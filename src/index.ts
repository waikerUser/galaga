import { Router } from './shared/Router';
import { MainMenu } from './main/MainMenu';
import { t } from './shared/Language';
import './styles/main.scss';

class MiniArcade {
  private router!: Router;
  private mainMenu!: MainMenu;
  private currentGameInstance: any = null;

  constructor() {
    this.init();
  }

  private async init(): Promise<void> {
    console.log('🕹️ Mini Arcade 초기화 중...');

    // 메인 컨테이너 설정
    const gameContainer = document.getElementById('game-container');
    if (!gameContainer) {
      console.error('❌ game-container를 찾을 수 없습니다.');
      return;
    }

    // 라우터 초기화
    this.router = new Router(gameContainer);
    this.mainMenu = new MainMenu(this.router);

    // 라우트 등록
    this.setupRoutes();

    // 라우터 디버깅 정보 출력
    console.log('🛣️ 등록된 라우트:', this.router.getRegisteredRoutes());
    console.log('🎯 현재 라우트:', this.router.getCurrentRoute());

    console.log('✅ Mini Arcade 초기화 완료');
  }

  private setupRoutes(): void {
    // 메인 메뉴
    this.router.addRoute('main', () => {
      this.showMainMenu();
    });

    // 갤러그 게임
    this.router.addRoute('galaga', () => {
      this.loadGalagaGame();
    });

    // 기타 게임들 (추후 구현)
    this.router.addRoute('tetris', () => {
      this.showComingSoon('Tetris');
    });

    this.router.addRoute('snake', () => {
      this.showComingSoon('Snake Game');
    });

    this.router.addRoute('pong', () => {
      this.showComingSoon('Pong');
    });

    console.log('🛣️ 라우트 설정 완료');
  }

  private showMainMenu(): void {
    console.log('🏠 메인 메뉴 표시');

    // 현재 게임 인스턴스 정리
    if (this.currentGameInstance && this.currentGameInstance.cleanup) {
      this.currentGameInstance.cleanup();
      this.currentGameInstance = null;
    }

    // body에 메인 메뉴 클래스 추가
    document.body.className = 'main-menu-active';

    this.mainMenu.render();
  }

