/**
 * 빤디따라마 YouTube 채널 영상 자동 업데이트 스크립트
 * GitHub Actions에서 실행 (매일 1회)
 * YouTube Data API v3 사용
 *
 * 수집 방식:
 * 1. 재생목록 기반 영상 수집 (카테고리 자동 분류)
 * 2. 채널 전체 업로드 영상 수집 (재생목록 누락분 → "비분류")
 */

import fs from 'fs';
import https from 'https';

const CHANNEL_ID = 'UCDkWGqNo6A3jTAY1qe53sZA';
const API_KEY = process.env.YOUTUBE_API_KEY;
const VIDEOS_FILE = 'videos.js';
const REPORT_FILE = 'scripts/update-report.md';
const UNCATEGORIZED = '비분류';

if (!API_KEY) {
  console.error('YOUTUBE_API_KEY 환경변수가 설정되지 않았습니다');
  process.exit(1);
}

// ── YouTube API 호출 유틸 ──

function apiGet(path) {
  return new Promise((resolve, reject) => {
    const url = `https://www.googleapis.com/youtube/v3${path}&key=${API_KEY}`;
    https.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try { resolve(JSON.parse(data)); }
        catch (e) { reject(new Error(`JSON 파싱 실패: ${data.slice(0, 200)}`)); }
      });
    }).on('error', reject);
  });
}

/** 채널의 모든 재생목록 조회 */
async function fetchPlaylists() {
  const playlists = [];
  let pageToken = '';
  do {
    const res = await apiGet(
      `/playlists?part=snippet&channelId=${CHANNEL_ID}&maxResults=50&pageToken=${pageToken}`
    );
    if (res.error) throw new Error(`API 에러: ${JSON.stringify(res.error)}`);
    for (const item of (res.items || [])) {
      playlists.push({ id: item.id, title: item.snippet.title });
    }
    pageToken = res.nextPageToken || '';
  } while (pageToken);
  return playlists;
}

/** 재생목록의 모든 영상 ID 조회 */
async function fetchPlaylistItems(playlistId) {
  const items = [];
  let pageToken = '';
  do {
    const res = await apiGet(
      `/playlistItems?part=snippet&playlistId=${playlistId}&maxResults=50&pageToken=${pageToken}`
    );
    if (res.error) throw new Error(`API 에러: ${JSON.stringify(res.error)}`);
    for (const item of (res.items || [])) {
      const vid = item.snippet.resourceId?.videoId;
      if (vid) {
        items.push({
          id: vid,
          title: item.snippet.title,
          publishedAt: item.snippet.publishedAt,
          position: item.snippet.position,
        });
      }
    }
    pageToken = res.nextPageToken || '';
  } while (pageToken);
  return items;
}

/** 채널의 전체 업로드 영상 조회 (uploads 재생목록 사용) */
async function fetchAllUploads() {
  // 채널 정보에서 uploads 재생목록 ID 조회
  const chRes = await apiGet(
    `/channels?part=contentDetails&id=${CHANNEL_ID}`
  );
  if (chRes.error) throw new Error(`API 에러: ${JSON.stringify(chRes.error)}`);
  const uploadsId = chRes.items?.[0]?.contentDetails?.relatedPlaylists?.uploads;
  if (!uploadsId) throw new Error('uploads 재생목록 ID를 찾을 수 없습니다');

  console.log(`  uploads 재생목록 ID: ${uploadsId}`);
  return await fetchPlaylistItems(uploadsId);
}

/** 영상 상세 정보 (duration) 조회 - 50개씩 배치 */
async function fetchVideoDetails(videoIds) {
  const details = {};
  for (let i = 0; i < videoIds.length; i += 50) {
    const batch = videoIds.slice(i, i + 50);
    const res = await apiGet(
      `/videos?part=contentDetails,snippet&id=${batch.join(',')}`
    );
    if (res.error) throw new Error(`API 에러: ${JSON.stringify(res.error)}`);
    for (const item of (res.items || [])) {
      details[item.id] = {
        duration: parseDuration(item.contentDetails.duration),
        durationSec: parseDurationSec(item.contentDetails.duration),
        date: item.snippet.publishedAt?.slice(0, 10) || '',
        title: item.snippet.title,
      };
    }
  }
  return details;
}

/** ISO 8601 duration → "H:MM:SS" 형식 */
function parseDuration(iso) {
  const match = iso.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!match) return '0:00';
  const h = parseInt(match[1] || '0');
  const m = parseInt(match[2] || '0');
  const s = parseInt(match[3] || '0');
  if (h > 0) return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  return `${m}:${String(s).padStart(2, '0')}`;
}

/** ISO 8601 duration → 초 */
function parseDurationSec(iso) {
  const match = iso.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!match) return 0;
  return (parseInt(match[1] || '0') * 3600) +
         (parseInt(match[2] || '0') * 60) +
         parseInt(match[3] || '0');
}

