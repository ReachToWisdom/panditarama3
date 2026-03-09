/**
 * 빤디따라마 YouTube 채널 영상 자동 업데이트 스크립트
 * GitHub Actions에서 실행 (매일 1회)
 * YouTube Data API v3 사용
 */

import fs from 'fs';
import https from 'https';

const CHANNEL_ID = 'UCDkWGqNo6A3jTAY1qe53sZA';
const API_KEY = process.env.YOUTUBE_API_KEY;
const VIDEOS_FILE = 'videos.js';
const REPORT_FILE = 'scripts/update-report.md';

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
  // 날짜 기반 폴백
  if (date) return parseInt(date.replace(/-/g, ''));
  return 0;
}

// ── 기존 videos.js 파싱 ──

function loadExistingVideos() {
  try {
    const content = fs.readFileSync(VIDEOS_FILE, 'utf-8');
    // VIDEOS 배열에서 id만 추출
    const ids = new Set();
    const idRegex = /"id":\s*"([^"]+)"/g;
    let match;
    while ((match = idRegex.exec(content)) !== null) {
      ids.add(match[1]);
    }
    // 기존 카테고리 추출
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
  console.log('YouTube 채널 영상 업데이트 시작...');

  // 1. 재생목록 조회
  const playlists = await fetchPlaylists();
  console.log(`재생목록 ${playlists.length}개 발견`);

  // 2. 기존 데이터 로드
  const existing = loadExistingVideos();
  console.log(`기존 영상 ${existing.ids.size}개`);

  // 3. 각 재생목록의 영상 수집
  const allVideos = [];         // 새로 추가할 영상
  const newCategories = [];     // 신규 카테고리
  const existingCategoryVideos = []; // 기존 카테고리의 새 영상

  for (const pl of playlists) {
    const items = await fetchPlaylistItems(pl.id);
    const isNewCategory = !existing.categories.has(pl.title);
    if (isNewCategory) newCategories.push(pl.title);

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

  if (allVideos.length === 0) {
    console.log('새 영상 없음. 종료.');
    // 리포트 파일 삭제 (이전 실행 잔여물)
    try { fs.unlinkSync(REPORT_FILE); } catch {}
    return;
  }

  console.log(`\n새 영상 총 ${allVideos.length}개 발견!`);

  // 4. 영상 상세 정보 (duration) 조회
  const newVideoIds = allVideos.map(v => v.id);
  const details = await fetchVideoDetails(newVideoIds);

  // 5. videos.js 업데이트
  // 기존 파일의 VIDEOS 배열에 새 영상 추가
  const content = existing.content;

  // CATEGORIES 업데이트
  let updatedContent = content;
  if (newCategories.length > 0) {
    // CATEGORIES 배열 끝에 새 카테고리 추가
    const catEndMatch = updatedContent.match(/const CATEGORIES = \[[\s\S]*?\];/);
    if (catEndMatch) {
      const oldCat = catEndMatch[0];
      const insertPoint = oldCat.lastIndexOf(']');
      const newCatEntries = newCategories.map(c => `  "${c}"`).join(',\n');
      const newCat = oldCat.slice(0, insertPoint) + ',\n' + newCatEntries + '\n]';
      updatedContent = updatedContent.replace(oldCat, newCat);
    }
  }

  // VIDEOS 배열에 새 영상 추가
  const newEntries = allVideos.map((v, i) => {
    const d = details[v.id] || { duration: '0:00', durationSec: 0, date: '' };
    const sortKey = makeSortKey(v.title, d.date);
    return `  {
    "id": "${v.id}",
    "title": ${JSON.stringify(v.title)},
    "duration": "${d.duration}",
    "durationSec": ${d.durationSec},
    "category": ${JSON.stringify(v.category)},
    "sortKey": ${sortKey},
    "date": "${d.date}",
    "order": ${existing.ids.size + i}
  }`;
  }).join(',\n');

  // VIDEOS 배열 끝에 추가
  const videosEndMatch = updatedContent.lastIndexOf('\n];');
  if (videosEndMatch >= 0) {
    updatedContent = updatedContent.slice(0, videosEndMatch) + ',\n' + newEntries + '\n];';
  }

  // 주석의 총 영상 수 업데이트
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

  // 6. 이메일 알림용 리포트 생성
  const report = generateReport(allVideos, newCategories, existingCategoryVideos, newTotal);
  fs.writeFileSync(REPORT_FILE, report, 'utf-8');
  console.log('리포트 생성 완료');
}

function generateReport(newVideos, newCategories, existingCategoryVideos, total) {
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

  lines.push(`---`);
  lines.push(`사이트: https://reachtowisdom.github.io/panditarama3/`);
  return lines.join('\n');
}

main().catch(err => {
  console.error('에러 발생:', err);
  process.exit(1);
});
