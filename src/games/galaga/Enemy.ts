import { BaseGameObject } from './BaseGameObject';
import { Position, Size, EnemyType, PowerUpType, Difficulty } from '../../shared/types';

export class Enemy extends BaseGameObject {
  private enemyType: EnemyType;
  private health: number;
  private maxHealth: number;
  private scoreValue: number;
  private shootCooldown: number;
  private lastShotTime: number;
  private movePattern: 'straight' | 'zigzag' | 'circle';
  private timeAlive: number;
  private hasPowerUp: boolean;
  private powerUpType: PowerUpType | null = null;

  // 편대 비행을 위한 속성
  private targetPosition: Position | null;
  private isMovingIntoFormation: boolean;
  private baseSpeedY: number;

  constructor(
    position: Position,
    enemyType: EnemyType,
    speed: number = 100,
    powerUpDropRate: number = 0.15,
    stageMultiplier: number = 1,
    targetPosition: Position | null = null // 편대 목표 위치
  ) {
    const size = Enemy.getSizeForType(enemyType);
    // 편대 이동 시 초기 속도를 높여 빠르게 진입
    const initialSpeed = targetPosition ? 350 : speed;
    const velocity = { x: 0, y: initialSpeed };

    super(position, size, velocity);

    this.enemyType = enemyType;
    this.health = Math.floor(
      Enemy.getHealthForType(enemyType) * stageMultiplier
    );
    this.maxHealth = this.health;
    this.scoreValue = Math.floor(
      Enemy.getScoreForType(enemyType) * stageMultiplier
    );
    this.shootCooldown = Enemy.getShootCooldownForType(enemyType);
    this.lastShotTime = 0;
    this.movePattern = Enemy.getMovePatternForType(enemyType);
    this.timeAlive = 0;

    this.baseSpeedY = speed; // 기본 속도 저장
    this.targetPosition = targetPosition;
    this.isMovingIntoFormation = !!targetPosition;

    this.hasPowerUp = Math.random() < powerUpDropRate;
    if (this.hasPowerUp) {
      const powerUpTypes: PowerUpType[] = [
        'multiShot',
        'extraLife',
        'powerUp',
        'shield',
      ];
      // 레어도에 따른 가중치 설정
      const weights = [40, 25, 20, 15]; // multiShot(40%), extraLife(25%), powerUp(20%), shield(15%)

      const totalWeight = weights.reduce((sum, weight) => sum + weight, 0);
      const random = Math.random() * totalWeight;
      let currentWeight = 0;

      for (let i = 0; i < powerUpTypes.length; i++) {
        currentWeight += weights[i] || 0;
        if (random <= currentWeight) {
          this.powerUpType = powerUpTypes[i] || null;
          break;
        }
      }
    } else {
      this.powerUpType = null;
    }
  }

  public update(deltaTime: number): void {
    this.timeAlive += deltaTime;
    this.lastShotTime += deltaTime * 1000;

    // 편대 이동 로직 또는 일반 이동 로직 실행
    if (this.isMovingIntoFormation) {
      this.moveIntoFormation(deltaTime);
    } else {
      this.updateMovementPattern(deltaTime);
    }
    this.updatePosition(deltaTime);

    if (this.enemyType === 'boss') {
      this.constrainBossToScreen();
    } else {
      // 편대 이동이 아닐 때만 화면 경계 체크
      if (!this.isMovingIntoFormation) {
        // 화면 아래쪽으로 완전히 벗어난 경우만 제거 (위쪽은 허용)
        const isReallyOutOfBounds =
          this.position.x + this.size.width < -50 ||
          this.position.x > 850 ||
          this.position.y > 650; // 화면 위쪽(-y)은 체크하지 않음

        if (isReallyOutOfBounds) {
          console.log(
            `🚫 적 제거: 화면 밖 (${Math.floor(this.position.x)}, ${Math.floor(
              this.position.y
            )})`
          );
          this.active = false;
        }
      }
    }
  }

