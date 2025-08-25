export type LanguageCode = 'ko' | 'en';

export interface TranslationStrings {
  // 메인 메뉴
  mainTitle: string;
  mainSubtitle: string;

  // 게임 카드
  galagaTitle: string;
  galagaDescription: string;
  tetrisTitle: string;
  tetrisDescription: string;
  snakeTitle: string;
  snakeDescription: string;
  pongTitle: string;
  pongDescription: string;
  playButton: string;
  comingSoon: string;

  // 사이트 소개
  introTitle: string;
  introDescription: string;
  featuresTitle: string;
  freeGameFeature: string;
  freeGameDescription: string;
  browserCompatFeature: string;
  browserCompatDescription: string;
  mobileFeature: string;
  mobileDescription: string;
  classicFeature: string;
  classicDescription: string;

  // 게임 가이드
  guideTitle: string;
  galagaGuideTitle: string;
  controlsTitle: string;
  controlsDescription: string;
  tipsTitle: string;
  tipsDescription: string;
  scoreSystemTitle: string;
  scoreSystemDescription: string;

  // 최신 소식
  newsTitle: string;
  galagaUpdateTitle: string;
  galagaUpdateDescription: string;
  upcomingGamesTitle: string;
  upcomingGamesDescription: string;

  // FAQ
  faqTitle: string;
  faqGameNotWorking: string;
  faqGameNotWorkingAnswer: string;
  faqMobileSupport: string;
  faqMobileSupportAnswer: string;
  faqScoreSaving: string;
  faqScoreSavingAnswer: string;
  faqGameRequest: string;
  faqGameRequestAnswer: string;

  // 이용 안내
  termsTitle: string;
  privacyTitle: string;
  privacyDescription: string;
  serviceTitle: string;
  serviceDescription: string;
  improvementTitle: string;
  improvementDescription: string;

  // 푸터
  footer: string;

  // 언어 전환
  languageSwitch: string;
  korean: string;
  english: string;

  // 광고 미리보기
  topBannerAd: string;
  leftSidebarAd: string;
  rightSidebarAd: string;
  bottomBannerAd: string;
  adApprovalText: string;

  // 갤러그 게임 UI
  score: string;
  stage: string;
  lives: string;
  items: string;
  missile: string;
  tier: string;
  gameStart: string;
  selectDifficulty: string;
  easy: string;
  normal: string;
  hard: string;
  gameOver: string;
  restart: string;
  backToMenu: string;
}