  private async loadGalagaGame(): Promise<void> {
    console.log('🚀 갤러그 게임 로딩 중...');

    try {
      // body 클래스 변경
      document.body.className = 'game-active galaga-active';

      // 게임 컨테이너를 갤러그 게임 전용 구조로 완전히 교체
      const container = this.router.getContainer();
      container.innerHTML = `
        <!-- 전체 레이아웃 컨테이너 (기존 구조 복원) -->
        <div id="main-layout">
          <!-- 상단 광고 영역 -->
          <div id="top-ad-area" class="ad-area">
            <div id="top-banner-ad" class="ad-container hidden">
              <ins
                class="adsbygoogle"
                style="display: block"
                data-ad-client="ca-pub-XXXXXXXXXXXXXXXXX"
                data-ad-slot="1234567890"
                data-ad-format="auto"
                data-full-width-responsive="true"
              ></ins>
            </div>
          </div>

          <!-- 좌측 광고 영역 -->
          <div id="left-ad-area" class="ad-area">
            <div id="sidebar-ad-left" class="sidebar-ad hidden">
              <ins
                class="adsbygoogle"
                style="display: block; width: 160px; height: 600px"
                data-ad-client="ca-pub-XXXXXXXXXXXXXXXXX"
                data-ad-slot="0987654321"
                data-ad-format="rectangle"
              ></ins>
            </div>
          </div>

          <!-- 게임 중앙 영역 -->
          <div id="game-center-area">
            <div id="galaga-game-container">
              <!-- 게임 헤더 (메뉴로 돌아가기) -->
              <div class="game-header">
                <button id="back-to-menu" class="back-btn">← ${t('backToMenu')}</button>
                <h2 class="game-title">🚀 ${t('galagaTitle')}</h2>
              </div>

              <!-- 게임 UI (점수, 생명, 스테이지) -->
              <div id="game-ui">
                <div class="ui-left">
                  <div class="stat-item">${t('score')}: <span id="score">0</span></div>
                  <div class="stat-item">${t('stage')}: <span id="stage">1</span></div>
                  <div class="stat-item">${t('items')}: <span id="items-count">0</span></div>
                </div>
                <div class="ui-center">
                  <div class="stat-item">${t('missile')}: <span id="missile-count">1</span></div>
                  <div class="stat-item">${t('tier')}: <span id="missile-tier">T1</span></div>
                </div>
                <div class="ui-right">
                  <div class="stat-item">${t('lives')}: <span id="lives">3</span></div>
                </div>
              </div>

              <!-- 게임 캔버스 -->
              <canvas id="game-canvas" width="800" height="600"></canvas>

              <!-- 플레이어 상태 UI -->
              <div id="player-status">
                <div id="power-up-status" class="hidden">⚡ Power Up!</div>
                <div id="shield-status" class="hidden">🛡️ Shield Active</div>
                <div id="power-up-time" class="hidden">파워업: <span>0</span>초</div>
                <div id="shield-hits" class="hidden">방패: <span>0</span>회</div>
              </div>

              <!-- 성능 모니터링 (개발자용) -->
              <div id="debug-info" class="debug-info">
                <div class="debug-item">활성: <span id="pool-active">0</span></div>
                <div class="debug-item">총합: <span id="pool-total">0</span></div>
              </div>

              <!-- 보스 UI -->
              <div id="boss-ui" class="hidden">
                <div id="boss-warning">⚠️ WARNING! BOSS APPROACHING! ⚠️</div>
                <div class="boss-health-container">
                  <div class="boss-health-label">Boss Health:</div>
                  <div class="boss-health-bar">
                    <div id="boss-health-fill" class="boss-health-fill"></div>
                  </div>
                </div>
              </div>

              <!-- 시작 화면 -->
              <div id="start-screen" class="screen">
                <h1>🚀 ${t('galagaTitle')}</h1>
                <p>${t('galagaDescription')}</p>
                <button id="start-btn" class="game-btn">${t('gameStart')}</button>
              </div>

              <!-- 난이도 선택 화면 -->
              <div id="difficulty-screen" class="screen hidden">
                <h2>⚡ ${t('selectDifficulty')}</h2>
                <p>원하는 난이도를 선택하세요</p>
                <div class="difficulty-buttons">
                  <button id="easy-btn" class="difficulty-btn easy">
                    <span class="difficulty-emoji">😊</span>
                    <span class="difficulty-name">${t('easy')}</span>
                    <span class="difficulty-desc">편안한 게임</span>
                  </button>
                  <button id="normal-btn" class="difficulty-btn normal">
                    <span class="difficulty-emoji">😐</span>
                    <span class="difficulty-name">${t('normal')}</span>
                    <span class="difficulty-desc">균형잡힌 도전</span>
                  </button>
                  <button id="hard-btn" class="difficulty-btn hard">
                    <span class="difficulty-emoji">😤</span>
                    <span class="difficulty-name">${t('hard')}</span>
                    <span class="difficulty-desc">극한의 도전</span>
                  </button>
                </div>
                <button id="back-btn" class="game-btn secondary">뒤로</button>
              </div>

              <!-- 게임 오버 화면 -->
              <div id="game-over" class="screen hidden">
                <h2>💀 ${t('gameOver')}</h2>
                <div class="game-over-stats">
                  <p>최종 점수: <span id="final-score" class="highlight">0</span></p>
                  <p>도달 레벨: <span id="final-level" class="highlight">1</span></p>
                  <p>처치한 적: <span id="final-enemies" class="highlight">0</span></p>
                  <p>정확도: <span id="final-accuracy" class="highlight">0%</span></p>
                </div>
                <div class="game-over-buttons">
                  <button id="restart-btn" class="game-btn">${t('restart')}</button>
                  <button id="menu-btn" class="game-btn secondary">${t('backToMenu')}</button>
                </div>
              </div>

              <!-- 레벨 알림 -->
              <div id="level-notification" class="hidden">
                <div id="level-notification-text"></div>
              </div>

              <!-- 게임 메시지 (보스 등장 등) -->
              <div id="game-message" class="hidden">
                <div id="game-message-content"></div>
              </div>

              <!-- 보스 인트로 화면 -->
              <div id="boss-intro" class="screen hidden">
                <div id="boss-intro-content">
                  <h2 id="boss-intro-title">🛸 거대한 모선이 나타났다!</h2>
                  <p id="boss-intro-subtitle">최종 보스를 물리쳐라!</p>
                </div>
              </div>
            </div>
          </div>

          <!-- 우측 광고 영역 -->
          <div id="right-ad-area" class="ad-area">
            <div id="sidebar-ad-right" class="sidebar-ad hidden">
              <ins
                class="adsbygoogle"
                style="display: block; width: 160px; height: 600px"
                data-ad-client="ca-pub-XXXXXXXXXXXXXXXXX"
                data-ad-slot="1122334455"
                data-ad-format="rectangle"
              ></ins>
            </div>
          </div>

          <!-- 하단 광고 영역 -->
          <div id="bottom-ad-area" class="ad-area">
            <div id="bottom-banner-ad" class="ad-container hidden">
              <ins
                class="adsbygoogle"
                style="display: block"
                data-ad-client="ca-pub-XXXXXXXXXXXXXXXXX"
                data-ad-slot="6677889900"
                data-ad-format="auto"
                data-full-width-responsive="true"
              ></ins>
            </div>
          </div>
        </div>

        <!-- 인터스티셜 광고 (비활성화됨) -->
        <div id="interstitial-ad" class="ad-overlay hidden" style="display: none !important;">
          <div class="ad-overlay-content">
            <h3>잠깐! 광고를 시청해주세요</h3>
            <div class="ad-unit">
              <ins
                class="adsbygoogle"
                style="display: block; width: 320px; height: 480px"
                data-ad-client="ca-pub-XXXXXXXXXXXXXXXXX"
                data-ad-slot="9988776655"
                data-ad-format="auto"
              ></ins>
            </div>
            <button id="close-ad" class="close-ad-btn">광고 닫기 (5초)</button>
          </div>
        </div>

        <!-- 보상형 광고 오버레이 (비활성화됨) -->
        <div id="reward-ad-overlay" class="ad-overlay hidden">
          <div class="ad-overlay-content">
            <h3>🎁 보상을 받으시겠습니까?</h3>
            <p>광고를 시청하고 특별한 보상을 받아보세요!</p>
            <div class="reward-options">
              <div class="reward-option" data-reward="powerup">
                <span class="reward-icon">⚡</span>
                <span class="reward-name">Power Up</span>
              </div>
              <div class="reward-option" data-reward="life">
                <span class="reward-icon">❤️</span>
                <span class="reward-name">추가 생명</span>
              </div>
              <div class="reward-option" data-reward="shield">
                <span class="reward-icon">🛡️</span>
                <span class="reward-name">보호막</span>
              </div>
            </div>
            <div class="ad-unit">
              <ins
                class="adsbygoogle"
                style="display: block; width: 300px; height: 250px"
                data-ad-client="ca-pub-XXXXXXXXXXXXXXXXX"
                data-ad-slot="5566778899"
                data-ad-format="rectangle"
              ></ins>
            </div>
            <div class="reward-buttons">
              <button id="watch-reward-ad" class="reward-btn">광고 시청하기</button>
              <button id="skip-reward-ad" class="skip-btn">건너뛰기</button>
            </div>
          </div>
        </div>

        <!-- 모바일 터치 컨트롤 UI (전체 화면 터치 모드에서는 숨김) -->
        <div id="mobile-controls" class="mobile-controls hidden">
          <div class="control-area control-left">
            <div class="joystick-container">
              <div id="joystick" class="joystick">
                <div class="joystick-knob"></div>
              </div>
              <div class="joystick-label">이동</div>
            </div>
          </div>

          <div class="control-area control-right">
            <div class="action-buttons">
              <button id="shoot-btn" class="action-btn">발사</button>
              <button id="pause-btn" class="action-btn">일시정지</button>
            </div>
            <div class="control-options">
              <button id="fullscreen-btn" class="control-btn">전체화면</button>
              <button id="vibration-btn" class="control-btn">진동</button>
            </div>
          </div>
        </div>
      `;

      // 뒤로가기 버튼 이벤트
      const backBtn = document.getElementById('back-to-menu');
      if (backBtn) {
        backBtn.addEventListener('click', () => {
          this.router.navigateTo('main');
        });
      }

      // 메인 메뉴 버튼 이벤트 (게임 오버 화면)
      const menuBtn = document.getElementById('menu-btn');
      if (menuBtn) {
        menuBtn.addEventListener('click', () => {
          this.router.navigateTo('main');
        });
      }

      // 갤러그 게임 동적 로드
      const { default: GallagGame } = await import('./games/galaga/index');

      // 갤러그 게임 인스턴스 생성
      this.currentGameInstance = new GallagGame();
    } catch (error) {
      console.error('❌ 갤러그 게임 로드 실패:', error);
      this.showError('갤러그 게임을 로드할 수 없습니다.');
    }
  }

