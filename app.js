// 빤디따라마 영상 플레이리스트 앱
// SSOT: 모든 설정은 CONFIG에 정의

const CONFIG = {
  STORAGE_KEY: 'panditarama_data',
  VERSION: 2,
  DEBOUNCE_MS: 300,
  AB_CHECK_INTERVAL_MS: 500,
  TOAST_DURATION_MS: 2000,
};

// ── 유틸 ──

function safeFloat(val, def = 0) {
  const parsed = parseFloat(val);
  return isNaN(parsed) ? def : parsed;
}

function formatTime(sec) {
  const s = Math.floor(safeFloat(sec));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const ss = s % 60;
  if (h > 0) return `${h}:${String(m).padStart(2, '0')}:${String(ss).padStart(2, '0')}`;
  return `${m}:${String(ss).padStart(2, '0')}`;
}

function showToast(msg) {
  const el = document.getElementById('toast');
  el.textContent = msg;
  el.classList.add('show');
  setTimeout(() => el.classList.remove('show'), CONFIG.TOAST_DURATION_MS);
}

function debounce(fn, ms) {
  let timer;
  return (...args) => { clearTimeout(timer); timer = setTimeout(() => fn(...args), ms); };
}

// ── 데이터 관리 ──

function defaultUserData() {
  return {
    version: CONFIG.VERSION,
    watched: {},
    starred: [],
    notes: {},
    lastWatched: null,
    lastPosition: {},
    repeat: {},
    abLoops: {},
    playCount: {},  // 영상별 재생 횟수
    settings: { theme: 'auto', sort: 'order', preset: 'chronological', autoplay: 'on' },
    categoryState: {},
    fabPosition: null, // { x, y } 플로팅 버튼 위치
    knownVideoCount: 0, // 마지막으로 확인한 영상 수 (신규 감지용)
  };
}

function loadData() {
  try {
    const raw = localStorage.getItem(CONFIG.STORAGE_KEY);
    if (raw) {
      const data = JSON.parse(raw);
      const merged = { ...defaultUserData(), ...data };
      merged.settings = { ...defaultUserData().settings, ...data.settings };
      // 기존 사용자: knownVideoCount 없으면 현재 영상 수로 초기화
      if (!data.knownVideoCount) merged.knownVideoCount = VIDEOS.length;
      return merged;
    }
  } catch (e) {
    console.error('데이터 로드 실패:', e);
  }
  // 신규 사용자: 현재 영상 수로 초기화 (모든 영상이 신규로 뜨는 것 방지)
  const defaults = defaultUserData();
  defaults.knownVideoCount = VIDEOS.length;
  return defaults;
}

function saveData() {
  try {
    localStorage.setItem(CONFIG.STORAGE_KEY, JSON.stringify(userData));
    // 클라우드 동기화 (로그인 시 자동)
    if (window.syncModule && window.syncModule.push) window.syncModule.push();
  } catch (e) {
    console.error('데이터 저장 실패:', e);
    showToast('저장 실패: 저장소 용량 초과');
  }
}

// ── 전역 상태 ──

let userData = loadData();
let currentFilter = 'all';
let searchQuery = '';
let ytPlayer = null;
let currentVideoId = null;
let abLoopTimer = null;
let abPointA = null;
let abPointB = null;

// ── 카테고리 순서 (프리셋 기반) ──

/** 현재 프리셋에 따른 카테고리 순서 반환 */
function getCategoryOrder() {
  const preset = userData.settings.preset || 'chronological';
  const presetData = CATEGORY_PRESETS[preset];

  // 등록순: 각 카테고리의 첫 영상(가장 오래된) 업로드일 기준 정렬
  if (presetData && presetData.sortCategoriesByFirstVideo) {
    const catFirstDate = {};
    for (const cat of CATEGORIES) {
      const dates = VIDEOS.filter(v => v.category === cat)
        .map(v => v.date || '9999')
        .sort();
      catFirstDate[cat] = dates[0] || '9999';
    }
    return [...CATEGORIES].sort((a, b) => catFirstDate[a].localeCompare(catFirstDate[b]));
  }

  if (presetData && presetData.order) {
    // 프리셋에 없는 카테고리도 뒤에 추가
    const remaining = CATEGORIES.filter(c => !presetData.order.includes(c));
    return [...presetData.order, ...remaining];
  }
  return CATEGORIES;
}

/** 현재 순서에서 전체 재생 목록 (순서대로) 생성 */
function getPlaylist() {
  const catOrder = getCategoryOrder();
  const playlist = [];
  for (const cat of catOrder) {
    const catVideos = VIDEOS.filter(v => v.category === cat);
    const sorted = sortVideos(catVideos);
    playlist.push(...sorted);
  }
  return playlist;
}

/** 현재 영상의 다음 영상 찾기 */
function getNextVideo(videoId) {
  const playlist = getPlaylist();
  const idx = playlist.findIndex(v => v.id === videoId);
  if (idx >= 0 && idx < playlist.length - 1) {
    return playlist[idx + 1];
  }
  return null;
}

/** 현재 영상의 이전 영상 찾기 */
function getPrevVideo(videoId) {
  const playlist = getPlaylist();
  const idx = playlist.findIndex(v => v.id === videoId);
  if (idx > 0) {
    return playlist[idx - 1];
  }
  return null;
}

// ── 테마 ──

function applyTheme() {
  const theme = userData.settings.theme;
  const isDark = theme === 'dark' ||
    (theme === 'auto' && window.matchMedia('(prefers-color-scheme: dark)').matches);
  document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
  document.getElementById('btn-theme').textContent = isDark ? '☀️' : '🌙';
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.content = isDark ? '#1a1a2e' : '#e94560';
}

function toggleTheme() {
  const t = userData.settings.theme;
  userData.settings.theme = t === 'auto' ? 'dark' : t === 'dark' ? 'light' : 'auto';
  applyTheme();
  saveData();
}

// ── 필터/검색 ──

