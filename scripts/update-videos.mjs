/**
 * 빤디따라마 YouTube 채널 영상 자동 업데이트 스크립트
 * GitHub Actions에서 실행 (매일 1회)
 * YouTube Data API v3 사용
 *
 * 방식: 매번 전체 영상 목록을 새로 생성 (비공개→공개 전환 반영)
 * CATEGORY_PRESETS는 기존 파일에서 보존
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

/** 재생목록의 모든 영상 ID 조회 (비공개/삭제 제외) */
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
      const title = item.snippet.title;
      // 비공개/삭제된 영상 제외
      if (vid && title !== 'Private video' && title !== 'Deleted video') {
        items.push({
          id: vid,
          title,
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

/** 기존 videos.js에서 CATEGORY_PRESETS 블록 추출 */
function extractPresets() {
  try {
    let content = fs.readFileSync(VIDEOS_FILE, 'utf-8');
    // CRLF → LF 정규화
    content = content.replace(/\r\n/g, '\n');
    const start = content.indexOf('const CATEGORY_PRESETS = {');
    if (start < 0) return null;
    const videosDecl = content.indexOf('const VIDEOS = [');
    if (videosDecl < 0) return null;
    // PRESETS 블록 = start ~ videosDecl 직전의 빈 줄까지
    let end = videosDecl;
    while (end > start && (content[end - 1] === '\n' || content[end - 1] === '\r')) end--;
    return content.slice(start, end + 1);
  } catch {
    return null;
  }
}

/** 기존 videos.js에서 VIDEOS 배열의 영상 ID만 순서대로 추출 */
function loadExistingIds() {
  try {
    const content = fs.readFileSync(VIDEOS_FILE, 'utf-8');
    // VIDEOS 배열 영역만 스캔 (PRESETS 내 "id" 패턴 오염 방지)
    const videosStart = content.indexOf('const VIDEOS = [');
    if (videosStart < 0) return [];
    const videosSection = content.slice(videosStart);
    const ids = [];
    const regex = /"id":\s*"([^"]+)"/g;
    let match;
    while ((match = regex.exec(videosSection)) !== null) {
      ids.push(match[1]);
    }
    return ids;
  } catch {
    return [];
  }
}

// ── 메인 ──

async function main() {
  console.log('YouTube 채널 영상 전체 재생성 시작...\n');

  // 1. 기존 PRESETS 보존
  const presetsBlock = extractPresets();
  const existingIdList = loadExistingIds(); // 순서 보존 배열
  const existingIdSet = new Set(existingIdList);
  console.log(`기존 영상 ${existingIdList.length}개\n`);

  // 2. 재생목록 조회
  const playlists = await fetchPlaylists();
  console.log(`재생목록 ${playlists.length}개 발견`);

  // 3. 모든 재생목록 영상 수집
  const videoMap = new Map(); // id → { title, category, ... }
  const categorySet = new Set();
  const playlistVideoIds = new Set();

  for (const pl of playlists) {
    const items = await fetchPlaylistItems(pl.id);
    if (items.length > 0) categorySet.add(pl.title);
    for (const item of items) {
      playlistVideoIds.add(item.id);
      if (!videoMap.has(item.id)) {
        videoMap.set(item.id, { ...item, category: pl.title });
      }
    }
    console.log(`  ${pl.title}: ${items.length}개`);
  }

  // 4. 채널 전체 업로드 (재생목록 누락분 → 비분류)
  console.log('\n채널 전체 업로드 영상 조회...');
  const allUploads = await fetchAllUploads();
  console.log(`  전체 업로드: ${allUploads.length}개`);

  let uncategorizedCount = 0;
  for (const item of allUploads) {
    if (!playlistVideoIds.has(item.id) && !videoMap.has(item.id)) {
      videoMap.set(item.id, { ...item, category: UNCATEGORIZED });
      uncategorizedCount++;
    }
  }
  if (uncategorizedCount > 0) {
    categorySet.add(UNCATEGORIZED);
    console.log(`  비분류 영상: ${uncategorizedCount}개`);
  }

  console.log(`\n공개 영상 총 ${videoMap.size}개 수집`);

  // 5. 영상 상세 정보 (duration) 조회
  const allIds = [...videoMap.keys()];
  const details = await fetchVideoDetails(allIds);

  // 6. 신규 영상 확인
  const newVideoIds = allIds.filter(id => !existingIdSet.has(id));
  // 삭제된 영상 (기존에 있었지만 이번에 없는 영상)
  const removedIds = existingIdList.filter(id => !videoMap.has(id));
  console.log(`신규 영상: ${newVideoIds.length}개`);
  if (removedIds.length > 0) console.log(`삭제/비공개 전환: ${removedIds.length}개`);

  // 7. videos.js 전체 재생성
  // 기존 영상 순서 유지 + 신규 영상은 뒤에 추가 (app.js slice 기반 신규 감지 호환)
  const categories = [...categorySet].sort((a, b) => a.localeCompare(b, 'ko'));

  // 기존 순서 유지 (삭제된 것 제외)
  const orderedIds = existingIdList.filter(id => videoMap.has(id));
  // 신규 영상은 date 역순(최신 먼저)으로 정렬 후 뒤에 추가
  newVideoIds.sort((a, b) => {
    const da = details[a]?.date || '';
    const db = details[b]?.date || '';
    return db.localeCompare(da);
  });
  orderedIds.push(...newVideoIds);

  const videos = orderedIds.map((id, i) => {
    const v = videoMap.get(id);
    const d = details[id] || { duration: '0:00', durationSec: 0, date: '', title: v.title };
    const title = d.title || v.title;
    return {
      id,
      title,
      duration: d.duration,
      durationSec: d.durationSec,
      category: v.category,
      sortKey: makeSortKey(title, d.date),
      date: d.date,
      order: i,
    };
  });

  // PRESETS 블록 (기존 보존 또는 기본값)
  const presets = presetsBlock || `const CATEGORY_PRESETS = {};`;

  const output = [
    `// 빤디따라마 영상 데이터 (자동 생성)`,
    `// 총 ${videos.length}개 영상, ${categories.length}개 카테고리`,
    `// 생성일: ${new Date().toISOString().slice(0, 10)}`,
    `// 정렬: 제목의 강 번호 기준 (없으면 날짜순)`,
    ``,
    `// 기본 카테고리 (영상 수 기준)`,
    `const CATEGORIES = [`,
    categories.map(c => `  ${JSON.stringify(c)}`).join(',\n'),
    `]`,
    ``,
    presets,
    ``,
    `const VIDEOS = [`,
    videos.map(v => `  ${JSON.stringify(v)}`).join(',\n'),
    `]`,
  ].join('\n');

  // 변경 감지: 신규/삭제 영상이 없으면 스킵
  if (newVideoIds.length === 0 && removedIds.length === 0) {
    console.log('\n영상 목록 변경 없음. 종료.');
    try { fs.unlinkSync(REPORT_FILE); } catch {}
    return;
  }

  fs.writeFileSync(VIDEOS_FILE, output, 'utf-8');
  console.log(`\nvideos.js 재생성 완료 (총 ${videos.length}개)`);

  // 8. 리포트 생성
  if (newVideoIds.length > 0) {
    const lines = [
      `## 빤디따라마 영상 업데이트\n`,
      `- **업데이트 일시**: ${new Date().toISOString().slice(0, 16).replace('T', ' ')} UTC`,
      `- **새 영상**: ${newVideoIds.length}개`,
      `- **전체 영상**: ${videos.length}개\n`,
      `### 신규 영상\n`,
    ];
    for (const id of newVideoIds) {
      const v = videoMap.get(id);
      const d = details[id];
      lines.push(`- [${v.category}] ${d?.title || v.title}`);
    }
    lines.push(`\n---`);
    lines.push(`사이트: https://reachtowisdom.github.io/panditarama3/`);
    fs.writeFileSync(REPORT_FILE, lines.join('\n'), 'utf-8');
    console.log('리포트 생성 완료');
  }
}

main().catch(err => {
  console.error('에러 발생:', err);
  process.exit(1);
});
