// 빤디따라마 Firebase 동기화 모듈
// Firestore를 통한 기기간 시청 기록 동기화

import { initializeApp } from 'https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged }
  from 'https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js';
import { getFirestore, doc, getDoc, setDoc }
  from 'https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js';

// Firebase 설정
const FIREBASE_CONFIG = {
  apiKey: 'AIzaSyDDNRL69ugkKb6mJPnJb2kQud0_3b97viA',
  authDomain: 'panditarama-video.firebaseapp.com',
  projectId: 'panditarama-video',
  storageBucket: 'panditarama-video.firebasestorage.app',
  messagingSenderId: '504794613271',
  appId: '1:504794613271:web:ac565d6c6e82d9b72c7e52'
};

// 동기화 상태
let auth = null;
let db = null;
let currentUser = null;
let syncEnabled = false;
const SYNC_DEBOUNCE_MS = 3000;
let syncTimer = null;

// ── 초기화 ──

function initSync() {
  try {
    const app = initializeApp(FIREBASE_CONFIG);
    auth = getAuth(app);
    db = getFirestore(app);

    onAuthStateChanged(auth, async (user) => {
      currentUser = user;
      syncEnabled = !!user;
      updateSyncUI();
      if (user) {
        await pullFromCloud();
      }
    });
  } catch (e) {
    console.error('Firebase 초기화 실패:', e);
  }

  // 버튼 이벤트
  document.getElementById('btn-sync').addEventListener('click', handleSyncClick);
  document.getElementById('btn-sync-now').addEventListener('click', async () => {
    showToast('동기화 중...');
    await pullFromCloud();
  });
  document.getElementById('btn-sync-logout').addEventListener('click', async () => {
    await signOut(auth);
    currentUser = null;
    syncEnabled = false;
    updateSyncUI();
    showToast('로그아웃 완료');
  });
}

// ── 로그인 ──

async function handleSyncClick() {
  if (syncEnabled) {
    // 이미 로그인됨 → 동기화 실행
    showToast('동기화 중...');
    await pullFromCloud();
    return;
  }
  try {
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
  } catch (e) {
    if (e.code === 'auth/popup-closed-by-user') return;
    console.error('로그인 실패:', e);
    showToast('로그인 실패');
  }
}

// ── 클라우드 읽기/쓰기 ──

async function pullFromCloud() {
  if (!syncEnabled || !currentUser || !db) return;
  try {
    const docRef = doc(db, 'users', currentUser.uid);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      mergeData(docSnap.data());
      showToast('동기화 완료');
    } else {
      await pushToCloud();
      showToast('첫 동기화: 업로드 완료');
    }
  } catch (e) {
    console.error('동기화 실패:', e);
    showToast('동기화 실패: 네트워크 확인');
  }
}

async function pushToCloud() {
  if (!syncEnabled || !currentUser || !db) return;
  try {
    const docRef = doc(db, 'users', currentUser.uid);
    const data = {
      watched: userData.watched || {},
      starred: userData.starred || [],
      notes: userData.notes || {},
      lastWatched: userData.lastWatched || null,
      lastPosition: userData.lastPosition || {},
      playCount: userData.playCount || {},
      settings: userData.settings || {},
      lastSyncAt: new Date().toISOString(),
      syncDevice: navigator.userAgent.slice(0, 100)
    };
    await setDoc(docRef, data, { merge: true });
  } catch (e) {
    console.error('클라우드 저장 실패:', e);
  }
}

function debouncedPush() {
  if (!syncEnabled) return;
  clearTimeout(syncTimer);
  syncTimer = setTimeout(() => pushToCloud(), SYNC_DEBOUNCE_MS);
}

// ── 데이터 병합 ──

function mergeData(cloud) {
  // watched: 더 최신 날짜 사용
  if (cloud.watched) {
    for (const [id, date] of Object.entries(cloud.watched)) {
      if (!userData.watched[id] || userData.watched[id] < date) {
        userData.watched[id] = date;
      }
    }
  }
  // starred: 합집합
  if (cloud.starred) {
    userData.starred = [...new Set([...userData.starred, ...cloud.starred])];
  }
  // notes: 로컬 없으면 클라우드 것 사용
  if (cloud.notes) {
    for (const [id, note] of Object.entries(cloud.notes)) {
      if (!userData.notes[id]) userData.notes[id] = note;
    }
  }
  // lastWatched + lastPosition: 클라우드 lastSyncAt이 있으면 클라우드 우선
  if (cloud.lastWatched && !userData.lastWatched) {
    userData.lastWatched = cloud.lastWatched;
  }
  // lastPosition: 더 큰 값 (더 많이 본 쪽)
  if (cloud.lastPosition) {
    for (const [id, pos] of Object.entries(cloud.lastPosition)) {
      const localPos = parseFloat(userData.lastPosition[id]) || 0;
      const cloudPos = parseFloat(pos) || 0;
      if (cloudPos > localPos) userData.lastPosition[id] = cloudPos;
    }
  }
  // playCount: 더 큰 값
  if (cloud.playCount) {
    for (const [id, count] of Object.entries(cloud.playCount)) {
      if ((count || 0) > (userData.playCount[id] || 0)) {
        userData.playCount[id] = count;
      }
    }
  }
  saveData();
  render();
}

// ── UI 업데이트 ──

function updateSyncUI() {
  const btn = document.getElementById('btn-sync');
  const btnNow = document.getElementById('btn-sync-now');
  const btnLogout = document.getElementById('btn-sync-logout');
  const status = document.getElementById('sync-status');

  if (currentUser) {
    const name = currentUser.displayName || currentUser.email;
    btn.textContent = `✅ ${name}`;
    status.textContent = `로그인 중: ${name}`;
    status.style.color = 'var(--checked)';
    btnNow.classList.remove('hidden');
    btnLogout.classList.remove('hidden');
  } else {
    btn.textContent = '🔄 Google 로그인';
    status.textContent = '로그인하면 시청 기록이 기기간 동기화됩니다';
    status.style.color = 'var(--text-muted)';
    btnNow.classList.add('hidden');
    btnLogout.classList.add('hidden');
  }
}

// ── 전역 등록 ──

window.syncModule = {
  init: initSync,
  push: debouncedPush,
  isLoggedIn: () => !!currentUser
};

// DOM 로드 후 초기화
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initSync);
} else {
  initSync();
}