function getFilteredVideos(categoryVideos) {
  return categoryVideos.filter(v => {
    if (searchQuery && !v.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    switch (currentFilter) {
      case 'unwatched': return !userData.watched[v.id];
      case 'watched': return !!userData.watched[v.id];
      case 'starred': return userData.starred.includes(v.id);
      case 'noted': return !!userData.notes[v.id];
      default: return true;
    }
  });
}

function sortVideos(videos) {
  const sorted = [...videos];
  const preset = userData.settings.preset || 'chronological';
  const presetData = CATEGORY_PRESETS[preset];

  // 날짜순 프리셋: 등록순(asc) 또는 최신순(desc)
  if (presetData && presetData.sortByDate) {
    if (presetData.sortByDate === 'asc') {
      sorted.sort((a, b) => (a.date || '').localeCompare(b.date || ''));
    } else {
      sorted.sort((a, b) => (b.date || '').localeCompare(a.date || ''));
    }
    return sorted;
  }

  switch (userData.settings.sort) {
    case 'title': sorted.sort((a, b) => a.title.localeCompare(b.title, 'ko')); break;
    case 'watched': sorted.sort((a, b) => (userData.watched[b.id] || '').localeCompare(userData.watched[a.id] || '')); break;
    default: sorted.sort((a, b) => a.order - b.order);
  }
  return sorted;
}

// ── UI 렌더링 ──

function render() {
  renderProgress();
  renderResume();
  renderCategories();
  updateFab();
}

function renderProgress() {
  const total = VIDEOS.length;
  const watched = Object.keys(userData.watched).length;
  const pct = total > 0 ? Math.round((watched / total) * 100) : 0;
  document.getElementById('progress-text').textContent = `${watched}/${total} (${pct}%)`;
  document.getElementById('progress-fill').style.width = `${pct}%`;
}

function renderResume() {
  const card = document.getElementById('resume-card');
  const vid = userData.lastWatched;
  if (!vid) { card.classList.add('hidden'); return; }
  const video = VIDEOS.find(v => v.id === vid);
  if (!video) { card.classList.add('hidden'); return; }
  card.classList.remove('hidden');
  document.getElementById('resume-title').textContent = video.title;
  const pos = userData.lastPosition[vid];
  document.getElementById('resume-sub').textContent = pos ? `${formatTime(pos)} / ${video.duration}` : video.category;
}

/** 신규 영상 목록 반환 (새로 추가된 + 안 시청한 영상) */
function getNewVideos() {
  const known = userData.knownVideoCount || 0;
  if (known === 0 || known >= VIDEOS.length) return [];
  return VIDEOS.slice(known).filter(v => !userData.watched[v.id]);
}

/** 신규 영상 확인 완료 처리 */
function dismissNewVideos() {
  userData.knownVideoCount = VIDEOS.length;
  saveData();
  render();
}

/** 신규 영상 섹션 렌더링 */
function renderNewVideosSection(container) {
  const newVideos = getNewVideos();
  if (newVideos.length === 0) return;

  const section = document.createElement('div');
  section.className = 'new-videos-section';
  section.innerHTML = `
    <div class="new-videos-header">
      <span class="new-videos-badge">${newVideos.length}</span>
      <span class="new-videos-title">신규 등록 영상</span>
      <button class="new-videos-dismiss" id="btn-dismiss-new">✓ 확인</button>
    </div>
    <div class="new-videos-body"></div>
  `;

  const body = section.querySelector('.new-videos-body');
  // 카테고리별로 그룹핑
  const catMap = {};
  for (const v of newVideos) {
    if (!catMap[v.category]) catMap[v.category] = [];
    catMap[v.category].push(v);
  }
  for (const [cat, videos] of Object.entries(catMap)) {
    const catLabel = document.createElement('div');
    catLabel.className = 'new-videos-cat';
    catLabel.textContent = cat;
    body.appendChild(catLabel);
    for (const v of videos) body.appendChild(createVideoItem(v));
  }

  section.querySelector('#btn-dismiss-new').addEventListener('click', dismissNewVideos);
  container.appendChild(section);
}

function renderCategories() {
  const container = document.getElementById('category-list');
  container.innerHTML = '';

  // 신규 영상 섹션 (항상 최상단)
  renderNewVideosSection(container);

  const preset = userData.settings.preset || 'chronological';
  const presetData = CATEGORY_PRESETS[preset];

  // 날짜순: 카테고리 무시, 전체 영상을 날짜순으로 표시
  if (presetData && presetData.sortByDate) {
    renderDateView(container, presetData.sortByDate);
    return;
  }

  const catOrder = getCategoryOrder();

  for (const cat of catOrder) {
    const allVideos = VIDEOS.filter(v => v.category === cat);
    const filtered = getFilteredVideos(allVideos);
    const sorted = sortVideos(filtered);
    if (searchQuery && sorted.length === 0) continue;

    const isOpen = userData.categoryState[cat] === true;
    const watchedCount = allVideos.filter(v => userData.watched[v.id]).length;
    const catPct = allVideos.length > 0 ? Math.round((watchedCount / allVideos.length) * 100) : 0;

    const catEl = document.createElement('div');
    catEl.className = `category${isOpen ? ' open' : ''}`;
    catEl.innerHTML = `
      <div class="category-header" data-cat="${cat}">
        <span class="category-arrow">▶</span>
        <span class="category-name">${cat}</span>
        <span class="category-count">${watchedCount}/${allVideos.length}</span>
        <div class="category-progress">
          <div class="category-progress-fill" style="width:${catPct}%"></div>
        </div>
      </div>
      <div class="category-body"></div>
    `;

    const body = catEl.querySelector('.category-body');
    for (const v of sorted) body.appendChild(createVideoItem(v));

    if (sorted.length === 0 && currentFilter !== 'all') {
      const msg = document.createElement('div');
      msg.style.cssText = 'padding:12px 14px;font-size:12px;color:var(--text-muted);text-align:center';
      msg.textContent = '해당하는 영상이 없습니다';
      body.appendChild(msg);
    }
    container.appendChild(catEl);
  }
}

/** 날짜순 뷰: 카테고리 없이 날짜별로 전체 영상 표시 */
function renderDateView(container, direction) {
  const filtered = getFilteredVideos(VIDEOS);
  const sorted = direction === 'asc'
    ? [...filtered].sort((a, b) => (a.date || '').localeCompare(b.date || ''))
    : [...filtered].sort((a, b) => (b.date || '').localeCompare(a.date || ''));
  if (sorted.length === 0) return;

  // 날짜별 그룹핑
  let currentDate = '';
  let currentBody = null;

  for (const v of sorted) {
    const dateLabel = v.date || '날짜 없음';
    if (dateLabel !== currentDate) {
      currentDate = dateLabel;
      const catEl = document.createElement('div');
      catEl.className = 'category open';
      catEl.innerHTML = `
        <div class="category-header date-header" data-cat="date-${dateLabel}">
          <span class="category-name">${dateLabel}</span>
          <span class="category-count" style="font-size:11px;color:var(--text-muted)">${v.category}</span>
        </div>
        <div class="category-body"></div>
      `;
      currentBody = catEl.querySelector('.category-body');
      container.appendChild(catEl);
    }
    currentBody.appendChild(createVideoItem(v));
  }
}

function createVideoItem(v) {
  const isWatched = !!userData.watched[v.id];
  const isStarred = userData.starred.includes(v.id);
  const hasNote = !!userData.notes[v.id];
  const hasRepeat = userData.repeat[v.id] && userData.repeat[v.id].mode !== 'off';
  const playCount = userData.playCount[v.id] || 0;

  const isOpened = playCount > 0 && !isWatched; // 열어봤지만 완료 아님

  const el = document.createElement('div');
  el.className = `video-item${isWatched ? ' watched' : ''}${isOpened ? ' opened' : ''}`;
  el.dataset.id = v.id;
  el.innerHTML = `
    <div class="video-check" data-action="toggle-watch" title="시청 완료 표시">${isWatched ? '✓' : ''}</div>
    <span class="play-count${playCount > 0 ? '' : ' empty'}" title="재생 ${playCount}회">${playCount > 0 ? playCount : ''}</span>
    <div class="video-info">
      <div class="video-title" data-action="play">${v.title}</div>
      <div class="video-meta">
        <span>${v.duration || ''}</span>
        ${isWatched ? '<span style="color:var(--checked)">시청완료</span>' : (isOpened ? '<span style="color:var(--accent)">시청중</span>' : '')}
      </div>
      <div class="note-area" id="note-${v.id}">
        <textarea placeholder="메모 입력..." data-action="note">${userData.notes[v.id] || ''}</textarea>
      </div>
    </div>
    <div class="video-actions">
      <button data-action="set-start" title="여기부터 연속 재생 시작">▶</button>
      <button class="${isStarred ? 'active' : ''}" data-action="toggle-star" title="별표">${isStarred ? '★' : '☆'}</button>
      <button class="note-btn${hasNote ? ' has-note' : ''}" data-action="toggle-note" title="메모">📝</button>
      <button class="repeat-btn${hasRepeat ? ' active' : ''}" data-action="toggle-repeat-badge" title="반복">🔁</button>
    </div>
  `;
  return el;
}

// ── 플로팅 재생 버튼 (FAB) ──
// 짧게 탭 = 이어보기, 길게 누름 = 메뉴(이어보기/처음부터/첫 영상)

function updateFab() {
  const fabText = document.getElementById('fab-text');
  const vid = userData.lastWatched;
  if (vid) {
    const video = VIDEOS.find(v => v.id === vid);
    if (video) {
      const pos = userData.lastPosition[vid];
      fabText.textContent = pos ? `${formatTime(pos)}` : '재생';
      return;
    }
  }
  fabText.textContent = '시작';
}

/** 짧게 탭: 이어보기 */
function fabResume() {
  closeFabMenu();
  if (userData.lastWatched) {
    openPlayer(userData.lastWatched);
  } else {
    fabFirstVideo();
  }
}

/** 처음부터: 마지막 본 영상을 0초부터 재시작 */
function fabRestart() {
  closeFabMenu();
  if (userData.lastWatched) {
    delete userData.lastPosition[userData.lastWatched];
    saveData();
    openPlayer(userData.lastWatched);
  } else {
    fabFirstVideo();
  }
}

/** 첫 영상부터: 프리셋 순서 첫 번째 영상, 0초 */
function fabFirstVideo() {
  closeFabMenu();
  const playlist = getPlaylist();
  if (playlist.length > 0) {
    delete userData.lastPosition[playlist[0].id];
    userData.lastWatched = playlist[0].id;
    saveData();
    openPlayer(playlist[0].id);
  }
}

function showFabMenu() {
  const fab = document.getElementById('fab-play');
  const menu = document.getElementById('fab-menu');
  const rect = fab.getBoundingClientRect();

  // 메뉴 위치: 버튼 위에 표시
  menu.style.left = `${Math.max(8, rect.left - 40)}px`;
  menu.style.top = `${Math.max(8, rect.top - 140)}px`;

  // 화면 밖으로 나가면 조정
  if (rect.top - 140 < 8) {
    menu.style.top = `${rect.bottom + 8}px`;
  }

  // "이어보기" 버튼 텍스트 업데이트
  const resumeBtn = menu.querySelector('[data-fab="resume"]');
  if (userData.lastWatched) {
    const video = VIDEOS.find(v => v.id === userData.lastWatched);
    const pos = userData.lastPosition[userData.lastWatched];
    if (video) {
      const short = video.title.length > 25 ? video.title.slice(0, 25) + '...' : video.title;
      resumeBtn.textContent = `▶ 이어보기${pos ? ' (' + formatTime(pos) + ')' : ''}`;
      resumeBtn.title = video.title;
    }
  } else {
    resumeBtn.textContent = '▶ 재생할 영상 없음';
  }

  menu.classList.remove('hidden');
}

function closeFabMenu() {
  document.getElementById('fab-menu').classList.add('hidden');
}

/** 플로팅 버튼 드래그 + 길게 누르기 */
function initFabDrag() {
  const fab = document.getElementById('fab-play');
  const menu = document.getElementById('fab-menu');
  let isDragging = false;
  let hasMoved = false;
  let longPressTimer = null;
  let isLongPress = false;
  let startX, startY, fabStartX, fabStartY;

  const LONG_PRESS_MS = 500;

  // 저장된 위치 복원
  if (userData.fabPosition) {
    const { x, y } = userData.fabPosition;
    fab.style.right = 'auto';
    fab.style.bottom = 'auto';
    fab.style.left = `${Math.min(x, window.innerWidth - 60)}px`;
    fab.style.top = `${Math.min(y, window.innerHeight - 60)}px`;
  }

  function onStart(clientX, clientY) {
    isDragging = true;
    hasMoved = false;
    isLongPress = false;
    closeFabMenu();

    const rect = fab.getBoundingClientRect();
    startX = clientX;
    startY = clientY;
    fabStartX = rect.left;
    fabStartY = rect.top;
    fab.classList.add('dragging');

    // 길게 누르기 타이머
    longPressTimer = setTimeout(() => {
      if (!hasMoved) {
        isLongPress = true;
        fab.classList.remove('dragging');
        showFabMenu();
      }
    }, LONG_PRESS_MS);
  }

  function onMove(clientX, clientY) {
    if (!isDragging || isLongPress) return;
    const dx = clientX - startX;
    const dy = clientY - startY;
    if (Math.abs(dx) > 5 || Math.abs(dy) > 5) {
      hasMoved = true;
      clearTimeout(longPressTimer);
    }
    if (!hasMoved) return;

    let newX = fabStartX + dx;
    let newY = fabStartY + dy;
    newX = Math.max(0, Math.min(newX, window.innerWidth - fab.offsetWidth));
    newY = Math.max(0, Math.min(newY, window.innerHeight - fab.offsetHeight));

    fab.style.right = 'auto';
    fab.style.bottom = 'auto';
    fab.style.left = `${newX}px`;
    fab.style.top = `${newY}px`;
  }

  function onEnd() {
    clearTimeout(longPressTimer);
    if (!isDragging) return;
    isDragging = false;
    fab.classList.remove('dragging');

    if (isLongPress) {
      // 메뉴 이미 표시됨
      return;
    }

    if (hasMoved) {
      userData.fabPosition = { x: parseInt(fab.style.left) || 0, y: parseInt(fab.style.top) || 0 };
      saveData();
    } else {
      // 짧게 탭 = 이어보기
      fabResume();
    }
  }

  // 마우스
  fab.addEventListener('mousedown', (e) => { e.preventDefault(); onStart(e.clientX, e.clientY); });
  document.addEventListener('mousemove', (e) => onMove(e.clientX, e.clientY));
  document.addEventListener('mouseup', onEnd);

  // 터치
  fab.addEventListener('touchstart', (e) => { onStart(e.touches[0].clientX, e.touches[0].clientY); }, { passive: true });
  document.addEventListener('touchmove', (e) => { if (isDragging && !isLongPress) onMove(e.touches[0].clientX, e.touches[0].clientY); }, { passive: true });
  document.addEventListener('touchend', onEnd);

  // 메뉴 버튼 클릭
  menu.querySelector('[data-fab="resume"]').addEventListener('click', fabResume);
  menu.querySelector('[data-fab="restart"]').addEventListener('click', fabRestart);
  menu.querySelector('[data-fab="first"]').addEventListener('click', fabFirstVideo);

  // 메뉴 외부 클릭으로 닫기
  document.addEventListener('click', (e) => {
    if (!menu.contains(e.target) && !fab.contains(e.target)) closeFabMenu();
  });
}

// ── 이벤트 핸들러 ──

function handleCategoryClick(e) {
  const header = e.target.closest('.category-header');
  if (!header) return;
  const cat = header.dataset.cat;
  const catEl = header.closest('.category');
  const isOpen = catEl.classList.toggle('open');
  userData.categoryState[cat] = isOpen;
  saveData();
}

function handleVideoAction(e) {
  const target = e.target.closest('[data-action]');
  if (!target) return;
  const videoItem = target.closest('.video-item');
  if (!videoItem) return;
  const videoId = videoItem.dataset.id;

  switch (target.dataset.action) {
    case 'toggle-watch': toggleWatch(videoId); break;
    case 'play': openPlayer(videoId); break;
    case 'set-start': setStartPoint(videoId); break;
    case 'toggle-star': toggleStar(videoId); break;
    case 'toggle-note': toggleNote(videoId); break;
    case 'toggle-repeat-badge': cycleRepeat(videoId); break;
  }
}

function handleNoteInput(e) {
  if (e.target.tagName !== 'TEXTAREA') return;
  const videoItem = e.target.closest('.video-item');
  if (!videoItem) return;
  const videoId = videoItem.dataset.id;
  const val = e.target.value.trim();
  if (val) { userData.notes[videoId] = val; } else { delete userData.notes[videoId]; }
  saveData();
  const noteBtn = videoItem.querySelector('.note-btn');
  if (noteBtn) noteBtn.classList.toggle('has-note', !!val);
}

/** 여기부터 연속 재생 시작점으로 설정하고 재생 */
function setStartPoint(videoId) {
  delete userData.lastPosition[videoId]; // 0초부터
  userData.lastWatched = videoId;
  saveData();
  updateFab();
  const video = VIDEOS.find(v => v.id === videoId);
  const name = video ? video.title.slice(0, 30) : '';
  showToast(`시작점 설정: ${name}...`);
  openPlayer(videoId);
}

function toggleWatch(videoId) {
  if (userData.watched[videoId]) { delete userData.watched[videoId]; }
  else { userData.watched[videoId] = new Date().toISOString(); }
  saveData();
  render();
}

function toggleStar(videoId) {
  const idx = userData.starred.indexOf(videoId);
  if (idx >= 0) { userData.starred.splice(idx, 1); } else { userData.starred.push(videoId); }
  saveData();
  render();
}

function toggleNote(videoId) {
  const noteEl = document.getElementById(`note-${videoId}`);
  if (noteEl) {
    noteEl.classList.toggle('open');
    if (noteEl.classList.contains('open')) noteEl.querySelector('textarea').focus();
  }
}

function cycleRepeat(videoId) {
  const current = userData.repeat[videoId] || { mode: 'off', count: 0 };
  if (current.mode === 'off') {
    userData.repeat[videoId] = { mode: 'infinite', count: 0 };
    showToast('무한 반복 설정');
  } else if (current.mode === 'infinite') {
    userData.repeat[videoId] = { mode: 'count', count: 3 };
    showToast('3회 반복 설정');
  } else {
    userData.repeat[videoId] = { mode: 'off', count: 0 };
    showToast('반복 해제');
  }
  saveData();
  render();
}

// ── YouTube 플레이어 ──

let ytReady = false;
window.onYouTubeIframeAPIReady = () => { ytReady = true; };

function openPlayer(videoId) {
  currentVideoId = videoId;
  const video = VIDEOS.find(v => v.id === videoId);
  if (!video) return;

  userData.lastWatched = videoId;
  // 재생 횟수 증가
  userData.playCount[videoId] = (userData.playCount[videoId] || 0) + 1;
  saveData();

  document.getElementById('player-title').textContent = video.title;
  document.getElementById('player-overlay').classList.add('open');

  // AB 루프 초기화
  abPointA = null;
  abPointB = null;
  updateAbUI();
  updateRepeatButton();
  updateNextInfo();

  // 플레이어: 기존 인스턴스 재사용 (모바일 자동재생 정책 우회)
  const startTime = Math.floor(safeFloat(userData.lastPosition[videoId]));

  if (ytReady && ytPlayer && typeof ytPlayer.loadVideoById === 'function') {
    // 기존 플레이어 재사용 → 모바일에서도 자동재생 됨
    ytPlayer.loadVideoById({ videoId: videoId, startSeconds: startTime });
  } else if (ytReady) {
    // 최초 1회만 새 플레이어 생성
    const wrapper = document.getElementById('player-wrapper');
    wrapper.innerHTML = '';
    ytPlayer = new YT.Player(wrapper, {
      width: '100%', height: '100%',
      videoId: videoId,
      playerVars: { autoplay: 1, start: startTime, rel: 0, modestbranding: 1, playsinline: 1 },
      events: {
        onReady: (evt) => { evt.target.playVideo(); },
        onStateChange: onPlayerStateChange
      }
    });
  } else {
    const wrapper = document.getElementById('player-wrapper');
    wrapper.innerHTML = `<iframe src="https://www.youtube.com/embed/${videoId}?autoplay=1&start=${startTime}&rel=0&playsinline=1" allow="autoplay; encrypted-media" allowfullscreen></iframe>`;
  }

  updateFab();
}

function closePlayer() {
  if (ytPlayer && typeof ytPlayer.getCurrentTime === 'function') {
    try {
      userData.lastPosition[currentVideoId] = Math.floor(ytPlayer.getCurrentTime());
      saveData();
      ytPlayer.pauseVideo(); // 파괴하지 않고 일시정지 (재사용 위해)
    } catch (e) {}
  }
  clearAbLoopTimer();
  currentVideoId = null;
  document.getElementById('player-overlay').classList.remove('open');
  render();
}

/** 다음 영상 정보 표시 */
function updateNextInfo() {
  const el = document.getElementById('next-info');
  if (!currentVideoId) { el.textContent = ''; return; }
  const next = getNextVideo(currentVideoId);
  if (next) {
    const autoplay = userData.settings.autoplay === 'on';
    el.textContent = `다음: ${next.title.slice(0, 50)}${next.title.length > 50 ? '...' : ''}${autoplay ? ' (자동 재생)' : ''}`;
  } else {
    el.textContent = '마지막 영상입니다';
  }
}

function onPlayerStateChange(e) {
  if (e.data === YT.PlayerState.ENDED) handleVideoEnded();
  if (e.data === YT.PlayerState.PLAYING) { startPositionTracking(); startAbLoopCheck(); }
  else { stopPositionTracking(); if (e.data !== YT.PlayerState.PAUSED) clearAbLoopTimer(); }
}

let positionTimer = null;
function startPositionTracking() {
  stopPositionTracking();
  positionTimer = setInterval(() => {
    if (ytPlayer && currentVideoId && typeof ytPlayer.getCurrentTime === 'function') {
      try { userData.lastPosition[currentVideoId] = Math.floor(ytPlayer.getCurrentTime()); saveData(); } catch (e) {}
    }
  }, 5000);
}
function stopPositionTracking() { if (positionTimer) { clearInterval(positionTimer); positionTimer = null; } }

function handleVideoEnded() {
  const vid = currentVideoId;
  if (!vid) return;

  // 시청 완료
  if (!userData.watched[vid]) {
    userData.watched[vid] = new Date().toISOString();
    saveData();
    renderProgress();
  }

  // 반복 재생 처리
  const repeat = userData.repeat[vid];
  if (repeat && repeat.mode !== 'off') {
    if (repeat.mode === 'infinite') {
      ytPlayer.seekTo(0, true); ytPlayer.playVideo();
      showToast('반복 재생 중...');
      return;
    } else if (repeat.mode === 'count' && repeat.count > 1) {
      repeat.count--; saveData();
      ytPlayer.seekTo(0, true); ytPlayer.playVideo();
      showToast(`반복 재생: 남은 ${repeat.count}회`);
      updateRepeatButton();
      return;
    } else {
      repeat.mode = 'off'; saveData(); updateRepeatButton();
    }
  }

  // 연속 재생: 다음 영상으로 이동
  if (userData.settings.autoplay === 'on') {
    const next = getNextVideo(vid);
    if (next) {
      showToast(`다음: ${next.title.slice(0, 30)}...`);
      // 잠시 후 다음 영상 재생 (UX)
      setTimeout(() => {
        closePlayerSilent();
        openPlayer(next.id);
      }, 1500);
    } else {
      showToast('모든 영상을 시청했습니다!');
    }
  }
}

/** 플레이어 닫기 (render 없이, 연속재생용) */
function closePlayerSilent() {
  clearAbLoopTimer();
  stopPositionTracking();
  if (ytPlayer && typeof ytPlayer.destroy === 'function') { try { ytPlayer.destroy(); } catch (e) {} }
  ytPlayer = null;
  document.getElementById('player-wrapper').innerHTML = '';
}

/** 다음 영상 재생 */
function playNext() {
  if (!currentVideoId) return;
  const next = getNextVideo(currentVideoId);
  if (next) {
    // 현재 위치 저장
    if (ytPlayer && typeof ytPlayer.getCurrentTime === 'function') {
      try { userData.lastPosition[currentVideoId] = Math.floor(ytPlayer.getCurrentTime()); saveData(); } catch (e) {}
    }
    closePlayerSilent();
    openPlayer(next.id);
  } else {
    showToast('마지막 영상입니다');
  }
}

/** 이전 영상 재생 */
function playPrev() {
  if (!currentVideoId) return;
  const prev = getPrevVideo(currentVideoId);
  if (prev) {
    if (ytPlayer && typeof ytPlayer.getCurrentTime === 'function') {
      try { userData.lastPosition[currentVideoId] = Math.floor(ytPlayer.getCurrentTime()); saveData(); } catch (e) {}
    }
    closePlayerSilent();
    openPlayer(prev.id);
  } else {
    showToast('첫 번째 영상입니다');
  }
}

// ── 반복 재생 UI ──

function updateRepeatButton() {
  const btn = document.getElementById('btn-repeat');
  const repeat = userData.repeat[currentVideoId] || { mode: 'off', count: 0 };
  switch (repeat.mode) {
    case 'infinite': btn.textContent = '🔁 무한'; btn.classList.add('active'); break;
    case 'count': btn.textContent = `🔁 ${repeat.count}회`; btn.classList.add('active'); break;
    default: btn.textContent = '🔁 끔'; btn.classList.remove('active');
  }
}

function cyclePlayerRepeat() {
  if (!currentVideoId) return;
  const current = userData.repeat[currentVideoId] || { mode: 'off', count: 0 };
  if (current.mode === 'off') { userData.repeat[currentVideoId] = { mode: 'infinite', count: 0 }; showToast('무한 반복'); }
  else if (current.mode === 'infinite') { userData.repeat[currentVideoId] = { mode: 'count', count: 3 }; showToast('3회 반복'); }
  else { userData.repeat[currentVideoId] = { mode: 'off', count: 0 }; showToast('반복 해제'); }
  saveData();
  updateRepeatButton();
}

// ── 구간 반복 (A-B Loop) ──

function setPointA() {
  if (!ytPlayer || typeof ytPlayer.getCurrentTime !== 'function') return;
  try {
    abPointA = Math.floor(ytPlayer.getCurrentTime());
    abPointB = null;
    document.getElementById('btn-ab-b').disabled = false;
    updateAbUI();
    showToast(`A점: ${formatTime(abPointA)}`);
  } catch (e) {}
}

function setPointB() {
  if (!ytPlayer || typeof ytPlayer.getCurrentTime !== 'function') return;
  if (abPointA === null) return;
  try {
    abPointB = Math.floor(ytPlayer.getCurrentTime());
    if (abPointB <= abPointA) { showToast('B점은 A점보다 뒤여야 합니다'); abPointB = null; return; }
    updateAbUI();
    startAbLoopCheck();
    showToast(`구간 반복: ${formatTime(abPointA)} → ${formatTime(abPointB)}`);
    if (currentVideoId) {
      if (!userData.abLoops[currentVideoId]) userData.abLoops[currentVideoId] = [];
      userData.abLoops[currentVideoId].push({ a: abPointA, b: abPointB, label: `${formatTime(abPointA)}-${formatTime(abPointB)}` });
      saveData();
    }
  } catch (e) {}
}

function clearAbLoop() {
  abPointA = null; abPointB = null;
  clearAbLoopTimer();
  document.getElementById('btn-ab-b').disabled = true;
  updateAbUI();
  showToast('구간 반복 해제');
}

function clearAbLoopTimer() { if (abLoopTimer) { clearInterval(abLoopTimer); abLoopTimer = null; } }

function startAbLoopCheck() {
  if (abPointA === null || abPointB === null) return;
  clearAbLoopTimer();
  abLoopTimer = setInterval(() => {
    if (!ytPlayer || typeof ytPlayer.getCurrentTime !== 'function') return;
    try { if (ytPlayer.getCurrentTime() >= abPointB) ytPlayer.seekTo(abPointA, true); } catch (e) {}
  }, CONFIG.AB_CHECK_INTERVAL_MS);
}

function updateAbUI() {
  const status = document.getElementById('ab-status');
  const clearBtn = document.getElementById('btn-ab-clear');
  const btnA = document.getElementById('btn-ab-a');
  const btnB = document.getElementById('btn-ab-b');

  if (abPointA !== null && abPointB !== null) {
    status.textContent = `구간 반복: ${formatTime(abPointA)} → ${formatTime(abPointB)}`;
    status.classList.remove('hidden'); clearBtn.classList.remove('hidden');
    btnA.classList.add('active'); btnA.textContent = `A:${formatTime(abPointA)}`;
    btnB.classList.add('active'); btnB.textContent = `B:${formatTime(abPointB)}`;
  } else if (abPointA !== null) {
    status.textContent = `A점: ${formatTime(abPointA)} (B점을 설정하세요)`;
    status.classList.remove('hidden'); clearBtn.classList.remove('hidden');
    btnA.classList.add('active'); btnA.textContent = `A:${formatTime(abPointA)}`;
    btnB.classList.remove('active'); btnB.textContent = 'B';
  } else {
    status.classList.add('hidden'); clearBtn.classList.add('hidden');
    btnA.classList.remove('active'); btnA.textContent = 'A';
    btnB.classList.remove('active'); btnB.textContent = 'B'; btnB.disabled = true;
  }
}

// ── 설정/데이터 관리 ──

function exportData() {
  const blob = new Blob([JSON.stringify(userData, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a'); a.href = url;
  a.download = `panditarama-backup-${new Date().toISOString().slice(0, 10)}.json`;
  a.click(); URL.revokeObjectURL(url);
  showToast('데이터 내보내기 완료');
}

function importData() { document.getElementById('import-file').click(); }

function handleImport(e) {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (ev) => {
    try {
      const data = JSON.parse(ev.target.result);
      if (data && typeof data === 'object') {
        userData = { ...defaultUserData(), ...data };
        userData.settings = { ...defaultUserData().settings, ...data.settings };
        saveData(); render(); applyTheme();
        showToast('데이터 가져오기 완료');
      }
    } catch (err) { showToast('잘못된 파일 형식입니다'); }
  };
  reader.readAsText(file);
  e.target.value = '';
}

function resetData() {
  if (!confirm('모든 시청 기록, 메모, 별표가 삭제됩니다. 계속하시겠습니까?')) return;
  userData = defaultUserData();
  saveData(); render(); applyTheme();
  showToast('데이터가 초기화되었습니다');
}

function toggleAllCategories() {
  const catOrder = getCategoryOrder();
  const allOpen = catOrder.every(c => userData.categoryState[c] === true);
  for (const c of catOrder) userData.categoryState[c] = !allOpen;
  saveData(); render();
  document.getElementById('btn-toggle-all').textContent = allOpen ? '전체 펼치기' : '전체 닫기';
}

// ── 초기화 ──

function init() {
  applyTheme();
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
    if (userData.settings.theme === 'auto') applyTheme();
  });

  // 설정 초기값 복원
  document.getElementById('sort-select').value = userData.settings.sort;
  document.getElementById('autoplay-select').value = userData.settings.autoplay || 'on';

  // 프리셋 버튼 활성화
  const activePreset = userData.settings.preset || 'chronological';
  document.querySelectorAll('.preset-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.preset === activePreset);
  });

  render();
  initFabDrag();

  // ── 이벤트 바인딩 ──

  document.getElementById('btn-share').addEventListener('click', shareApp);
  document.getElementById('btn-theme').addEventListener('click', toggleTheme);

  document.getElementById('btn-settings').addEventListener('click', () => {
    document.getElementById('settings-overlay').classList.add('open');
  });
  document.getElementById('btn-close-settings').addEventListener('click', () => {
    document.getElementById('settings-overlay').classList.remove('open');
  });

  document.getElementById('search-input').addEventListener('input',
    debounce((e) => { searchQuery = e.target.value.trim(); render(); }, CONFIG.DEBOUNCE_MS));

  // 필터
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentFilter = btn.dataset.filter;
      render();
    });
  });

  // 프리셋 버튼
  document.querySelectorAll('.preset-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.preset-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      userData.settings.preset = btn.dataset.preset;
      saveData();
      render();
      const preset = CATEGORY_PRESETS[btn.dataset.preset];
      if (preset) showToast(preset.description);
    });
  });

  // 카테고리 + 영상 클릭 (이벤트 위임)
  document.getElementById('category-list').addEventListener('click', (e) => {
    handleCategoryClick(e);
    handleVideoAction(e);
  });
  document.getElementById('category-list').addEventListener('input', debounce(handleNoteInput, CONFIG.DEBOUNCE_MS));

  // 이어보기 카드
  document.getElementById('resume-card').addEventListener('click', () => {
    if (userData.lastWatched) openPlayer(userData.lastWatched);
  });

  // 플레이어 컨트롤
  document.getElementById('btn-repeat').addEventListener('click', cyclePlayerRepeat);
  document.getElementById('btn-ab-a').addEventListener('click', setPointA);
  document.getElementById('btn-ab-b').addEventListener('click', setPointB);
  document.getElementById('btn-ab-clear').addEventListener('click', clearAbLoop);
  document.getElementById('btn-prev').addEventListener('click', playPrev);
  document.getElementById('btn-next').addEventListener('click', playNext);
  document.getElementById('btn-mark-watched').addEventListener('click', () => {
    if (currentVideoId) {
      userData.watched[currentVideoId] = new Date().toISOString();
      saveData(); renderProgress();
      showToast('시청 완료 표시됨');
    }
  });
  document.getElementById('btn-lock').addEventListener('click', lockScreen);
  document.getElementById('btn-close-player').addEventListener('click', closePlayer);

  // 모달 외부 클릭
  document.getElementById('player-overlay').addEventListener('click', (e) => {
    if (e.target === e.currentTarget) closePlayer();
  });
  document.getElementById('settings-overlay').addEventListener('click', (e) => {
    if (e.target === e.currentTarget) e.currentTarget.classList.remove('open');
  });

  // 정렬
  document.getElementById('sort-select').addEventListener('change', (e) => {
    userData.settings.sort = e.target.value; saveData(); render();
  });

  // 연속 재생 설정
  document.getElementById('autoplay-select').addEventListener('change', (e) => {
    userData.settings.autoplay = e.target.value; saveData();
    showToast(e.target.value === 'on' ? '연속 재생 켜짐' : '연속 재생 꺼짐');
  });

  // 바로가기
  document.getElementById('btn-add-shortcut').addEventListener('click', handleAddShortcut);

  // 이미 PWA로 실행 중이면 바로가기 버튼 숨기기
  if (window.matchMedia('(display-mode: standalone)').matches || navigator.standalone) {
    document.getElementById('shortcut-section').innerHTML =
      '<div style="font-size:13px;color:var(--checked)">✓ 이미 앱으로 실행 중입니다</div>';
  }

  // 데이터 관리
  document.getElementById('btn-export').addEventListener('click', exportData);
  document.getElementById('btn-import').addEventListener('click', importData);
  document.getElementById('import-file').addEventListener('change', handleImport);
  document.getElementById('btn-reset').addEventListener('click', resetData);
  document.getElementById('btn-toggle-all').addEventListener('click', toggleAllCategories);

  // PWA
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./service-worker.js', { updateViaCache: 'none' })
      .then(reg => { reg.update(); })
      .catch(() => {});
  }
  if (navigator.storage && navigator.storage.persist) navigator.storage.persist();
  initInstallBanner();
  initLockScreen();

  // ESC
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') { closePlayer(); document.getElementById('settings-overlay').classList.remove('open'); }
  });
}