  // 목표 위치로 이동하는 편대 이동 로직
  private moveIntoFormation(deltaTime: number): void {
    if (!this.targetPosition) {
      console.log('🚨 목표 위치가 없음 - 편대 이동 중단');
      this.isMovingIntoFormation = false;
      this.velocity.y = this.baseSpeedY;
      return;
    }

    const dx = this.targetPosition.x - this.position.x;
    const dy = this.targetPosition.y - this.position.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    // 목표에 근접하면 이동 완료
    if (distance < 10) {
      console.log(
        `✅ 편대 위치 도달: (${Math.floor(this.position.x)}, ${Math.floor(
          this.position.y
        )})`
      );
      this.isMovingIntoFormation = false;
      this.position.x = this.targetPosition.x;
      this.position.y = this.targetPosition.y;
      this.velocity.y = this.baseSpeedY * 0.5; // 편대 완성 후 적당한 속도로 이동 (50% 속도)
      this.velocity.x = 0;
      this.targetPosition = null;
    } else {
      // 갤러그 스타일: 거리에 따른 동적 속도 조정
      const angle = Math.atan2(dy, dx);
      let speed = 300; // 기본 편대 이동 속도

      // 거리가 멀수록 빠르게, 가까우면 천천히 (더 자연스러운 진입)
      if (distance > 200) {
        speed = 450; // 멀리 있을 때는 빠르게
      } else if (distance > 100) {
        speed = 350; // 중간 거리
      } else {
        speed = 200; // 가까이 있을 때는 천천히
      }

      this.velocity.x = Math.cos(angle) * speed;
      this.velocity.y = Math.sin(angle) * speed;

      // 편대 이동 상태 로그 (처음과 목표 근처에서만)
      if (this.timeAlive < 0.1 || distance < 50) {
        console.log(
          `🔄 편대 이동: (${Math.floor(this.position.x)}, ${Math.floor(
            this.position.y
          )}) → (${this.targetPosition.x}, ${
            this.targetPosition.y
          }) 거리: ${Math.floor(distance)}, 속도: ${speed}`
        );
      }
    }
  }

  private constrainBossToScreen(): void {
    const canvasWidth = 800;
    const canvasHeight = 600;

    if (this.position.x < 0) {
      this.position.x = 0;
    }
    if (this.position.x + this.size.width > canvasWidth) {
      this.position.x = canvasWidth - this.size.width;
    }
    if (this.position.y < 20) {
      this.position.y = 20;
    }
    if (this.position.y > 150) {
      this.position.y = 150;
    }
  }

  private updateMovementPattern(deltaTime: number): void {
    const baseSpeed = this.velocity.y;

    switch (this.movePattern) {
      case 'straight':
        this.velocity.x = 0;
        break;
      case 'zigzag':
        this.velocity.x = Math.sin(this.timeAlive * 3) * 80;
        break;
      case 'circle':
        if (this.enemyType === 'boss') {
          this.velocity.x = Math.sin(this.timeAlive * 1.5) * 120;
          if (this.position.y > 80) {
            this.velocity.y = baseSpeed * 0.3;
          } else {
            this.velocity.y = 0;
          }
        } else {
          const radius = 60;
          const angleSpeed = 2;
          this.velocity.x = Math.cos(this.timeAlive * angleSpeed) * radius;
          this.velocity.y =
            baseSpeed + Math.sin(this.timeAlive * angleSpeed) * 30;
        }
        break;
    }
  }

  public canShoot(): boolean {
    // 편대 이동 중에는 발사하지 않음
    return (
      !this.isMovingIntoFormation && this.lastShotTime >= this.shootCooldown
    );
  }

  public shoot(): void {
    this.lastShotTime = 0;
  }

  public getBulletSpawnPosition(): Position {
    return {
      x: this.position.x + this.size.width / 2 - 2,
      y: this.position.y + this.size.height,
    };
  }

