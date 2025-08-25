import { Router } from '../shared/Router';
import { LanguageManager, t, LanguageCode } from '../shared/Language';
import { seoManager } from '../shared/SEO';

interface GameCard {
  id: string;
  title: string;
  description: string;
  image?: string;
  backgroundColor: string;
  textColor: string;
  available: boolean;
}

export class MainMenu {
  private router!: Router;
  private container!: HTMLElement;
  private languageManager!: LanguageManager;

  private getGames(): GameCard[] {
    return [
      {
        id: 'galaga',
        title: `🚀 ${t('galagaTitle')}`,
        description: t('galagaDescription'),
        backgroundColor: '#1a1a2e',
        textColor: '#ffffff',
        available: true,
      },
      {
        id: 'tetris',
        title: `🧩 ${t('tetrisTitle')}`,
        description: t('tetrisDescription'),
        backgroundColor: '#2d4059',
        textColor: '#ffffff',
        available: false,
      },
      {
        id: 'snake',
        title: `🐍 ${t('snakeTitle')}`,
        description: t('snakeDescription'),
        backgroundColor: '#ea5455',
        textColor: '#ffffff',
        available: false,
      },
      {
        id: 'pong',
        title: `🏓 ${t('pongTitle')}`,
        description: t('pongDescription'),
        backgroundColor: '#f07b3f',
        textColor: '#ffffff',
        available: false,
      },
    ];
  }

  constructor(router: Router) {
    this.router = router;
    this.container = router.getContainer();
    this.languageManager = LanguageManager.getInstance();

    // 언어 변경 리스너 추가
    this.languageManager.addLanguageChangeListener((language: LanguageCode) => {
      // 현재 컨텐츠 영역의 스크롤 위치 저장
      const contentArea = document.getElementById('main-content-area');
      const scrollPosition = contentArea ? contentArea.scrollTop : 0;

      // SEO 메타 태그 업데이트
      const mainMenuMeta = seoManager.getMetaDataForMainMenu(language);
      seoManager.updateMetaTags(mainMenuMeta);

      this.render();

      // 렌더링 완료 후 컨텐츠 영역 스크롤 위치 복원
      setTimeout(() => {
        const newContentArea = document.getElementById('main-content-area');
        if (newContentArea) {
          newContentArea.scrollTop = scrollPosition;
        }
      }, 0);
    });
  }

