import { Router } from '../shared/Router';

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
  private router: Router;
  private container: HTMLElement;

  private games: GameCard[] = [
    {
      id: 'galaga',
      title: '🚀 Galaga Shooter',
      description: '클래식 갤러그 스타일 우주 슈팅 게임',
      backgroundColor: '#1a1a2e',
      textColor: '#ffffff',
      available: true,
    },
    {
      id: 'tetris',
      title: '🧩 Tetris',
      description: '클래식 테트리스 퍼즐 게임',
      backgroundColor: '#2d4059',
      textColor: '#ffffff',
      available: false,
    },
    {
      id: 'snake',
      title: '🐍 Snake Game',
      description: '전설적인 스네이크 게임',
      backgroundColor: '#ea5455',
      textColor: '#ffffff',
      available: false,
    },
    {
      id: 'pong',
      title: '🏓 Pong',
      description: '최초의 아케이드 게임 퐁',
      backgroundColor: '#f07b3f',
      textColor: '#ffffff',
      available: false,
    },
  ];

  constructor(router: Router) {
    this.router = router;
    this.container = router.getContainer();
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
              <div class="ad-text">상단 배너 광고 영역 (728x90)</div>
              <div class="ad-status">AdSense 승인 후 광고 표시</div>
            </div>
          </div>
        </div>

        <!-- 좌측 광고 영역 -->
        <div id="main-left-ad-area" class="main-ad-area">
          <div id="main-sidebar-ad-left" class="main-ad-container main-sidebar-ad ad-preview">
            <div class="ad-preview-content vertical">
              <div class="ad-icon">📱</div>
              <div class="ad-text">좌측 사이드바 광고</div>
              <div class="ad-size">(160x600)</div>
              <div class="ad-status">승인 후 표시</div>
            </div>
          </div>
        </div>

        <!-- 메인 콘텐츠 영역 -->
        <div id="main-content-area" class="main-content-area">
          <div id="main-menu" class="main-menu">
            <header class="arcade-header">
              <h1 class="arcade-title">🕹️ MINI ARCADE</h1>
              <p class="arcade-subtitle">클래식 게임을 즐겨보세요!</p>
            </header>
            
            <!-- 사이트 소개 섹션 (AdSense 정책 준수) -->
            <section class="content-section intro-section">
              <h2>🎮 Mini Arcade 소개</h2>
              <p>Mini Arcade는 클래식 아케이드 게임을 현대적인 웹 기술로 재탄생시킨 온라인 게임 플랫폼입니다. 
              HTML5와 TypeScript를 활용하여 구현된 고품질 게임들을 브라우저에서 바로 즐길 수 있습니다.</p>
              
              <h3>✨ 주요 특징</h3>
              <ul>
                <li><strong>무료 게임:</strong> 모든 게임을 무료로 즐길 수 있습니다</li>
                <li><strong>브라우저 호환:</strong> 별도 설치 없이 웹브라우저에서 바로 실행</li>
                <li><strong>모바일 지원:</strong> PC와 모바일 모두에서 최적화된 게임 경험</li>
                <li><strong>클래식 게임:</strong> 80년대 아케이드 게임의 향수를 느낄 수 있습니다</li>
              </ul>
            </section>

            <!-- 게임 가이드 섹션 -->
            <section class="content-section guide-section">
              <h2>🕹️ 게임 플레이 가이드</h2>
              
              <h3>갤러그 슈터 게임 방법</h3>
              <div class="game-guide">
                <div class="guide-item">
                  <h4>🎯 조작 방법</h4>
                  <p><strong>PC:</strong> 방향키로 이동, 스페이스바로 발사<br>
                  <strong>모바일:</strong> 화면 터치로 이동 및 자동 발사</p>
                </div>
                
                <div class="guide-item">
                  <h4>⭐ 게임 팁</h4>
                  <p>• 적의 움직임 패턴을 파악하여 효율적으로 공격하세요<br>
                  • 파워업 아이템을 획득하여 화력을 강화할 수 있습니다<br>
                  • 방패 아이템으로 일시적인 무적 상태를 유지하세요</p>
                </div>
                
                <div class="guide-item">
                  <h4>🏆 점수 시스템</h4>
                  <p>• 적 처치: 기본 점수 획득<br>
                  • 연속 명중: 콤보 보너스 점수<br>
                  • 보스 처치: 대량 보너스 점수</p>
                </div>
              </div>
            </section>

            <!-- 게임 선택 영역 -->
            <div class="games-grid" id="games-grid">
              ${this.renderGameCards()}
            </div>

            <!-- 최신 소식 섹션 -->
            <section class="content-section news-section">
              <h2>📢 최신 소식</h2>
              
              <div class="news-item">
                <h3>🚀 갤러그 게임 업데이트 (2024.12)</h3>
                <p>• 모바일 터치 컨트롤 개선으로 더욱 부드러운 조작감 제공<br>
                • 새로운 파워업 시스템 및 방패 아이템 추가<br>
                • 보스전 시스템 및 난이도 조절 기능 구현</p>
              </div>
              
              <div class="news-item">
                <h3>🎮 추가 예정 게임</h3>
                <p>• <strong>테트리스:</strong> 클래식 블록 퍼즐 게임 개발 중<br>
                • <strong>스네이크:</strong> 추억의 뱀 게임 제작 준비 중<br>
                • <strong>퐁:</strong> 최초의 아케이드 게임 구현 예정</p>
              </div>
            </section>

            <!-- FAQ 섹션 -->
            <section class="content-section faq-section">
              <h2>❓ 자주 묻는 질문</h2>
              
              <div class="faq-item">
                <h3>Q. 게임이 실행되지 않아요</h3>
                <p>A. 최신 버전의 웹브라우저(Chrome, Firefox, Safari, Edge)를 사용하시고, 
                JavaScript가 활성화되어 있는지 확인해주세요. 모바일에서는 화면을 세로 또는 가로로 회전해보시기 바랍니다.</p>
              </div>
              
              <div class="faq-item">
                <h3>Q. 모바일에서도 게임을 할 수 있나요?</h3>
                <p>A. 네! 모든 게임은 모바일 환경에 최적화되어 있습니다. 
                터치 컨트롤을 지원하며, 다양한 화면 크기에 맞춰 자동으로 조정됩니다.</p>
              </div>
              
              <div class="faq-item">
                <h3>Q. 게임 점수가 저장되나요?</h3>
                <p>A. 현재는 세션 내에서만 점수가 유지됩니다. 
                추후 업데이트를 통해 최고 점수 저장 기능을 추가할 예정입니다.</p>
              </div>
              
              <div class="faq-item">
                <h3>Q. 새로운 게임을 요청할 수 있나요?</h3>
                <p>A. 물론입니다! 원하시는 클래식 게임이 있다면 언제든 의견을 주시기 바랍니다. 
                사용자 요청을 우선으로 새로운 게임을 개발하고 있습니다.</p>
              </div>
            </section>

            <!-- 이용 안내 섹션 -->
            <section class="content-section terms-section">
              <h2>📋 이용 안내</h2>
              
              <div class="terms-item">
                <h3>🔒 개인정보 보호</h3>
                <p>Mini Arcade는 사용자의 개인정보를 수집하지 않으며, 
                게임 플레이에 필요한 최소한의 정보만을 브라우저에 임시 저장합니다. 
                모든 데이터는 세션 종료 시 자동으로 삭제됩니다.</p>
              </div>
              
              <div class="terms-item">
                <h3>🎯 서비스 이용</h3>
                <p>• 모든 게임은 무료로 제공됩니다<br>
                • 상업적 목적의 무단 복제 및 배포를 금지합니다<br>
                • 게임 내 콘텐츠의 저작권은 Mini Arcade에 있습니다</p>
              </div>
              
              <div class="terms-item">
                <h3>💡 서비스 개선</h3>
                <p>사용자 경험 향상을 위해 지속적으로 게임을 업데이트하고 있습니다. 
                버그 신고나 기능 제안이 있으시면 언제든 연락해주시기 바랍니다.</p>
              </div>
            </section>
            
            <footer class="arcade-footer">
              <p>&copy; 2024 Mini Arcade - Built with ❤️</p>
            </footer>
          </div>
        </div>

        <!-- 우측 광고 영역 -->
        <div id="main-right-ad-area" class="main-ad-area">
          <div id="main-sidebar-ad-right" class="main-ad-container main-sidebar-ad ad-preview">
            <div class="ad-preview-content vertical">
              <div class="ad-icon">📱</div>
              <div class="ad-text">우측 사이드바 광고</div>
              <div class="ad-size">(160x600)</div>
              <div class="ad-status">승인 후 표시</div>
            </div>
          </div>
        </div>

        <!-- 하단 광고 영역 -->
        <div id="main-bottom-ad-area" class="main-ad-area">
          <div id="main-bottom-banner-ad" class="main-ad-container ad-preview">
            <div class="ad-preview-content">
              <div class="ad-icon">📺</div>
              <div class="ad-text">하단 배너 광고 영역 (728x90)</div>
              <div class="ad-status">AdSense 승인 후 광고 표시</div>
            </div>
          </div>
        </div>
      </div>
    `;

    this.setupEventListeners();
    this.applyStyles();
  }

  private renderGameCards(): string {
    return this.games
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
                ? '<button class="play-btn">🎮 플레이</button>'
                : '<span class="coming-soon">🔜 출시 예정</span>'
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