  public getBossMultiShotPattern(
    stage: number,
    difficulty: Difficulty
  ): Array<{ position: Position; angle: number; speed: number }> {
    if (this.enemyType !== 'boss') {
      return [
        {
          position: this.getBulletSpawnPosition(),
          angle: Math.PI / 2,
          speed: 300,
        },
      ];
    }

    const centerX = this.position.x + this.size.width / 2;
    const centerY = this.position.y + this.size.height;
    const patterns: Array<{
      position: Position;
      angle: number;
      speed: number;
    }> = [];

    let bulletCount = 3;
    let baseSpeed = 250;
    let spreadAngle = Math.PI / 3;

    switch (difficulty) {
      case 'easy':
        bulletCount = 3;
        baseSpeed = 200;
        break;
      case 'normal':
        bulletCount = 5;
        baseSpeed = 250;
        break;
      case 'hard':
        bulletCount = 7;
        baseSpeed = 300;
        break;
    }

    bulletCount = Math.min(bulletCount + Math.floor(stage / 2), 15);
    baseSpeed += stage * 20;

    if (stage <= 2) {
      for (let i = 0; i < bulletCount; i++) {
        const ratio = bulletCount === 1 ? 0.5 : i / (bulletCount - 1);
        const angle = Math.PI - spreadAngle / 2 + spreadAngle * ratio;

        patterns.push({
          position: { x: centerX - 2, y: centerY },
          angle: angle,
          speed: baseSpeed + Math.random() * 50 - 25,
        });
      }
    } else if (stage <= 4) {
      const circleCount = Math.min(8, bulletCount);
      for (let i = 0; i < circleCount; i++) {
        const angle = (i * 2 * Math.PI) / circleCount;
        patterns.push({
          position: { x: centerX - 2, y: centerY },
          angle: angle,
          speed: baseSpeed,
        });
      }

      if (bulletCount > circleCount) {
        const remainingBullets = bulletCount - circleCount;
        for (let i = 0; i < remainingBullets; i++) {
          patterns.push({
            position: {
              x: centerX - 2 + (Math.random() - 0.5) * 40,
              y: centerY,
            },
            angle: Math.PI / 2 + (Math.random() - 0.5) * 0.4,
            speed: baseSpeed * 1.2,
          });
        }
      }
    } else {
      for (let i = 0; i < bulletCount; i++) {
        const randomAngle = Math.random() * Math.PI * 2;
        const randomSpeed = baseSpeed + (Math.random() - 0.5) * 100;
        const offsetX = (Math.random() - 0.5) * this.size.width;

        patterns.push({
          position: { x: centerX + offsetX, y: centerY },
          angle: randomAngle,
          speed: Math.max(150, randomSpeed),
        });
      }
    }

    return patterns;
  }

  public takeDamage(damage: number): boolean {
    this.health -= damage;
    return this.health <= 0;
  }

  public getScoreValue(): number {
    return this.scoreValue;
  }

  public getEnemyType(): EnemyType {
    return this.enemyType;
  }

  public getHealth(): number {
    return this.health;
  }

  public getMaxHealth(): number {
    return this.maxHealth;
  }

  public getHealthPercent(): number {
    return this.health / this.maxHealth;
  }

  public hasPowerUpItem(): boolean {
    return this.hasPowerUp;
  }

  public getPowerUpType(): PowerUpType | null {
    return this.powerUpType;
  }

  public dropPowerUp(): PowerUpType | null {
    if (this.hasPowerUp && this.powerUpType) {
      const droppedType = this.powerUpType;
      this.hasPowerUp = false;
      this.powerUpType = null;
      return droppedType;
    }
    return null;
  }

  public render(ctx: CanvasRenderingContext2D): void {
    if (!this.active) return;

    ctx.save();
    ctx.translate(
      this.position.x + this.size.width / 2,
      this.position.y + this.size.height / 2
    );

    switch (this.enemyType) {
      case 'basic':
        this.renderBasicEnemy(ctx);
        break;
      case 'fast':
        this.renderFastEnemy(ctx);
        break;
      case 'strong':
        this.renderStrongEnemy(ctx);
        break;
      case 'boss':
        this.renderBossEnemy(ctx);
        break;
    }

    if (this.enemyType === 'boss' || this.enemyType === 'strong') {
      this.renderHealthBar(ctx);
    }

    ctx.restore();
  }