// ── 바로가기 만들기 ──

function handleAddShortcut() {
  const guide = document.getElementById('shortcut-guide');

  // Android: beforeinstallprompt 사용
  if (deferredInstallPrompt) {
    deferredInstallPrompt.prompt();
    deferredInstallPrompt.userChoice.then(result => {
      if (result.outcome === 'accepted') showToast('앱이 설치되었습니다!');
      deferredInstallPrompt = null;
    });
    return;
  }

  // 기기별 안내 표시
  const ua = navigator.userAgent;
  const isIOS = /iPad|iPhone|iPod/.test(ua);
  const isAndroid = /Android/.test(ua);
  const isMac = /Macintosh/.test(ua) && !isIOS;
  const isWindows = /Windows/.test(ua);

  const isSafari = isIOS && /Safari/.test(ua) && !/CriOS|FxiOS|EdgiOS/.test(ua);
  const isIOSNotSafari = isIOS && !isSafari;

  let html = '';
  if (isIOSNotSafari) {
    // iOS에서 Safari가 아닌 브라우저
    html = `
      <div class="install-guide">
        <div class="guide-warning">
          <span style="font-size:24px">⚠️</span>
          <strong>Safari에서 열어주세요</strong>
        </div>
        <p>iPhone/iPad는 <strong>Safari</strong>에서만 홈 화면에 추가할 수 있습니다.</p>
        <div class="guide-step">
          <div class="guide-num">1</div>
          <div class="guide-content">
            <strong>Safari 앱</strong>을 열어주세요
            <div class="guide-icon">🧭 Safari</div>
          </div>
        </div>
        <div class="guide-step">
          <div class="guide-num">2</div>
          <div class="guide-content">
            주소창에 아래 주소를 입력하세요
            <div class="guide-url">reachtowisdom.github.io/panditarama3</div>
            <button class="btn-copy-url" onclick="navigator.clipboard.writeText('https://reachtowisdom.github.io/panditarama3/').then(()=>showToast('주소 복사됨!'))">📋 주소 복사</button>
          </div>
        </div>
        <div class="guide-step">
          <div class="guide-num">3</div>
          <div class="guide-content">Safari에서 아래 설치 방법을 따라하세요</div>
        </div>
      </div>
    `;
  } else if (isIOS) {
    // iOS Safari
    html = `
      <div class="install-guide">
        <div class="guide-title">iPhone/iPad 홈 화면에 추가하기</div>
        <div class="guide-step">
          <div class="guide-num">1</div>
          <div class="guide-content">
            화면 <strong>하단</strong>의 <strong>공유 버튼</strong>을 탭하세요
            <div class="guide-visual">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#007AFF" stroke-width="2">
                <rect x="5" y="8" width="14" height="13" rx="2"/>
                <path d="M12 3v12M8 7l4-4 4 4"/>
              </svg>
              <span>이 모양의 버튼</span>
            </div>
          </div>
        </div>
        <div class="guide-step">
          <div class="guide-num">2</div>
          <div class="guide-content">
            메뉴를 <strong>위로 스크롤</strong>하여<br>
            <strong>"홈 화면에 추가"</strong>를 찾아 탭하세요
            <div class="guide-visual">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#007AFF" stroke-width="2">
                <rect x="3" y="3" width="18" height="18" rx="2"/>
                <path d="M12 8v8M8 12h8"/>
              </svg>
              <span>홈 화면에 추가</span>
            </div>
          </div>
        </div>
        <div class="guide-step">
          <div class="guide-num">3</div>
          <div class="guide-content">
            우측 상단 <strong>"추가"</strong>를 탭하면 완료!
            <div class="guide-result">홈 화면에 앱 아이콘이 생깁니다 🎉</div>
          </div>
        </div>
      </div>
    `;
  } else if (isAndroid) {
    html = `
      <div class="install-guide">
        <div class="guide-title">Android 홈 화면에 추가하기</div>
        <div class="guide-step">
          <div class="guide-num">1</div>
          <div class="guide-content">
            우측 상단 <strong>⋮ 메뉴</strong>를 탭하세요
            <div class="guide-visual">
              <span style="font-size:24px;font-weight:bold">⋮</span>
              <span>점 세 개 메뉴</span>
            </div>
          </div>
        </div>
        <div class="guide-step">
          <div class="guide-num">2</div>
          <div class="guide-content">
            <strong>"앱 설치"</strong> 또는 <strong>"홈 화면에 추가"</strong>를 탭하세요
          </div>
        </div>
        <div class="guide-step">
          <div class="guide-num">3</div>
          <div class="guide-content">
            <strong>"설치"</strong>를 탭하면 완료!
            <div class="guide-result">홈 화면에 앱 아이콘이 생깁니다 🎉</div>
          </div>
        </div>
        <p style="font-size:11px;color:var(--text-muted);margin-top:8px">* Chrome 브라우저 권장</p>
      </div>
    `;
  } else if (isMac) {
    html = `
      <div class="install-guide">
        <div class="guide-title">Mac에 설치하기</div>
        <div class="guide-step">
          <div class="guide-num">1</div>
          <div class="guide-content">
            <strong>Chrome:</strong> 주소창 오른쪽 <strong>설치 아이콘</strong>(⊕) 클릭<br>
            <strong>Safari:</strong> 메뉴 → 파일 → <strong>"Dock에 추가"</strong>
          </div>
        </div>
        <div class="guide-step">
          <div class="guide-num">2</div>
          <div class="guide-content">
            <strong>"설치"</strong> 확인하면 완료!
            <div class="guide-result">독립 앱으로 실행됩니다 🎉</div>
          </div>
        </div>
      </div>
    `;
  } else if (isWindows) {
    html = `
      <div class="install-guide">
        <div class="guide-title">PC에 설치하기</div>
        <div class="guide-step">
          <div class="guide-num">1</div>
          <div class="guide-content">
            주소창 오른쪽 <strong>설치 아이콘</strong>(⊕) 클릭
          </div>
        </div>
        <div class="guide-step">
          <div class="guide-num">2</div>
          <div class="guide-content">
            <strong>"설치"</strong> 확인하면 완료!
            <div class="guide-result">독립 앱으로 실행됩니다 🎉</div>
          </div>
        </div>
      </div>
    `;
  } else {
    html = `
      <div class="install-guide">
        <div class="guide-title">홈 화면에 추가하기</div>
        <p>브라우저 메뉴에서 <strong>"홈 화면에 추가"</strong> 또는 <strong>"앱 설치"</strong>를 찾아주세요.</p>
      </div>
    `;
  }

  guide.innerHTML = html;
  guide.classList.toggle('hidden');
}