  public render(): void {
    console.log('🎮 메인 메뉴 렌더링');

    // 메인 컨테이너를 광고가 포함된 그리드 레이아웃으로 생성
    this.container.innerHTML = `
      <!-- 메인 메뉴 전체 레이아웃 (광고 포함) -->
      <div id="main-menu-layout" class="main-menu-layout">
        <!-- 상단 광고 영역 -->
        <div id="main-top-ad-area" class="main-ad-area">
          <div id="main-top-banner-ad" class="main-ad-container ad-preview">
            <div class="ad-preview-content">
              <div class="ad-icon">📺</div>
              <div class="ad-text">${t('topBannerAd')}</div>
              <div class="ad-status">${t('adApprovalText')}</div>
            </div>
          </div>
        </div>

        <!-- 좌측 광고 영역 -->
        <div id="main-left-ad-area" class="main-ad-area">
          <div id="main-sidebar-ad-left" class="main-ad-container main-sidebar-ad ad-preview">
            <div class="ad-preview-content vertical">
              <div class="ad-icon">📱</div>
              <div class="ad-text">${t('leftSidebarAd')}</div>
              <div class="ad-size">(160x600)</div>
              <div class="ad-status">${t('adApprovalText')}</div>
            </div>
          </div>
        </div>

        <!-- 메인 콘텐츠 영역 -->
        <div id="main-content-area" class="main-content-area">
          <div id="main-menu" class="main-menu">
            <header class="arcade-header">
              <h1 class="arcade-title">${t('mainTitle')}</h1>
              <p class="arcade-subtitle">${t('mainSubtitle')}</p>
              
              <!-- 언어 전환 버튼 -->
              <div class="language-switcher">
                <button class="language-btn ${
                  this.languageManager.getCurrentLanguage() === 'ko'
                    ? 'active'
                    : ''
                }" data-lang="ko">
                  ${t('korean')}
                </button>
                <button class="language-btn ${
                  this.languageManager.getCurrentLanguage() === 'en'
                    ? 'active'
                    : ''
                }" data-lang="en">
                  ${t('english')}
                </button>
              </div>
            </header>
            
            <!-- 사이트 소개 섹션 (AdSense 정책 준수) -->
            <section class="content-section intro-section">
              <h2>${t('introTitle')}</h2>
              <p>${t('introDescription')}</p>
              
              <h3>${t('featuresTitle')}</h3>
              <ul>
                <li><strong>${t('freeGameFeature')}</strong> ${t(
      'freeGameDescription'
    )}</li>
                <li><strong>${t('browserCompatFeature')}</strong> ${t(
      'browserCompatDescription'
    )}</li>
                <li><strong>${t('mobileFeature')}</strong> ${t(
      'mobileDescription'
    )}</li>
                <li><strong>${t('classicFeature')}</strong> ${t(
      'classicDescription'
    )}</li>
              </ul>
            </section>

            <!-- 게임 가이드 섹션 -->
            <section class="content-section guide-section">
              <h2>${t('guideTitle')}</h2>
              
              <h3>${t('galagaGuideTitle')}</h3>
              <div class="game-guide">
                <div class="guide-item">
                  <h4>${t('controlsTitle')}</h4>
                  <p>${t('controlsDescription').replace(/\\n/g, '<br>')}</p>
                </div>
                
                <div class="guide-item">
                  <h4>${t('tipsTitle')}</h4>
                  <p>${t('tipsDescription').replace(/\\n/g, '<br>')}</p>
                </div>
                
                <div class="guide-item">
                  <h4>${t('scoreSystemTitle')}</h4>
                  <p>${t('scoreSystemDescription').replace(/\\n/g, '<br>')}</p>
                </div>
              </div>
            </section>

            <!-- 게임 선택 영역 -->
            <div class="games-grid" id="games-grid">
              ${this.renderGameCards()}
            </div>

            <!-- 최신 소식 섹션 -->
            <section class="content-section news-section">
              <h2>${t('newsTitle')}</h2>
              
              <div class="news-item">
                <h3>${t('galagaUpdateTitle')}</h3>
                <p>${t('galagaUpdateDescription').replace(/\\n/g, '<br>')}</p>
              </div>
              
              <div class="news-item">
                <h3>${t('upcomingGamesTitle')}</h3>
                <p>${t('upcomingGamesDescription').replace(/\\n/g, '<br>')}</p>
              </div>
            </section>

            <!-- FAQ 섹션 -->
            <section class="content-section faq-section">
              <h2>${t('faqTitle')}</h2>
              
              <div class="faq-item">
                <h3>${t('faqGameNotWorking')}</h3>
                <p>${t('faqGameNotWorkingAnswer')}</p>
              </div>
              
              <div class="faq-item">
                <h3>${t('faqMobileSupport')}</h3>
                <p>${t('faqMobileSupportAnswer')}</p>
              </div>
              
              <div class="faq-item">
                <h3>${t('faqScoreSaving')}</h3>
                <p>${t('faqScoreSavingAnswer')}</p>
              </div>
              
              <div class="faq-item">
                <h3>${t('faqGameRequest')}</h3>
                <p>${t('faqGameRequestAnswer')}</p>
              </div>
            </section>

            <!-- 이용 안내 섹션 -->
            <section class="content-section terms-section">
              <h2>${t('termsTitle')}</h2>
              
              <div class="terms-item">
                <h3>${t('privacyTitle')}</h3>
                <p>${t('privacyDescription')}</p>
              </div>
              
              <div class="terms-item">
                <h3>${t('serviceTitle')}</h3>
                <p>${t('serviceDescription').replace(/\\n/g, '<br>')}</p>
              </div>
              
              <div class="terms-item">
                <h3>${t('improvementTitle')}</h3>
                <p>${t('improvementDescription')}</p>
              </div>
            </section>
            
            <footer class="arcade-footer">
              <p>${t('footer')}</p>
            </footer>
          </div>
        </div>

        <!-- 우측 광고 영역 -->
        <div id="main-right-ad-area" class="main-ad-area">
          <div id="main-sidebar-ad-right" class="main-ad-container main-sidebar-ad ad-preview">
            <div class="ad-preview-content vertical">
              <div class="ad-icon">📱</div>
              <div class="ad-text">${t('rightSidebarAd')}</div>
              <div class="ad-size">(160x600)</div>
              <div class="ad-status">${t('adApprovalText')}</div>
            </div>
          </div>
        </div>

        <!-- 하단 광고 영역 -->
        <div id="main-bottom-ad-area" class="main-ad-area">
          <div id="main-bottom-banner-ad" class="main-ad-container ad-preview">
            <div class="ad-preview-content">
              <div class="ad-icon">📺</div>
              <div class="ad-text">${t('bottomBannerAd')}</div>
              <div class="ad-status">${t('adApprovalText')}</div>
            </div>
          </div>
        </div>
      </div>
    `;

    this.setupEventListeners();
    this.applyStyles();
  }