  private renderBasicEnemy(ctx: CanvasRenderingContext2D): void {
    const basicPattern = [
      [0, 0, 1, 1, 1, 0, 0],
      [0, 1, 1, 2, 1, 1, 0],
      [1, 1, 1, 1, 1, 1, 1],
      [1, 0, 1, 1, 1, 0, 1],
      [1, 0, 0, 1, 0, 0, 1],
    ];
    const baseColor = this.hasPowerUp ? '#ff44ff' : '#ff4444';
    if (this.hasPowerUp) {
      ctx.shadowColor = '#ff44ff';
      ctx.shadowBlur = 6;
    }
    const pixelSize = 2;
    const startX = -((basicPattern[0]?.length || 0) * pixelSize) / 2;
    const startY = -(basicPattern.length * pixelSize) / 2;
    basicPattern.forEach((row, y) => {
      row.forEach((pixel, x) => {
        if (pixel > 0) {
          let color = baseColor;
          if (pixel === 2) {
            color = '#ffffff';
          }
          ctx.fillStyle = color;
          ctx.fillRect(
            startX + x * pixelSize,
            startY + y * pixelSize,
            pixelSize,
            pixelSize
          );
        }
      });
    });
  }

  private renderFastEnemy(ctx: CanvasRenderingContext2D): void {
    const fastPattern = [
      [0, 0, 0, 1, 0, 0, 0],
      [0, 0, 1, 2, 1, 0, 0],
      [0, 1, 1, 1, 1, 1, 0],
      [1, 1, 1, 1, 1, 1, 1],
      [1, 0, 1, 1, 1, 0, 1],
      [0, 1, 0, 0, 0, 1, 0],
    ];
    const baseColor = this.hasPowerUp ? '#ffaa88' : '#ffaa00';
    if (this.hasPowerUp) {
      ctx.shadowColor = '#ffaa88';
      ctx.shadowBlur = 6;
    }
    const pixelSize = 2;
    const startX = -((fastPattern[0]?.length || 0) * pixelSize) / 2;
    const startY = -(fastPattern.length * pixelSize) / 2;
    fastPattern.forEach((row, y) => {
      row.forEach((pixel, x) => {
        if (pixel > 0) {
          let color = baseColor;
          if (pixel === 2) {
            color = '#ffffff';
          }
          ctx.fillStyle = color;
          ctx.fillRect(
            startX + x * pixelSize,
            startY + y * pixelSize,
            pixelSize,
            pixelSize
          );
        }
      });
    });
  }

  private renderStrongEnemy(ctx: CanvasRenderingContext2D): void {
    const strongPattern = [
      [0, 0, 1, 1, 1, 1, 1, 0, 0],
      [0, 1, 1, 1, 2, 1, 1, 1, 0],
      [1, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 1, 1, 3, 3, 3, 1, 1, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 0, 1, 1, 1, 1, 1, 0, 1],
      [0, 1, 0, 1, 0, 1, 0, 1, 0],
    ];
    const baseColor = this.hasPowerUp ? '#aa66ff' : '#8844ff';
    if (this.hasPowerUp) {
      ctx.shadowColor = '#aa66ff';
      ctx.shadowBlur = 8;
    }
    const pixelSize = 2.5;
    const startX = -((strongPattern[0]?.length || 0) * pixelSize) / 2;
    const startY = -(strongPattern.length * pixelSize) / 2;
    strongPattern.forEach((row, y) => {
      row.forEach((pixel, x) => {
        if (pixel > 0) {
          let color = baseColor;
          if (pixel === 2) {
            color = '#ffffff';
          } else if (pixel === 3) {
            color = '#dddddd';
          }
          ctx.fillStyle = color;
          ctx.fillRect(
            startX + x * pixelSize,
            startY + y * pixelSize,
            pixelSize,
            pixelSize
          );
        }
      });
    });
  }