export const translations: Record<LanguageCode, TranslationStrings> = {
  ko: {
    // 메인 메뉴
    mainTitle: '🕹️ MINI ARCADE',
    mainSubtitle: '클래식 게임을 즐겨보세요!',

    // 게임 카드
    galagaTitle: '갤러그 슈터',
    galagaDescription: '우주를 배경으로 한 클래식 슈팅 게임',
    tetrisTitle: '테트리스',
    tetrisDescription: '떨어지는 블록을 맞춰 라인을 완성하세요',
    snakeTitle: '스네이크',
    snakeDescription: '뱀을 조종해서 먹이를 먹고 성장하세요',
    pongTitle: '퐁',
    pongDescription: '최초의 아케이드 게임을 경험해보세요',
    playButton: '🎮 플레이',
    comingSoon: '🔜 출시 예정',

    // 사이트 소개
    introTitle: '🎮 Mini Arcade 소개',
    introDescription:
      'Mini Arcade는 클래식 아케이드 게임을 현대적인 웹 기술로 재탄생시킨 온라인 게임 플랫폼입니다. HTML5와 TypeScript를 활용하여 구현된 고품질 게임들을 브라우저에서 바로 즐길 수 있습니다.',
    featuresTitle: '✨ 주요 특징',
    freeGameFeature: '무료 게임:',
    freeGameDescription: '모든 게임을 무료로 즐길 수 있습니다',
    browserCompatFeature: '브라우저 호환:',
    browserCompatDescription: '별도 설치 없이 웹브라우저에서 바로 실행',
    mobileFeature: '모바일 지원:',
    mobileDescription: 'PC와 모바일 모두에서 최적화된 게임 경험',
    classicFeature: '클래식 게임:',
    classicDescription: '80년대 아케이드 게임의 향수를 느낄 수 있습니다',

    // 게임 가이드
    guideTitle: '🕹️ 게임 플레이 가이드',
    galagaGuideTitle: '갤러그 슈터 게임 방법',
    controlsTitle: '🎯 조작 방법',
    controlsDescription:
      'PC: 방향키로 이동, 스페이스바로 발사\n모바일: 화면 터치로 이동 및 자동 발사',
    tipsTitle: '⭐ 게임 팁',
    tipsDescription:
      '• 적의 움직임 패턴을 파악하여 효율적으로 공격하세요\n• 파워업 아이템을 획득하여 화력을 강화할 수 있습니다\n• 방패 아이템으로 일시적인 무적 상태를 유지하세요',
    scoreSystemTitle: '🏆 점수 시스템',
    scoreSystemDescription:
      '• 적 처치: 기본 점수 획득\n• 연속 명중: 콤보 보너스 점수\n• 보스 처치: 대량 보너스 점수',

    // 최신 소식
    newsTitle: '📢 최신 소식',
    galagaUpdateTitle: '🚀 갤러그 게임 업데이트 (2024.12)',
    galagaUpdateDescription:
      '• 모바일 터치 컨트롤 개선으로 더욱 부드러운 조작감 제공\n• 새로운 파워업 시스템 및 방패 아이템 추가\n• 보스전 시스템 및 난이도 조절 기능 구현',
    upcomingGamesTitle: '🎮 추가 예정 게임',
    upcomingGamesDescription:
      '• 테트리스: 클래식 블록 퍼즐 게임 개발 중\n• 스네이크: 추억의 뱀 게임 제작 준비 중\n• 퐁: 최초의 아케이드 게임 구현 예정',

    // FAQ
    faqTitle: '❓ 자주 묻는 질문',
    faqGameNotWorking: 'Q. 게임이 실행되지 않아요',
    faqGameNotWorkingAnswer:
      'A. 최신 버전의 웹브라우저(Chrome, Firefox, Safari, Edge)를 사용하시고, JavaScript가 활성화되어 있는지 확인해주세요. 모바일에서는 화면을 세로 또는 가로로 회전해보시기 바랍니다.',
    faqMobileSupport: 'Q. 모바일에서도 게임을 할 수 있나요?',
    faqMobileSupportAnswer:
      'A. 네! 모든 게임은 모바일 환경에 최적화되어 있습니다. 터치 컨트롤을 지원하며, 다양한 화면 크기에 맞춰 자동으로 조정됩니다.',
    faqScoreSaving: 'Q. 게임 점수가 저장되나요?',
    faqScoreSavingAnswer:
      'A. 현재는 세션 내에서만 점수가 유지됩니다. 추후 업데이트를 통해 최고 점수 저장 기능을 추가할 예정입니다.',
    faqGameRequest: 'Q. 새로운 게임을 요청할 수 있나요?',
    faqGameRequestAnswer:
      'A. 물론입니다! 원하시는 클래식 게임이 있다면 언제든 의견을 주시기 바랍니다. 사용자 요청을 우선으로 새로운 게임을 개발하고 있습니다.',

    // 이용 안내
    termsTitle: '📋 이용 안내',
    privacyTitle: '🔒 개인정보 보호',
    privacyDescription:
      'Mini Arcade는 사용자의 개인정보를 수집하지 않으며, 게임 플레이에 필요한 최소한의 정보만을 브라우저에 임시 저장합니다. 모든 데이터는 세션 종료 시 자동으로 삭제됩니다.',
    serviceTitle: '🎯 서비스 이용',
    serviceDescription:
      '• 모든 게임은 무료로 제공됩니다\n• 상업적 목적의 무단 복제 및 배포를 금지합니다\n• 게임 내 콘텐츠의 저작권은 Mini Arcade에 있습니다',
    improvementTitle: '💡 서비스 개선',
    improvementDescription:
      '사용자 경험 향상을 위해 지속적으로 게임을 업데이트하고 있습니다. 버그 신고나 기능 제안이 있으시면 언제든 연락해주시기 바랍니다.',

    // 푸터
    footer: '© 2024 Mini Arcade - Built with ❤️',

    // 언어 전환
    languageSwitch: '언어 변경',
    korean: '한국어',
    english: 'English',

    // 광고 미리보기
    topBannerAd: '상단 배너 광고 영역 (728x90)',
    leftSidebarAd: '좌측 사이드바 광고',
    rightSidebarAd: '우측 사이드바 광고',
    bottomBannerAd: '하단 배너 광고 영역 (728x90)',
    adApprovalText: 'AdSense 승인 후 광고 표시',

    // 갤러그 게임 UI
    score: '점수',
    stage: '스테이지',
    lives: '생명',
    items: '아이템',
    missile: '미사일',
    tier: '티어',
    gameStart: '게임 시작',
    selectDifficulty: '난이도 선택',
    easy: '쉬움',
    normal: '보통',
    hard: '어려움',
    gameOver: '게임 오버',
    restart: '다시 시작',
    backToMenu: '메뉴로 돌아가기',
  },

  en: {
    // 메인 메뉴
    mainTitle: '🕹️ MINI ARCADE',
    mainSubtitle: 'Enjoy Classic Games!',

    // 게임 카드
    galagaTitle: 'Galaga Shooter',
    galagaDescription: 'Classic space shooting game',
    tetrisTitle: 'Tetris',
    tetrisDescription: 'Stack falling blocks to complete lines',
    snakeTitle: 'Snake',
    snakeDescription: 'Control the snake to eat food and grow',
    pongTitle: 'Pong',
    pongDescription: 'Experience the first arcade game ever',
    playButton: '🎮 Play',
    comingSoon: '🔜 Coming Soon',

    // 사이트 소개
    introTitle: '🎮 About Mini Arcade',
    introDescription:
      'Mini Arcade is an online gaming platform that brings classic arcade games to life with modern web technology. Enjoy high-quality games built with HTML5 and TypeScript directly in your browser.',
    featuresTitle: '✨ Key Features',
    freeGameFeature: 'Free Games:',
    freeGameDescription: 'All games are completely free to play',
    browserCompatFeature: 'Browser Compatible:',
    browserCompatDescription:
      'Run instantly in your web browser without any installation',
    mobileFeature: 'Mobile Support:',
    mobileDescription:
      'Optimized gaming experience on both PC and mobile devices',
    classicFeature: 'Classic Games:',
    classicDescription: 'Relive the nostalgia of 80s arcade games',

    // 게임 가이드
    guideTitle: '🕹️ Game Play Guide',
    galagaGuideTitle: 'How to Play Galaga Shooter',
    controlsTitle: '🎯 Controls',
    controlsDescription:
      'PC: Use arrow keys to move, spacebar to shoot\nMobile: Touch screen to move and auto-fire',
    tipsTitle: '⭐ Game Tips',
    tipsDescription:
      '• Study enemy movement patterns for efficient attacks\n• Collect power-up items to enhance your firepower\n• Use shield items for temporary invincibility',
    scoreSystemTitle: '🏆 Scoring System',
    scoreSystemDescription:
      '• Enemy Kill: Basic score points\n• Consecutive Hits: Combo bonus points\n• Boss Kill: Massive bonus points',

    // 최신 소식
    newsTitle: '📢 Latest News',
    galagaUpdateTitle: '🚀 Galaga Game Update (Dec 2024)',
    galagaUpdateDescription:
      '• Improved mobile touch controls for smoother gameplay\n• New power-up system and shield items added\n• Boss battle system and difficulty adjustment features implemented',
    upcomingGamesTitle: '🎮 Upcoming Games',
    upcomingGamesDescription:
      '• Tetris: Classic block puzzle game in development\n• Snake: Nostalgic snake game in preparation\n• Pong: The first arcade game coming soon',

    // FAQ
    faqTitle: '❓ Frequently Asked Questions',
    faqGameNotWorking: 'Q. The game is not working',
    faqGameNotWorkingAnswer:
      'A. Please use the latest version of web browsers (Chrome, Firefox, Safari, Edge) and make sure JavaScript is enabled. On mobile, try rotating your screen to portrait or landscape mode.',
    faqMobileSupport: 'Q. Can I play games on mobile?',
    faqMobileSupportAnswer:
      'A. Yes! All games are optimized for mobile environments. They support touch controls and automatically adjust to various screen sizes.',
    faqScoreSaving: 'Q. Are game scores saved?',
    faqScoreSavingAnswer:
      'A. Currently, scores are only maintained within the session. We plan to add a high score saving feature in future updates.',
    faqGameRequest: 'Q. Can I request new games?',
    faqGameRequestAnswer:
      "A. Absolutely! If you have any classic games you'd like to see, please feel free to share your suggestions. We develop new games based on user requests.",

    // 이용 안내
    termsTitle: '📋 Terms of Service',
    privacyTitle: '🔒 Privacy Policy',
    privacyDescription:
      'Mini Arcade does not collect user personal information and only temporarily stores minimal information required for gameplay in the browser. All data is automatically deleted when the session ends.',
    serviceTitle: '🎯 Service Usage',
    serviceDescription:
      '• All games are provided for free\n• Unauthorized commercial reproduction and distribution is prohibited\n• Copyright of in-game content belongs to Mini Arcade',
    improvementTitle: '💡 Service Improvement',
    improvementDescription:
      'We continuously update our games to improve user experience. Please feel free to contact us for bug reports or feature suggestions.',

    // 푸터
    footer: '© 2024 Mini Arcade - Built with ❤️',

    // 언어 전환
    languageSwitch: 'Language',
    korean: '한국어',
    english: 'English',

    // 광고 미리보기
    topBannerAd: 'Top Banner Ad Area (728x90)',
    leftSidebarAd: 'Left Sidebar Ad',
    rightSidebarAd: 'Right Sidebar Ad',
    bottomBannerAd: 'Bottom Banner Ad Area (728x90)',
    adApprovalText: 'Ads will show after AdSense approval',

    // 갤러그 게임 UI
    score: 'Score',
    stage: 'Stage',
    lives: 'Lives',
    items: 'Items',
    missile: 'Missile',
    tier: 'Tier',
    gameStart: 'Start Game',
    selectDifficulty: 'Select Difficulty',
    easy: 'Easy',
    normal: 'Normal',
    hard: 'Hard',
    gameOver: 'Game Over',
    restart: 'Restart',
    backToMenu: 'Back to Menu',
  },
};