  private showComingSoon(gameName: string): void {
    console.log(`🔜 ${gameName} - 출시 예정`);

    document.body.className = 'coming-soon-active';

    const container = this.router.getContainer();
    container.innerHTML = `
      <div class="coming-soon">
        <div class="coming-soon-content">
          <h2>🔜 ${gameName}</h2>
          <p>이 게임은 곧 출시될 예정입니다!</p>
          <button id="back-to-menu" class="back-btn">${t('backToMenu')}</button>
        </div>
      </div>
    `;

    const backBtn = document.getElementById('back-to-menu');
    if (backBtn) {
      backBtn.addEventListener('click', () => {
        this.router.navigateTo('main');
      });
    }
  }

  private showError(message: string): void {
    const container = this.router.getContainer();
    container.innerHTML = `
      <div class="error-screen">
        <div class="error-content">
          <h2>❌ 오류 발생</h2>
          <p>${message}</p>
          <button id="back-to-menu" class="back-btn">메뉴로 돌아가기</button>
        </div>
      </div>
    `;

    const backBtn = document.getElementById('back-to-menu');
    if (backBtn) {
      backBtn.addEventListener('click', () => {
        this.router.navigateTo('main');
      });
    }
  }
}

// DOM이 로드되면 앱 시작
document.addEventListener('DOMContentLoaded', () => {
  new MiniArcade();
});

// 타입 체크를 위한 export (실제로는 사용하지 않음)
export { MiniArcade };
