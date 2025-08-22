import {
  GameState,
  GameConfig,
  GameStats,
  EnemyType,
  Difficulty,
  DifficultyConfig,
  PowerUpType,
} from '../../shared/types';
import { Player } from './Player';
import { Enemy } from './Enemy';
import { Bullet } from './Bullet';
import { PowerUp } from './PowerUp';
import { InputManager } from './InputManager';
import { BaseGameObject } from './BaseGameObject';
import { BulletPool } from './BulletPool';
import { AdManager } from './AdManager';

export class GameEngine {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private config: GameConfig;
  private gameState: GameState;
  private stats: GameStats;

  private player!: Player;
  private enemies: Enemy[];
  private bullets: Bullet[];
  private powerUps: PowerUp[];
  private inputManager!: InputManager;
  private currentDifficulty: Difficulty;
  private difficultyConfig: DifficultyConfig;

  private lastTime: number;
  private enemySpawnTimer: number;
  private levelTimer: number;
  private currentBoss: Enemy | null;
  private bossSpawnScore: number;

  // 우주 배경
  private stars: Array<{
    x: number;
    y: number;
    size: number;
    speed: number;
    brightness: number;
  }> = [];

  // 객체 풀링
  private bulletPool: BulletPool;

  // 광고 관리자
  private adManager: AdManager;

