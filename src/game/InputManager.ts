import { KeyState } from '../types';

export class InputManager {
  private keyState: KeyState;
  private keyBindings: { [key: string]: keyof KeyState };

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

    this.setupEventListeners();
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
  }
}
