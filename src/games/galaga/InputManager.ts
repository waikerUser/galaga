import { KeyState } from '../../shared/types';

export class InputManager {
  private keyState: KeyState;
  private keyBindings: { [key: string]: keyof KeyState };

  // 터치 컨트롤 관련 속성
  private touchControls: {
    gameContainer: HTMLElement | null;
    pauseBtn: HTMLElement | null;
    mobileControls: HTMLElement | null;
  };

  private touchState: {
    isActive: boolean;
    currentTouch: { x: number; y: number } | null;
    gameAreaBounds: DOMRect | null;
    playerPosition: { x: number; y: number };
    autoShoot: boolean;
  };

  constructor() {
    this.keyState = {
      left: false,
      right: false,
      up: false,
      down: false,
      space: false,
      enter: false,
      escape: false,
    };

    this.keyBindings = {
      ArrowLeft: 'left',
      KeyA: 'left',
      ArrowRight: 'right',
      KeyD: 'right',
      ArrowUp: 'up',
      KeyW: 'up',
      ArrowDown: 'down',
      KeyS: 'down',
      Space: 'space',
      Enter: 'enter',
      Escape: 'escape',
    };

    this.touchControls = {
      gameContainer: null,
      pauseBtn: null,
      mobileControls: null,
    };

    this.touchState = {
      isActive: false,
      currentTouch: null,
      gameAreaBounds: null,
      playerPosition: { x: 400, y: 500 }, // 기본 플레이어 위치
      autoShoot: false,
    };

    this.setupEventListeners();
    this.setupTouchControls();
  }

  private setupEventListeners(): void {
    // 키 입력 이벤트 리스너 설정
    document.addEventListener('keydown', (event) => this.handleKeyDown(event));
    document.addEventListener('keyup', (event) => this.handleKeyUp(event));

    // 포커스가 벗어나면 모든 키 상태 리셋
    window.addEventListener('blur', () => this.resetKeyState());
  }

  private handleKeyDown(event: KeyboardEvent): void {
    const mappedKey = this.keyBindings[event.code];
    if (mappedKey) {
      event.preventDefault();
      this.keyState[mappedKey] = true;
    }
  }

  private handleKeyUp(event: KeyboardEvent): void {
    const mappedKey = this.keyBindings[event.code];
    if (mappedKey) {
      event.preventDefault();
      this.keyState[mappedKey] = false;
    }
  }

  private resetKeyState(): void {
    Object.keys(this.keyState).forEach((key) => {
      (this.keyState as any)[key] = false;
    });
  }

  public getKeyState(): Readonly<KeyState> {
    return this.keyState;
  }

  public isKeyPressed(key: keyof KeyState): boolean {
    return this.keyState[key];
  }

  public destroy(): void {
    document.removeEventListener('keydown', this.handleKeyDown);
    document.removeEventListener('keyup', this.handleKeyUp);
    window.removeEventListener('blur', this.resetKeyState);
    this.destroyTouchControls();
  }

  // 터치 컨트롤 설정
  private setupTouchControls(): void {
    console.log('🎮 전체 화면 터치 컨트롤 설정 시작');

    // DOM 요소들 찾기
    this.touchControls.gameContainer = document.getElementById(
      'galaga-game-container'
    );
    this.touchControls.pauseBtn = document.getElementById('pause-btn');
    this.touchControls.mobileControls =
      document.getElementById('mobile-controls');

    // DOM 요소 확인 로그
    console.log('🎮 터치 컨트롤 DOM 요소 확인:', {
      gameContainer: !!this.touchControls.gameContainer,
      pauseBtn: !!this.touchControls.pauseBtn,
      mobileControls: !!this.touchControls.mobileControls,
    });

    // 모바일 환경 체크
    const isMobileDevice = this.isMobile();
    console.log('🎮 모바일 디바이스 체크:', isMobileDevice);

    // 모바일 환경에서만 터치 컨트롤 활성화
    if (isMobileDevice) {
      this.enableMobileControls();
      this.setupFullScreenTouchEvents();
    }

    this.setupButtonEvents();
  }

