export class Router {
  private currentRoute: string = '';
  private routes: Map<string, () => void> = new Map();
  private container: HTMLElement;
  private fallbackAttempted: boolean = false;

  constructor(container: HTMLElement) {
    this.container = container;

    // 브라우저 히스토리 이벤트 처리
    window.addEventListener('popstate', (event) => {
      const route = event.state?.route || 'main';
      console.log(`⬅️ 브라우저 뒤로가기: ${route}`);

      try {
        this.handleRoute(route);
      } catch (error) {
        console.error('❌ 브라우저 히스토리 처리 중 오류:', error);
        this.showDefaultScreen();
      }
    });

    // 초기 라우트 설정 (약간의 지연을 두어 라우트 등록 완료 후 실행)
    setTimeout(() => {
      const initialRoute = this.getRouteFromUrl();
      console.log(`🚀 초기 라우트: ${initialRoute}`);

      try {
        this.handleRoute(initialRoute);
      } catch (error) {
        console.error('❌ 초기 라우트 처리 중 오류:', error);
        this.showDefaultScreen();
      }
    }, 0);
  }

  public addRoute(route: string, handler: () => void): void {
    this.routes.set(route, handler);
  }

  public navigateTo(route: string, pushState: boolean = true): void {
    console.log(`🧭 라우트 이동 요청: ${route} (pushState: ${pushState})`);

    if (pushState) {
      window.history.pushState({ route }, '', `#${route}`);
    }

    try {
      this.handleRoute(route);
    } catch (error) {
      console.error('❌ 라우트 처리 중 오류 발생:', error);
      this.showDefaultScreen();
    }
  }

  public goBack(): void {
    window.history.back();
  }

  private handleRoute(route: string): void {
    this.currentRoute = route;
    const handler = this.routes.get(route);

    if (handler) {
      // 성공적으로 라우트를 찾았으므로 fallback 플래그 리셋
      this.fallbackAttempted = false;

      // 컨테이너 초기화
      this.container.innerHTML = '';
      handler();
      console.log(`🎯 라우트 변경: ${route}`);
    } else {
      // 무한 재귀 방지
      if (this.fallbackAttempted) {
        console.error(
          `❌ 라우트 '${route}' 및 fallback 모두 실패. 기본 화면을 표시합니다.`
        );
        this.showDefaultScreen();
        return;
      }

      console.warn(
        `⚠️ 라우트 '${route}'에 대한 핸들러가 없습니다. 메인으로 이동합니다.`
      );

      // fallback 시도 표시
      this.fallbackAttempted = true;

      // main 라우트가 등록되어 있는지 확인
      if (this.routes.has('main')) {
        this.navigateTo('main', false);
      } else {
        console.error(
          '❌ main 라우트도 등록되지 않았습니다. 기본 화면을 표시합니다.'
        );
        this.showDefaultScreen();
      }
    }
  }

  private getRouteFromUrl(): string {
    const hash = window.location.hash.slice(1); // # 제거
    return hash || 'main';
  }

  public getCurrentRoute(): string {
    return this.currentRoute;
  }

  public clearContainer(): void {
    this.container.innerHTML = '';
  }

  public getContainer(): HTMLElement {
    return this.container;
  }

  private showDefaultScreen(): void {
    this.fallbackAttempted = false;
    this.currentRoute = 'error';

    this.container.innerHTML = `
      <div class="router-error-screen">
        <div class="router-error-content">
          <h1>🚧 라우터 오류</h1>
          <p>요청하신 페이지를 찾을 수 없습니다.</p>
          <p>잠시 후 다시 시도해 주세요.</p>
          <button id="router-reload-btn" class="router-reload-btn">
            🔄 새로고침
          </button>
        </div>
      </div>
      
      <style>
        .router-error-screen {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 100%;
          height: 100vh;
          background: linear-gradient(135deg, #ff6b6b 0%, #ee5a52 100%);
          color: white;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
        }
        
        .router-error-content {
          text-align: center;
          padding: 40px;
          max-width: 500px;
        }
        
        .router-error-content h1 {
          font-size: 2.5rem;
          margin-bottom: 1rem;
          text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
        }
        
        .router-error-content p {
          font-size: 1.2rem;
          margin-bottom: 1rem;
          opacity: 0.9;
          line-height: 1.4;
        }
        
        .router-reload-btn {
          background: rgba(255,255,255,0.2);
          border: 2px solid rgba(255,255,255,0.3);
          color: white;
          padding: 12px 24px;
          border-radius: 25px;
          font-size: 1rem;
          font-weight: bold;
          cursor: pointer;
          transition: all 0.2s ease;
          margin-top: 1rem;
        }
        
        .router-reload-btn:hover {
          background: rgba(255,255,255,0.3);
          border-color: rgba(255,255,255,0.5);
          transform: scale(1.05);
        }
      </style>
    `;

    // 새로고침 버튼 이벤트
    const reloadBtn = document.getElementById('router-reload-btn');
    if (reloadBtn) {
      reloadBtn.addEventListener('click', () => {
        window.location.reload();
      });
    }

    console.log('🚧 기본 에러 화면 표시');
  }

  public getRegisteredRoutes(): string[] {
    return Array.from(this.routes.keys());
  }

  public isRouteRegistered(route: string): boolean {
    return this.routes.has(route);
  }
}
