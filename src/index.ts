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

    // 캔버스 크기를 명시적으로 설정
    this.canvas.width = 800;
    this.canvas.height = 600;

    // 캔버스 스타일 설정
    this.canvas.style.display = 'block';
    this.canvas.style.margin = '0 auto';

    // 픽셀 아트 스타일을 위한 이미지 렌더링 설정
    const ctx = this.canvas.getContext('2d');
    if (ctx) {
      ctx.imageSmoothingEnabled = false;
    }
  }

  private handleResize(): void {
    // 필요시 캔버스 크기 재조정 로직 추가 가능
    // 현재는 고정 크기 유지
  }

  private cleanup(): void {
    if (this.gameEngine) {
      this.gameEngine.destroy();
      this.gameEngine = null;
    }
  }
}

// 게임 인스턴스 생성 및 시작
const game = new GallagGame();

// 개발 모드에서 전역 접근 가능하도록 설정
if (process.env.NODE_ENV === 'development') {
  (window as any).game = game;
}
