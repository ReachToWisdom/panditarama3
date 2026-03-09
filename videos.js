// 빤디따라마 영상 데이터 (자동 생성)
// 총 303개 영상, 26개 카테고리
// 생성일: 2026-03-09
// 정렬: 제목의 강 번호 기준 (없으면 날짜순)

// 기본 카테고리 (영상 수 기준)
const CATEGORIES = [
  "12연기",
  "초전법륜경",
  "무아인경",
  "[레디 사야도] 바와나 디빠니",
  "실라완따숟따",
  "마하사띠빧타나숟따",
  "붇다의 날",
  "집중수행 법문 | 빤디따라마 큰스님(아신 빤디따비왐사)",
  "살레카숟따",
  "헤마와따경",
  "대념처경",
  "망갈라숟따",
  "보시, 회향",
  "아리야와사숟따",
  "빤디따라마 유소년 위빳사나 불교학교",
  "빤디따라마 큰스님(아신 빤디따 비왐사 사야도)",
  "수받다 경",
  "위빳사나 수행 입문",
  "추모법회",
  "빠릳따빠리깜마",
  "왐미까숟따",
  "특별법회",
  "아시위소빠마숟따",
  "오와다 빠띠목카, 전륜성왕경",
  "바와나숟따",
  "아누룻다 장로의 대사유의 경"
,
  "낑다다숟따",
  "니디깐다숟따",
  "위빳사나 집중수행 법문(2006)"
]

// 카테고리 순서 프리셋
const CATEGORY_PRESETS = {
  // 부처님 법을 설하신 역사적 순서
  historical: {
    label: "설법 순서 (역사적)",
    description: "부처님께서 법을 설하신 시기 순서",
    order: [
      "초전법륜경",           // 성도 후 첫 설법
      "무아인경",             // 첫 설법 직후 5일째
      "12연기",              // 초기 설법, 연기법
      "헤마와따경",           // 숫따니빠따, 초기 교화기
      "살레카숟따",           // MN 8, 초기 상가
      "왐미까숟따",           // MN 23, 수행 장애 비유
      "망갈라숟따",           // 숫따니빠따, 최상의 축복
      "아리야와사숟따",       // AN 4.28, 성자의 전통
      "실라완따숟따",         // 계행의 공덕
      "아시위소빠마숟따",     // AN 4.113, 네 종류의 말
      "오와다 빠띠목카, 전륜성왕경", // 첫 안거 후
      "마하사띠빧타나숟따",   // DN 22, 사념처
      "대념처경",             // MN 10, 사념처
      "바와나숟따",           // 수행에 관한 가르침
      "아누룻다 장로의 대사유의 경", // AN 8.30
      "수받다 경",            // 부처님 마지막 설법
      "빠릳따빠리깜마",       // 보호경 독송
      "[레디 사야도] 바와나 디빠니", // 후대 저술
      "붇다의 날",
      "집중수행 법문 | 빤디따라마 큰스님(아신 빤디따비왐사)",
      "보시, 회향",
      "빤디따라마 유소년 위빳사나 불교학교",
      "빤디따라마 큰스님(아신 빤디따 비왐사 사야도)",
      "위빳사나 수행 입문",
      "추모법회",
      "특별법회",
    ]
  },

  // 초보자 학습 추천 순서
  beginner: {
    label: "초보자 순서",
    description: "불교를 처음 접하는 분을 위한 단계별 학습",
    order: [
      // 1단계: 입문 — 기초적 실천과 축복
      "망갈라숟따",           // 최상의 축복 38가지, 일상 지침
      "보시, 회향",           // 가장 기초적 실천
      // 2단계: 기초 교리 — 핵심 가르침
      "초전법륜경",           // 사성제, 팔정도 (첫 설법)
      "무아인경",             // 오온과 무아
      "실라완따숟따",         // 계행의 중요성
      "살레카숟따",           // 자기 정화
      // 3단계: 수행 입문
      "위빳사나 수행 입문",
      "빤디따라마 큰스님(아신 빤디따 비왐사 사야도)",
      "집중수행 법문 | 빤디따라마 큰스님(아신 빤디따비왐사)",
      "바와나숟따",
      // 4단계: 중급 — 교리 심화
      "12연기",
      "헤마와따경",
      "아시위소빠마숟따",
      "아리야와사숟따",
      // 5단계: 심화 — 사념처와 전문 경전
      "마하사띠빧타나숟따",
      "대념처경",
      "왐미까숟따",
      "[레디 사야도] 바와나 디빠니",
      "수받다 경",
      "오와다 빠띠목카, 전륜성왕경",
      "아누룻다 장로의 대사유의 경",
      "빠릳따빠리깜마",
      // 기타 — 기념 법회/행사
      "붇다의 날",
      "빤디따라마 유소년 위빳사나 불교학교",
      "추모법회",
      "특별법회",
    ]
  },

  // 수행자 순서
  practitioner: {
    label: "수행자 순서",
    description: "기본 교리를 아는 수행자의 심화 학습",
    order: [
      // 1단계: 계행 재점검
      "실라완따숟따",
      "살레카숟따",
      "아리야와사숟따",
      // 2단계: 사띠빧타나 집중
      "마하사띠빧타나숟따",
      "대념처경",
      "집중수행 법문 | 빤디따라마 큰스님(아신 빤디따비왐사)",
      "위빳사나 수행 입문",
      // 3단계: 핵심 교리 심화
      "12연기",
      "초전법륜경",
      "무아인경",
      // 4단계: 수행 장애와 극복
      "왐미까숟따",
      "아시위소빠마숟따",
      "아누룻다 장로의 대사유의 경",
      // 5단계: 전통과 주석서
      "[레디 사야도] 바와나 디빠니",
      "헤마와따경",
      "수받다 경",
      "오와다 빠띠목카, 전륜성왕경",
      "바와나숟따",
      "빠릳따빠리깜마",
      "망갈라숟따",
      // 기타
      "보시, 회향",
      "붇다의 날",
      "빤디따라마 큰스님(아신 빤디따 비왐사 사야도)",
      "빤디따라마 유소년 위빳사나 불교학교",
      "추모법회",
      "특별법회",
    ]
  },

  // 등록순 (오래된 영상부터 시간순)
  chronological: {
    label: "등록순",
    description: "업로드 날짜순 (오래된 영상부터)",
    order: null,
    sortByDate: 'asc'  // 날짜 오름차순
  },

  // 최신순 (최근 업로드된 영상부터)
  latest: {
    label: "최신순",
    description: "최근 업로드된 영상이 위에 표시",
    order: null,
    sortByDate: 'desc'  // 날짜 역순 정렬
  },

  // 영상 수 기준 (기본)
  count: {
    label: "영상 수 순",
    description: "영상이 많은 카테고리부터",
    order: null  // null이면 CATEGORIES 기본 순서 사용
  }
};