/** 제목에서 강 번호 추출 */
function extractEpisodeNum(title) {
  const match = title.match(/(\d+)\s*강/);
  return match ? parseInt(match[1]) : 0;
}

/** 제목에서 연도 추출 */
function extractYear(title) {
  const match = title.match(/\((\d{4})\)/);
  return match ? parseInt(match[1]) : 0;
}

/** sortKey 생성: 연도*10000 + 에피소드번호 */
function makeSortKey(title, date) {
  const ep = extractEpisodeNum(title);
  const year = extractYear(title) || (date ? parseInt(date.slice(0, 4)) : 0);
  if (year > 0 && ep > 0) return year * 10000 + ep;
  if (ep > 0) return ep;
  if (date) return parseInt(date.replace(/-/g, ''));
  return 0;
}

// ── 기존 videos.js 파싱 ──

function loadExistingVideos() {
  try {
    const content = fs.readFileSync(VIDEOS_FILE, 'utf-8');
    const ids = new Set();
    const idRegex = /"id":\s*"([^"]+)"/g;
    let match;
    while ((match = idRegex.exec(content)) !== null) {
      ids.add(match[1]);
    }
    const categories = new Set();
    const catRegex = /"category":\s*"([^"]+)"/g;
    while ((match = catRegex.exec(content)) !== null) {
      categories.add(match[1]);
    }
    return { ids, categories, content };
  } catch (e) {
    console.error('videos.js 읽기 실패:', e.message);
    return { ids: new Set(), categories: new Set(), content: '' };
  }
}

// ── 메인 ──

async function main() {
  console.log('YouTube 채널 영상 업데이트 시작...\n');

  // 1. 재생목록 조회
  const playlists = await fetchPlaylists();
  console.log(`재생목록 ${playlists.length}개 발견`);

  // 2. 기존 데이터 로드
  const existing = loadExistingVideos();
  console.log(`기존 영상 ${existing.ids.size}개\n`);

  // 3. 재생목록 기반 영상 수집
  const allVideos = [];
  const newCategories = [];
  const existingCategoryVideos = [];
  const playlistVideoIds = new Set(); // 재생목록에 포함된 모든 영상 ID

  for (const pl of playlists) {
    const items = await fetchPlaylistItems(pl.id);
    const isNewCategory = !existing.categories.has(pl.title);
    if (isNewCategory && items.length > 0) newCategories.push(pl.title);

    for (const item of items) {
      playlistVideoIds.add(item.id);
    }

    const newItems = items.filter(item => !existing.ids.has(item.id));
    if (newItems.length > 0) {
      for (const item of newItems) {
        allVideos.push({ ...item, category: pl.title });
      }
      if (!isNewCategory) {
        existingCategoryVideos.push({
          category: pl.title,
          count: newItems.length,
          titles: newItems.map(i => i.title),
        });
      }
    }
    console.log(`  ${pl.title}: ${items.length}개 (새 영상 ${newItems.length}개)${isNewCategory ? ' [신규 카테고리]' : ''}`);
  }

  // 4. 채널 전체 업로드 영상 수집 (재생목록 누락분 찾기)
  console.log('\n채널 전체 업로드 영상 조회...');
  const allUploads = await fetchAllUploads();
  console.log(`  전체 업로드: ${allUploads.length}개`);

  // 재생목록에도 없고 기존 videos.js에도 없는 영상 = 비분류
  const uncategorizedItems = allUploads.filter(
    item => !playlistVideoIds.has(item.id) && !existing.ids.has(item.id)
  );

  if (uncategorizedItems.length > 0) {
    console.log(`  비분류 새 영상: ${uncategorizedItems.length}개`);
    for (const item of uncategorizedItems) {
      allVideos.push({ ...item, category: UNCATEGORIZED });
    }
    // "비분류" 카테고리가 새로 필요한지 확인
    if (!existing.categories.has(UNCATEGORIZED) && !newCategories.includes(UNCATEGORIZED)) {
      newCategories.push(UNCATEGORIZED);
    }
  } else {
    console.log('  비분류 새 영상 없음');
  }

  // 기존 videos.js에 있지만 재생목록에 없는 영상도 체크 (정보 출력만)
  const existingUncategorized = allUploads.filter(
    item => !playlistVideoIds.has(item.id) && existing.ids.has(item.id)
  );
  if (existingUncategorized.length > 0) {
    console.log(`  (기존 비분류 영상: ${existingUncategorized.length}개 - 이미 등록됨)`);
  }

  if (allVideos.length === 0) {
    console.log('\n새 영상 없음. 종료.');
    try { fs.unlinkSync(REPORT_FILE); } catch {}
    return;
  }

  console.log(`\n새 영상 총 ${allVideos.length}개 발견!`);

  // 5. 영상 상세 정보 (duration) 조회
  const newVideoIds = allVideos.map(v => v.id);
  const details = await fetchVideoDetails(newVideoIds);

  // 6. videos.js 업데이트
  const content = existing.content;
  let updatedContent = content;

  // CATEGORIES 배열에 새 카테고리 추가
  if (newCategories.length > 0) {
    const catMarker = 'const CATEGORIES = [';
    const catStart = updatedContent.indexOf(catMarker);
    if (catStart >= 0) {
      // CATEGORIES 배열의 닫는 ] 찾기 (catStart 이후 첫 번째 ])
      const catSearchFrom = catStart + catMarker.length;
      const catEnd = updatedContent.indexOf('\n]', catSearchFrom);
      if (catEnd >= 0) {
        const newCatEntries = newCategories.map(c => `  "${c}"`).join(',\n');
        updatedContent = updatedContent.slice(0, catEnd) + ',\n' + newCatEntries + updatedContent.slice(catEnd);
      }
    }
  }

  // VIDEOS 배열에 새 영상 추가
  const newEntries = allVideos.map((v, i) => {
    const d = details[v.id] || { duration: '0:00', durationSec: 0, date: '', title: v.title };
    const title = d.title || v.title;
    const sortKey = makeSortKey(title, d.date);
    return `  {
    "id": "${v.id}",
    "title": ${JSON.stringify(title)},
    "duration": "${d.duration}",
    "durationSec": ${d.durationSec},
    "category": ${JSON.stringify(v.category)},
    "sortKey": ${sortKey},
    "date": "${d.date}",
    "order": ${existing.ids.size + i}
  }`;
  }).join(',\n');

  // VIDEOS 배열의 마지막 ]을 찾아서 그 앞에 삽입
  // videos.js에서 VIDEOS는 파일 마지막 배열이므로 lastIndexOf 사용
  const videosMarker = 'const VIDEOS = [';
  const videosStart = updatedContent.indexOf(videosMarker);
  if (videosStart >= 0) {
    const videosEndMatch = updatedContent.lastIndexOf('\n]');
    if (videosEndMatch >= videosStart) {
      updatedContent = updatedContent.slice(0, videosEndMatch) + ',\n' + newEntries + updatedContent.slice(videosEndMatch);
    }
  }

  // 주석 업데이트
  const newTotal = existing.ids.size + allVideos.length;
  updatedContent = updatedContent.replace(
    /\/\/ 총 \d+개 영상/,
    `// 총 ${newTotal}개 영상`
  );
  updatedContent = updatedContent.replace(
    /\/\/ 생성일: .+/,
    `// 생성일: ${new Date().toISOString().slice(0, 10)}`
  );

  fs.writeFileSync(VIDEOS_FILE, updatedContent, 'utf-8');
  console.log(`videos.js 업데이트 완료 (총 ${newTotal}개)`);

  // 7. 리포트 생성
  const report = generateReport(allVideos, newCategories, existingCategoryVideos, uncategorizedItems, newTotal);
  fs.writeFileSync(REPORT_FILE, report, 'utf-8');
  console.log('리포트 생성 완료');
}