  private renderBossEnemy(ctx: CanvasRenderingContext2D): void {
    const bossPattern = [
      [0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0],
      [0, 0, 0, 1, 1, 1, 2, 2, 2, 1, 1, 1, 0, 0, 0],
      [0, 0, 1, 1, 1, 2, 2, 3, 2, 2, 1, 1, 1, 0, 0],
      [0, 1, 1, 1, 2, 2, 3, 3, 3, 2, 2, 1, 1, 1, 0],
      [1, 1, 1, 2, 2, 3, 3, 4, 3, 3, 2, 2, 1, 1, 1],
      [1, 1, 2, 2, 3, 3, 4, 4, 4, 3, 3, 2, 2, 1, 1],
      [1, 2, 2, 3, 3, 4, 4, 4, 4, 4, 3, 3, 2, 2, 1],
      [1, 2, 3, 3, 4, 4, 4, 5, 4, 4, 4, 3, 3, 2, 1],
      [1, 2, 2, 3, 3, 4, 4, 4, 4, 4, 3, 3, 2, 2, 1],
      [1, 1, 2, 2, 3, 3, 4, 4, 4, 3, 3, 2, 2, 1, 1],
      [1, 1, 1, 2, 2, 3, 3, 4, 3, 3, 2, 2, 1, 1, 1],
      [0, 1, 1, 1, 2, 2, 3, 3, 3, 2, 2, 1, 1, 1, 0],
      [0, 0, 1, 1, 1, 2, 2, 3, 2, 2, 1, 1, 1, 0, 0],
      [0, 0, 0, 1, 1, 1, 2, 2, 2, 1, 1, 1, 0, 0, 0],
      [0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0],
    ];
    const baseColor = this.hasPowerUp ? '#ff44aa' : '#ff0088';
    const colorPalette = this.hasPowerUp
      ? ['#000000', '#ff44aa', '#dd2288', '#bb1166', '#991144', '#ffffff']
      : ['#000000', '#ff0088', '#dd0066', '#bb0044', '#990022', '#ffffff'];
    ctx.shadowColor = baseColor;
    ctx.shadowBlur = 15;
    const pixelSize = 4;
    const startX = -((bossPattern[0]?.length || 0) * pixelSize) / 2;
    const startY = -(bossPattern.length * pixelSize) / 2;
    bossPattern.forEach((row, y) => {
      row.forEach((pixel, x) => {
        if (pixel > 0) {
          ctx.fillStyle = colorPalette[pixel] || colorPalette[1] || '#ff0088';
          ctx.fillRect(
            startX + x * pixelSize,
            startY + y * pixelSize,
            pixelSize,
            pixelSize
          );
        }
      });
    });
    const time = Date.now() * 0.003;
    const orbitRadius = (bossPattern.length * pixelSize) / 2 + 15;
    ctx.fillStyle = '#ffff00';
    for (let i = 0; i < 8; i++) {
      const angle = (i * Math.PI * 2) / 8 + time;
      const x = Math.cos(angle) * orbitRadius;
      const y = Math.sin(angle) * orbitRadius;
      ctx.fillRect(x - 2, y - 2, 4, 4);
    }
  }

  private renderHealthBar(ctx: CanvasRenderingContext2D): void {
    const barWidth = this.size.width;
    const barHeight = 4;
    const barY = -this.size.height / 2 - 8;
    ctx.fillStyle = '#333333';
    ctx.fillRect(-barWidth / 2, barY, barWidth, barHeight);
    const healthPercent = this.health / this.maxHealth;
    const healthWidth = barWidth * healthPercent;
    ctx.fillStyle =
      healthPercent > 0.5
        ? '#00ff00'
        : healthPercent > 0.25
        ? '#ffaa00'
        : '#ff0000';
    ctx.fillRect(-barWidth / 2, barY, healthWidth, barHeight);
  }

  private static getSizeForType(type: EnemyType): Size {
    switch (type) {
      case 'basic':
        return { width: 25, height: 20 };
      case 'fast':
        return { width: 20, height: 15 };
      case 'strong':
        return { width: 35, height: 30 };
      case 'boss':
        return { width: 80, height: 80 };
    }
  }

  private static getHealthForType(type: EnemyType): number {
    switch (type) {
      case 'basic':
        return 1;
      case 'fast':
        return 1;
      case 'strong':
        return 3;
      case 'boss':
        return 25;
    }
  }

  private static getScoreForType(type: EnemyType): number {
    switch (type) {
      case 'basic':
        return 100;
      case 'fast':
        return 200;
      case 'strong':
        return 300;
      case 'boss':
        return 5000;
    }
  }

  private static getShootCooldownForType(type: EnemyType): number {
    switch (type) {
      case 'basic':
        return 2000;
      case 'fast':
        return 1500;
      case 'strong':
        return 2500;
      case 'boss':
        return 1200;
    }
  }

  private static getMovePatternForType(
    type: EnemyType
  ): 'straight' | 'zigzag' | 'circle' {
    switch (type) {
      case 'basic':
        return 'straight';
      case 'fast':
        return 'zigzag';
      case 'strong':
        return 'straight';
      case 'boss':
        return 'circle';
    }
  }
}
