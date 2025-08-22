import { KeyState } from '../types';

export class InputManager {
  private keyState: KeyState;
  private keyBindings: { [key: string]: keyof KeyState };

  // 터치 컨트롤 관련 속성
  private touchControls: {
    joystick: HTMLElement | null;
    joystickKnob: HTMLElement | null;
    shootBtn: HTMLElement | null;
    pauseBtn: HTMLElement | null;
    mobileControls: HTMLElement | null;
  };

  private touchState: {
    joystickActive: boolean;
    joystickCenter: { x: number; y: number };
    joystickRadius: number;
    currentTouch: { x: number; y: number } | null;
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
      joystick: null,
      joystickKnob: null,
      shootBtn: null,
      pauseBtn: null,
      mobileControls: null,
    };

    this.touchState = {
      joystickActive: false,
      joystickCenter: { x: 0, y: 0 },
      joystickRadius: 50,
      currentTouch: null,
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
    // DOM 요소들 찾기
    this.touchControls.mobileControls =
      document.getElementById('mobile-controls');
    this.touchControls.joystick = document.getElementById('joystick');
    this.touchControls.joystickKnob =
      this.touchControls.joystick?.querySelector(
        '.joystick-knob'
      ) as HTMLElement;
    this.touchControls.shootBtn = document.getElementById('shoot-btn');
    this.touchControls.pauseBtn = document.getElementById('pause-btn');

    // 모바일 환경에서만 터치 컨트롤 활성화
    if (this.isMobile()) {
      this.enableMobileControls();
    }

    this.setupJoystickEvents();
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
    if (this.touchControls.mobileControls) {
      this.touchControls.mobileControls.classList.remove('hidden');
      this.touchControls.mobileControls.classList.add('active');
    }
  }

  private setupJoystickEvents(): void {
    if (!this.touchControls.joystick || !this.touchControls.joystickKnob)
      return;

    const joystick = this.touchControls.joystick;
    const knob = this.touchControls.joystickKnob;

    // 조이스틱 중심점 계산
    const updateJoystickCenter = () => {
      const rect = joystick.getBoundingClientRect();
      this.touchState.joystickCenter = {
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2,
      };
      this.touchState.joystickRadius =
        Math.min(rect.width, rect.height) / 2 - 20;
    };

    updateJoystickCenter();
    window.addEventListener('resize', updateJoystickCenter);

    // 터치 시작
    const handleTouchStart = (e: TouchEvent) => {
      e.preventDefault();
      if (e.touches[0]) {
        this.touchState.joystickActive = true;
        this.handleJoystickMove(e.touches[0]);
      }
    };

    // 터치 이동
    const handleTouchMove = (e: TouchEvent) => {
      if (!this.touchState.joystickActive || !e.touches[0]) return;
      e.preventDefault();
      this.handleJoystickMove(e.touches[0]);
    };

    // 터치 종료
    const handleTouchEnd = (e: TouchEvent) => {
      e.preventDefault();
      this.touchState.joystickActive = false;
      this.touchState.currentTouch = null;

      // 조이스틱 노브를 중앙으로 복원
      knob.style.transform = 'translate(-50%, -50%)';

      // 이동 키 상태 초기화
      this.keyState.left = false;
      this.keyState.right = false;
      this.keyState.up = false;
      this.keyState.down = false;
    };

    joystick.addEventListener('touchstart', handleTouchStart, {
      passive: false,
    });
    document.addEventListener('touchmove', handleTouchMove, { passive: false });
    document.addEventListener('touchend', handleTouchEnd, { passive: false });
  }

  private handleJoystickMove(touch: Touch): void {
    if (!this.touchControls.joystickKnob) return;

    const center = this.touchState.joystickCenter;
    const radius = this.touchState.joystickRadius;

    // 터치 위치 계산
    const deltaX = touch.clientX - center.x;
    const deltaY = touch.clientY - center.y;
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

    // 조이스틱 범위 제한
    let x = deltaX;
    let y = deltaY;

    if (distance > radius) {
      x = (deltaX / distance) * radius;
      y = (deltaY / distance) * radius;
    }

    // 노브 위치 업데이트
    const knobX = (x / radius) * 20; // 최대 20px 이동
    const knobY = (y / radius) * 20;

    this.touchControls.joystickKnob.style.transform = `translate(calc(-50% + ${knobX}px), calc(-50% + ${knobY}px))`;

    // 키 상태 업데이트
    const threshold = radius * 0.3; // 30% 임계값

    this.keyState.left = x < -threshold;
    this.keyState.right = x > threshold;
    this.keyState.up = y < -threshold;
    this.keyState.down = y > threshold;

    this.touchState.currentTouch = { x: touch.clientX, y: touch.clientY };
  }

  private setupButtonEvents(): void {
    // 발사 버튼
    if (this.touchControls.shootBtn) {
      this.setupButton(this.touchControls.shootBtn, 'space');
    }

    // 일시정지 버튼
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
}
