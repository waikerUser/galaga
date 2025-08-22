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

    // 메인 컨테이너 생성
    this.container.innerHTML = `
      <div id="main-menu" class="main-menu">
        <header class="arcade-header">
          <h1 class="arcade-title">🕹️ MINI ARCADE</h1>
          <p class="arcade-subtitle">클래식 게임을 즐겨보세요!</p>
        </header>
        
        <div class="games-grid" id="games-grid">
          ${this.renderGameCards()}
        </div>
        
        <footer class="arcade-footer">
          <p>&copy; 2024 Mini Arcade - Built with ❤️</p>
        </footer>
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
      .main-menu {
        min-height: 100vh;
        background: 
          radial-gradient(circle at 20% 20%, rgba(120, 119, 198, 0.3) 0%, transparent 50%),
          radial-gradient(circle at 80% 80%, rgba(255, 119, 198, 0.3) 0%, transparent 50%),
          radial-gradient(circle at 40% 40%, rgba(120, 219, 255, 0.2) 0%, transparent 50%),
          linear-gradient(135deg, #0f0f23 0%, #1a1a2e 40%, #16213e 100%);
        padding: 20px;
        font-family: 'Orbitron', 'Arial', monospace;
        position: relative;
        overflow: hidden;
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
        margin: 0 auto;
        padding: 0 20px;
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
    `;

    document.head.appendChild(styleSheet);
  }

  public destroy(): void {
    document.removeEventListener('keydown', this.handleKeyboard.bind(this));
  }
}