// ── 화면 잠금 (주머니 모드) ──

let lockTimer = null;
const UNLOCK_HOLD_MS = 2000; // 2초 길게 눌러야 해제

function lockScreen() {
  document.getElementById('lock-overlay').classList.remove('hidden');
  // 전체화면으로 전환 (주소창/메뉴 숨김)
  const el = document.documentElement;
  if (el.requestFullscreen) el.requestFullscreen().catch(() => {});
  else if (el.webkitRequestFullscreen) el.webkitRequestFullscreen();
  // 화면 꺼짐 방지
  if (navigator.wakeLock) {
    navigator.wakeLock.request('screen').catch(() => {});
  }
  showToast('화면 잠금 — 해제: 2초 길게 누르기');
}

function initLockScreen() {
  const overlay = document.getElementById('lock-overlay');
  const progress = document.getElementById('lock-progress');

  function onStart(e) {
    e.preventDefault();
    lockTimer = setTimeout(() => {
      overlay.classList.add('hidden');
      progress.style.width = '0%';
      // 전체화면 해제
      if (document.fullscreenElement) document.exitFullscreen().catch(() => {});
      else if (document.webkitFullscreenElement) document.webkitExitFullscreen();
      showToast('잠금 해제');
    }, UNLOCK_HOLD_MS);
    // 프로그레스 애니메이션
    progress.style.transition = `width ${UNLOCK_HOLD_MS}ms linear`;
    progress.style.width = '100%';
  }

  function onEnd() {
    clearTimeout(lockTimer);
    progress.style.transition = 'none';
    progress.style.width = '0%';
  }

  overlay.addEventListener('touchstart', onStart, { passive: false });
  overlay.addEventListener('touchend', onEnd);
  overlay.addEventListener('touchcancel', onEnd);
  overlay.addEventListener('mousedown', onStart);
  overlay.addEventListener('mouseup', onEnd);
  overlay.addEventListener('mouseleave', onEnd);

  // 잠금 중 모든 터치 차단
  overlay.addEventListener('click', (e) => e.stopPropagation());
}