  private renderGameCards(): string {
    return this.getGames()
      .map(
        (game) => `
      <div class="game-card ${game.available ? 'available' : 'unavailable'}" 
           data-game-id="${game.id}"
           style="background-color: ${game.backgroundColor}; color: ${
          game.textColor
        };">
        <div class="game-card-content">
          <h3 class="game-title">${game.title}</h3>
          <p class="game-description">${game.description}</p>
          <div class="game-status">
            ${
              game.available
                ? `<button class="play-btn">${t('playButton')}</button>`
                : `<span class="coming-soon">${t('comingSoon')}</span>`
            }
          </div>
        </div>
        ${!game.available ? '<div class="overlay"></div>' : ''}
      </div>
    `
      )
      .join('');
  }

  private setupEventListeners(): void {
    // 언어 전환 버튼 이벤트
    const languageButtons = this.container.querySelectorAll('.language-btn');
    languageButtons.forEach((button) => {
      button.addEventListener('click', () => {
        const lang = (button as HTMLElement).dataset.lang as LanguageCode;
        if (lang && lang !== this.languageManager.getCurrentLanguage()) {
          this.languageManager.setLanguage(lang);
        }
      });
    });

    const gameCards = this.container.querySelectorAll('.game-card.available');

    gameCards.forEach((card) => {
      card.addEventListener('click', (e) => {
        const gameId = (card as HTMLElement).dataset.gameId;
        if (gameId) {
          this.startGame(gameId);
        }
      });

      // 호버 효과를 위한 추가 이벤트
      card.addEventListener('mouseenter', () => {
        (card as HTMLElement).style.transform = 'translateY(-10px) scale(1.05)';
      });

      card.addEventListener('mouseleave', () => {
        (card as HTMLElement).style.transform = 'translateY(0) scale(1)';
      });
    });

    // 키보드 네비게이션
    document.addEventListener('keydown', this.handleKeyboard.bind(this));
  }

  private handleKeyboard(event: KeyboardEvent): void {
    // ESC로 메인 메뉴로 돌아가기 (다른 게임에서)
    if (event.key === 'Escape' && this.router.getCurrentRoute() !== 'main') {
      this.router.navigateTo('main');
    }
  }

  private startGame(gameId: string): void {
    console.log(`🎯 게임 시작: ${gameId}`);
    this.router.navigateTo(gameId);
  }