function generateReport(newVideos, newCategories, existingCategoryVideos, uncategorizedItems, total) {
  const lines = [];
  lines.push(`## 빤디따라마 영상 업데이트\n`);
  lines.push(`- **업데이트 일시**: ${new Date().toISOString().slice(0, 16).replace('T', ' ')} UTC`);
  lines.push(`- **새 영상**: ${newVideos.length}개`);
  lines.push(`- **전체 영상**: ${total}개\n`);

  if (newCategories.length > 0) {
    lines.push(`### 🆕 신규 카테고리 (${newCategories.length}개)\n`);
    lines.push(`> ⚠️ 신규 카테고리는 "설법순/초보자/수행자" 프리셋에 자동 배치되지 않습니다.`);
    lines.push(`> 필요시 videos.js의 CATEGORY_PRESETS를 수동 편집해주세요.\n`);
    for (const cat of newCategories) {
      const catVideos = newVideos.filter(v => v.category === cat);
      lines.push(`- **${cat}** (${catVideos.length}개)`);
      for (const v of catVideos) {
        lines.push(`  - ${v.title}`);
      }
    }
    lines.push('');
  }

  if (existingCategoryVideos.length > 0) {
    lines.push(`### 📌 기존 카테고리 새 영상\n`);
    for (const cat of existingCategoryVideos) {
      lines.push(`- **${cat.category}** (+${cat.count}개)`);
      for (const t of cat.titles) {
        lines.push(`  - ${t}`);
      }
    }
    lines.push('');
  }

  if (uncategorizedItems.length > 0) {
    lines.push(`### 📂 비분류 영상 (재생목록 미포함) (${uncategorizedItems.length}개)\n`);
    for (const v of uncategorizedItems) {
      lines.push(`  - ${v.title}`);
    }
    lines.push('');
  }

  lines.push(`---`);
  lines.push(`사이트: https://reachtowisdom.github.io/panditarama3/`);
  return lines.join('\n');
}

main().catch(err => {
  console.error('에러 발생:', err);
  process.exit(1);
});