// ── 공유 ──

function shareApp() {
  const url = 'https://reachtowisdom.github.io/panditarama3/';
  const text = '빤디따라마 법문 영상 플레이리스트';
  if (navigator.share) {
    navigator.share({ title: text, url: url }).catch(() => {});
  } else {
    // 클립보드 복사 폴백
    navigator.clipboard.writeText(url).then(() => {
      showToast('링크가 복사되었습니다');
    }).catch(() => {
      // 폴백: 수동 복사
      prompt('링크를 복사하세요:', url);
    });
  }
}

// ── PWA 설치 배너 ──

let deferredInstallPrompt = null;

function initInstallBanner() {
  const banner = document.getElementById('install-banner');
  const btnInstall = document.getElementById('btn-install');
  const btnClose = document.getElementById('btn-install-close');

  // 이미 설치됨 또는 닫기 기억
  if (window.matchMedia('(display-mode: standalone)').matches || navigator.standalone) return;
  if (localStorage.getItem('panditarama_install_dismissed')) return;

  // Android Chrome: beforeinstallprompt 이벤트
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredInstallPrompt = e;
    document.getElementById('install-desc').textContent = '홈 화면에 추가하면 앱처럼 사용할 수 있어요';
    banner.classList.remove('hidden');
  });

  // iOS Safari: 수동 안내
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
  if (isIOS && !navigator.standalone) {
    document.getElementById('install-desc').textContent = '공유 버튼(□↑) → "홈 화면에 추가"를 눌러주세요';
    btnInstall.textContent = '방법 보기';
    banner.classList.remove('hidden');
  }

  btnInstall.addEventListener('click', async () => {
    if (deferredInstallPrompt) {
      deferredInstallPrompt.prompt();
      const result = await deferredInstallPrompt.userChoice;
      if (result.outcome === 'accepted') showToast('앱이 설치되었습니다!');
      deferredInstallPrompt = null;
      banner.classList.add('hidden');
    } else {
      // iOS: 안내 토스트
      showToast('하단 공유 버튼(□↑) → "홈 화면에 추가"');
    }
  });

  btnClose.addEventListener('click', () => {
    banner.classList.add('hidden');
    localStorage.setItem('panditarama_install_dismissed', '1');
  });

  // 설치 완료 감지
  window.addEventListener('appinstalled', () => {
    banner.classList.add('hidden');
    showToast('앱이 설치되었습니다!');
  });
}

document.addEventListener('DOMContentLoaded', init);