  // UI 엘리먼트들
  private scoreElement: HTMLElement | null;
  private livesElement: HTMLElement | null;
  private stageElement: HTMLElement | null;
  private gameOverElement: HTMLElement | null;
  private finalScoreElement: HTMLElement | null;
  private startScreenElement: HTMLElement | null;
  private difficultyScreenElement: HTMLElement | null;
  private bossUIElement: HTMLElement | null;
  private bossHealthFillElement: HTMLElement | null;
  // 파워업 UI 엘리먼트들
  private missileCountElement: HTMLElement | null;
  private missileTierElement: HTMLElement | null;
  private itemsCountElement: HTMLElement | null;
  // 성능 모니터링 UI 엘리먼트들
  private poolActiveElement: HTMLElement | null;
  private poolTotalElement: HTMLElement | null;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      throw new Error('Cannot get 2D rendering context');
    }
    this.ctx = ctx;

    this.config = {
      canvasWidth: canvas.width,
      canvasHeight: canvas.height,
      playerSpeed: 300,
      bulletSpeed: 500,
      enemySpeed: 100,
      enemySpawnRate: 2000, // 2초마다 적 생성
      maxLives: 3,
    };

    this.gameState = 'start';
    this.currentDifficulty = 'normal';
    this.difficultyConfig = this.getDifficultyConfig(this.currentDifficulty);

    this.stats = {
      score: 0,
      lives: this.config.maxLives,
      level: 1,
      stage: 1,
      enemiesKilled: 0,
      bulletsShot: 0,
      accuracy: 0,
      difficulty: this.currentDifficulty,
      bossesKilled: 0,
      itemsCollected: 0,
      levelStartTime: Date.now(),
      totalPlayTime: 0,
      consecutiveHits: 0,
    };

    this.enemies = [];
    this.bullets = [];
    this.powerUps = [];
    this.lastTime = 0;
    this.enemySpawnTimer = 0;
    this.levelTimer = 0;
    this.currentBoss = null;
    this.bossSpawnScore = 15000; // 첫 번째 보스는 15000점에 등장 (더 늦게)

    // UI 엘리먼트 참조 획득
    this.scoreElement = document.getElementById('score');
    this.livesElement = document.getElementById('lives');
    this.stageElement = document.getElementById('stage');
    this.gameOverElement = document.getElementById('game-over');
    this.finalScoreElement = document.getElementById('final-score');
    this.startScreenElement = document.getElementById('start-screen');
    this.difficultyScreenElement = document.getElementById('difficulty-screen');
    this.bossUIElement = document.getElementById('boss-ui');
    this.bossHealthFillElement = document.getElementById('boss-health-fill');
    // 파워업 UI 엘리먼트 참조
    this.missileCountElement = document.getElementById('missile-count');
    this.missileTierElement = document.getElementById('missile-tier');
    this.itemsCountElement = document.getElementById('items-count');
    // 성능 모니터링 UI 엘리먼트 참조
    this.poolActiveElement = document.getElementById('pool-active');
    this.poolTotalElement = document.getElementById('pool-total');

    this.setupPlayer();
    this.setupInputManager();
    this.setupUI();
    this.initializeStars();

    // 객체 풀 초기화
    this.bulletPool = new BulletPool(150); // 총알 풀 크기 150개

    // 광고 관리자 초기화
    this.adManager = new AdManager();

    // 초기 상태에서는 모든 광고 숨김 (시작 화면에서 관리)
    this.adManager.hideTopBannerAd();
    this.adManager.hideBottomBannerAd();
    this.adManager.hideSidebarAds();

    // 모바일 광고 최적화 적용
    this.adManager.optimizeAdsForMobile();
  }

  private getDifficultyConfig(difficulty: Difficulty): DifficultyConfig {
    switch (difficulty) {
      case 'easy':
        return {
          enemySpeed: 70,
          enemySpawnRate: 1500, // 2.5초 → 1.5초
          enemyHealth: 0.8,
          powerUpDropRate: 0.25,
          scoreMultiplier: 0.8,
        };
      case 'normal':
        return {
          enemySpeed: 100,
          enemySpawnRate: 1200, // 2초 → 1.2초
          enemyHealth: 1,
          powerUpDropRate: 0.15,
          scoreMultiplier: 1,
        };
      case 'hard':
        return {
          enemySpeed: 140,
          enemySpawnRate: 800, // 1.5초 → 0.8초
          enemyHealth: 1.2,
          powerUpDropRate: 0.1,
          scoreMultiplier: 1.5,
        };
    }
  }

  private setupPlayer(): void {
    const startX = this.config.canvasWidth / 2 - 20;
    const startY = this.config.canvasHeight - 80;
    this.player = new Player(
      { x: startX, y: startY },
      this.config.canvasWidth,
      this.config.canvasHeight,
      this.config.playerSpeed
    );
  }

  private setupInputManager(): void {
    this.inputManager = new InputManager();
  }

  private setupUI(): void {
    // 시작 버튼 이벤트 - 난이도 선택 화면으로 이동 (모바일 터치 지원 추가)
    const startBtn = document.getElementById('start-btn');
    if (startBtn) {
      startBtn.addEventListener('click', () => this.showDifficultyScreen());
      startBtn.addEventListener('touchend', (e) => {
        e.preventDefault();
        this.showDifficultyScreen();
      });

      console.log('🎮 게임 시작 버튼 이벤트 리스너 등록 완료 (클릭 + 터치)');
    } else {
      console.warn('⚠️ 게임 시작 버튼을 찾을 수 없습니다!');
    }

    // 난이도 선택 버튼들
    const easyBtn = document.getElementById('easy-btn');
    const normalBtn = document.getElementById('normal-btn');
    const hardBtn = document.getElementById('hard-btn');
    const backBtn = document.getElementById('back-btn');

    if (easyBtn) {
      easyBtn.addEventListener('click', () => this.selectDifficulty('easy'));
      easyBtn.addEventListener('touchend', (e) => {
        e.preventDefault();
        this.selectDifficulty('easy');
      });
    }
    if (normalBtn) {
      normalBtn.addEventListener('click', () =>
        this.selectDifficulty('normal')
      );
      normalBtn.addEventListener('touchend', (e) => {
        e.preventDefault();
        this.selectDifficulty('normal');
      });
    }
    if (hardBtn) {
      hardBtn.addEventListener('click', () => this.selectDifficulty('hard'));
      hardBtn.addEventListener('touchend', (e) => {
        e.preventDefault();
        this.selectDifficulty('hard');
      });
    }
    if (backBtn) {
      backBtn.addEventListener('click', () => this.showStartScreen());
      backBtn.addEventListener('touchend', (e) => {
        e.preventDefault();
        this.showStartScreen();
      });
    }

    // 재시작 버튼 이벤트
    const restartBtn = document.getElementById('restart-btn');
    if (restartBtn) {
      restartBtn.addEventListener('click', () => this.showDifficultyScreen());
      restartBtn.addEventListener('touchend', (e) => {
        e.preventDefault();
        this.showDifficultyScreen();
      });
    }

    console.log('🎮 모든 게임 버튼에 터치 이벤트 추가 완료');
  }

  public startGame(): void {
    this.gameState = 'playing';
    this.hideDifficultyScreen();
    this.resetGame();

    // 게임 시작 시 광고 설정
    this.adManager.hideTopBannerAd();
    this.adManager.hideBottomBannerAd();
    this.adManager.showSidebarAds();
    console.log('🎮 게임 시작 - 광고 시스템 활성화');

    this.gameLoop();
  }

  private showDifficultyScreen(): void {
    this.gameState = 'difficulty';
    this.hideStartScreen();
    this.hideGameOverScreen();
    if (this.difficultyScreenElement) {
      this.difficultyScreenElement.classList.remove('hidden');
    }
  }

  private showStartScreen(): void {
    this.gameState = 'start';
    this.hideDifficultyScreen();

    // 시작 화면에서 상하단 배너 광고 표시
    this.adManager.showTopBannerAd();
    this.adManager.showBottomBannerAd();
    this.adManager.hideSidebarAds();

    if (this.startScreenElement) {
      this.startScreenElement.classList.remove('hidden');
    }
  }

  private selectDifficulty(difficulty: Difficulty): void {
    this.currentDifficulty = difficulty;
    this.difficultyConfig = this.getDifficultyConfig(difficulty);
    this.stats.difficulty = difficulty;
    this.startGame();
  }

  private restartGame(): void {
    this.hideGameOverScreen();
    this.resetGame();
    this.gameState = 'playing';
  }

  private resetGame(): void {
    this.stats = {
      score: 0,
      lives: this.config.maxLives,
      level: 1,
      stage: 1,
      enemiesKilled: 0,
      bulletsShot: 0,
      accuracy: 0,
      difficulty: this.currentDifficulty,
      bossesKilled: 0,
      itemsCollected: 0,
      levelStartTime: Date.now(),
      totalPlayTime: 0,
      consecutiveHits: 0,
    };

    this.enemies = [];
    this.bullets = [];
    this.powerUps = [];
    this.currentBoss = null;
    this.bossSpawnScore = 15000;

    // 초기 적 편대 생성
    this.spawnInitialWave();

    // 일반 적 생성 타이머 초기화 (편대가 모두 등장한 후 추가 적 생성 시작)
    this.enemySpawnTimer = 0;
    this.levelTimer = 0;

    this.setupPlayer();
    this.updateUI();
  }

  private updateGameStats(deltaTime: number): void {
    // 총 플레이 시간 업데이트
    this.stats.totalPlayTime += deltaTime;

    // 정확도 계산
    if (this.stats.bulletsShot > 0) {
      this.stats.accuracy =
        (this.stats.enemiesKilled / this.stats.bulletsShot) * 100;
    }

    // 레벨업 체크 (점수 기반)
    this.checkLevelUp();
  }

  private checkLevelUp(): void {
    const scoreThresholds = [
      0, 1000, 3000, 6000, 10000, 15000, 22000, 30000, 40000, 52000,
    ];
    const nextLevelThreshold =
      scoreThresholds[this.stats.level] || this.stats.level * 15000;

    if (
      this.stats.score >= nextLevelThreshold &&
      this.gameState === 'playing'
    ) {
      this.stats.level++;
      this.stats.levelStartTime = Date.now();
      this.showLevelUpMessage();

      // 보상형 광고 제거됨 - 레벨업 시 추가 혜택 없음
    }
  }

  private showLevelUpMessage(): void {
    const notificationElement = document.getElementById('level-notification');
    const notificationText = document.getElementById('level-notification-text');

    if (notificationElement && notificationText) {
      // 알림 텍스트 설정
      notificationText.textContent = `🎉 레벨 ${this.stats.level}! 🎉`;

      // 기존 애니메이션 클래스 제거 후 다시 추가 (재시작을 위해)
      notificationElement.style.animation = 'none';
      notificationElement.classList.remove('hidden');

      // 한 프레임 후 애니메이션 재시작
      requestAnimationFrame(() => {
        notificationElement.style.animation =
          'levelNotificationSlide 3s ease-in-out forwards';
      });

      // 3초 후 숨기기 (애니메이션 완료 후)
      setTimeout(() => {
        notificationElement.classList.add('hidden');
      }, 3000);
    }

    console.log(`🎉 레벨 업! 새로운 레벨: ${this.stats.level}`);
  }

  private showRewardAdOffer(): void {
    // 보상형 광고 비활성화됨 - 사용자 요청으로 제거
    console.log('🎁 보상형 광고 비활성화됨 - 메서드 호출 무시');
    return;
  }

  private spawnInitialWave(): void {
    const rows = 2;
    const cols = 8;
    const spacingX = 60;
    const spacingY = 40; // 간격을 줄여서 더 조밀하게
    const offsetX = (this.config.canvasWidth - (cols - 1) * spacingX) / 2;

    console.log(`🚀 편대 생성 시작: ${rows}x${cols} = ${rows * cols}개의 적`);

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        // 편대 목표 위치를 화면 상단으로 이동 (y: 30부터 시작)
        const targetPosition = {
          x: offsetX + col * spacingX,
          y: 30 + row * spacingY, // 60 → 30으로 변경하여 더 위쪽에서 편대 형성
        };

        // 갤러그 스타일: 화면 중앙에서 편대 위치로 흩어지며 진입
        const centerX = this.config.canvasWidth / 2;
        const startPosition = {
          x: centerX + (Math.random() - 0.5) * 100, // 중앙 근처에서 랜덤하게 시작
          y: -100 - row * 20, // 높은 위치에서 시작
        };

        const enemy = new Enemy(
          startPosition,
          'basic',
          this.difficultyConfig.enemySpeed,
          this.difficultyConfig.powerUpDropRate,
          1, // stageMultiplier
          targetPosition // 목표 위치 전달
        );

        console.log(
          `🎯 적 생성 [${row},${col}]: 시작(${startPosition.x}, ${startPosition.y}) → 목표(${targetPosition.x}, ${targetPosition.y})`
        );

        this.enemies.push(enemy);
      }
    }

    console.log(`✅ 총 ${this.enemies.length}개의 적이 생성되었습니다.`);
  }

  private gameLoop = (currentTime: number = 0): void => {
    if (this.gameState !== 'playing' && this.gameState !== 'boss') return;

    const deltaTime = (currentTime - this.lastTime) / 1000;
    this.lastTime = currentTime;

    this.update(deltaTime);
    this.render();

    requestAnimationFrame(this.gameLoop);
  };

  private update(deltaTime: number): void {
    this.handleInput();
    this.updatePlayer(deltaTime);

    // 게임 통계 업데이트
    this.updateGameStats(deltaTime);

    // 우주 배경 별들 업데이트
    this.updateStars(deltaTime);

    // 보스 점수 체크 및 보스 생성
    this.checkBossSpawn();

    this.updateEnemies(deltaTime);
    this.updateBullets(deltaTime);
    this.updatePowerUps(deltaTime);

    // 보스 전투 중이 아닐 때만 일반 적 생성
    if (this.gameState !== 'boss') {
      this.spawnEnemies(deltaTime);
    }

    this.checkCollisions();
    this.updateUI();
  }

  private handleInput(): void {
    const keyState = this.inputManager.getKeyState();

    // 게임 일시정지
    if (keyState.escape) {
      if (this.gameState === 'paused') {
        this.gameState = this.currentBoss ? 'boss' : 'playing';
      } else if (this.gameState === 'playing' || this.gameState === 'boss') {
        this.gameState = 'paused';
      }
    }

    // 플레이 중이거나 보스 전투 중일 때만 입력 처리
    if (this.gameState !== 'playing' && this.gameState !== 'boss') return;

    this.player.handleInput(keyState);

    // 발사 처리
    if (keyState.space && this.player.canShoot()) {
      this.spawnPlayerBullet();
      this.player.shoot();
    }
  }

  private updatePlayer(deltaTime: number): void {
    this.player.update(deltaTime);
  }

  private updateEnemies(deltaTime: number): void {
    const beforeCount = this.enemies.length;

    this.enemies = this.enemies.filter((enemy) => {
      enemy.update(deltaTime);

      // 적이 발사할 수 있는지 확인
      let shootProbability = 0.02; // 기본 2% 확률

      // 보스는 더 높은 확률로 발사
      if (enemy.getEnemyType() === 'boss') {
        shootProbability = 0.08 + (this.stats.stage - 1) * 0.02; // 8%부터 시작해서 스테이지당 2% 증가
      }

      if (enemy.canShoot() && Math.random() < shootProbability) {
        this.spawnEnemyBullet(enemy);
        enemy.shoot();
      }

      return enemy.active;
    });

    // 적이 제거되면 로그 출력
    if (this.enemies.length < beforeCount) {
      console.log(`⚠️ 적이 제거됨: ${beforeCount} → ${this.enemies.length}`);
    }
  }

  private updateBullets(deltaTime: number): void {
    this.bullets = this.bullets.filter((bullet) => {
      bullet.update(deltaTime);

      if (!bullet.active) {
        // 비활성화된 총알을 풀로 반환
        this.bulletPool.returnBullet(bullet);
        return false;
      }

      return true;
    });
  }

  private updatePowerUps(deltaTime: number): void {
    this.powerUps = this.powerUps.filter((powerUp) => {
      powerUp.update(deltaTime);
      return powerUp.active;
    });
  }

  private spawnEnemies(deltaTime: number): void {
    this.enemySpawnTimer += deltaTime * 1000;

    if (this.enemySpawnTimer >= this.difficultyConfig.enemySpawnRate) {
      this.spawnEnemy();
      this.enemySpawnTimer = 0;

      // 레벨이 올라갈수록 더 빠르게 생성 (난이도별 기본값 고려)
      this.difficultyConfig.enemySpawnRate = Math.max(
        500,
        this.difficultyConfig.enemySpawnRate - (this.stats.level - 1) * 150
      );
    }
  }

  private spawnEnemy(): void {
    const enemyTypes: EnemyType[] = ['basic', 'fast', 'strong'];

    // 레벨에 따른 적 타입 확률 조정
    let enemyType: EnemyType;
    const rand = Math.random();

    if (this.stats.level >= 5 && rand < 0.1) {
      enemyType = 'boss';
    } else if (this.stats.level >= 3 && rand < 0.3) {
      enemyType = 'strong';
    } else if (this.stats.level >= 2 && rand < 0.4) {
      enemyType = 'fast';
    } else {
      enemyType = 'basic';
    }

    const x = Math.random() * (this.config.canvasWidth - 60);
    // 스테이지별 적 강화 (체력, 점수 증가)
    const stageMultiplier = 1 + (this.stats.stage - 1) * 0.3;

    const enemy = new Enemy(
      { x, y: -30 },
      enemyType,
      this.difficultyConfig.enemySpeed + (this.stats.level - 1) * 20,
      this.difficultyConfig.powerUpDropRate,
      stageMultiplier
    );

    this.enemies.push(enemy);
  }

  private spawnPlayerBullet(): void {
    const bulletPositions = this.player.getBulletSpawnPositions();
    const powerLevel = this.player.getCurrentPowerLevel();

    bulletPositions.forEach((pos) => {
      const bullet = this.bulletPool.getBullet(
        pos,
        'player',
        this.config.bulletSpeed,
        powerLevel,
        0
      );

      if (bullet) {
        this.bullets.push(bullet);
      }
    });

    this.stats.bulletsShot += bulletPositions.length;
  }

  private spawnEnemyBullet(enemy: Enemy): void {
    if (enemy.getEnemyType() === 'boss') {
      // 보스는 다중 패턴 발사
      const patterns = enemy.getBossMultiShotPattern(
        this.stats.stage,
        this.currentDifficulty
      );

      patterns.forEach((pattern) => {
        const bullet = this.bulletPool.getBullet(
          pattern.position,
          'enemy',
          pattern.speed,
          1, // 파워레벨 1 (적 총알)
          pattern.angle
        );

        if (bullet) {
          this.bullets.push(bullet);
        }
      });
    } else {
      // 일반 적은 기존 방식
      const bulletPos = enemy.getBulletSpawnPosition();
      const bullet = this.bulletPool.getBullet(
        bulletPos,
        'enemy',
        this.config.bulletSpeed / 2,
        1,
        0
      );

      if (bullet) {
        this.bullets.push(bullet);
      }
    }
  }

  private checkCollisions(): void {
    // 플레이어 총알 vs 적
    for (const bullet of this.bullets) {
      if (bullet.getBulletType() === 'player') {
        for (const enemy of this.enemies) {
          if (BaseGameObject.checkCollision(bullet, enemy)) {
            this.bulletPool.returnBullet(bullet);
            bullet.active = false;

            // Power Up 효과가 적용된 데미지 계산
            const baseDamage = bullet.getDamage();
            const damageMultiplier = this.player.getCurrentDamageMultiplier();
            const finalDamage = Math.floor(baseDamage * damageMultiplier);

            if (enemy.takeDamage(finalDamage)) {
              // 적 처치 시 연속 적중 횟수 증가
              this.stats.consecutiveHits++;

              // 적이 죽을 때 파워업 드롭
              const powerUpType = enemy.dropPowerUp();
              if (powerUpType) {
                this.spawnPowerUp(enemy.position, powerUpType);
              }

              enemy.active = false;

              // 연속 적중 보너스 점수 (10회마다 보너스)
              let scoreBonus = 1;
              if (
                this.stats.consecutiveHits > 0 &&
                this.stats.consecutiveHits % 10 === 0
              ) {
                scoreBonus = 1.5;
                console.log(
                  `🔥 연속 적중 보너스! x${scoreBonus} (${this.stats.consecutiveHits}회 연속)`
                );
              }

              this.stats.score += Math.floor(
                enemy.getScoreValue() *
                  this.difficultyConfig.scoreMultiplier *
                  scoreBonus
              );
              this.stats.enemiesKilled++;

              // 보스가 처치되었는지 확인
              if (enemy === this.currentBoss) {
                this.checkBossDefeated();
              }
            } else {
              // 적이 죽지 않았어도 연속 적중 증가
              this.stats.consecutiveHits++;
            }
            break;
          }
        }
      }

      // 적 총알 vs 플레이어
      else if (bullet.getBulletType() === 'enemy') {
        if (BaseGameObject.checkCollision(bullet, this.player)) {
          this.bulletPool.returnBullet(bullet);
          bullet.active = false;

          // Shield로 피격 방어 시도
          const shieldBlocked = this.player.handleShieldHit();

          if (!shieldBlocked) {
            // Shield가 방어하지 못했을 때만 생명력 감소
            this.stats.lives--;
            this.stats.consecutiveHits = 0; // 연속 적중 초기화
            console.log('💥 플레이어 피격! 연속 적중 초기화');

            if (this.stats.lives <= 0) {
              this.gameOver();
            }
          }
        }
      }
    }

    // 적 vs 플레이어 (직접 충돌)
    for (const enemy of this.enemies) {
      if (BaseGameObject.checkCollision(enemy, this.player)) {
        enemy.active = false;

        // Shield로 피격 방어 시도
        const shieldBlocked = this.player.handleShieldHit();

        if (!shieldBlocked) {
          // Shield가 방어하지 못했을 때만 생명력 감소
          this.stats.lives--;
          this.stats.consecutiveHits = 0; // 연속 적중 초기화
          console.log('💥 적과 직접 충돌! 연속 적중 초기화');

          if (this.stats.lives <= 0) {
            this.gameOver();
          }
        }
        break;
      }
    }

    // 플레이어 vs 파워업 아이템
    for (const powerUp of this.powerUps) {
      if (BaseGameObject.checkCollision(powerUp, this.player)) {
        powerUp.active = false;
        this.collectPowerUp(powerUp.getPowerUpType());
        break;
      }
    }
  }

  private checkBossSpawn(): void {
    // 보스가 이미 있거나 보스 전투 중이면 리턴
    if (this.currentBoss || this.gameState === 'boss') {
      return;
    }

    // 점수가 보스 생성 조건에 도달하면 보스 생성
    if (this.stats.score >= this.bossSpawnScore) {
      this.spawnBoss();
    }
  }

  private spawnBoss(): void {
    // 모든 일반 적 제거
    this.enemies = [];

    // 보스 생성 (화면 중앙 상단에서 시작)
    const bossX = this.config.canvasWidth / 2 - 40; // 보스 크기 80을 고려해서 중앙 정렬
    const stageMultiplier = 1 + (this.stats.stage - 1) * 0.5; // 스테이지별 강화

    this.currentBoss = new Enemy(
      { x: bossX, y: -80 },
      'boss',
      this.difficultyConfig.enemySpeed * 0.8, // 보스는 조금 느리게
      0.8, // 보스는 높은 확률로 파워업 드롭
      stageMultiplier
    );

    this.enemies.push(this.currentBoss);
    this.gameState = 'boss';
  }

  private checkBossDefeated(): void {
    if (this.currentBoss && !this.currentBoss.active) {
      // 보스 처치!
      this.stats.bossesKilled++;
      this.stats.stage++;

      // 다음 보스 등장 점수 설정 (단계적으로 증가, 더 큰 간격)
      this.bossSpawnScore = this.stats.score + 20000 + this.stats.stage * 5000;

      this.currentBoss = null;
      this.gameState = 'playing';

      // 스테이지 클리어 보너스 점수
      this.stats.score += 2000 * this.stats.stage;
    }
  }

  private spawnPowerUp(
    position: { x: number; y: number },
    powerUpType: PowerUpType
  ): void {
    const powerUp = new PowerUp(position, powerUpType);
    this.powerUps.push(powerUp);
  }

  private collectPowerUp(powerUpType: PowerUpType): void {
    // 아이템 수집 카운트 증가
    this.stats.itemsCollected++;

    switch (powerUpType) {
      case 'extraLife':
        this.stats.lives = Math.min(this.stats.lives + 1, 5); // 최대 5개 생명
        console.log('❤️ 생명력 증가!');
        break;
      case 'powerUp':
        this.player.applyPowerUp(powerUpType);
        this.showPowerUpMessage('⚡ POWER UP!', '10초간 2배 공격력');
        break;
      case 'shield':
        this.player.applyPowerUp(powerUpType);
        this.showPowerUpMessage('🛡️ SHIELD!', '15초간 3회 방어');
        break;
      case 'multiShot':
        this.player.applyPowerUp(powerUpType);
        break;
    }

    // 파워업 UI 업데이트
    this.updatePlayerStatusUI();
  }

  private showPowerUpMessage(title: string, subtitle: string): void {
    const notificationElement = document.getElementById('level-notification');
    const notificationText = document.getElementById('level-notification-text');

    if (notificationElement && notificationText) {
      // 파워업 알림 텍스트 설정 (간단하게)
      notificationText.textContent = `${subtitle}`;

      // 기존 애니메이션 중단 후 새로 시작
      notificationElement.style.animation = 'none';
      notificationElement.classList.remove('hidden');

      // 짧은 애니메이션 적용 (2초)
      requestAnimationFrame(() => {
        notificationElement.style.animation =
          'levelNotificationSlide 2s ease-in-out forwards';
      });

      // 2초 후 숨기기 (파워업은 더 짧게)
      setTimeout(() => {
        notificationElement.classList.add('hidden');
      }, 2000);
    }

    console.log(`💪 파워업: ${title} - ${subtitle}`);
  }

  private updatePlayerStatusUI(): void {
    const powerUpStatusElement = document.getElementById('power-up-status');
    const shieldStatusElement = document.getElementById('shield-status');
    const powerUpTimeElement = document.getElementById('power-up-time');
    const shieldHitsElement = document.getElementById('shield-hits');

    const powerUps = this.player.getPowerUps();
    const currentTime = Date.now();

    // Power Up 상태 표시
    if (powerUpStatusElement && powerUpTimeElement) {
      if (powerUps.powerUp.active) {
        const remainingTime = Math.ceil(
          (powerUps.powerUp.endTime - currentTime) / 1000
        );
        powerUpTimeElement.textContent = remainingTime.toString();
        powerUpStatusElement.classList.remove('hidden');
      } else {
        powerUpStatusElement.classList.add('hidden');
      }
    }

    // Shield 상태 표시
    if (shieldStatusElement && shieldHitsElement) {
      if (powerUps.shield.active && powerUps.shield.hits > 0) {
        shieldHitsElement.textContent = powerUps.shield.hits.toString();
        shieldStatusElement.classList.remove('hidden');
      } else {
        shieldStatusElement.classList.add('hidden');
      }
    }
  }

  private checkLevelProgress(deltaTime: number): void {
    this.levelTimer += deltaTime * 1000;

    // 30초마다 레벨업 또는 일정 적 처치 시 레벨업
    if (
      this.levelTimer >= 30000 ||
      this.stats.enemiesKilled >= this.stats.level * 10
    ) {
      this.stats.level++;
      this.levelTimer = 0;
    }
  }

  private gameOver(): void {
    this.gameState = 'gameOver';

    // 사이드바 광고 숨기기
    this.adManager.hideSidebarAds();

    // 인터스티셜 광고 제거 - 바로 게임오버 화면 표시
    this.showGameOverScreen();
    // 상하단 배너 광고 다시 표시
    this.adManager.showTopBannerAd();
    this.adManager.showBottomBannerAd();

    console.log('💀 게임 오버 - 바로 게임오버 화면 표시');
  }

  private render(): void {
    // 화면 클리어 - 우주 공간 느낌의 진한 검은색
    this.ctx.fillStyle = '#000000';
    this.ctx.fillRect(0, 0, this.config.canvasWidth, this.config.canvasHeight);

    // 배경 효과 (별)
    this.renderStars();

    // 게임 오브젝트들 렌더링 상태 로그 (5초마다 한 번)
    if (
      Math.floor(this.lastTime / 5000) !==
      Math.floor((this.lastTime - 16) / 5000)
    ) {
      console.log(
        `🎨 렌더링: 적 ${this.enemies.length}개, 총알 ${this.bullets.length}개, 파워업 ${this.powerUps.length}개`
      );
    }

    // 게임 객체들 렌더링
    this.player.render(this.ctx);

    for (const enemy of this.enemies) {
      enemy.render(this.ctx);
    }

    for (const bullet of this.bullets) {
      bullet.render(this.ctx);
    }

    for (const powerUp of this.powerUps) {
      powerUp.render(this.ctx);
    }

    // 일시정지 화면
    if (this.gameState === 'paused') {
      this.renderPausedOverlay();
    }
  }

  private renderStars(): void {
    this.ctx.save();

    this.stars.forEach((star) => {
      const alpha = star.brightness;
      this.ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;

      // 별 깜빡임 효과
      const flicker = Math.sin(Date.now() * 0.005 + star.x) * 0.3 + 0.7;
      this.ctx.globalAlpha = alpha * flicker;

      if (star.size < 2) {
        // 작은 별: 점
        this.ctx.fillRect(star.x, star.y, 1, 1);
      } else {
        // 큰 별: 십자가 모양
        this.ctx.fillRect(star.x, star.y, 1, star.size);
        this.ctx.fillRect(
          star.x - Math.floor(star.size / 2),
          star.y + Math.floor(star.size / 2),
          star.size,
          1
        );
      }
    });

    this.ctx.restore();
  }

  private renderPausedOverlay(): void {
    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    this.ctx.fillRect(0, 0, this.config.canvasWidth, this.config.canvasHeight);

    this.ctx.fillStyle = '#00ff00';
    this.ctx.font = '32px "Courier New"';
    this.ctx.textAlign = 'center';
    this.ctx.fillText(
      '일시정지',
      this.config.canvasWidth / 2,
      this.config.canvasHeight / 2
    );

    this.ctx.font = '16px "Courier New"';
    this.ctx.fillText(
      'ESC를 눌러 계속하기',
      this.config.canvasWidth / 2,
      this.config.canvasHeight / 2 + 40
    );
  }

  private updateUI(): void {
    if (this.scoreElement) {
      this.scoreElement.textContent = this.stats.score.toString();
    }
    if (this.livesElement) {
      this.livesElement.textContent = this.stats.lives.toString();
    }
    if (this.stageElement) {
      this.stageElement.textContent = this.stats.stage.toString();
    }

    // 파워업 UI 업데이트
    this.updatePowerUpUI();

    // 플레이어 상태 UI 업데이트
    this.updatePlayerStatusUI();

    // 보스 UI 업데이트
    this.updateBossUI();
  }

  private updatePowerUpUI(): void {
    if (this.player) {
      const shotCount = this.player.getCurrentShotCount();
      const powerTier = this.player.getCurrentPowerLevel();

      if (this.missileCountElement) {
        this.missileCountElement.textContent = shotCount.toString();
      }

      if (this.missileTierElement) {
        this.missileTierElement.textContent = `T${powerTier}`;
      }
    }

    if (this.itemsCountElement) {
      this.itemsCountElement.textContent = this.stats.itemsCollected.toString();
    }

    // 성능 모니터링 정보 업데이트
    if (this.poolActiveElement) {
      this.poolActiveElement.textContent = this.bulletPool
        .getActiveCount()
        .toString();
    }

    if (this.poolTotalElement) {
      this.poolTotalElement.textContent = this.bulletPool
        .getTotalCount()
        .toString();
    }
  }

  private updateBossUI(): void {
    if (!this.bossUIElement) return;

    if (this.gameState === 'boss' && this.currentBoss) {
      // 보스 전투 중이면 보스 UI 표시
      this.bossUIElement.classList.remove('hidden');

      // 보스 체력바 업데이트
      if (this.bossHealthFillElement && this.currentBoss.active) {
        const healthPercent = this.currentBoss.getHealthPercent();
        this.bossHealthFillElement.style.width = `${healthPercent * 100}%`;
      }
    } else {
      // 보스 전투가 아니면 보스 UI 숨기기
      this.bossUIElement.classList.add('hidden');
    }
  }

  private showGameOverScreen(): void {
    if (this.gameOverElement) {
      this.gameOverElement.classList.remove('hidden');
    }
    if (this.finalScoreElement) {
      this.finalScoreElement.textContent = this.stats.score.toString();
    }
  }

  private hideGameOverScreen(): void {
    if (this.gameOverElement) {
      this.gameOverElement.classList.add('hidden');
    }
  }

  private hideStartScreen(): void {
    if (this.startScreenElement) {
      this.startScreenElement.classList.add('hidden');
    }
  }

  private hideDifficultyScreen(): void {
    if (this.difficultyScreenElement) {
      this.difficultyScreenElement.classList.add('hidden');
    }
  }

  private initializeStars(): void {
    this.stars = [];
    const starCount = 150; // 별의 개수

    for (let i = 0; i < starCount; i++) {
      this.stars.push({
        x: Math.random() * this.config.canvasWidth,
        y: Math.random() * this.config.canvasHeight,
        size: Math.random() * 2 + 1, // 1-3 크기
        speed: Math.random() * 50 + 20, // 20-70 속도
        brightness: Math.random() * 0.5 + 0.5, // 0.5-1.0 밝기
      });
    }
  }

  private updateStars(deltaTime: number): void {
    this.stars.forEach((star) => {
      star.y += star.speed * deltaTime;

      // 화면 아래로 나가면 위쪽에서 다시 등장
      if (star.y > this.config.canvasHeight + 5) {
        star.y = -5;
        star.x = Math.random() * this.config.canvasWidth;
        star.speed = Math.random() * 50 + 20;
        star.brightness = Math.random() * 0.5 + 0.5;
      }
    });
  }

  public destroy(): void {
    this.inputManager.destroy();
  }

  public handleResize(newWidth: number, newHeight: number): void {
    // 새로운 캔버스 크기에 맞게 게임 설정 조정
    this.config.canvasWidth = newWidth;
    this.config.canvasHeight = newHeight;

    // 플레이어 위치 조정 (하단 중앙 유지)
    if (this.player) {
      this.player.position.x = newWidth / 2;
      this.player.position.y = newHeight - 50;
    }

    // 별 배경 재생성
    this.initializeStars();

    // UI 요소들 위치 조정
    this.adjustUIForScreenSize();

    console.log(`🔄 화면 크기 조정: ${newWidth}x${newHeight}`);
  }

  private adjustUIForScreenSize(): void {
    // 모바일 광고 최적화 재적용
    this.adManager.optimizeAdsForMobile();

    const isMobile = this.config.canvasWidth <= 480;

    // 모바일에서 광고 위치 최적화
    if (isMobile) {
      this.adManager.hideBottomBannerAd();
      this.adManager.showTopBannerAd();
    } else {
      this.adManager.showTopBannerAd();
      this.adManager.showBottomBannerAd();
    }

    console.log(`📱 광고 레이아웃: ${this.adManager.getCurrentAdLayout()}`);
  }
}