  private applyStyles(): void {
    // 동적 스타일 추가
    const styleSheet = document.createElement('style');
    styleSheet.textContent = `
      /* 메인 메뉴 광고 포함 레이아웃 */
      .main-menu-layout {
        display: grid !important;
        min-height: 100vh !important;
        height: auto !important;
        grid-template-columns: 180px 1fr 180px;
        grid-template-rows: minmax(auto, 100px) auto minmax(auto, 100px);
        grid-template-areas:
          'main-top main-top main-top'
          'main-left main-center main-right'
          'main-bottom main-bottom main-bottom';
        gap: 10px;
        padding: 10px;
        background: 
          radial-gradient(circle at 20% 20%, rgba(120, 119, 198, 0.3) 0%, transparent 50%),
          radial-gradient(circle at 80% 80%, rgba(255, 119, 198, 0.3) 0%, transparent 50%),
          radial-gradient(circle at 40% 40%, rgba(120, 219, 255, 0.2) 0%, transparent 50%),
          linear-gradient(135deg, #0f0f23 0%, #1a1a2e 40%, #16213e 100%);
        align-items: start;
        justify-items: center;
      }

      /* 광고 영역 정의 */
      .main-ad-area {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        height: 100%;
      }

      #main-top-ad-area { grid-area: main-top; }
      #main-left-ad-area { grid-area: main-left; }
      #main-content-area { grid-area: main-center; }
      #main-right-ad-area { grid-area: main-right; }
      #main-bottom-ad-area { grid-area: main-bottom; }

      /* 광고 컨테이너 */
      .main-ad-container {
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        background: rgba(0, 0, 0, 0.3);
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 8px;
        transition: all 0.3s ease;
      }

      .main-ad-container:not(.hidden) {
        background: rgba(0, 0, 0, 0.5);
        border-color: rgba(255, 255, 255, 0.2);
      }

      /* 광고 미리보기 스타일 */
      .ad-preview {
        background: linear-gradient(135deg, rgba(255, 165, 0, 0.1) 0%, rgba(255, 69, 0, 0.1) 100%) !important;
        border: 2px dashed rgba(255, 165, 0, 0.5) !important;
        position: relative;
        overflow: hidden;
      }

      .ad-preview::before {
        content: '';
        position: absolute;
        top: 0;
        left: -100%;
        width: 100%;
        height: 100%;
        background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
        animation: shimmer 2s infinite;
      }

      @keyframes shimmer {
        0% { left: -100%; }
        100% { left: 100%; }
      }

      .ad-preview-content {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        text-align: center;
        padding: 10px;
        position: relative;
        z-index: 2;
      }

      .ad-preview-content.vertical {
        height: 100%;
        justify-content: center;
      }

      .ad-icon {
        font-size: 2rem;
        margin-bottom: 8px;
        opacity: 0.7;
      }

      .ad-text {
        color: #ff6b35;
        font-weight: bold;
        font-size: 0.9rem;
        margin-bottom: 4px;
        text-shadow: 0 0 5px rgba(255, 107, 53, 0.3);
      }

      .ad-size {
        color: #ffaa00;
        font-size: 0.8rem;
        font-weight: 600;
        margin-bottom: 4px;
        opacity: 0.8;
      }

      .ad-status {
        color: rgba(255, 255, 255, 0.6);
        font-size: 0.7rem;
        font-style: italic;
        opacity: 0.7;
      }

      /* 사이드바 광고 전용 스타일 */
      .main-sidebar-ad {
        min-height: 250px;
        max-height: 600px;
      }

      .main-sidebar-ad-unit {
        width: 100%;
        height: 100%;
        min-height: 250px;
      }

      /* 숨겨진 광고 (더미 표시) */
      .main-ad-container.hidden::before {
        content: '📺 광고 영역';
        color: rgba(255, 255, 255, 0.3);
        font-size: 14px;
        font-family: 'Orbitron', monospace;
      }

      /* 메인 콘텐츠 영역 */
      .main-content-area {
        width: 100%;
        height: 100%;
        display: flex;
        align-items: flex-start;
        justify-content: center;
        overflow-y: auto;
        overflow-x: hidden;
        padding: 20px 0;
      }

      .main-menu {
        width: 100%;
        max-width: 1000px;
        padding: 20px;
        font-family: 'Orbitron', 'Arial', monospace;
        position: relative;
        overflow: visible;
        min-height: fit-content;
      }

      .main-menu::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: 
          repeating-linear-gradient(
            90deg,
            transparent,
            transparent 98px,
            rgba(255,255,255,0.02) 100px
          ),
          repeating-linear-gradient(
            0deg,
            transparent,
            transparent 98px,
            rgba(255,255,255,0.02) 100px
          );
        pointer-events: none;
        animation: gridMove 20s linear infinite;
      }

      @keyframes gridMove {
        0% { transform: translate(0, 0); }
        100% { transform: translate(100px, 100px); }
      }

      .arcade-header {
        text-align: center;
        margin-bottom: 50px;
        position: relative;
        z-index: 2;
      }

      .arcade-title {
        font-size: 4rem;
        font-weight: 900;
        margin: 0;
        background: linear-gradient(45deg, #ff6b6b, #4ecdc4, #45b7d1, #96ceb4, #feca57);
        background-size: 300% 300%;
        background-clip: text;
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        text-shadow: 0 0 30px rgba(255,255,255,0.5);
        animation: gradientShift 4s ease-in-out infinite;
        letter-spacing: 2px;
      }

      @keyframes gradientShift {
        0%, 100% { background-position: 0% 50%; }
        50% { background-position: 100% 50%; }
      }

      .arcade-subtitle {
        font-size: 1.4rem;
        margin: 20px 0;
        color: rgba(255,255,255,0.9);
        text-shadow: 0 2px 10px rgba(0,0,0,0.5);
        font-weight: 300;
        letter-spacing: 1px;
      }

      /* 언어 전환 버튼 스타일 */
      .language-switcher {
        display: flex;
        gap: 10px;
        justify-content: center;
        margin-bottom: 30px;
      }

      .language-btn {
        background: rgba(255, 255, 255, 0.1);
        border: 2px solid rgba(255, 255, 255, 0.3);
        color: rgba(255, 255, 255, 0.8);
        padding: 8px 16px;
        border-radius: 20px;
        cursor: pointer;
        transition: all 0.3s ease;
        font-size: 0.9rem;
        font-weight: 600;
        backdrop-filter: blur(10px);
      }

      .language-btn:hover {
        background: rgba(255, 255, 255, 0.2);
        border-color: rgba(255, 255, 255, 0.5);
        color: #ffffff;
        transform: translateY(-2px);
      }

      .language-btn.active {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        border-color: #667eea;
        color: #ffffff;
        box-shadow: 0 5px 15px rgba(102, 126, 234, 0.3);
      }

      .language-btn.active:hover {
        transform: translateY(-2px) scale(1.05);
        box-shadow: 0 8px 25px rgba(102, 126, 234, 0.4);
      }

      .games-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
        gap: 25px;
        max-width: 1000px;
        margin: 30px auto;
        padding: 0 20px;
        width: 100%;
        box-sizing: border-box;
      }

      .game-card {
        position: relative;
        border-radius: 20px;
        padding: 25px;
        cursor: pointer;
        transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        box-shadow: 
          0 15px 35px rgba(0,0,0,0.3),
          0 5px 15px rgba(0,0,0,0.2),
          inset 0 1px 0 rgba(255,255,255,0.1);
        border: 1px solid rgba(255,255,255,0.2);
        overflow: hidden;
        backdrop-filter: blur(10px);
        height: 180px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        text-align: center;
      }

      .game-card::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%);
        opacity: 0;
        transition: opacity 0.3s ease;
        pointer-events: none;
      }

      .game-card.available:hover {
        transform: translateY(-8px) scale(1.02);
        box-shadow: 
          0 25px 50px rgba(0,0,0,0.4),
          0 10px 25px rgba(0,0,0,0.3),
          inset 0 1px 0 rgba(255,255,255,0.2);
        border-color: rgba(255,255,255,0.4);
      }

      .game-card.available:hover::before {
        opacity: 1;
      }

      .game-card.unavailable {
        opacity: 0.6;
        cursor: not-allowed;
      }

      .game-card-content {
        position: relative;
        z-index: 2;
      }

      .game-title {
        font-size: 1.6rem;
        margin: 0 0 10px 0;
        font-weight: 800;
        text-shadow: 0 2px 10px rgba(0,0,0,0.3);
        position: relative;
        z-index: 2;
      }

      .game-description {
        font-size: 1rem;
        margin: 0 0 20px 0;
        opacity: 0.85;
        line-height: 1.4;
        position: relative;
        z-index: 2;
      }

      .game-status {
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .play-btn {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        border: none;
        color: white;
        padding: 14px 28px;
        border-radius: 30px;
        font-size: 1rem;
        font-weight: bold;
        cursor: pointer;
        transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        box-shadow: 
          0 4px 15px rgba(102, 126, 234, 0.4),
          inset 0 1px 0 rgba(255,255,255,0.2);
        text-transform: uppercase;
        letter-spacing: 1px;
        position: relative;
        overflow: hidden;
      }

      .play-btn::before {
        content: '';
        position: absolute;
        top: 0;
        left: -100%;
        width: 100%;
        height: 100%;
        background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
        transition: left 0.5s ease;
      }

      .play-btn:hover {
        transform: translateY(-2px) scale(1.05);
        box-shadow: 
          0 8px 25px rgba(102, 126, 234, 0.6),
          inset 0 1px 0 rgba(255,255,255,0.3);
      }

      .play-btn:hover::before {
        left: 100%;
      }

      .play-btn:active {
        transform: translateY(0) scale(1.02);
      }

      .coming-soon {
        background: linear-gradient(135deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.05) 100%);
        padding: 12px 20px;
        border-radius: 20px;
        font-size: 1rem;
        font-weight: 600;
        opacity: 0.8;
        border: 1px solid rgba(255,255,255,0.2);
        box-shadow: inset 0 1px 0 rgba(255,255,255,0.1);
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }

      .overlay {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0,0,0,0.3);
        z-index: 1;
      }

      .arcade-footer {
        text-align: center;
        margin-top: 60px;
        padding: 30px 20px;
        color: rgba(255,255,255,0.6);
        font-size: 0.95rem;
        border-top: 1px solid rgba(255,255,255,0.1);
        backdrop-filter: blur(10px);
        position: relative;
        z-index: 2;
      }

      .arcade-footer p {
        margin: 0;
        text-shadow: 0 1px 2px rgba(0,0,0,0.3);
      }

      /* 모바일 최적화 */
      @media (max-width: 768px) {
        /* 메인 레이아웃 모바일 조정 */
        .main-menu-layout {
          grid-template-columns: 1fr;
          grid-template-rows: minmax(auto, 80px) 1fr minmax(auto, 80px);
          grid-template-areas:
            'main-top'
            'main-center'
            'main-bottom';
          gap: 5px;
          padding: 5px;
        }

        /* 사이드바 광고 숨김 */
        #main-left-ad-area,
        #main-right-ad-area {
          display: none;
        }

        /* 모바일 광고 미리보기 조정 */
        .ad-preview-content {
          padding: 8px;
        }

        .ad-icon {
          font-size: 1.5rem;
          margin-bottom: 4px;
        }

        .ad-text {
          font-size: 0.8rem;
        }

        .ad-size {
          font-size: 0.7rem;
        }

        .ad-status {
          font-size: 0.6rem;
        }

        .main-menu {
          padding: 15px;
        }
        
        .arcade-title {
          font-size: 2.5rem;
          letter-spacing: 1px;
        }
        
        .arcade-subtitle {
          font-size: 1.1rem;
          margin: 15px 0;
        }
        
        .language-switcher {
          margin-bottom: 20px;
        }
        
        .language-btn {
          font-size: 0.8rem;
          padding: 6px 12px;
        }
        
        .arcade-header {
          margin-bottom: 30px;
        }
        
        .games-grid {
          grid-template-columns: 1fr;
          gap: 15px;
          padding: 0 5px;
        }
        
        .game-card {
          padding: 20px;
          height: 150px;
        }
        
        .game-title {
          font-size: 1.5rem;
        }
        
        .game-description {
          font-size: 1rem;
          margin-bottom: 20px;
        }
        
        .play-btn {
          padding: 12px 24px;
          font-size: 0.9rem;
        }
        
        .arcade-footer {
          margin-top: 40px;
          padding: 20px;
          font-size: 0.85rem;
        }
      }

      @media (max-width: 480px) {
        /* 초소형 모바일 레이아웃 */
        .main-menu-layout {
          grid-template-rows: minmax(auto, 60px) 1fr minmax(auto, 60px);
          gap: 3px;
          padding: 3px;
        }

        .arcade-title {
          font-size: 2rem;
        }
        
        .games-grid {
          gap: 12px;
        }
        
        .game-card {
          padding: 18px;
          height: 130px;
        }
      }

      /* ===============================
         새로운 콘텐츠 섹션 스타일
         =============================== */
      
      .content-section {
        background: rgba(0, 0, 0, 0.3);
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 15px;
        padding: 30px;
        margin: 30px 0;
        backdrop-filter: blur(10px);
        position: relative;
        overflow: hidden;
      }

      .content-section::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%);
        pointer-events: none;
      }

      .content-section h2 {
        color: #00ff88;
        font-size: 1.8rem;
        font-weight: bold;
        margin-bottom: 20px;
        text-shadow: 0 0 10px rgba(0, 255, 136, 0.3);
        position: relative;
        z-index: 2;
      }

      .content-section h3 {
        color: #66ccff;
        font-size: 1.4rem;
        font-weight: 600;
        margin: 20px 0 15px 0;
        text-shadow: 0 0 8px rgba(102, 204, 255, 0.3);
        position: relative;
        z-index: 2;
      }

      .content-section h4 {
        color: #ffaa00;
        font-size: 1.2rem;
        font-weight: 600;
        margin: 15px 0 10px 0;
        text-shadow: 0 0 6px rgba(255, 170, 0, 0.3);
        position: relative;
        z-index: 2;
      }

      .content-section p {
        color: rgba(255, 255, 255, 0.9);
        font-size: 1.1rem;
        line-height: 1.6;
        margin-bottom: 15px;
        position: relative;
        z-index: 2;
      }

      .content-section ul {
        padding-left: 20px;
        position: relative;
        z-index: 2;
      }

      .content-section li {
        color: rgba(255, 255, 255, 0.9);
        font-size: 1.1rem;
        line-height: 1.6;
        margin-bottom: 10px;
        list-style-type: none;
        position: relative;
        padding-left: 20px;
      }

      .content-section li::before {
        content: '✨';
        position: absolute;
        left: 0;
        top: 0;
        color: #00ff88;
      }

      .content-section strong {
        color: #ffffff;
        font-weight: 700;
      }

      /* 게임 가이드 특별 스타일 */
      .game-guide {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: 20px;
        margin-top: 20px;
      }

      .guide-item {
        background: rgba(0, 0, 0, 0.4);
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 10px;
        padding: 20px;
        transition: all 0.3s ease;
      }

      .guide-item:hover {
        background: rgba(0, 0, 0, 0.5);
        border-color: rgba(255, 255, 255, 0.2);
        transform: translateY(-2px);
      }

      /* 뉴스 아이템 스타일 */
      .news-item {
        background: rgba(0, 0, 0, 0.4);
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 10px;
        padding: 20px;
        margin-bottom: 20px;
        transition: all 0.3s ease;
      }

      .news-item:hover {
        background: rgba(0, 0, 0, 0.5);
        border-color: rgba(255, 255, 255, 0.2);
        transform: translateY(-2px);
      }

      /* FAQ 아이템 스타일 */
      .faq-item {
        background: rgba(0, 0, 0, 0.4);
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 10px;
        padding: 20px;
        margin-bottom: 15px;
        transition: all 0.3s ease;
      }

      .faq-item:hover {
        background: rgba(0, 0, 0, 0.5);
        border-color: rgba(255, 255, 255, 0.2);
      }

      .faq-item h3 {
        color: #ffcc00;
        font-size: 1.2rem;
        margin-bottom: 10px;
        text-shadow: 0 0 6px rgba(255, 204, 0, 0.3);
      }

      /* 이용약관 아이템 스타일 */
      .terms-item {
        background: rgba(0, 0, 0, 0.4);
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 10px;
        padding: 20px;
        margin-bottom: 15px;
        transition: all 0.3s ease;
      }

      .terms-item:hover {
        background: rgba(0, 0, 0, 0.5);
        border-color: rgba(255, 255, 255, 0.2);
      }

      /* 모바일 최적화 */
      @media (max-width: 768px) {
        .content-section {
          padding: 20px;
          margin: 20px 0;
        }

        .content-section h2 {
          font-size: 1.5rem;
        }

        .content-section h3 {
          font-size: 1.2rem;
        }

        .content-section h4 {
          font-size: 1.1rem;
        }

        .content-section p,
        .content-section li {
          font-size: 1rem;
        }

        .game-guide {
          grid-template-columns: 1fr;
          gap: 15px;
        }

        .guide-item,
        .news-item,
        .faq-item,
        .terms-item {
          padding: 15px;
        }
      }

      @media (max-width: 480px) {
        .content-section {
          padding: 15px;
          margin: 15px 0;
        }

        .content-section h2 {
          font-size: 1.3rem;
        }

        .content-section h3 {
          font-size: 1.1rem;
        }

        .content-section h4 {
          font-size: 1rem;
        }

        .content-section p,
        .content-section li {
          font-size: 0.95rem;
        }

        .guide-item,
        .news-item,
        .faq-item,
        .terms-item {
          padding: 12px;
        }
      }
    `;

    document.head.appendChild(styleSheet);
  }

  public destroy(): void {
    document.removeEventListener('keydown', this.handleKeyboard.bind(this));
  }
}