  private isMobile(): boolean {
    return (
      window.innerWidth <= 767 ||
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      )
    );
  }

  private enableMobileControls(): void {
    // 전체 화면 터치 방식에서는 기존 조이스틱 UI를 숨김
    if (this.touchControls.mobileControls) {
      this.touchControls.mobileControls.classList.add('hidden');
      console.log('🎮 조이스틱 UI 숨김 - 전체 화면 터치 모드');
    }
  }

  private setupFullScreenTouchEvents(): void {
    console.log('🎮 전체 화면 터치 이벤트 설정');

    // 게임 영역의 경계 업데이트
    const updateGameAreaBounds = () => {
      if (this.touchControls.gameContainer) {
        this.touchState.gameAreaBounds =
          this.touchControls.gameContainer.getBoundingClientRect();
        console.log(
          '🎮 게임 영역 경계 업데이트:',
          this.touchState.gameAreaBounds
        );
      }
    };

    updateGameAreaBounds();
    window.addEventListener('resize', updateGameAreaBounds);

    // 터치 시작
    const handleTouchStart = (e: TouchEvent) => {
      if (!this.touchState.gameAreaBounds) return;

      e.preventDefault();
      const touch = e.touches[0];

      // 터치 객체가 존재하는지 확인
      if (!touch) return;

      // 게임 영역 내에서만 터치 처리
      if (this.isTouchInGameArea(touch)) {
        this.touchState.isActive = true;
        this.touchState.autoShoot = true; // 터치하면 자동 발사 시작
        this.handleFullScreenTouch(touch);
        console.log('🎮 전체 화면 터치 시작 + 자동 발사 활성화');
      }
    };

    // 터치 이동
    const handleTouchMove = (e: TouchEvent) => {
      if (!this.touchState.isActive) return;

      const touch = e.touches[0];
      if (!touch) return;

      e.preventDefault();

      if (this.isTouchInGameArea(touch)) {
        this.handleFullScreenTouch(touch);
      }
    };

    // 터치 종료
    const handleTouchEnd = (e: TouchEvent) => {
      e.preventDefault();
      this.touchState.isActive = false;
      this.touchState.autoShoot = false; // 터치 종료 시 자동 발사 중지
      this.touchState.currentTouch = null;

      // 이동 키 상태 초기화
      this.keyState.left = false;
      this.keyState.right = false;
      this.keyState.up = false;
      this.keyState.down = false;
      this.keyState.space = false; // 발사도 중지

      console.log('🎮 전체 화면 터치 종료 + 자동 발사 중지');
    };

    // 게임 컨테이너에 터치 이벤트 추가
    if (this.touchControls.gameContainer) {
      this.touchControls.gameContainer.addEventListener(
        'touchstart',
        handleTouchStart,
        { passive: false }
      );
    }

    document.addEventListener('touchmove', handleTouchMove, { passive: false });
    document.addEventListener('touchend', handleTouchEnd, { passive: false });
    document.addEventListener('touchcancel', handleTouchEnd, {
      passive: false,
    });
  }

  private isTouchInGameArea(touch: Touch): boolean {
    if (!this.touchState.gameAreaBounds) return false;

    const bounds = this.touchState.gameAreaBounds;
    return (
      touch.clientX >= bounds.left &&
      touch.clientX <= bounds.right &&
      touch.clientY >= bounds.top &&
      touch.clientY <= bounds.bottom
    );
  }

  private handleFullScreenTouch(touch: Touch): void {
    if (!this.touchState.gameAreaBounds) return;

    const bounds = this.touchState.gameAreaBounds;

    // 게임 영역 내에서의 상대 위치 계산 (0~1 범위)
    const relativeX = (touch.clientX - bounds.left) / bounds.width;
    const relativeY = (touch.clientY - bounds.top) / bounds.height;

    // 현재 플레이어 위치 (게임 영역 중앙 기준)
    const centerX = 0.5;
    const centerY = 0.8; // 플레이어는 보통 화면 하단에 위치

    // 터치 위치와 플레이어 위치의 차이 계산
    const deltaX = relativeX - centerX;
    const deltaY = relativeY - centerY;

    // 이동 임계값 설정 (더 민감하게)
    const threshold = 0.05; // 5% 이상 차이가 날 때만 이동

    // 키 상태 업데이트
    this.keyState.left = deltaX < -threshold;
    this.keyState.right = deltaX > threshold;
    this.keyState.up = deltaY < -threshold;
    this.keyState.down = deltaY > threshold;

    // 자동 발사 상태 유지
    this.keyState.space = this.touchState.autoShoot;

    // 터치 위치 저장
    this.touchState.currentTouch = { x: touch.clientX, y: touch.clientY };

    // 디버깅: 터치 상태 로그 (간헐적으로만)
    if (Math.random() < 0.05) {
      // 5%만 로그 출력
      console.log('🎮 전체 화면 터치 상태:', {
        relativePos: {
          x: Math.round(relativeX * 100),
          y: Math.round(relativeY * 100),
        },
        delta: { x: Math.round(deltaX * 100), y: Math.round(deltaY * 100) },
        keys: {
          left: this.keyState.left,
          right: this.keyState.right,
          up: this.keyState.up,
          down: this.keyState.down,
          shoot: this.keyState.space,
        },
      });
    }
  }

  private setupButtonEvents(): void {
    // 전체 화면 터치 모드에서는 발사 버튼이 필요 없음 (터치 시 자동 발사)
    console.log('🎮 전체 화면 터치 모드 - 별도 발사 버튼 불필요');

    // 일시정지 버튼만 유지 (필요시)
    if (this.touchControls.pauseBtn) {
      this.setupButton(this.touchControls.pauseBtn, 'escape');
    }

    // 전체화면 버튼
    const fullscreenBtn = document.getElementById('fullscreen-btn');
    if (fullscreenBtn) {
      fullscreenBtn.addEventListener('click', this.toggleFullscreen);
    }

    // 진동 버튼 (나중에 구현)
    const vibrationBtn = document.getElementById('vibration-btn');
    if (vibrationBtn) {
      vibrationBtn.addEventListener('click', this.toggleVibration);
    }
  }

  private setupButton(button: HTMLElement, keyName: keyof KeyState): void {
    const handleStart = (e: Event) => {
      e.preventDefault();
      this.keyState[keyName] = true;
      button.classList.add('active');
      this.vibrate(50); // 짧은 진동 피드백
    };

    const handleEnd = (e: Event) => {
      e.preventDefault();
      this.keyState[keyName] = false;
      button.classList.remove('active');
    };

    button.addEventListener('touchstart', handleStart, { passive: false });
    button.addEventListener('touchend', handleEnd, { passive: false });
    button.addEventListener('touchcancel', handleEnd, { passive: false });

    // 마우스 이벤트도 지원 (테스트용)
    button.addEventListener('mousedown', handleStart);
    button.addEventListener('mouseup', handleEnd);
    button.addEventListener('mouseleave', handleEnd);
  }

  private toggleFullscreen = (): void => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((err) => {
        console.log(`전체화면 모드 실패: ${err.message}`);
      });
    } else {
      document.exitFullscreen();
    }
  };

  private toggleVibration = (): void => {
    // 진동 설정 토글 (localStorage에 저장)
    const vibrationEnabled =
      localStorage.getItem('vibrationEnabled') !== 'false';
    localStorage.setItem('vibrationEnabled', (!vibrationEnabled).toString());

    const btn = document.getElementById('vibration-btn');
    if (btn) {
      btn.style.opacity = vibrationEnabled ? '0.5' : '1';
    }

    this.vibrate(100); // 설정 변경 피드백
  };

  private vibrate(duration: number): void {
    if (
      'vibrate' in navigator &&
      localStorage.getItem('vibrationEnabled') !== 'false'
    ) {
      navigator.vibrate(duration);
    }
  }

  private destroyTouchControls(): void {
    // 터치 이벤트 리스너 정리는 자동으로 처리됨 (DOM 요소가 제거되면)
    if (this.touchControls.mobileControls) {
      this.touchControls.mobileControls.classList.add('hidden');
      this.touchControls.mobileControls.classList.remove('active');
    }
  }

  // 공개 메서드: 외부에서 터치 컨트롤 상태 확인
  public isTouchControlActive(): boolean {
    return (
      this.touchControls.mobileControls?.classList.contains('active') || false
    );
  }

  public getCurrentTouchPosition(): { x: number; y: number } | null {
    return this.touchState.currentTouch;
  }

  public isAutoShootActive(): boolean {
    return this.touchState.autoShoot;
  }

  public getTouchState(): Readonly<typeof this.touchState> {
    return this.touchState;
  }
}
