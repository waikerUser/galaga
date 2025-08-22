import './styles/main.scss';
import { GameEngine } from './game/GameEngine';

class GallagGame {
  private gameEngine: GameEngine | null = null;
  private canvas: HTMLCanvasElement | null = null;

  constructor() {
    this.init();
  }

  private init(): void {
    // DOM이 로드될 때까지 대기
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.setupGame());
    } else {
      this.setupGame();
    }
  }

  private setupGame(): void {
    this.canvas = document.getElementById('game-canvas') as HTMLCanvasElement;

    if (!this.canvas) {
      console.error('게임 캔버스를 찾을 수 없습니다!');
      return;
    }

    // main-layout 인라인 스타일 제거 및 수정
    this.fixMainLayoutStyles();

    // 캔버스 크기 설정
    this.setupCanvas();

    // 게임 엔진 초기화
    try {
      this.gameEngine = new GameEngine(this.canvas);
      console.log('갤러그 슈팅 게임이 성공적으로 초기화되었습니다!');
    } catch (error) {
      console.error('게임 엔진 초기화 실패:', error);
    }

    // 윈도우 크기 변경 이벤트 처리
    window.addEventListener('resize', () => this.handleResize());

    // 페이지 언로드 시 정리
    window.addEventListener('beforeunload', () => this.cleanup());
  }

  private setupCanvas(): void {
    if (!this.canvas) return;

    // 반응형 캔버스 크기 계산
    const { width, height } = this.calculateCanvasSize();

    // 캔버스 크기를 반응형으로 설정
    this.canvas.width = width;
    this.canvas.height = height;

    // 캔버스 스타일 설정
    this.canvas.style.display = 'block';
    this.canvas.style.margin = '0 auto';
    this.canvas.style.maxWidth = '100%';
    this.canvas.style.height = 'auto';

    // 픽셀 아트 스타일을 위한 이미지 렌더링 설정
    const ctx = this.canvas.getContext('2d');
    if (ctx) {
      ctx.imageSmoothingEnabled = false;
    }
  }

  private calculateCanvasSize(): { width: number; height: number } {
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    // 기본 캔버스 크기
    const baseWidth = 800;
    const baseHeight = 600;
    const aspectRatio = baseWidth / baseHeight;

    // 모바일 환경 감지
    const isMobile = viewportWidth <= 767;
    const isSmallMobile = viewportWidth <= 480;

    let canvasWidth: number;
    let canvasHeight: number;

    if (isMobile) {
      // 모바일: 광고 영역을 제외한 사용 가능한 공간 계산
      const availableHeight = this.calculateAvailableHeight();
      const availableWidth = viewportWidth;

      // 화면 너비의 98% 사용 (여백 최소화)
      canvasWidth = Math.floor(availableWidth * 0.98);

      // 사용 가능한 높이를 최대한 활용 (UI 공간 최소화)
      const maxHeightFromWidth = canvasWidth / aspectRatio;
      const maxHeightFromScreen = availableHeight * 0.99; // UI 공간 1%만 확보 - 더 공격적으로

      // 높이를 우선하여 화면을 꽉 채움
      canvasHeight = Math.floor(maxHeightFromScreen);

      // 높이에 맞춰 너비를 역계산하여 비율 유지 (필요한 경우)
      const idealWidthFromHeight = canvasHeight * aspectRatio;
      if (idealWidthFromHeight > canvasWidth) {
        // 너비가 부족하면 높이를 조정
        canvasHeight = Math.floor(canvasWidth / aspectRatio);
      }

      // 비율 제한을 더 관대하게 설정 (높이 우선)
      const maxAllowedHeight = canvasWidth * 1.5; // 2:3 비율까지 허용 (세로로 더 길게)
      if (canvasHeight > maxAllowedHeight) {
        canvasHeight = Math.floor(maxAllowedHeight);
        canvasWidth = Math.floor(canvasHeight * aspectRatio);
      }

      console.log(
        `📱 모바일 캔버스: ${canvasWidth}x${canvasHeight} (사용가능: ${availableWidth}x${availableHeight})`
      );
    } else {
      // 데스크톱: 기본 크기 또는 화면에 맞게 조정
      const maxWidth = Math.min(baseWidth, viewportWidth * 0.6);
      const maxHeight = Math.min(baseHeight, viewportHeight * 0.7);

      if (maxWidth / maxHeight > aspectRatio) {
        canvasWidth = maxHeight * aspectRatio;
        canvasHeight = maxHeight;
      } else {
        canvasWidth = maxWidth;
        canvasHeight = maxWidth / aspectRatio;
      }
    }

    // 최소 크기 보장
    canvasWidth = Math.max(280, canvasWidth);
    canvasHeight = Math.max(210, canvasHeight);

    return {
      width: Math.floor(canvasWidth),
      height: Math.floor(canvasHeight),
    };
  }

  private calculateAvailableHeight(): number {
    const viewportHeight = window.innerHeight;

    // 모바일에서 광고 영역을 최소화하여 게임 공간 최대한 확보
    let reservedHeight = 0;

    const topAd = document.getElementById('top-banner-ad');
    if (topAd && !topAd.classList.contains('hidden')) {
      // 광고 실제 크기 측정, 없으면 최소값 사용
      const actualHeight = topAd.offsetHeight;
      reservedHeight += actualHeight > 0 ? Math.min(actualHeight, 60) : 40; // 최대 60px로 제한
    }

    const bottomAd = document.getElementById('bottom-banner-ad');
    if (bottomAd && !bottomAd.classList.contains('hidden')) {
      const actualHeight = bottomAd.offsetHeight;
      reservedHeight += actualHeight > 0 ? Math.min(actualHeight, 60) : 40; // 최대 60px로 제한
    }

    // 게임 UI와 컨테이너 영역 대폭 최소화
    const gameUIHeight = 50; // 게임 UI 높이 대폭 축소 (80px → 50px)
    const containerPadding = 6; // 컨테이너 패딩 최소화 (10px → 6px)
    const safeMargin = 4; // 안전 여백 최소화 (10px → 4px)

    const totalReservedHeight =
      reservedHeight + gameUIHeight + containerPadding + safeMargin;
    const availableHeight = Math.max(280, viewportHeight - totalReservedHeight);

    console.log(
      `📏 모바일 최적화된 사용가능 높이: ${availableHeight}px (전체: ${viewportHeight}px, 예약: ${totalReservedHeight}px, 광고실제: ${reservedHeight}px)`
    );

    return availableHeight;
  }

  private handleResize(): void {
    // main-layout 스타일 재적용 (인라인 스타일 재설정 방지)
    this.fixMainLayoutStyles();

    // 캔버스 크기 재조정
    if (this.canvas) {
      const { width, height } = this.calculateCanvasSize();
      this.canvas.width = width;
      this.canvas.height = height;

      // 게임 엔진에 새 캔버스 크기 알림
      if (this.gameEngine) {
        this.gameEngine.handleResize(width, height);
      }
    }
  }

  private fixMainLayoutStyles(): void {
    const mainLayout = document.getElementById('main-layout');
    if (mainLayout) {
      // 인라인 스타일 제거
      mainLayout.style.minHeight = '';
      mainLayout.style.height = '';

      // CSS 클래스를 통한 스타일 적용 보장
      mainLayout.classList.add('main-layout-fixed');

      // MutationObserver로 인라인 스타일 변경 감지 및 방지
      this.observeMainLayoutChanges(mainLayout);

      console.log('📐 main-layout 인라인 스타일 문제 해결 및 감시 시작');
    }
  }

  private observeMainLayoutChanges(mainLayout: HTMLElement): void {
    // 이미 Observer가 있다면 중복 생성 방지
    if ((mainLayout as any).__styleObserver) {
      return;
    }

    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (
          mutation.type === 'attributes' &&
          mutation.attributeName === 'style'
        ) {
          const element = mutation.target as HTMLElement;

          // 잘못된 인라인 스타일이 설정되면 즉시 제거
          if (
            element.style.minHeight === '0px' ||
            element.style.minHeight === '0'
          ) {
            console.log(
              '🚨 main-layout에 잘못된 인라인 스타일 감지 - 자동 수정'
            );
            element.style.minHeight = '';
            element.style.height = '';
          }
        }
      });
    });

    observer.observe(mainLayout, {
      attributes: true,
      attributeFilter: ['style'],
    });

    // Observer 참조 저장 (중복 생성 방지용)
    (mainLayout as any).__styleObserver = observer;
  }

  private cleanup(): void {
    if (this.gameEngine) {
      this.gameEngine.destroy();
      this.gameEngine = null;
    }

    // MutationObserver 정리
    const mainLayout = document.getElementById('main-layout');
    if (mainLayout && (mainLayout as any).__styleObserver) {
      ((mainLayout as any).__styleObserver as MutationObserver).disconnect();
      delete (mainLayout as any).__styleObserver;
    }
  }
}

// 게임 인스턴스 생성 및 시작
const game = new GallagGame();

// 개발 모드에서 전역 접근 가능하도록 설정
if (process.env.NODE_ENV === 'development') {
  (window as any).game = game;
}