export class LanguageManager {
  private static instance: LanguageManager;
  private currentLanguage: LanguageCode = 'ko';
  private listeners: Array<(language: LanguageCode) => void> = [];

  private constructor() {
    // URL에서 언어 감지
    this.detectLanguageFromURL();

    // 브라우저 언어 감지 (URL에 없을 경우)
    if (!this.currentLanguage) {
      this.detectBrowserLanguage();
    }
  }

  public static getInstance(): LanguageManager {
    if (!LanguageManager.instance) {
      LanguageManager.instance = new LanguageManager();
    }
    return LanguageManager.instance;
  }

  private detectLanguageFromURL(): void {
    const urlParams = new URLSearchParams(window.location.search);
    const langParam = urlParams.get('lang') as LanguageCode;

    if (langParam && (langParam === 'ko' || langParam === 'en')) {
      this.currentLanguage = langParam;
    }
  }

  private detectBrowserLanguage(): void {
    const browserLang = navigator.language.toLowerCase();

    if (browserLang.startsWith('ko')) {
      this.currentLanguage = 'ko';
    } else {
      this.currentLanguage = 'en';
    }
  }

  public getCurrentLanguage(): LanguageCode {
    return this.currentLanguage;
  }

  public setLanguage(language: LanguageCode): void {
    if (this.currentLanguage !== language) {
      this.currentLanguage = language;

      // URL 업데이트
      const url = new URL(window.location.href);
      url.searchParams.set('lang', language);
      window.history.pushState({}, '', url.toString());

      // 리스너들에게 알림
      this.listeners.forEach((listener) => listener(language));
    }
  }

  public addLanguageChangeListener(
    listener: (language: LanguageCode) => void
  ): void {
    this.listeners.push(listener);
  }

  public removeLanguageChangeListener(
    listener: (language: LanguageCode) => void
  ): void {
    const index = this.listeners.indexOf(listener);
    if (index > -1) {
      this.listeners.splice(index, 1);
    }
  }

  public t(key: keyof TranslationStrings): string {
    const translation = translations[this.currentLanguage];
    return translation[key] || key;
  }

  public getAvailableLanguages(): LanguageCode[] {
    return ['ko', 'en'];
  }
}

// 전역 함수로 번역 기능 제공
export const t = (key: keyof TranslationStrings): string => {
  return LanguageManager.getInstance().t(key);
};