const VIDEOS = [
  {
    "id": "KCyIntyRmTM",
    "title": "[12연기] 1강 - 서론 | 빤디따라마 | 아야 마나삐까 | 2019.05.26",
    "duration": "1:39:55",
    "durationSec": 5995,
    "category": "12연기",
    "sortKey": 20190001,
    "date": "2019-05-26",
    "order": 0
  },
  {
    "id": "wQkQxznaCkQ",
    "title": "[12연기] 2강 - 아윗자빳짜야 상카라 (1) | 빤디따라마 | 아야 마나삐까 | 2019.06.09",
    "duration": "1:29:20",
    "durationSec": 5360,
    "category": "12연기",
    "sortKey": 20190002,
    "date": "2019-06-09",
    "order": 1
  },
  {
    "id": "CBo2DqKKk4g",
    "title": "[12연기] 3강 - 아윗자빳짜야 상카라 (2) | 빤디따라마 | 아야 마나삐까 | 2019.06.23",
    "duration": "1:44:15",
    "durationSec": 6255,
    "category": "12연기",
    "sortKey": 20190003,
    "date": "2019-06-23",
    "order": 2
  },
  {
    "id": "TOi88XoLjs4",
    "title": "[12연기] 4강 - 아윗자빳짜야 상카라 (3) | 빤디따라마 | 아야 마나삐까 | 2019.07.14",
    "duration": "1:35:09",
    "durationSec": 5709,
    "category": "12연기",
    "sortKey": 20190004,
    "date": "2019-07-14",
    "order": 3
  },
  {
    "id": "y1_WtTGpXPQ",
    "title": "[12연기] 5강 - 아윗자빳짜야 상카라 (4) | 빤디따라마 | 아야 마나삐까 | 2019.07.28",
    "duration": "1:36:38",
    "durationSec": 5798,
    "category": "12연기",
    "sortKey": 20190005,
    "date": "2019-07-28",
    "order": 4
  },
  {
    "id": "gzXd2-5T5iI",
    "title": "[12연기] 6강 - 상카라빳짜야 윈냐낭 (1) | 빤디따라마 | 아야 마나삐까 | 2019.08.11",
    "duration": "1:38:56",
    "durationSec": 5936,
    "category": "12연기",
    "sortKey": 20190006,
    "date": "2019-08-11",
    "order": 5
  },
  {
    "id": "UPNiK0pkGkk",
    "title": "[12연기] 7강 - 상카라빳짜야 윈냐낭 (2) | 빤디따라마 | 아야 마나삐까 | 2019.08.25",
    "duration": "1:31:41",
    "durationSec": 5501,
    "category": "12연기",
    "sortKey": 20190007,
    "date": "2019-08-25",
    "order": 6
  },
  {
    "id": "T1yiC_p3Bb0",
    "title": "[12연기] 8강 - 상카라빳짜야 윈냐낭 (3) | 빤디따라마 | 아야 마나삐까 | 2019.09.08",
    "duration": "1:27:52",
    "durationSec": 5272,
    "category": "12연기",
    "sortKey": 20190008,
    "date": "2019-09-08",
    "order": 7
  },
  {
    "id": "XT1h_VNJ26Y",
    "title": "[12연기] 9강 - 윈냐나빳자야 나마루빵 (수행자가 지켜야 할 6가지) | 빤디따라마 | 아야 마나삐까 | 2019.09.12",
    "duration": "1:13:34",
    "durationSec": 4414,
    "category": "12연기",
    "sortKey": 20190009,
    "date": "2019-09-12",
    "order": 8
  },
  {
    "id": "yLRg42msBlQ",
    "title": "[12연기] 10강 - 상카라빳자야 윈냐낭 (4) | 빤디따라마 | 아야 마나삐까 | 2019.09.13",
    "duration": "1:19:40",
    "durationSec": 4780,
    "category": "12연기",
    "sortKey": 20190010,
    "date": "2019-09-13",
    "order": 9
  },
  {
    "id": "17IywIhtHno",
    "title": "[12연기] 11강 - 상카라빳자야 윈냐낭 (5) | 빤디따라마 | 아야 마나삐까 | 2019.09.14",
    "duration": "1:10:27",
    "durationSec": 4227,
    "category": "12연기",
    "sortKey": 20190011,
    "date": "2019-09-14",
    "order": 10
  },
  {
    "id": "Da7B2Bge558",
    "title": "[12연기] 12강 - 아윗자빳짜야 상카라, 상카라빳짜야 윈냐낭 | 빤디따라마 | 아야 마나삐까 | 2019.09.15",
    "duration": "1:03:45",
    "durationSec": 3825,
    "category": "12연기",
    "sortKey": 20190012,
    "date": "2019-09-15",
    "order": 11
  },
  {
    "id": "72xda99udOM",
    "title": "[12연기] 13강 - 아윗자빳짜야 상카라, 상카라빳짜야 윈냐낭, 윈냐나빳짜야 나마루빵 | 빤디따라마 | 아야 마나삐까 | 2019.09.22",
    "duration": "1:42:27",
    "durationSec": 6147,
    "category": "12연기",
    "sortKey": 20190013,
    "date": "2019-09-22",
    "order": 12
  },
  {
    "id": "1AR4QCyInk0",
    "title": "[12연기] 14강 - 윈냐나빳짜야 나마루빵 | 빤디따라마 | 아야 마나삐까 | 2019.10.13",
    "duration": "1:45:32",
    "durationSec": 6332,
    "category": "12연기",
    "sortKey": 20190014,
    "date": "2019-10-13",
    "order": 13
  },
  {
    "id": "ZKHnHJrIdKE",
    "title": "[12연기] 15강 - 나마루빠빳짜야 살라야따낭 | 빤디따라마 | 아야 마나삐까 | 2019.10.27",
    "duration": "1:21:59",
    "durationSec": 4919,
    "category": "12연기",
    "sortKey": 20190015,
    "date": "2019-10-27",
    "order": 14
  },
  {
    "id": "4NJsHZ4H8Nk",
    "title": "[12연기] 16강 - 난다말라 큰스님 법문에 바탕한 12연기 중간정리 | 빤디따라마 | 아야 마나삐까 | 2019.11.10",
    "duration": "1:22:31",
    "durationSec": 4951,
    "category": "12연기",
    "sortKey": 20190016,
    "date": "2019-11-10",
    "order": 15
  },
  {
    "id": "4jmaSBhSGVs",
    "title": "[12연기] 17강 - 아난다 존자 일화로 보는 12연기의 심오한 모습 | 빤디따라마 | 아야 마나삐까 | 2020.06.28",
    "duration": "1:41:21",
    "durationSec": 6081,
    "category": "12연기",
    "sortKey": 20200017,
    "date": "2020-06-28",
    "order": 16
  },
  {
    "id": "yFd5dFg1eKY",
    "title": "[12연기] 18강 - 아윗자빳짜야 상카라, 상카라빳짜야 윈냐낭 | 빤디따라마 | 아야 마나삐까 | 2020.07.05",
    "duration": "1:36:00",
    "durationSec": 5760,
    "category": "12연기",
    "sortKey": 20200018,
    "date": "2020-07-05",
    "order": 17
  },
  {
    "id": "cNM35BzbZqM",
    "title": "[12연기] 19강 - 윈냐나빳짜야 나마루빵, 나마루빠빳짜야 살라야따낭 | 빤디따라마 | 아야 마나삐까 | 2020.07.12",
    "duration": "1:26:01",
    "durationSec": 5161,
    "category": "12연기",
    "sortKey": 20200019,
    "date": "2020-07-12",
    "order": 18
  },
  {
    "id": "lK6uhGS66NE",
    "title": "[12연기] 20강 - 살라야따나빳짜야 팟쏘 | 빤디따라마 | 아야 마나삐까 | 2020.07.19",
    "duration": "1:22:46",
    "durationSec": 4966,
    "category": "12연기",
    "sortKey": 20200020,
    "date": "2020-07-19",
    "order": 19
  },
  {
    "id": "TTcbe3gJCpw",
    "title": "[12연기] 21강 - 아윗짜빳짜야 상카라 ~ 팟사빳짜야 웨다나 | 빤디따라마 | 아야 마나삐까 | 2020.07.26",
    "duration": "1:40:41",
    "durationSec": 6041,
    "category": "12연기",
    "sortKey": 20200021,
    "date": "2020-07-26",
    "order": 20
  },
  {
    "id": "EvRvx1cwVJw",
    "title": "[12연기] 22강 - 팟사빳짜야 웨다나 (1) | 빤디따라마 | 아야 마나삐까 | 2020.08.09",
    "duration": "2:07:24",
    "durationSec": 7644,
    "category": "12연기",
    "sortKey": 20200022,
    "date": "2020-08-09",
    "order": 21
  },
  {
    "id": "cxZxHmIVobc",
    "title": "[12연기] 23강 - 팟사빳짜야 웨다나 (2) | 빤디따라마 | 아야 마나삐까 | 2020.08.16",
    "duration": "1:37:43",
    "durationSec": 5863,
    "category": "12연기",
    "sortKey": 20200023,
    "date": "2020-08-16",
    "order": 22
  },
  {
    "id": "lrKx_3b3xuk",
    "title": "[12연기] 24강 - 웨다나빳짜야 딴하 (1) | 빤디따라마 | 아야 마나삐까 | 2020.08.23",
    "duration": "1:26:14",
    "durationSec": 5174,
    "category": "12연기",
    "sortKey": 20200024,
    "date": "2020-08-23",
    "order": 23
  },
  {
    "id": "-wBLuBJL4YQ",
    "title": "[12연기] 25강 - 웨다나빳짜야 딴하 (2) | 빤디따라마 | 아야 마나삐까 | 2020.09.13",
    "duration": "1:54:28",
    "durationSec": 6868,
    "category": "12연기",
    "sortKey": 20200025,
    "date": "2020-09-13",
    "order": 24
  },
  {
    "id": "U3_OJJ468dA",
    "title": "[12연기] 26강 - 웨다나빳짜야 딴하 (3) | 빤디따라마 | 아야 마나삐까 | 2020.09.20",
    "duration": "1:59:28",
    "durationSec": 7168,
    "category": "12연기",
    "sortKey": 20200026,
    "date": "2020-09-20",
    "order": 25
  },
  {
    "id": "4MeSMsJ6O2A",
    "title": "[12연기] 27강 - 딴하빳짜야 우빠다낭 (1) | 빤디따라마 | 아야 마나삐까 | 2020.09.27",
    "duration": "1:33:55",
    "durationSec": 5635,
    "category": "12연기",
    "sortKey": 20200027,
    "date": "2020-09-27",
    "order": 26
  },
  {
    "id": "zBRSlbcndfQ",
    "title": "[12연기] 28강 - 딴하빳짜야 우빠다낭 (2) | 빤디따라마 | 아야 마나삐까 | 2020.10.11",
    "duration": "2:08:36",
    "durationSec": 7716,
    "category": "12연기",
    "sortKey": 20200028,
    "date": "2020-10-11",
    "order": 27
  },
  {
    "id": "V8E6TYbyzlQ",
    "title": "[12연기] 29강 - 딴하빳짜야 우빠다낭 (3) | 빤디따라마 | 아야 마나삐까 | 2020.10.18",
    "duration": "2:13:07",
    "durationSec": 7987,
    "category": "12연기",
    "sortKey": 20200029,
    "date": "2020-10-18",
    "order": 28
  },
  {
    "id": "Mel_oZd3JT0",
    "title": "[12연기] 30강 - 딴하빳짜야 우빠다낭 (4) | 빤디따라마 | 아야 마나삐까 | 2020.11.08",
    "duration": "1:20:24",
    "durationSec": 4824,
    "category": "12연기",
    "sortKey": 20200030,
    "date": "2020-11-08",
    "order": 29
  },
  {
    "id": "vplgK2cd2CM",
    "title": "[12연기] 31강 - 우빠다나빳짜야 바오 (1) | 빤디따라마 | 아야 마나삐까 | 2020.11.22",
    "duration": "1:44:38",
    "durationSec": 6278,
    "category": "12연기",
    "sortKey": 20200031,
    "date": "2020-11-22",
    "order": 30
  },
  {
    "id": "L6gt53FrpWk",
    "title": "[12연기] 32강 - 우빠다나빳짜야 바오 (2) | 빤디따라마 | 아야 마나삐까 | 2020.12.12",
    "duration": "2:03:28",
    "durationSec": 7408,
    "category": "12연기",
    "sortKey": 20200032,
    "date": "2020-12-12",
    "order": 31
  },
  {
    "id": "5Gu7YVIIkto",
    "title": "[12연기] 33강 - 우빠다나빳짜야 바오 (3) | 빤디따라마 | 아야 마나삐까 | 2020.12.27",
    "duration": "2:02:27",
    "durationSec": 7347,
    "category": "12연기",
    "sortKey": 20200033,
    "date": "2020-12-27",
    "order": 32
  },
  {
    "id": "LYQBxS3GyeA",
    "title": "[12연기] 34강 - 우빠다나빳짜야 바오 (4) | 빤디따라마 | 아야 마나삐까 | 2021.01.17",
    "duration": "1:44:15",
    "durationSec": 6255,
    "category": "12연기",
    "sortKey": 20210034,
    "date": "2021-01-17",
    "order": 33
  },
  {
    "id": "maYYRrHhsyg",
    "title": "[12연기] 35강 - 우빠다나빳짜야 바오 (5) | 빤디따라마 | 아야 마나삐까 | 2021.02.28",
    "duration": "1:51:49",
    "durationSec": 6709,
    "category": "12연기",
    "sortKey": 20210035,
    "date": "2021-02-28",
    "order": 34
  },
  {
    "id": "hkmZ0qAz8dE",
    "title": "[12연기] 36강 - 12연기 정리 및 분석 | 빤디따라마 | 아야 마나삐까 | 2021.06.13",
    "duration": "1:24:15",
    "durationSec": 5055,
    "category": "12연기",
    "sortKey": 20210036,
    "date": "2021-06-13",
    "order": 35
  },
  {
    "id": "Z07oV77TSnI",
    "title": "[12연기] 37강 - 과거의 원인과 그로 인해 발생하는 현재의 결과 (12연기 분석) | 빤디따라마 | 아야 마나삐까 | 2021.06.27",
    "duration": "1:33:33",
    "durationSec": 5613,
    "category": "12연기",
    "sortKey": 20210037,
    "date": "2021-06-27",
    "order": 36
  },
  {
    "id": "Ol5iriD5gPE",
    "title": "[12연기] 38강 - 현재의 다섯 결과와 현재의 다섯 원인 (12연기 분석) | 빤디따라마 | 아야 마나삐까 | 2021.07.11",
    "duration": "1:36:17",
    "durationSec": 5777,
    "category": "12연기",
    "sortKey": 20210038,
    "date": "2021-07-11",
    "order": 37
  },
  {
    "id": "RCTWOiuPV7Y",
    "title": "[12연기] 39강 - 12연기 분석 | 빤디따라마 | 아야 마나삐까 | 2021.07.25",
    "duration": "1:14:18",
    "durationSec": 4458,
    "category": "12연기",
    "sortKey": 20210039,
    "date": "2021-07-25",
    "order": 38
  },
  {
    "id": "TXail7GkAVQ",
    "title": "[12연기] 40강 - 12연기 요약 | 빤디따라마 | 아야 마나삐까 | 2021.08.22",
    "duration": "1:48:46",
    "durationSec": 6526,
    "category": "12연기",
    "sortKey": 20210040,
    "date": "2021-08-22",
    "order": 39
  },
  {
    "id": "hkc1NZgVMUw",
    "title": "[12연기] 41강 - 12연기의 네 가지 방식과 아라한 공덕 | 빤디따라마 | 아야 마나삐까 | 2021.09.12",
    "duration": "2:05:23",
    "durationSec": 7523,
    "category": "12연기",
    "sortKey": 20210041,
    "date": "2021-09-12",
    "order": 40
  },
  {
    "id": "kOmQWK4p-3g",
    "title": "[12연기] 42강 - 12연기와 세 번째 아라한 공덕 (보충해설) | 빤디따라마 | 아야 마나삐까 | 2021.09.26",
    "duration": "1:51:10",
    "durationSec": 6670,
    "category": "12연기",
    "sortKey": 20210042,
    "date": "2021-09-26",
    "order": 41
  },
  {
    "id": "iqncOlOeTFM",
    "title": "[12연기] 43강 - 마하시 큰스님의 12연기 도표와 부처님 공덕 | 빤디따라마 | 아야 마나삐까 | 2021.10.31",
    "duration": "1:48:05",
    "durationSec": 6485,
    "category": "12연기",
    "sortKey": 20210043,
    "date": "2021-10-31",
    "order": 42
  },
  {
    "id": "k_Y1-A-8gfY",
    "title": "초전법륜경 (1) : 초전법륜경이 무엇인가?  (Dhammacakkappavattana·sutta)",
    "duration": "1:04:40",
    "durationSec": 3880,
    "category": "초전법륜경",
    "sortKey": 1,
    "date": "",
    "order": 0
  },
  {
    "id": "30Wlz2eg8D8",
    "title": "초전법륜경 (2) : 초전법륜경이 설해지게 된 배경, 가까운 원인  (Dhammacakkappavattana·sutta)",
    "duration": "52:10",
    "durationSec": 3130,
    "category": "초전법륜경",
    "sortKey": 2,
    "date": "",
    "order": 1
  },
  {
    "id": "cKUlw10Njbg",
    "title": "초전법륜경 (3) : 보살께서 마지막생에 출가하신 후 고행수행을 하기까지  (Dhammacakkappavattana·sutta)",
    "duration": "59:59",
    "durationSec": 3599,
    "category": "초전법륜경",
    "sortKey": 3,
    "date": "",
    "order": 2
  },
  {
    "id": "NisCDuZGTnA",
    "title": "초전법륜경 (4) : 보살께서 일체지를 깨달으시고 붓다가 되기까지  (Dhammacakkappavattana·sutta)",
    "duration": "51:04",
    "durationSec": 3064,
    "category": "초전법륜경",
    "sortKey": 4,
    "date": "",
    "order": 3
  },
  {
    "id": "WrnsM9awr24",
    "title": "초전법륜경 (5) : 붓다가 되신 이후 49일간 아라한의 과의 지혜를 누리고 법을 숙고하신 모습  (Dhammacakkappavattana·sutta)",
    "duration": "1:00:35",
    "durationSec": 3635,
    "category": "초전법륜경",
    "sortKey": 5,
    "date": "",
    "order": 4
  },
  {
    "id": "dsveM0UAyPA",
    "title": "초전법륜경 (6) :  빤짜왁까아(다섯 비구들)에게 법을 설하심 (Dhammacakkappavattana·sutta)",
    "duration": "55:20",
    "durationSec": 3320,
    "category": "초전법륜경",
    "sortKey": 6,
    "date": "",
    "order": 5
  },
  {
    "id": "DMypuYDXs7I",
    "title": "초전법륜경 (7) :  '까마숙칼리까누요가' 감각적 쾌락을 즐기는 것 (Dhammacakkappavattana·sutta)",
    "duration": "59:17",
    "durationSec": 3557,
    "category": "초전법륜경",
    "sortKey": 7,
    "date": "",
    "order": 6
  },
  {
    "id": "KwTP-636Kj8",
    "title": "초전법륜경 (8) :  '아따낄라마타누요가' 스스로를 고통스럽고 힘들게 하는 것 (Dhammacakkappavattana·sutta)",
    "duration": "54:20",
    "durationSec": 3260,
    "category": "초전법륜경",
    "sortKey": 8,
    "date": "",
    "order": 7
  },
  {
    "id": "o9Jcm_wDONs",
    "title": "초전법륜경 (9) :  '마하담마사마다나숟따' 고귀한 법을 지키는 경과 중도수행, 칸따 상와라 인욕으로서 절제, 지킴  (Dhammacakkappavattana·sutta)",
    "duration": "55:57",
    "durationSec": 3357,
    "category": "초전법륜경",
    "sortKey": 9,
    "date": "",
    "order": 8
  },
  {
    "id": "s4_mUhZZjBk",
    "title": "초전법륜경 (10) (Dhammacakkappavattana·sutta)",
    "duration": "53:20",
    "durationSec": 3200,
    "category": "초전법륜경",
    "sortKey": 10,
    "date": "",
    "order": 9
  },
  {
    "id": "HbvJ0z6Rck8",
    "title": "초전법륜경 (11) : 맛지마빠띠빠다'라는 중도수행(2) 팔정도 수행을 통해 지혜의 눈이 열리게 하고 열반에 이르게 하는 결과(Dhammacakkappavattana·sutta)",
    "duration": "57:09",
    "durationSec": 3429,
    "category": "초전법륜경",
    "sortKey": 11,
    "date": "",
    "order": 10
  },
  {
    "id": "Nc_OcjCIABo",
    "title": "초전법륜경 (12) : 팔정도 (1) 실라카다 3가지 (Dhammacakkappavattana·sutta)",
    "duration": "58:54",
    "durationSec": 3534,
    "category": "초전법륜경",
    "sortKey": 12,
    "date": "",
    "order": 11
  },
  {
    "id": "tazhjkaBK3A",
    "title": "초전법륜경 (13) : 팔정도 (2) 출가자의 생계유지, 삼마와야마 막강가 (Dhammacakkappavattana·sutta)",
    "duration": "58:59",
    "durationSec": 3539,
    "category": "초전법륜경",
    "sortKey": 13,
    "date": "",
    "order": 12
  },
  {
    "id": "P-WiJ71Xbdk",
    "title": "초전법륜경 (14) : 팔정도 (3) 삼마사띠 막강가  (Dhammacakkappavattana·sutta)",
    "duration": "1:00:49",
    "durationSec": 3649,
    "category": "초전법륜경",
    "sortKey": 14,
    "date": "",
    "order": 13
  },
  {
    "id": "k4qr7rbEsT4",
    "title": "초전법륜경 (15) :  팔정도 (4) 삼마사마디 막강가 (Dhammacakkappavattana·sutta)",
    "duration": "1:00:05",
    "durationSec": 3605,
    "category": "초전법륜경",
    "sortKey": 15,
    "date": "",
    "order": 14
  },
  {
    "id": "n2SoURdCyIs",
    "title": "초전법륜경 (16) : 팔정도 (5) 삼마디티 막강가  (Dhammacakkappavattana·sutta)",
    "duration": "1:08:02",
    "durationSec": 4082,
    "category": "초전법륜경",
    "sortKey": 16,
    "date": "",
    "order": 15
  },
  {
    "id": "KmDp6t8T2zk",
    "title": "초전법륜경 (17) : 팔정도 (6) 삼마상까빠 막강가, 둑카7종류 (Dhammacakkappavattana·sutta)",
    "duration": "1:19:40",
    "durationSec": 4780,
    "category": "초전법륜경",
    "sortKey": 17,
    "date": "",
    "order": 16
  },
  {
    "id": "5YBq01Azhmk",
    "title": "초전법륜경 (18) : 고성제 (1) 자띠(jāti, 생)로 시작되는 고통의 성품 (Dhammacakkappavattana·sutta)",
    "duration": "1:12:52",
    "durationSec": 4372,
    "category": "초전법륜경",
    "sortKey": 18,
    "date": "",
    "order": 17
  },
  {
    "id": "IiX0YsIJSCM",
    "title": "초전법륜경 (19) : 고성제 (2) '우빠다나칸다'오취온 (Dhammacakkappavattana·sutta)",
    "duration": "1:16:01",
    "durationSec": 4561,
    "category": "초전법륜경",
    "sortKey": 19,
    "date": "",
    "order": 18
  },
  {
    "id": "SAsqmM1ZJxk",
    "title": "초전법륜경 (20) : 집성제 (1) '뽀노 바위까' 13생을 윤회한 암퇘지였던 수마나테리 비구니 이야기  (Dhammacakkappavattana·sutta)",
    "duration": "1:09:18",
    "durationSec": 4158,
    "category": "초전법륜경",
    "sortKey": 20,
    "date": "",
    "order": 19
  },
  {
    "id": "oyPS8LafzA0",
    "title": "초전법륜경 (21) : 집성제 (2) '뽀노 바위까' 비구였다가 천인이 된 사마나 천인 이야기  (Dhammacakkappavattana·sutta)",
    "duration": "1:14:17",
    "durationSec": 4457,
    "category": "초전법륜경",
    "sortKey": 21,
    "date": "",
    "order": 20
  },
  {
    "id": "3xJ6F8ObQRo",
    "title": "초전법륜경 (22) : 집성제 (3) '바와따하', '위바와따하'  (Dhammacakkappavattana·sutta)",
    "duration": "1:14:14",
    "durationSec": 4454,
    "category": "초전법륜경",
    "sortKey": 22,
    "date": "",
    "order": 21
  },
  {
    "id": "VY0-2DUwS8k",
    "title": "초전법륜경 (23) : 도성제 (1) 도성제와 팔정도 (Dhammacakkappavattana·sutta)",
    "duration": "1:17:58",
    "durationSec": 4678,
    "category": "초전법륜경",
    "sortKey": 23,
    "date": "",
    "order": 22
  },
  {
    "id": "beWB5vrl_VE",
    "title": "초전법륜경 (24) : 도성제 (2) 사성제를 동시에 깨닫는 모습, 3가지 지혜 (Dhammacakkappavattana·sutta)",
    "duration": "42:18",
    "durationSec": 2538,
    "category": "초전법륜경",
    "sortKey": 24,
    "date": "",
    "order": 23
  },
  {
    "id": "mRiUEwgBO2w",
    "title": "초전법륜경  (25) (Dhammacakkappavattana·sutta)",
    "duration": "1:19:53",
    "durationSec": 4793,
    "category": "초전법륜경",
    "sortKey": 25,
    "date": "",
    "order": 24
  },
  {
    "id": "hkZuVYc3zBI",
    "title": "초전법륜경 (26) (Dhammacakkappavattana·sutta)",
    "duration": "1:05:35",
    "durationSec": 3935,
    "category": "초전법륜경",
    "sortKey": 26,
    "date": "",
    "order": 25
  },
  {
    "id": "uTRfQ6DsDn4",
    "title": "초전법륜경 (27) (Dhammacakkappavattana·sutta)",
    "duration": "1:11:19",
    "durationSec": 4279,
    "category": "초전법륜경",
    "sortKey": 27,
    "date": "",
    "order": 26
  },
  {
    "id": "ba9ylKWghgo",
    "title": "무아인경 (1) : 난다말라 큰스님 법문에 바탕한 무아인경 (Anattalakkhaṇa-sutta)",
    "duration": "1:46:28",
    "durationSec": 6388,
    "category": "무아인경",
    "sortKey": 1,
    "date": "",
    "order": 0
  },
  {
    "id": "uDo3lwprnIs",
    "title": "무아인경 (2) : 색온이 무아인 모습 - 1 (Anattalakkhaṇa-sutta)",
    "duration": "1:15:29",
    "durationSec": 4529,
    "category": "무아인경",
    "sortKey": 2,
    "date": "",
    "order": 1
  },
  {
    "id": "KI60g3mf9wo",
    "title": "무아인경 (3) : 색온이 무아인 모습 - 2 (Anattalakkhaṇa-sutta)",
    "duration": "1:41:08",
    "durationSec": 6068,
    "category": "무아인경",
    "sortKey": 3,
    "date": "",
    "order": 2
  },
  {
    "id": "M8iNpimzMA4",
    "title": "무아인경 (4) :  수온이 무아인 모습 - 1 (Anattalakkhaṇa-sutta)",
    "duration": "1:22:35",
    "durationSec": 4955,
    "category": "무아인경",
    "sortKey": 4,
    "date": "",
    "order": 3
  },
  {
    "id": "rtT2RoO0XI4",
    "title": "무아인경 (5) : 수온이 무아인 모습 - 2 (Anattalakkhaṇa-sutta)",
    "duration": "1:21:34",
    "durationSec": 4894,
    "category": "무아인경",
    "sortKey": 5,
    "date": "",
    "order": 4
  },
  {
    "id": "bK3XYTZ_xSw",
    "title": "무아인경 (6) : 상온과 행온이 무아인 모습 (Anattalakkhaṇa-sutta)",
    "duration": "1:54:48",
    "durationSec": 6888,
    "category": "무아인경",
    "sortKey": 6,
    "date": "",
    "order": 5
  },
  {
    "id": "B8q5en-6aT0",
    "title": "무아인경 (7) : 식온이 무아인 모습 (Anattalakkhaṇa-sutta)",
    "duration": "1:44:18",
    "durationSec": 6258,
    "category": "무아인경",
    "sortKey": 7,
    "date": "",
    "order": 6
  },
  {
    "id": "cUPpMLpNiu8",
    "title": "무아인경 (8) :  의식온이 무상한 모습 - 오온의 비유 (Anattalakkhaṇa-sutta)",
    "duration": "1:52:57",
    "durationSec": 6777,
    "category": "무아인경",
    "sortKey": 8,
    "date": "",
    "order": 7
  },
  {
    "id": "5jM4-xnN0ck",
    "title": "무아인경 (9) : 무상과 고의 성품을 통해 무아를 보이시는 모습 (Anattalakkhaṇa-sutta)",
    "duration": "1:59:25",
    "durationSec": 7165,
    "category": "무아인경",
    "sortKey": 9,
    "date": "",
    "order": 8
  },
  {
    "id": "2JgQCl6zI-A",
    "title": "무아인경 (10) : 무상한 법, 고통의 법, 무아의 법 (Anattalakkhaṇa-sutta)",
    "duration": "1:29:20",
    "durationSec": 5360,
    "category": "무아인경",
    "sortKey": 10,
    "date": "",
    "order": 9
  },
  {
    "id": "I2wxKgTsgwU",
    "title": "무아인경 (11)  : 물질온과 삼법인 (Anattalakkhaṇa-sutta)",
    "duration": "1:06:33",
    "durationSec": 3993,
    "category": "무아인경",
    "sortKey": 11,
    "date": "",
    "order": 10
  },
  {
    "id": "eh_aVwpdPYQ",
    "title": "무아인경 (12) : 느낌온과 삼법인 (1) 무상 (Anattalakkhaṇa-sutta)",
    "duration": "1:11:22",
    "durationSec": 4282,
    "category": "무아인경",
    "sortKey": 12,
    "date": "",
    "order": 11
  },
  {
    "id": "nBXB-grDA8Q",
    "title": "무아인경 (13) : 느낌온과 삼법인 (2) 고 (Anattalakkhaṇa-sutta)",
    "duration": "1:00:44",
    "durationSec": 3644,
    "category": "무아인경",
    "sortKey": 13,
    "date": "",
    "order": 12
  },
  {
    "id": "snTjMq0EN3Q",
    "title": "무아인경 (14) : 느낌온과 삼법인 (3) 무아 (Anattalakkhaṇa-sutta)",
    "duration": "1:23:09",
    "durationSec": 4989,
    "category": "무아인경",
    "sortKey": 14,
    "date": "",
    "order": 13
  },
  {
    "id": "2EM7IzNBQ6Y",
    "title": "무아인경 (15) : 지각온과 삼법인(1)무상 (Anattalakkhaṇa-sutta)",
    "duration": "1:13:16",
    "durationSec": 4396,
    "category": "무아인경",
    "sortKey": 15,
    "date": "",
    "order": 14
  },
  {
    "id": "Jgk_lZLSwSc",
    "title": "무아인경 (16) : 지각온(2), 형성온(1)과 삼법인 (Anattalakkhaṇa-sutta)",
    "duration": "1:44:44",
    "durationSec": 6284,
    "category": "무아인경",
    "sortKey": 16,
    "date": "",
    "order": 15
  },
  {
    "id": "FRPif130MQ4",
    "title": "무아인경 (17) : 의식온과 삼법인 (Anattalakkhaṇa-sutta)",
    "duration": "1:12:27",
    "durationSec": 4347,
    "category": "무아인경",
    "sortKey": 17,
    "date": "",
    "order": 16
  },
  {
    "id": "EVfsYoyHksU",
    "title": "무아인경 (18) : 물질을 11가지로 관하는 모습 (Anattalakkhaṇa-sutta)",
    "duration": "1:20:09",
    "durationSec": 4809,
    "category": "무아인경",
    "sortKey": 18,
    "date": "",
    "order": 17
  },
  {
    "id": "gKncV5GYhrE",
    "title": "무아인경 (19) : 느낌, 지각을 11가지로 관하는 모습 (Anattalakkhaṇa-sutta)",
    "duration": "1:57:37",
    "durationSec": 7057,
    "category": "무아인경",
    "sortKey": 19,
    "date": "",
    "order": 18
  },
  {
    "id": "nL73XE3qVTc",
    "title": "무아인경 (20) : 형성을 11가지로 관하는 모습 (Anattalakkhaṇa-sutta)",
    "duration": "2:12:41",
    "durationSec": 7961,
    "category": "무아인경",
    "sortKey": 20,
    "date": "",
    "order": 19
  },
  {
    "id": "jh6h5zStfDI",
    "title": "무아인경 (21) : 의식을 11가지로 관하는 모습 (Anattalakkhaṇa-sutta)",
    "duration": "2:18:29",
    "durationSec": 8309,
    "category": "무아인경",
    "sortKey": 21,
    "date": "",
    "order": 20
  },
  {
    "id": "PGXK2SvrJJE",
    "title": "무아인경 (22) : 오온을 염오하는 지혜로 관하는 모습 (Anattalakkhaṇa-sutta)",
    "duration": "2:40:00",
    "durationSec": 9600,
    "category": "무아인경",
    "sortKey": 22,
    "date": "",
    "order": 21
  },
  {
    "id": "RRQjSWTZE1Y",
    "title": "무아인경 (23) : 성인의 도의 지혜를 얻는 모습 (Anattalakkhaṇa-sutta)",
    "duration": "2:08:53",
    "durationSec": 7733,
    "category": "무아인경",
    "sortKey": 23,
    "date": "",
    "order": 22
  },
  {
    "id": "2S0k75X-GOo",
    "title": "바와나 디빠니 (1) : 40가지 바와나-수행과 사악도, 손톱 끝 경, 눈 먼 거북이 경 | 청법의 이익",
    "duration": "1:58:56",
    "durationSec": 7136,
    "category": "[레디 사야도] 바와나 디빠니",
    "sortKey": 1,
    "date": "",
    "order": 0
  },
  {
    "id": "nDrC2XZuT6w",
    "title": "바와나 디빠니 (2) : 집착과 그것을 제거하는 관하는 지혜, 두 가지 그림자, 무상으로 보는 지혜 | 경전을 공부하는 목적 | 포살계를 지켜야하는 이유",
    "duration": "2:14:26",
    "durationSec": 8066,
    "category": "[레디 사야도] 바와나 디빠니",
    "sortKey": 2,
    "date": "",
    "order": 1
  },
  {
    "id": "Re_U6338AKw",
    "title": "바와나 디빠니 (3) : 물질 안에 생기는 무상을 보는 지혜(사대요소로의 설명) | 출가자에게 재가자가 예를 올려야 하는 이유 (밀린다 왕 문경)",
    "duration": "1:46:07",
    "durationSec": 6367,
    "category": "[레디 사야도] 바와나 디빠니",
    "sortKey": 3,
    "date": "",
    "order": 2
  },
  {
    "id": "85JTGZSzu4I",
    "title": "바와나 디빠니 (4) : 무상한 성품을 보지 못하는 모습 | 관념 2가지 | 사람들이 누군가를 존경하는 기준 | 좋은 벗(깔리아나밋따)의 요건이 되는 8가지 원인과 7가지 결과",
    "duration": "1:49:57",
    "durationSec": 6597,
    "category": "[레디 사야도] 바와나 디빠니",
    "sortKey": 4,
    "date": "",
    "order": 3
  },
  {
    "id": "KtGOfvmlS-w",
    "title": "바와나 디빠니 (5) : 32가지 부분의 성분분석과 왜곡으로 인한 표상화 | 공덕행 토대 10가지",
    "duration": "1:54:28",
    "durationSec": 6868,
    "category": "[레디 사야도] 바와나 디빠니",
    "sortKey": 5,
    "date": "",
    "order": 4
  },
  {
    "id": "Z2QEOfulQiE",
    "title": "바와나 디빠니 (6) : 표상에 항상하고 확고한 실체가 없는 모습 | 물질이 생성되는 조건 | 업 4가지",
    "duration": "1:48:09",
    "durationSec": 6489,
    "category": "[레디 사야도] 바와나 디빠니",
    "sortKey": 6,
    "date": "",
    "order": 5
  },
  {
    "id": "lUOuweXDIV4",
    "title": "바와나 디빠니 (7) : 표상에 항상하고 확고한 실체가 없는 모습 2 | 아담미까숟따 | 속임수(완짜나) 1",
    "duration": "1:37:20",
    "durationSec": 5840,
    "category": "[레디 사야도] 바와나 디빠니",
    "sortKey": 7,
    "date": "",
    "order": 6
  },
  {
    "id": "7Rz9TUQErls",
    "title": "바와나 디빠니 (8) : 가는 자세의 물질온에서의 무상성 1 | 속임수 2  | 행복하게 사는 조건",
    "duration": "1:44:52",
    "durationSec": 6292,
    "category": "[레디 사야도] 바와나 디빠니",
    "sortKey": 8,
    "date": "",
    "order": 7
  },
  {
    "id": "lVPo9EXveyo",
    "title": "바와나 디빠니 (9) : 가는 자세의 물질온에서의 무상성 2 | 속임수 3",
    "duration": "1:29:19",
    "durationSec": 5359,
    "category": "[레디 사야도] 바와나 디빠니",
    "sortKey": 9,
    "date": "",
    "order": 8
  },
  {
    "id": "LnUc88FWdUg",
    "title": "바와나 디빠니 (10) : 가는 자세의 물질온에서의 무상성 3 | 마하간다용 큰스님의 상웨가 게송 | 나는 공부 가르치는 스님 | 속임수 4",
    "duration": "1:56:56",
    "durationSec": 7016,
    "category": "[레디 사야도] 바와나 디빠니",
    "sortKey": 10,
    "date": "",
    "order": 9
  },
  {
    "id": "UZkTSNmVvgQ",
    "title": "바와나 디빠니 (11) : 서는 자세의 물질온에서의 무상성 | 속임수 5",
    "duration": "1:08:15",
    "durationSec": 4095,
    "category": "[레디 사야도] 바와나 디빠니",
    "sortKey": 11,
    "date": "",
    "order": 10
  },
  {
    "id": "Y75GHK9EAJw",
    "title": "바와나 디빠니 (12) : 서는 자세의 물질온에서의 무상성 2",
    "duration": "1:23:41",
    "durationSec": 5021,
    "category": "[레디 사야도] 바와나 디빠니",
    "sortKey": 12,
    "date": "",
    "order": 11
  },
  {
    "id": "tUfdwHiv83k",
    "title": "바와나 디빠니 (13) : 서는 자세의 물질온에서의 무상성 3, 앉고 눕는 자세의 물질온에서의 무상성",
    "duration": "1:28:36",
    "durationSec": 5316,
    "category": "[레디 사야도] 바와나 디빠니",
    "sortKey": 13,
    "date": "",
    "order": 12
  },
  {
    "id": "fQ4i2r7JSjg",
    "title": "바와나 디빠니 (14) : 정신온의 무상성 (오온의 간략한 의미) 2 , 의식온의 무상성 (고통스런 느낌의 신식의 네 가지 정신온을 보임) 1",
    "duration": "1:43:42",
    "durationSec": 6222,
    "category": "[레디 사야도] 바와나 디빠니",
    "sortKey": 14,
    "date": "",
    "order": 13
  },
  {
    "id": "xJ9_KV3qoBE",
    "title": "바와나 디빠니(15) : 의식온의 무상성 (고통스런 느낌의 신식의 네 가지 정신온을 보임)  2",
    "duration": "1:45:16",
    "durationSec": 6316,
    "category": "[레디 사야도] 바와나 디빠니",
    "sortKey": 15,
    "date": "",
    "order": 14
  },
  {
    "id": "za_9C9gxMSU",
    "title": "바와나 디빠니 (16) : 의식온의 무상성 (고통스런 느낌의 신식의 네 가지 정신온을 보임) 3",
    "duration": "1:31:35",
    "durationSec": 5495,
    "category": "[레디 사야도] 바와나 디빠니",
    "sortKey": 16,
    "date": "",
    "order": 15
  },
  {
    "id": "bF36t8yKjUI",
    "title": "바와나 디빠니(17) : 의식온의 무상성 (즐거운 느낌의 신식의 네 가지 정신온을 보임)",
    "duration": "1:26:56",
    "durationSec": 5216,
    "category": "[레디 사야도] 바와나 디빠니",
    "sortKey": 17,
    "date": "",
    "order": 16
  },
  {
    "id": "C1HUJKd_Srs",
    "title": "물거품 덩어리의 경 (Pheṇapiṇḍūpama·sutta)",
    "duration": "1:10:37",
    "durationSec": 4237,
    "category": "[레디 사야도] 바와나 디빠니",
    "sortKey": 99990000,
    "date": "",
    "order": 17
  },
  {
    "id": "HqX-gFDXNnA",
    "title": "실라완따 숟따  Sīlavanta·sutta  (계행있는 이의 경) 1강",
    "duration": "1:12:56",
    "durationSec": 4376,
    "category": "실라완따숟따",
    "sortKey": 1,
    "date": "",
    "order": 0
  },
  {
    "id": "3d6Ts4dcpYY",
    "title": "실라완따 숟따  Sīlavanta·sutta  (계행있는 이의 경) 2강",
    "duration": "1:03:33",
    "durationSec": 3813,
    "category": "실라완따숟따",
    "sortKey": 2,
    "date": "",
    "order": 1
  },
  {
    "id": "DYByj_xX1fs",
    "title": "실라완따 숟따  Sīlavanta·sutta  (계행있는 이의 경) 3강",
    "duration": "1:03:40",
    "durationSec": 3820,
    "category": "실라완따숟따",
    "sortKey": 3,
    "date": "",
    "order": 2
  },
  {
    "id": "tGwDdXLiHW0",
    "title": "실라완따 숟따  Sīlavanta·sutta  (계행있는 이의 경) 4강",
    "duration": "1:07:56",
    "durationSec": 4076,
    "category": "실라완따숟따",
    "sortKey": 4,
    "date": "",
    "order": 3
  },
  {
    "id": "SFAsPW9CrLU",
    "title": "실라완따 숟따  Sīlavanta·sutta  (계행있는 이의 경) 5강",
    "duration": "1:12:42",
    "durationSec": 4362,
    "category": "실라완따숟따",
    "sortKey": 5,
    "date": "",
    "order": 4
  },
  {
    "id": "9V1nlJ3JBSk",
    "title": "실라완따 숟따  Sīlavanta·sutta  (계행있는 이의 경) 6강",
    "duration": "1:07:32",
    "durationSec": 4052,
    "category": "실라완따숟따",
    "sortKey": 6,
    "date": "",
    "order": 5
  },
  {
    "id": "XO3Ls9DM41I",
    "title": "실라완따 숟따  Sīlavanta·sutta  (계행있는 이의 경) 7강",
    "duration": "1:03:38",
    "durationSec": 3818,
    "category": "실라완따숟따",
    "sortKey": 7,
    "date": "",
    "order": 6
  },
  {
    "id": "emc8elF7YTQ",
    "title": "실라완따 숟따  Sīlavanta·sutta  (계행있는 이의 경) 8강",
    "duration": "1:08:14",
    "durationSec": 4094,
    "category": "실라완따숟따",
    "sortKey": 8,
    "date": "",
    "order": 7
  },
  {
    "id": "ffz_wFeQoJE",
    "title": "실라완따 숟따  Sīlavanta·sutta  (계행있는 이의 경) 9강",
    "duration": "59:56",
    "durationSec": 3596,
    "category": "실라완따숟따",
    "sortKey": 9,
    "date": "",
    "order": 8
  },
  {
    "id": "q-_nimwDwBQ",
    "title": "실라완따 숟따  Sīlavanta·sutta  (계행있는 이의 경) 10강",
    "duration": "1:03:32",
    "durationSec": 3812,
    "category": "실라완따숟따",
    "sortKey": 10,
    "date": "",
    "order": 9
  },
  {
    "id": "It5TkVGfb-I",
    "title": "실라완따 숟따  Sīlavanta·sutta  (계행있는 이의 경) 11강",
    "duration": "1:19:10",
    "durationSec": 4750,
    "category": "실라완따숟따",
    "sortKey": 11,
    "date": "",
    "order": 10
  },
  {
    "id": "hxFGdyJaqNU",
    "title": "실라완따 숟따  Sīlavanta·sutta  (계행있는 이의 경) 12강",
    "duration": "1:14:58",
    "durationSec": 4498,
    "category": "실라완따숟따",
    "sortKey": 12,
    "date": "",
    "order": 11
  },
  {
    "id": "Gcv-6wD-16c",
    "title": "실라완따 숟따  Sīlavanta·sutta  (계행있는 이의 경) 13강",
    "duration": "1:20:18",
    "durationSec": 4818,
    "category": "실라완따숟따",
    "sortKey": 13,
    "date": "",
    "order": 12
  },
  {
    "id": "moiNUM8Sqtw",
    "title": "실라완따 숟따  Sīlavanta·sutta  (계행있는 이의 경) 14강",
    "duration": "1:22:50",
    "durationSec": 4970,
    "category": "실라완따숟따",
    "sortKey": 14,
    "date": "",
    "order": 13
  },
  {
    "id": "5ddDLVry_Ew",
    "title": "실라완따 숟따  Sīlavanta·sutta  (계행있는 이의 경) 15강",
    "duration": "1:25:22",
    "durationSec": 5122,
    "category": "실라완따숟따",
    "sortKey": 15,
    "date": "",
    "order": 14
  },
  {
    "id": "gJUuIhVgMmg",
    "title": "실라완따 숟따 Sīlavanta·sutta  (계행있는 이의 경) 16강 | 바와나 디빠니 Bhāvanā dīpanī  19강",
    "duration": "1:08:42",
    "durationSec": 4122,
    "category": "실라완따숟따",
    "sortKey": 16,
    "date": "",
    "order": 15
  },
  {
    "id": "HD6JNMLXFP4",
    "title": "마하사띠빧타나숟따 1강【 서론 】 사띠빧타나의 의미, 경의 배경(경이 발생한 조건), 법의 선포 | 빤디따라마 | 아야 마나삐까 | 2024.10.13",
    "duration": "1:25:13",
    "durationSec": 5113,
    "category": "마하사띠빧타나숟따",
    "sortKey": 20240001,
    "date": "2024-10-13",
    "order": 0
  },
  {
    "id": "HtsGjkjBQRU",
    "title": "마하사띠빧타나숟따 2강【 서론 】사띠빧타나의 이익 (1) - 슬픔과 탄식에서 벗어남 | 빤디따라마 | 아야 마나삐까 | 2024.10.27",
    "duration": "1:32:54",
    "durationSec": 5574,
    "category": "마하사띠빧타나숟따",
    "sortKey": 20240002,
    "date": "2024-10-27",
    "order": 1
  },
  {
    "id": "oJYc7FdQaJM",
    "title": "마하사띠빧타나숟따 3강【 서론 】 사띠빧타나의 이익 (2) - 몸과 마음의 고통에서 벗어남, 도의 지혜와 열반을 얻음  | 빤디따라마 | 아야 마나삐까 | 2024.11.10",
    "duration": "1:33:13",
    "durationSec": 5593,
    "category": "마하사띠빧타나숟따",
    "sortKey": 20240003,
    "date": "2024-11-10",
    "order": 2
  },
  {
    "id": "S8dKR9CWHRM",
    "title": "마하사띠빧타나숟따 4강【 서론 】 사띠빧타나의 세 가지 의미와 네 가지 사띠빧타나 | 빤디따라마 | 아야 마나삐까 | 2025.04.13",
    "duration": "1:20:29",
    "durationSec": 4829,
    "category": "마하사띠빧타나숟따",
    "sortKey": 20250004,
    "date": "2025-04-13",
    "order": 3
  },
  {
    "id": "-_kmzMmdTYc",
    "title": "마하사띠빧타나숟따 5강【 웃데사 】까야눕빳싸나의 요건 - 열렬한 노력, 새김, 분명한  앎  | 빤디따라마 | 아야 마나삐까 | 2025.04.27",
    "duration": "1:36:05",
    "durationSec": 5765,
    "category": "마하사띠빧타나숟따",
    "sortKey": 20250005,
    "date": "2025-04-27",
    "order": 4
  },
  {
    "id": "-p5T8dOYEbo",
    "title": "마하사띠빧타나숟따 6강【 웃데사 】사띠빧타나의 힘(번뇌의 제거), 느낌, 마음, 성품의 관찰 | 빤디따라마 | 아야 마나삐까 | 2025.05.25",
    "duration": "1:27:03",
    "durationSec": 5223,
    "category": "마하사띠빧타나숟따",
    "sortKey": 20250006,
    "date": "2025-05-25",
    "order": 5
  },
  {
    "id": "4anJgd4VX4c",
    "title": "마하사띠빧타나숟따 7강【 닛데사와라 】까야누빳싸나 (1) - 들숨, 날숨의 장 | 빤디따라마 | 아야 마나삐까 | 2025.06.22",
    "duration": "1:45:39",
    "durationSec": 6339,
    "category": "마하사띠빧타나숟따",
    "sortKey": 20250007,
    "date": "2025-06-22",
    "order": 6
  },
  {
    "id": "BcwmngCu-xw",
    "title": "마하사띠빧타나숟따 8강【 닛데사와라 】 까야누빳싸나 (2) - 16가지 수식관  | 빤디따라마 | 아야 마나삐까 | 2025.07.27",
    "duration": "2:00:00",
    "durationSec": 7200,
    "category": "마하사띠빧타나숟따",
    "sortKey": 20250008,
    "date": "2025-07-27",
    "order": 7
  },
  {
    "id": "pqOpyGV6jew",
    "title": "마하사띠빧타나숟따 9강【 닛데사와라 】 까야누빳사나 (3) 열반으로 향하는 길  | 빤디따라마 | 아야 마나삐까 | 2025.08.10",
    "duration": "1:20:00",
    "durationSec": 4800,
    "category": "마하사띠빧타나숟따",
    "sortKey": 20250009,
    "date": "2025-08-10",
    "order": 8
  },
  {
    "id": "aGbB2epmoAM",
    "title": "마하사띠빧타나숟따 10강【 닛데사와라 】 까야누빳싸나  (4) - 자세의 장(1)  | 빤디따라마 | 아야 마나삐까 | 2025.08.24",
    "duration": "1:26:11",
    "durationSec": 5171,
    "category": "마하사띠빧타나숟따",
    "sortKey": 20250010,
    "date": "2025-08-24",
    "order": 9
  },
  {
    "id": "_oeQOaJAV7Q",
    "title": "마하사띠빧타나숟따 11강 【 닛데사와라 】까야누빳싸나 (5) - 자세의 장 (2)  | 빤디따라마 | 아야 마나삐까 | 2025.09.14",
    "duration": "1:43:45",
    "durationSec": 6225,
    "category": "마하사띠빧타나숟따",
    "sortKey": 20250011,
    "date": "2025-09-14",
    "order": 10
  },
  {
    "id": "bncoWK-3hTc",
    "title": "마하사띠빧타나숟따 12강【 닛데사와라 】 까야누빳싸나 (6) - 삼빠자나의 장 (1) | 빤디따라마 | 아야 마나삐까 | 2025.09.28",
    "duration": "1:21:55",
    "durationSec": 4915,
    "category": "마하사띠빧타나숟따",
    "sortKey": 20250012,
    "date": "2025-09-28",
    "order": 11
  },
  {
    "id": "gVMFMidoivU",
    "title": "마하사띠빧타나숟따 13강【 닛데사와라 】 까야누빳싸나 (7) - 삼빠자나의 장 (2) | 빤디따라마 | 아야 마나삐까 | 2025.10.12",
    "duration": "1:33:22",
    "durationSec": 5602,
    "category": "마하사띠빧타나숟따",
    "sortKey": 20250013,
    "date": "2025-10-12",
    "order": 12
  },
  {
    "id": "y1ITEpETaWM",
    "title": "마하사띠빧타나숟따 14강【 닛데사와라 】까야누빳싸나 (8) - 삼빠자나의 장 (3) | 빤디따라마 | 아야 마나삐까 | 2025.10.26",
    "duration": "1:31:23",
    "durationSec": 5483,
    "category": "마하사띠빧타나숟따",
    "sortKey": 20250014,
    "date": "2025-10-26",
    "order": 13
  },
  {
    "id": "wmwTObWaj6Y",
    "title": "붇다의 날 (1) (2016)",
    "duration": "53:31",
    "durationSec": 3211,
    "category": "붇다의 날",
    "sortKey": 20160001,
    "date": "",
    "order": 0
  },
  {
    "id": "plPEYERW1ow",
    "title": "붇다의 날 (2) (2016)",
    "duration": "51:42",
    "durationSec": 3102,
    "category": "붇다의 날",
    "sortKey": 20160002,
    "date": "",
    "order": 1
  },
  {
    "id": "aYo7fOh2odc",
    "title": "붇다의 날 (3) (2016)",
    "duration": "59:26",
    "durationSec": 3566,
    "category": "붇다의 날",
    "sortKey": 20160003,
    "date": "",
    "order": 2
  },
  {
    "id": "vi-hGhGamjI",
    "title": "붇다의 날 (4) (2016)",
    "duration": "54:42",
    "durationSec": 3282,
    "category": "붇다의 날",
    "sortKey": 20160004,
    "date": "",
    "order": 3
  },
  {
    "id": "bTlG0dXybXg",
    "title": "붇다의 날 (5) (2016)",
    "duration": "44:13",
    "durationSec": 2653,
    "category": "붇다의 날",
    "sortKey": 20160005,
    "date": "",
    "order": 4
  },
  {
    "id": "tEqIOdSgoWg",
    "title": "붇다의 날 (6) (2016)",
    "duration": "1:26:04",
    "durationSec": 5164,
    "category": "붇다의 날",
    "sortKey": 20160006,
    "date": "",
    "order": 5
  },
  {
    "id": "Z5bzXyRnM1I",
    "title": "붇다의 날 (2017)",
    "duration": "1:14:13",
    "durationSec": 4453,
    "category": "붇다의 날",
    "sortKey": 20170000,
    "date": "",
    "order": 6
  },
  {
    "id": "apx8EQtlACE",
    "title": "붇다의 날 (1) (2018)",
    "duration": "2:03",
    "durationSec": 123,
    "category": "붇다의 날",
    "sortKey": 20180001,
    "date": "",
    "order": 7
  },
  {
    "id": "BrhVN-PezXI",
    "title": "붇다의 날 (2)  (2018)",
    "duration": "26:12",
    "durationSec": 1572,
    "category": "붇다의 날",
    "sortKey": 20180002,
    "date": "",
    "order": 8
  },
  {
    "id": "U_vR4BuhiKU",
    "title": "붇다의 날 (2019) | 빤디따라마 근본불교 수행센터",
    "duration": "1:02:54",
    "durationSec": 3774,
    "category": "붇다의 날",
    "sortKey": 20190000,
    "date": "",
    "order": 9
  },
  {
    "id": "VMqenvGrbaU",
    "title": "부처님 오신 날 (2021)",
    "duration": "42:14",
    "durationSec": 2534,
    "category": "붇다의 날",
    "sortKey": 20210000,
    "date": "",
    "order": 10
  },
  {
    "id": "Gs3Mr6Ejgyk",
    "title": "부처님 오신 날 (2023)",
    "duration": "52:51",
    "durationSec": 3171,
    "category": "붇다의 날",
    "sortKey": 20230000,
    "date": "",
    "order": 11
  },
  {
    "id": "HtkQTNKQisY",
    "title": "부처님 오신 날 (2024)  『수밧다 경』  간략 설명",
    "duration": "37:20",
    "durationSec": 2240,
    "category": "붇다의 날",
    "sortKey": 20240000,
    "date": "",
    "order": 12
  },
  {
    "id": "hMNtLX5MzG4",
    "title": "2025 붇다의 날 법문 | 붇다의 청정함과 지혜의 완성 (2025.5.11)",
    "duration": "37:32",
    "durationSec": 2252,
    "category": "붇다의 날",
    "sortKey": 20250000,
    "date": "2025-05-11",
    "order": 13
  },
  {
    "id": "0byNxqRo1Jg",
    "title": "[2003-10] 세 가지 특성 | 미얀마 집중수행 법문 | 빤디따라마 큰스님(아신 빤디따비왐사) | 2003.12.11",
    "duration": "31:01",
    "durationSec": 1861,
    "category": "집중수행 법문 | 빤디따라마 큰스님(아신 빤디따비왐사)",
    "sortKey": 99990000,
    "date": "2003-12-11",
    "order": 0
  },
  {
    "id": "9bmToDzbj7U",
    "title": "[2003-9] 세 종류의 완성된 앎 | 미얀마 집중수행 법문 | 빤디따라마 큰스님(아신 빤디따비왐사) | 2003.12.10",
    "duration": "34:06",
    "durationSec": 2046,
    "category": "집중수행 법문 | 빤디따라마 큰스님(아신 빤디따비왐사)",
    "sortKey": 99990000,
    "date": "2003-12-10",
    "order": 1
  },
  {
    "id": "4jHqd4Ly_xg",
    "title": "[2003-8] 인드리야를 강화시키는 9가지 요건 중 첫 번째 | 미얀마 집중수행 법문 | 빤디따라마 큰스님(아신 빤디따비왐사) | 2003.12.09",
    "duration": "35:40",
    "durationSec": 2140,
    "category": "집중수행 법문 | 빤디따라마 큰스님(아신 빤디따비왐사)",
    "sortKey": 99990000,
    "date": "2003-12-09",
    "order": 2
  },
  {
    "id": "ub6TuSziRAk",
    "title": "[2003-7] 네 가지 상황의 지혜와 그 보조조건 | 미얀마 집중수행 법문 | 빤디따라마 큰스님(아신 빤디따비왐사) | 2003.12.08",
    "duration": "33:38",
    "durationSec": 2018,
    "category": "집중수행 법문 | 빤디따라마 큰스님(아신 빤디따비왐사)",
    "sortKey": 99990000,
    "date": "2003-12-08",
    "order": 3
  },
  {
    "id": "tpYOYlM8gbI",
    "title": "[2003-5] 신심의 특성, 기능, 상황, 근접원인 | 미얀마 집중수행 법문 | 빤디따라마 큰스님(아신 빤디따비왐사) | 2003.12.06",
    "duration": "28:33",
    "durationSec": 1713,
    "category": "집중수행 법문 | 빤디따라마 큰스님(아신 빤디따비왐사)",
    "sortKey": 99990000,
    "date": "2003-12-06",
    "order": 4
  },
  {
    "id": "uDAJKowMouo",
    "title": "[2003-4] 신심의 계발과 법의 가치 | 미얀마 집중수행 법문 | 빤디따라마 큰스님(아신 빤디따비왐사) | 2003.12.05",
    "duration": "32:14",
    "durationSec": 1934,
    "category": "집중수행 법문 | 빤디따라마 큰스님(아신 빤디따비왐사)",
    "sortKey": 99990000,
    "date": "2003-12-05",
    "order": 5
  },
  {
    "id": "uhH8yPNMVZ0",
    "title": "[2003-3] 네 가지 신심(saddhā) | 미얀마 집중수행 법문 | 빤디따라마 큰스님(아신 빤디따비왐사) | 2003.12.04",
    "duration": "28:11",
    "durationSec": 1691,
    "category": "집중수행 법문 | 빤디따라마 큰스님(아신 빤디따비왐사)",
    "sortKey": 99990000,
    "date": "2003-12-04",
    "order": 6
  },
  {
    "id": "ZJFMsfHXTt8",
    "title": "[2003-2] 다섯 가지 인드리야(Indriya)의 계발과 그 시작인 신심(saddhā) | 미얀마 집중수행 법문 | 빤디따라마 큰스님(아신 빤디따비왐사) | 2003.12.03",
    "duration": "32:40",
    "durationSec": 1960,
    "category": "집중수행 법문 | 빤디따라마 큰스님(아신 빤디따비왐사)",
    "sortKey": 99990000,
    "date": "2003-12-03",
    "order": 7
  },
  {
    "id": "ULGQRb87uMU",
    "title": "[2003-1] 다섯 가지 인드리야(Indriya)와 신심(saddhā) | 미얀마 집중수행 법문 | 빤디따라마 큰스님(아신 빤디따비왐사) | 2003.12.02",
    "duration": "30:03",
    "durationSec": 1803,
    "category": "집중수행 법문 | 빤디따라마 큰스님(아신 빤디따비왐사)",
    "sortKey": 99990000,
    "date": "2003-12-02",
    "order": 8
  },
  {
    "id": "cXwy0lfRsnA",
    "title": "[2008-3] 수행을 보호하는 4가지 법 (부처관, 자애관, 부정관, 죽음관) | 집중수행 법문 | 빤디따라마 큰스님(아신 빤디따비왐사) | 2008.03.28",
    "duration": "56:23",
    "durationSec": 3383,
    "category": "집중수행 법문 | 빤디따라마 큰스님(아신 빤디따비왐사)",
    "sortKey": 99990000,
    "date": "2008-03-28",
    "order": 9
  },
  {
    "id": "OfCcxhb91es",
    "title": "[2003-6] 수행자를 위한 빛 - 따마네죠 큰스님 | 미얀마 집중수행 법문 | 빤디따라마 큰스님(아신 빤디따비왐사) | 2003.12.07",
    "duration": "48:47",
    "durationSec": 2927,
    "category": "집중수행 법문 | 빤디따라마 큰스님(아신 빤디따비왐사)",
    "sortKey": 99990000,
    "date": "2003-12-07",
    "order": 10
  },
  {
    "id": "ZbQo41b-va8",
    "title": "[2008-2] 부처님께서 가르치신 위빳사나 수행의 이익 7가지 | 집중수행 법문 | 빤디따라마 큰스님(아신 빤디따비왐사) | 2008.03.27",
    "duration": "52:54",
    "durationSec": 3174,
    "category": "집중수행 법문 | 빤디따라마 큰스님(아신 빤디따비왐사)",
    "sortKey": 99990000,
    "date": "2008-03-27",
    "order": 11
  },
  {
    "id": "Xln163O0gtY",
    "title": "[2008-1] 얻기 어려운 법 5가지 | 집중수행 법문 | 빤디따라마 큰스님(아신 빤디따비왐사) | 2008.03.26",
    "duration": "55:06",
    "durationSec": 3306,
    "category": "집중수행 법문 | 빤디따라마 큰스님(아신 빤디따비왐사)",
    "sortKey": 99990000,
    "date": "2008-03-26",
    "order": 12
  },
  {
    "id": "1MGji7lvCME",
    "title": "살레카숟따 (Sallekha-sutta) 1강",
    "duration": "1:10:35",
    "durationSec": 4235,
    "category": "살레카숟따",
    "sortKey": 1,
    "date": "",
    "order": 0
  },
  {
    "id": "lvR3GabnnSk",
    "title": "살레카숟따 (Sallekha-sutta) 2강",
    "duration": "1:20:19",
    "durationSec": 4819,
    "category": "살레카숟따",
    "sortKey": 2,
    "date": "",
    "order": 1
  },
  {
    "id": "BlhmZP4DUCg",
    "title": "살레카숟따 (Sallekha-sutta) 3강",
    "duration": "1:03:28",
    "durationSec": 3808,
    "category": "살레카숟따",
    "sortKey": 3,
    "date": "",
    "order": 2
  },
  {
    "id": "acAn-xU61Bc",
    "title": "살레카숟따 (Sallekha-sutta) 4강",
    "duration": "1:03:19",
    "durationSec": 3799,
    "category": "살레카숟따",
    "sortKey": 4,
    "date": "",
    "order": 3
  },
  {
    "id": "IU9DOO0TGq8",
    "title": "살레카숟따 (Sallekha-sutta) 5강",
    "duration": "1:06:19",
    "durationSec": 3979,
    "category": "살레카숟따",
    "sortKey": 5,
    "date": "",
    "order": 4
  },
  {
    "id": "902LIkbMYFc",
    "title": "살레카숟따 (Sallekha-sutta) 6강",
    "duration": "1:09:54",
    "durationSec": 4194,
    "category": "살레카숟따",
    "sortKey": 6,
    "date": "",
    "order": 5
  },
  {
    "id": "BWgCPAUFoyo",
    "title": "살레카숟따 (Sallekha-sutta) 7강",
    "duration": "1:15:09",
    "durationSec": 4509,
    "category": "살레카숟따",
    "sortKey": 7,
    "date": "",
    "order": 6
  },
  {
    "id": "R84NWzpfMcw",
    "title": "살레카숟따 (Sallekha-sutta) 8강",
    "duration": "1:05:21",
    "durationSec": 3921,
    "category": "살레카숟따",
    "sortKey": 8,
    "date": "",
    "order": 7
  },
  {
    "id": "9-IXiThbnvo",
    "title": "살레카숟따 (Sallekha-sutta) 9강",
    "duration": "1:03:27",
    "durationSec": 3807,
    "category": "살레카숟따",
    "sortKey": 9,
    "date": "",
    "order": 8
  },
  {
    "id": "e-008dRAXNo",
    "title": "살레카숟따 (Sallekha-sutta) 10강",
    "duration": "1:07:13",
    "durationSec": 4033,
    "category": "살레카숟따",
    "sortKey": 10,
    "date": "",
    "order": 9
  },
  {
    "id": "yeBqEnHKdxw",
    "title": "살레카숟따 (Sallekha-sutta) 11강",
    "duration": "1:13:00",
    "durationSec": 4380,
    "category": "살레카숟따",
    "sortKey": 11,
    "date": "",
    "order": 10
  },
  {
    "id": "4HJpbDEXfFo",
    "title": "살레카숟따 (Sallekha-sutta) 12강",
    "duration": "1:06:05",
    "durationSec": 3965,
    "category": "살레카숟따",
    "sortKey": 12,
    "date": "",
    "order": 11
  },
  {
    "id": "5JIDRUD2Isk",
    "title": "살레카숟따 (Sallekha-sutta) 13강",
    "duration": "1:02:23",
    "durationSec": 3743,
    "category": "살레카숟따",
    "sortKey": 13,
    "date": "",
    "order": 12
  },
  {
    "id": "iBNL0uO45pU",
    "title": "헤마와따숟따 (Hemavata·sutta) 1강",
    "duration": "1:20:40",
    "durationSec": 4840,
    "category": "헤마와따경",
    "sortKey": 1,
    "date": "",
    "order": 0
  },
  {
    "id": "gi4kfPJV2Is",
    "title": "헤마와따숟따 (Hemavata·sutta) 2강",
    "duration": "1:15:26",
    "durationSec": 4526,
    "category": "헤마와따경",
    "sortKey": 2,
    "date": "",
    "order": 1
  },
  {
    "id": "ghzWdNAiJTI",
    "title": "헤마와따숟따 (Hemavata·sutta) 3강",
    "duration": "1:31:40",
    "durationSec": 5500,
    "category": "헤마와따경",
    "sortKey": 3,
    "date": "",
    "order": 2
  },
  {
    "id": "8XhXPkX6XnQ",
    "title": "헤마와따숟따 (Hemavata·sutta) 4강",
    "duration": "1:06:15",
    "durationSec": 3975,
    "category": "헤마와따경",
    "sortKey": 4,
    "date": "",
    "order": 3
  },
  {
    "id": "pON3d_FazFs",
    "title": "헤마와따숟따 (Hemavata·sutta) 5강",
    "duration": "1:00:15",
    "durationSec": 3615,
    "category": "헤마와따경",
    "sortKey": 5,
    "date": "",
    "order": 4
  },
  {
    "id": "UT8glOiqPEU",
    "title": "헤마와따숟따 (Hemavata·sutta) 6강",
    "duration": "1:16:25",
    "durationSec": 4585,
    "category": "헤마와따경",
    "sortKey": 6,
    "date": "",
    "order": 5
  },
  {
    "id": "6nVkDmDW6Mc",
    "title": "헤마와따숟따 (Hemavata·sutta) 7강",
    "duration": "1:30:27",
    "durationSec": 5427,
    "category": "헤마와따경",
    "sortKey": 7,
    "date": "",
    "order": 6
  },
  {
    "id": "O0-xHl2nAh4",
    "title": "헤마와따숟따 (Hemavata·sutta) 8강",
    "duration": "1:04:25",
    "durationSec": 3865,
    "category": "헤마와따경",
    "sortKey": 8,
    "date": "",
    "order": 7
  },
  {
    "id": "dr50LbqXOb8",
    "title": "헤마와따숟따 (Hemavata·sutta) 9강",
    "duration": "1:14:27",
    "durationSec": 4467,
    "category": "헤마와따경",
    "sortKey": 9,
    "date": "",
    "order": 8
  },
  {
    "id": "ayF4lKBR7EM",
    "title": "헤마와따숟따 (Hemavata·sutta) 10강",
    "duration": "1:28:22",
    "durationSec": 5302,
    "category": "헤마와따경",
    "sortKey": 10,
    "date": "",
    "order": 9
  },
  {
    "id": "m6Rlc2qrQnY",
    "title": "헤마와따숟따 (Hemavata·sutta) 11강",
    "duration": "1:05:13",
    "durationSec": 3913,
    "category": "헤마와따경",
    "sortKey": 11,
    "date": "",
    "order": 10
  },
  {
    "id": "X_zxuxjvvXk",
    "title": "헤마와따숟따 (Hemavata·sutta) 12강",
    "duration": "1:03:10",
    "durationSec": 3790,
    "category": "헤마와따경",
    "sortKey": 12,
    "date": "",
    "order": 11
  },
  {
    "id": "n6VQK6dvoxM",
    "title": "대념처경 (Mahāsatipatthāna·sutta 마하사띠빧타나숟따) 1강",
    "duration": "1:07:12",
    "durationSec": 4032,
    "category": "대념처경",
    "sortKey": 1,
    "date": "",
    "order": 0
  },
  {
    "id": "hHsUiSMXDtA",
    "title": "대념처경 (Mahāsatipatthāna·sutta 마하사띠빧타나숟따) 2강",
    "duration": "54:27",
    "durationSec": 3267,
    "category": "대념처경",
    "sortKey": 2,
    "date": "",
    "order": 1
  },
  {
    "id": "THT2zBp37M8",
    "title": "대념처경 (Mahāsatipatthāna·sutta 마하사띠빧타나숟따) 3강",
    "duration": "57:22",
    "durationSec": 3442,
    "category": "대념처경",
    "sortKey": 3,
    "date": "",
    "order": 2
  },
  {
    "id": "KTOuClLfIXw",
    "title": "대념처경 (Mahāsatipatthāna·sutta 마하사띠빧타나숟따) 4강",
    "duration": "1:02:21",
    "durationSec": 3741,
    "category": "대념처경",
    "sortKey": 4,
    "date": "",
    "order": 3
  },
  {
    "id": "D_QIKlcmBkM",
    "title": "대념처경 (Mahāsatipatthāna·sutta 마하사띠빧타나숟따) 5강",
    "duration": "1:02:55",
    "durationSec": 3775,
    "category": "대념처경",
    "sortKey": 5,
    "date": "",
    "order": 4
  },
  {
    "id": "2zNJH_QHHy8",
    "title": "대념처경 (Mahāsatipatthāna·sutta 마하사띠빧타나숟따) 6강",
    "duration": "57:41",
    "durationSec": 3461,
    "category": "대념처경",
    "sortKey": 6,
    "date": "",
    "order": 5
  },
  {
    "id": "i7eotnY0nfs",
    "title": "대념처경 (Mahāsatipatthāna·sutta 마하사띠빧타나숟따) 7강",
    "duration": "1:17:59",
    "durationSec": 4679,
    "category": "대념처경",
    "sortKey": 7,
    "date": "",
    "order": 6
  },
  {
    "id": "FdFivpOaB1E",
    "title": "대념처경 (Mahāsatipatthāna·sutta 마하사띠빧타나숟따) 8강",
    "duration": "59:30",
    "durationSec": 3570,
    "category": "대념처경",
    "sortKey": 8,
    "date": "",
    "order": 7
  },
  {
    "id": "3P_ryKgD-es",
    "title": "대념처경 (Mahāsatipatthāna·sutta 마하사띠빧타나숟따) 9강",
    "duration": "1:04:15",
    "durationSec": 3855,
    "category": "대념처경",
    "sortKey": 9,
    "date": "",
    "order": 8
  },
  {
    "id": "mEPyJ_SFs3E",
    "title": "대념처경 (Mahāsatipatthāna·sutta 마하사띠빧타나숟따) 10강",
    "duration": "55:52",
    "durationSec": 3352,
    "category": "대념처경",
    "sortKey": 10,
    "date": "",
    "order": 9
  },
  {
    "id": "K5RPfO5h1dI",
    "title": "대념처경 (Mahāsatipatthāna·sutta 마하사띠빧타나숟따) 11강",
    "duration": "57:52",
    "durationSec": 3472,
    "category": "대념처경",
    "sortKey": 11,
    "date": "",
    "order": 10
  },
  {
    "id": "w2-HiyYX5ZE",
    "title": "대념처경 (Mahāsatipatthāna·sutta 마하사띠빧타나숟따) 12강",
    "duration": "1:10:21",
    "durationSec": 4221,
    "category": "대념처경",
    "sortKey": 12,
    "date": "",
    "order": 11
  },
  {
    "id": "Lk-_ufr9tu8",
    "title": "망갈라숟따 (1) (Maṅgala·sutta)",
    "duration": "1:55:21",
    "durationSec": 6921,
    "category": "망갈라숟따",
    "sortKey": 1,
    "date": "",
    "order": 0
  },
  {
    "id": "OBGAy_-sej4",
    "title": "망갈라숟따 (2) : 어리석은 이들과 교류하지 않고 멀리함, 지혜로운 선인들을 교류하고 다가감, 공양 올려야 할 분들께 공양올림 (Maṅgala·sutta)",
    "duration": "1:41:31",
    "durationSec": 6091,
    "category": "망갈라숟따",
    "sortKey": 2,
    "date": "",
    "order": 1
  },
  {
    "id": "Rcrm15x4cME",
    "title": "망갈라숟따 (3) :  적절한 장소에 지냄, 과거의 행한 선업이 있음, 몸과 마음을 훌륭히 둠 (Maṅgala·sutta)",
    "duration": "1:19:41",
    "durationSec": 4781,
    "category": "망갈라숟따",
    "sortKey": 3,
    "date": "",
    "order": 2
  },
  {
    "id": "wA9PhhABAa4",
    "title": "망갈라숟따 (4) :  견문이 많음, 기술을 습득함, 자기 수행인 율을 배우고 훈련함, 말을 훌륭하게 함 (Maṅgala·sutta)",
    "duration": "2:07:35",
    "durationSec": 7655,
    "category": "망갈라숟따",
    "sortKey": 4,
    "date": "",
    "order": 3
  },
  {
    "id": "ssyLOKlqUpA",
    "title": "망갈라숟따 (5) :  아버지를 봉양함, 어머니를 봉양함, 처자식을 돌보고 보조함 (Maṅgala·sutta)",
    "duration": "1:35:25",
    "durationSec": 5725,
    "category": "망갈라숟따",
    "sortKey": 5,
    "date": "",
    "order": 4
  },
  {
    "id": "snFTv6Aw0io",
    "title": "망갈라숟따 (6) :  번잡함이 없도록 일함, 보시함 (Maṅgala·sutta)",
    "duration": "1:45:14",
    "durationSec": 6314,
    "category": "망갈라숟따",
    "sortKey": 6,
    "date": "",
    "order": 5
  },
  {
    "id": "0-UgPWkntQU",
    "title": "망갈라숟따 (7) :  좋은 행위를 실천함, 친족들을 보조함, 허물이 없는 일들을 함, 불선업을 몸과 마음으로 삼감, 술 마심을 자제함 (Maṅgala·sutta)",
    "duration": "1:52:55",
    "durationSec": 6775,
    "category": "망갈라숟따",
    "sortKey": 7,
    "date": "",
    "order": 6
  },
  {
    "id": "bn6H-zyYU8I",
    "title": "망갈라숟따 (8)  :  선업의 법들에 방일하지 않음, 공손해야 할 사람에게 공손함, 자신을 낮춤, 만족함, 은혜를 앎, 적절한 때 법을 들음 (Maṅgala·sutta)",
    "duration": "1:43:24",
    "durationSec": 6204,
    "category": "망갈라숟따",
    "sortKey": 8,
    "date": "",
    "order": 7
  },
  {
    "id": "AVt_jQ73Tcs",
    "title": "망갈라숟따 (9)  :  인내함, 가르치고 훈계하기 쉬움, 사문들을 친견함, 법을 의논함 (Maṅgala·sutta)",
    "duration": "1:36:03",
    "durationSec": 5763,
    "category": "망갈라숟따",
    "sortKey": 9,
    "date": "",
    "order": 8
  },
  {
    "id": "akiJDioOUR8",
    "title": "망갈라숟따 (10) :  마음의 동요하지 않음, 걱정과 근심이 없음, 갈애 등의 먼지가 없음, 위험과 적이 없음  (Maṅgala·sutta)",
    "duration": "1:31:32",
    "durationSec": 5492,
    "category": "망갈라숟따",
    "sortKey": 10,
    "date": "",
    "order": 9
  },
  {
    "id": "9HmFMV4S6bk",
    "title": "와소해제 회향법회 (2016.10.16)",
    "duration": "54:05",
    "durationSec": 3245,
    "category": "보시, 회향",
    "sortKey": 20160000,
    "date": "2016-10-16",
    "order": 0
  },
  {
    "id": "a8bC7l6GKKg",
    "title": "아누모다나 (anumodanā) | 선원이전 회향법회 (2024.07.14)",
    "duration": "46:17",
    "durationSec": 2777,
    "category": "보시, 회향",
    "sortKey": 20240000,
    "date": "2024-07-14",
    "order": 1
  },
  {
    "id": "GIC0kZWsNA0",
    "title": "[평촌선원 개원법회] 사원 보시의 이익 | 빤디따라마 | 아야 마나삐까 | 2025.07.13",
    "duration": "1:56:39",
    "durationSec": 6999,
    "category": "보시, 회향",
    "sortKey": 20250000,
    "date": "2025-07-13",
    "order": 2
  },
  {
    "id": "J7bLkHN8bnE",
    "title": "니디깐다숟따 (Nidhikaṇḍa·sutta)",
    "duration": "1:10:08",
    "durationSec": 4208,
    "category": "보시, 회향",
    "sortKey": 99990000,
    "date": "",
    "order": 3
  },
  {
    "id": "oBXeZvwTuTE",
    "title": "낑다다숟따 (Kiṃdada sutta)",
    "duration": "49:14",
    "durationSec": 2954,
    "category": "보시, 회향",
    "sortKey": 99990000,
    "date": "",
    "order": 4
  },
  {
    "id": "rsomMDAEIxo",
    "title": "아리야와사숟따 (1)",
    "duration": "1:02:39",
    "durationSec": 3759,
    "category": "아리야와사숟따",
    "sortKey": 1,
    "date": "",
    "order": 0
  },
  {
    "id": "CE4KMTuz50Q",
    "title": "아리야와사숟따 (2)",
    "duration": "1:14:14",
    "durationSec": 4454,
    "category": "아리야와사숟따",
    "sortKey": 2,
    "date": "",
    "order": 1
  },
  {
    "id": "zltH48gt-KA",
    "title": "아리야와사숟따  (3)",
    "duration": "58:23",
    "durationSec": 3503,
    "category": "아리야와사숟따",
    "sortKey": 3,
    "date": "",
    "order": 2
  },
  {
    "id": "lg6dai5LMuY",
    "title": "아리야와사숟따 (4)",
    "duration": "1:37:38",
    "durationSec": 5858,
    "category": "아리야와사숟따",
    "sortKey": 4,
    "date": "",
    "order": 3
  },
  {
    "id": "ARp9eQGE7_s",
    "title": "아리야와사숟따 (5) | 행복하게 사는 법 | 숲에서 수행하는 사람들",
    "duration": "55:54",
    "durationSec": 3354,
    "category": "아리야와사숟따",
    "sortKey": 5,
    "date": "",
    "order": 4
  },
  {
    "id": "ZutBUjz4vyM",
    "title": "1. 빤디따라마 유소년 위빳사나 불교학교 법문  | 아야 마나삐까 |  2025.07.30.",
    "duration": "47:01",
    "durationSec": 2821,
    "category": "빤디따라마 유소년 위빳사나 불교학교",
    "sortKey": 20250001,
    "date": "2025-07-30",
    "order": 0
  },
  {
    "id": "UC9RHZ0ceGE",
    "title": "2. 빤디따라마 유소년 위빳사나 불교학교 법문 | 아야 마나삐까 |  2025.07.31.",
    "duration": "39:14",
    "durationSec": 2354,
    "category": "빤디따라마 유소년 위빳사나 불교학교",
    "sortKey": 20250002,
    "date": "2025-07-31",
    "order": 1
  },
  {
    "id": "6CzHcD7vG-Q",
    "title": "3. 빤디따라마 유소년 위빳사나 불교학교 법문  | 아야 마나삐까 | 2025.08.01.",
    "duration": "41:53",
    "durationSec": 2513,
    "category": "빤디따라마 유소년 위빳사나 불교학교",
    "sortKey": 20250003,
    "date": "2025-08-01",
    "order": 2
  },
  {
    "id": "xf__Su7padI",
    "title": "4. 빤디따라마 유소년 위빳사나 불교학교 법문  | 아야 마나삐까 | 2025.08.02.",
    "duration": "46:40",
    "durationSec": 2800,
    "category": "빤디따라마 유소년 위빳사나 불교학교",
    "sortKey": 20250004,
    "date": "2025-08-02",
    "order": 3
  },
  {
    "id": "SdJAN42AZjs",
    "title": "대(大)은사(恩師), 빤디따라마 큰스님(아신 빤디따비왐사)  짧은 법문(2016)",
    "duration": "37:12",
    "durationSec": 2232,
    "category": "빤디따라마 큰스님(아신 빤디따 비왐사 사야도)",
    "sortKey": 20160000,
    "date": "",
    "order": 0
  },
  {
    "id": "uS7eqf1g9Is",
    "title": "빤디따라마 큰스님(아신 빤디따비왐사)  추모 영상(2016)",
    "duration": "9:26",
    "durationSec": 566,
    "category": "빤디따라마 큰스님(아신 빤디따 비왐사 사야도)",
    "sortKey": 20160000,
    "date": "",
    "order": 1
  },
  {
    "id": "Szzpo_SG-Co",
    "title": "담마란 무엇인가, 어떤 것인가, 담마위하리(법으로 지내는 이)란 무엇인가? |  2025 빤디따라마 큰스님(아신 빤디따비왐사) 추모법회",
    "duration": "42:34",
    "durationSec": 2554,
    "category": "빤디따라마 큰스님(아신 빤디따 비왐사 사야도)",
    "sortKey": 20250000,
    "date": "",
    "order": 2
  },
  {
    "id": "oSct0e6l_Kw",
    "title": "빤디따라마 큰스님의 입적부터 다비식까지",
    "duration": "11:08",
    "durationSec": 668,
    "category": "빤디따라마 큰스님(아신 빤디따 비왐사 사야도)",
    "sortKey": 99990000,
    "date": "",
    "order": 3
  },
  {
    "id": "t_gGYKEITaM",
    "title": "마하시 큰스님의 수밧다 경 (1) (2024.05.22. 붓다의 날)",
    "duration": "1:24:29",
    "durationSec": 5069,
    "category": "수받다 경",
    "sortKey": 20240001,
    "date": "2024-05-22",
    "order": 0
  },
  {
    "id": "4rR258kg3Pc",
    "title": "마하시 큰스님의 수받다 경 (2) (2024.08.25.)",
    "duration": "1:45:29",
    "durationSec": 6329,
    "category": "수받다 경",
    "sortKey": 20240002,
    "date": "2024-08-25",
    "order": 1
  },
  {
    "id": "tTcIMHzoRrU",
    "title": "마하시 큰스님의 수받다 경 (3) (2024.09.08.)",
    "duration": "1:37:42",
    "durationSec": 5862,
    "category": "수받다 경",
    "sortKey": 20240003,
    "date": "2024-09-08",
    "order": 2
  },
  {
    "id": "VTfLJOtqEo0",
    "title": "마하시 큰스님의 수받다 경 (4) (2024.09.22.)",
    "duration": "1:40:29",
    "durationSec": 6029,
    "category": "수받다 경",
    "sortKey": 20240004,
    "date": "2024-09-22",
    "order": 3
  },
  {
    "id": "4gaHdMeKLoQ",
    "title": "[위빳사나 기본다지기] 1. 좌선 - 15분 좌선 및 수행보고 | 빤디따라마 | 아야 마나삐까 | 2025.08.04",
    "duration": "1:06:59",
    "durationSec": 4019,
    "category": "위빳사나 수행 입문",
    "sortKey": 20250000,
    "date": "2025-08-04",
    "order": 0
  },
  {
    "id": "D9_cr22O-AE",
    "title": "위빳사나 수행방법 안내 |  마하시 큰스님",
    "duration": "50:31",
    "durationSec": 3031,
    "category": "위빳사나 수행 입문",
    "sortKey": 99990000,
    "date": "",
    "order": 1
  },
  {
    "id": "QeKFqrA3V9A",
    "title": "수행보고 방법 길라잡이 | 빤디따라마 큰스님(아신 빤디따비왐사)",
    "duration": "50:25",
    "durationSec": 3025,
    "category": "위빳사나 수행 입문",
    "sortKey": 99990000,
    "date": "",
    "order": 2
  },
  {
    "id": "ZAkwmWE5RXQ",
    "title": "2016년 빤디따라마 큰스님 추모법회 (1) |  빤디따라마 근본불교 수행센터",
    "duration": "1:33:16",
    "durationSec": 5596,
    "category": "추모법회",
    "sortKey": 20160001,
    "date": "",
    "order": 0
  },
  {
    "id": "ilcINDLsreE",
    "title": "빤디따라마 큰스님 3주기 추모법회 (2019)",
    "duration": "1:00:15",
    "durationSec": 3615,
    "category": "추모법회",
    "sortKey": 20190000,
    "date": "",
    "order": 1
  },
  {
    "id": "wJ069vR4V7U",
    "title": "2024 빤디따라마 큰스님(아신 빤디따비왐사) 추모법회 (삼보와 스승의 은덕)",
    "duration": "47:36",
    "durationSec": 2856,
    "category": "추모법회",
    "sortKey": 20240000,
    "date": "",
    "order": 2
  },
  {
    "id": "jKM-U207wEs",
    "title": "빠릳따빠리깜마 (Parittaparikamma) 1강",
    "duration": "1:52:48",
    "durationSec": 6768,
    "category": "빠릳따빠리깜마",
    "sortKey": 1,
    "date": "",
    "order": 0
  },
  {
    "id": "X0U6vtqKZqw",
    "title": "빠릳따빠리깜마 (Parittaparikamma) 2강",
    "duration": "1:30:51",
    "durationSec": 5451,
    "category": "빠릳따빠리깜마",
    "sortKey": 2,
    "date": "",
    "order": 1
  },
  {
    "id": "wW21c9GBGnQ",
    "title": "빠릳따빠리깜마 (Parittaparikamma) 3강",
    "duration": "1:06:51",
    "durationSec": 4011,
    "category": "빠릳따빠리깜마",
    "sortKey": 3,
    "date": "",
    "order": 2
  },
  {
    "id": "7kUzCEP5Na0",
    "title": "왐미까숟따 (개미언덕의 경) 1강",
    "duration": "1:05:02",
    "durationSec": 3902,
    "category": "왐미까숟따",
    "sortKey": 1,
    "date": "",
    "order": 0
  },
  {
    "id": "dbKI3dIOmMM",
    "title": "왐미까숟따(개미언덕의 경) 2강",
    "duration": "1:05:02",
    "durationSec": 3902,
    "category": "왐미까숟따",
    "sortKey": 2,
    "date": "",
    "order": 1
  },
  {
    "id": "J_SoXIsQ__8",
    "title": "왐미까숟따(개미언덕의 경) 3강",
    "duration": "37:01",
    "durationSec": 2221,
    "category": "왐미까숟따",
    "sortKey": 3,
    "date": "",
    "order": 2
  },
  {
    "id": "6lOsfj0KoT8",
    "title": "제5차 정기총회 법문 | 사단법인 빤디따라마 근본불교 수행센터  (2024.06.09)",
    "duration": "18:53",
    "durationSec": 1133,
    "category": "특별법회",
    "sortKey": 20240000,
    "date": "2024-06-09",
    "order": 0
  },
  {
    "id": "DxVJ5x6hxHo",
    "title": "[특별법회] 얻기 어려운 다섯 가지(붇다의 훈계) | 아신 냐눗조따 비왐사 사야도 (2025.6.14)",
    "duration": "1:18:42",
    "durationSec": 4722,
    "category": "특별법회",
    "sortKey": 20250000,
    "date": "2025-06-14",
    "order": 1
  },
  {
    "id": "V3Ellz9sVOI",
    "title": "독사에의 비유경 (Āsīvisopama·sutta 아시위소빠마숟따) 1강",
    "duration": "1:08:38",
    "durationSec": 4118,
    "category": "아시위소빠마숟따",
    "sortKey": 1,
    "date": "",
    "order": 0
  },
  {
    "id": "VlBwUuSjUKw",
    "title": "독사에의 비유경 (Āsīvisopama·sutta 아시위소빠마숟따) 2강",
    "duration": "1:04:29",
    "durationSec": 3869,
    "category": "아시위소빠마숟따",
    "sortKey": 2,
    "date": "",
    "order": 1
  },
  {
    "id": "qx6QkjXfjhI",
    "title": "오와다 빠띠목카 (Ovāda·pātimokkha) 1강",
    "duration": "1:38:00",
    "durationSec": 5880,
    "category": "오와다 빠띠목카, 전륜성왕경",
    "sortKey": 1,
    "date": "",
    "order": 0
  },
  {
    "id": "zzmiaC6Ge5k",
    "title": "오와다 빠띠목카 (Ovāda·pātimokkha) 2강 |  전륜성왕경",
    "duration": "1:46:53",
    "durationSec": 6413,
    "category": "오와다 빠띠목카, 전륜성왕경",
    "sortKey": 2,
    "date": "",
    "order": 1
  },
  {
    "id": "9pt1Q_N6kSo",
    "title": "바와나숟따 (1)",
    "duration": "53:25",
    "durationSec": 3205,
    "category": "바와나숟따",
    "sortKey": 1,
    "date": "",
    "order": 0
  },
  {
    "id": "p7l5WQfU6Is",
    "title": "바와나숟따 (2)",
    "duration": "57:06",
    "durationSec": 3426,
    "category": "바와나숟따",
    "sortKey": 2,
    "date": "",
    "order": 1
  },
  {
    "id": "3B8OjWL-NJ0",
    "title": "아누룻다 장로의 대사유의 경 (Anuruddha·mahāvitakka·sutta)",
    "duration": "1:19:06",
    "durationSec": 4746,
    "category": "아누룻다 장로의 대사유의 경",
    "sortKey": 99990000,
    "date": "",
    "order": 0
  },
  {
    "id": "4MtLHM44PvY",
    "title": "Private video",
    "duration": "0:00",
    "durationSec": 0,
    "category": "보시, 회향",
    "sortKey": 0,
    "date": "",
    "order": 258
  },
  {
    "id": "BZNHegrwmuI",
    "title": "Private video",
    "duration": "0:00",
    "durationSec": 0,
    "category": "위빳사나 집중수행 법문(2006)",
    "sortKey": 0,
    "date": "",
    "order": 259
  },
  {
    "id": "7VcL947zmaY",
    "title": "Private video",
    "duration": "0:00",
    "durationSec": 0,
    "category": "위빳사나 집중수행 법문(2006)",
    "sortKey": 0,
    "date": "",
    "order": 260
  },
  {
    "id": "bdeQN0kdoGk",
    "title": "Private video",
    "duration": "0:00",
    "durationSec": 0,
    "category": "위빳사나 집중수행 법문(2006)",
    "sortKey": 0,
    "date": "",
    "order": 261
  },
  {
    "id": "JJjYpOPwj04",
    "title": "Private video",
    "duration": "0:00",
    "durationSec": 0,
    "category": "위빳사나 집중수행 법문(2006)",
    "sortKey": 0,
    "date": "",
    "order": 262
  },
  {
    "id": "LJgaAnFyBcc",
    "title": "Private video",
    "duration": "0:00",
    "durationSec": 0,
    "category": "위빳사나 집중수행 법문(2006)",
    "sortKey": 0,
    "date": "",
    "order": 263
  },
  {
    "id": "YUQjdC6mUmM",
    "title": "Private video",
    "duration": "0:00",
    "durationSec": 0,
    "category": "위빳사나 집중수행 법문(2006)",
    "sortKey": 0,
    "date": "",
    "order": 264
  },
  {
    "id": "e1zBMQMsu0k",
    "title": "Private video",
    "duration": "0:00",
    "durationSec": 0,
    "category": "위빳사나 집중수행 법문(2006)",
    "sortKey": 0,
    "date": "",
    "order": 265
  },
  {
    "id": "pzOlk6jBiBo",
    "title": "Private video",
    "duration": "0:00",
    "durationSec": 0,
    "category": "위빳사나 집중수행 법문(2006)",
    "sortKey": 0,
    "date": "",
    "order": 266
  },
  {
    "id": "6QIuKshaQbk",
    "title": "Private video",
    "duration": "0:00",
    "durationSec": 0,
    "category": "위빳사나 집중수행 법문(2006)",
    "sortKey": 0,
    "date": "",
    "order": 267
  },
  {
    "id": "mrlmGkie6Cg",
    "title": "Private video",
    "duration": "0:00",
    "durationSec": 0,
    "category": "위빳사나 집중수행 법문(2006)",
    "sortKey": 0,
    "date": "",
    "order": 268
  },
  {
    "id": "ukK8VKgwMJU",
    "title": "Private video",
    "duration": "0:00",
    "durationSec": 0,
    "category": "위빳사나 집중수행 법문(2006)",
    "sortKey": 0,
    "date": "",
    "order": 269
  },
  {
    "id": "bOev-XkrVk8",
    "title": "Private video",
    "duration": "0:00",
    "durationSec": 0,
    "category": "위빳사나 집중수행 법문(2006)",
    "sortKey": 0,
    "date": "",
    "order": 270
  },
  {
    "id": "nHpwDC3bWFY",
    "title": "Private video",
    "duration": "0:00",
    "durationSec": 0,
    "category": "위빳사나 집중수행 법문(2006)",
    "sortKey": 0,
    "date": "",
    "order": 271
  },
  {
    "id": "FhfQSNGv7JE",
    "title": "Private video",
    "duration": "0:00",
    "durationSec": 0,
    "category": "위빳사나 집중수행 법문(2006)",
    "sortKey": 0,
    "date": "",
    "order": 272
  },
  {
    "id": "WvLs8T9RcTs",
    "title": "Private video",
    "duration": "0:00",
    "durationSec": 0,
    "category": "위빳사나 집중수행 법문(2006)",
    "sortKey": 0,
    "date": "",
    "order": 273
  },
  {
    "id": "xN6NdcwqEDE",
    "title": "Private video",
    "duration": "0:00",
    "durationSec": 0,
    "category": "위빳사나 집중수행 법문(2006)",
    "sortKey": 0,
    "date": "",
    "order": 274
  },
  {
    "id": "XGlSSSFcHsc",
    "title": "Private video",
    "duration": "0:00",
    "durationSec": 0,
    "category": "위빳사나 집중수행 법문(2006)",
    "sortKey": 0,
    "date": "",
    "order": 275
  },
  {
    "id": "RK2HuyeL0Uw",
    "title": "Private video",
    "duration": "0:00",
    "durationSec": 0,
    "category": "위빳사나 집중수행 법문(2006)",
    "sortKey": 0,
    "date": "",
    "order": 276
  },
  {
    "id": "m40_CqIJmMQ",
    "title": "Private video",
    "duration": "0:00",
    "durationSec": 0,
    "category": "위빳사나 집중수행 법문(2006)",
    "sortKey": 0,
    "date": "",
    "order": 277
  },
  {
    "id": "2m7m0jZ54Wg",
    "title": "Private video",
    "duration": "0:00",
    "durationSec": 0,
    "category": "위빳사나 집중수행 법문(2006)",
    "sortKey": 0,
    "date": "",
    "order": 278
  },
  {
    "id": "p48Q7Fiwkl8",
    "title": "Private video",
    "duration": "0:00",
    "durationSec": 0,
    "category": "위빳사나 집중수행 법문(2006)",
    "sortKey": 0,
    "date": "",
    "order": 279
  },
  {
    "id": "RUSa3nb9VP4",
    "title": "Private video",
    "duration": "0:00",
    "durationSec": 0,
    "category": "위빳사나 집중수행 법문(2006)",
    "sortKey": 0,
    "date": "",
    "order": 280
  },
  {
    "id": "IuRefw8MDtg",
    "title": "Private video",
    "duration": "0:00",
    "durationSec": 0,
    "category": "위빳사나 집중수행 법문(2006)",
    "sortKey": 0,
    "date": "",
    "order": 281
  },
  {
    "id": "XL5-edfCMMA",
    "title": "Private video",
    "duration": "0:00",
    "durationSec": 0,
    "category": "위빳사나 집중수행 법문(2006)",
    "sortKey": 0,
    "date": "",
    "order": 282
  },
  {
    "id": "aj_gFTGinAw",
    "title": "Private video",
    "duration": "0:00",
    "durationSec": 0,
    "category": "위빳사나 집중수행 법문(2006)",
    "sortKey": 0,
    "date": "",
    "order": 283
  },
  {
    "id": "ZCrXN74cJQg",
    "title": "Private video",
    "duration": "0:00",
    "durationSec": 0,
    "category": "위빳사나 집중수행 법문(2006)",
    "sortKey": 0,
    "date": "",
    "order": 284
  },
  {
    "id": "mLU7qa6xJ18",
    "title": "Private video",
    "duration": "0:00",
    "durationSec": 0,
    "category": "위빳사나 집중수행 법문(2006)",
    "sortKey": 0,
    "date": "",
    "order": 285
  },
  {
    "id": "njeDQDzTg54",
    "title": "Private video",
    "duration": "0:00",
    "durationSec": 0,
    "category": "위빳사나 집중수행 법문(2006)",
    "sortKey": 0,
    "date": "",
    "order": 286
  },
  {
    "id": "cdFdQcknGOM",
    "title": "Private video",
    "duration": "0:00",
    "durationSec": 0,
    "category": "위빳사나 집중수행 법문(2006)",
    "sortKey": 0,
    "date": "",
    "order": 287
  },
  {
    "id": "_Nf_yoHl1ss",
    "title": "Private video",
    "duration": "0:00",
    "durationSec": 0,
    "category": "위빳사나 집중수행 법문(2006)",
    "sortKey": 0,
    "date": "",
    "order": 288
  },
  {
    "id": "dgh8xEqsJrY",
    "title": "Private video",
    "duration": "0:00",
    "durationSec": 0,
    "category": "위빳사나 집중수행 법문(2006)",
    "sortKey": 0,
    "date": "",
    "order": 289
  },
  {
    "id": "3HwWX_BSRso",
    "title": "Private video",
    "duration": "0:00",
    "durationSec": 0,
    "category": "위빳사나 집중수행 법문(2006)",
    "sortKey": 0,
    "date": "",
    "order": 290
  },
  {
    "id": "F8itoNwE4UM",
    "title": "Private video",
    "duration": "0:00",
    "durationSec": 0,
    "category": "위빳사나 집중수행 법문(2006)",
    "sortKey": 0,
    "date": "",
    "order": 291
  },
  {
    "id": "AyURnqGU1lw",
    "title": "Private video",
    "duration": "0:00",
    "durationSec": 0,
    "category": "위빳사나 집중수행 법문(2006)",
    "sortKey": 0,
    "date": "",
    "order": 292
  },
  {
    "id": "CB6qkSYyi24",
    "title": "Private video",
    "duration": "0:00",
    "durationSec": 0,
    "category": "위빳사나 집중수행 법문(2006)",
    "sortKey": 0,
    "date": "",
    "order": 293
  },
  {
    "id": "SXAALtUAqKg",
    "title": "Private video",
    "duration": "0:00",
    "durationSec": 0,
    "category": "위빳사나 집중수행 법문(2006)",
    "sortKey": 0,
    "date": "",
    "order": 294
  },
  {
    "id": "M-dI4nLsIxA",
    "title": "Private video",
    "duration": "0:00",
    "durationSec": 0,
    "category": "위빳사나 집중수행 법문(2006)",
    "sortKey": 0,
    "date": "",
    "order": 295
  },
  {
    "id": "Jj_t1jLygLE",
    "title": "Private video",
    "duration": "0:00",
    "durationSec": 0,
    "category": "위빳사나 집중수행 법문(2006)",
    "sortKey": 0,
    "date": "",
    "order": 296
  },
  {
    "id": "zEj7ZeMdJCE",
    "title": "Private video",
    "duration": "0:00",
    "durationSec": 0,
    "category": "위빳사나 집중수행 법문(2006)",
    "sortKey": 0,
    "date": "",
    "order": 297
  },
  {
    "id": "RwZ4mDfrU7A",
    "title": "Private video",
    "duration": "0:00",
    "durationSec": 0,
    "category": "위빳사나 집중수행 법문(2006)",
    "sortKey": 0,
    "date": "",
    "order": 298
  },
  {
    "id": "2L-xOCJUnKk",
    "title": "Private video",
    "duration": "0:00",
    "durationSec": 0,
    "category": "위빳사나 집중수행 법문(2006)",
    "sortKey": 0,
    "date": "",
    "order": 299
  },
  {
    "id": "aL_mZJxPYDU",
    "title": "Private video",
    "duration": "0:00",
    "durationSec": 0,
    "category": "위빳사나 집중수행 법문(2006)",
    "sortKey": 0,
    "date": "",
    "order": 300
  },
  {
    "id": "ipk4TMF1o-8",
    "title": "Private video",
    "duration": "0:00",
    "durationSec": 0,
    "category": "붇다의 날",
    "sortKey": 0,
    "date": "",
    "order": 301
  },
  {
    "id": "DvFYFoP1-vU",
    "title": "Private video",
    "duration": "0:00",
    "durationSec": 0,
    "category": "빤디따라마 큰스님(아신 빤디따 비왐사 사야도)",
    "sortKey": 0,
    "date": "",
    "order": 302
  }
];