import { BaseGameObject } from './BaseGameObject';
import {
  Position,
  Size,
  KeyState,
  PlayerPowerUps,
  PowerUpType,
} from '../types';

export class Player extends BaseGameObject {
  private speed: number;
  private canvasWidth: number;
  private canvasHeight: number;
  private shootCooldown: number;
  private lastShotTime: number;
  private powerUps: PlayerPowerUps;

  constructor(
    position: Position,
    canvasWidth: number,
    canvasHeight: number,
    speed: number = 300
  ) {
    const size: Size = { width: 40, height: 30 };
    super(position, size);

    this.speed = speed;
    this.canvasWidth = canvasWidth;
    this.canvasHeight = canvasHeight;
    this.shootCooldown = 150; // 밀리초
    this.lastShotTime = 0;

    // 파워업 상태 초기화 (확장)
    this.powerUps = {
      multiShot: {
        active: true, // 기본적으로 활성화 (레벨 1부터 시작)
        level: 1,
        maxLevel: 15, // 최대 레벨을 크게 늘림
      },
      powerUp: {
        active: false,
        endTime: 0,
        multiplier: 2.0, // 2배 공격력
      },
      shield: {
        active: false,
        endTime: 0,
        hits: 0,
      },
    };
  }

  public update(deltaTime: number): void {
    this.lastShotTime += deltaTime * 1000; // deltaTime을 밀리초로 변환
    this.updatePosition(deltaTime);
    this.constrainToCanvas();
    this.updatePowerUps(deltaTime);
  }

  private updatePowerUps(deltaTime: number): void {
    const currentTime = Date.now();

    // Power Up 시간 체크
    if (
      this.powerUps.powerUp.active &&
      currentTime > this.powerUps.powerUp.endTime
    ) {
      this.powerUps.powerUp.active = false;
      console.log('💫 Power Up 효과 종료');
    }

    // Shield 시간 체크
    if (
      this.powerUps.shield.active &&
      currentTime > this.powerUps.shield.endTime
    ) {
      this.powerUps.shield.active = false;
      this.powerUps.shield.hits = 0;
      console.log('🛡️ Shield 효과 종료');
    }

    // multiShot은 영구적이므로 시간 감소 로직이 필요 없음
  }

  // 키 입력에 따른 플레이어 이동 처리
  public handleInput(keyState: KeyState): void {
    this.velocity.x = 0;
    this.velocity.y = 0;

    if (keyState.left) {
      this.velocity.x = -this.speed;
    }
    if (keyState.right) {
      this.velocity.x = this.speed;
    }
    if (keyState.up) {
      this.velocity.y = -this.speed;
    }
    if (keyState.down) {
      this.velocity.y = this.speed;
    }
  }

  // 발사 가능한지 확인
  public canShoot(): boolean {
    return this.lastShotTime >= this.shootCooldown;
  }

  // 발사 후 쿨다운 리셋
  public shoot(): void {
    this.lastShotTime = 0;
  }

  // 총알 발사 위치 반환 (멀티샷 지원)
  public getBulletSpawnPositions(): Position[] {
    const centerX = this.position.x + this.size.width / 2;
    const y = this.position.y;
    const positions: Position[] = [];

    const level = this.powerUps.multiShot.level;
    // 3개씩 사이클: (level - 1) % 3 + 1로 1, 2, 3이 반복됨
    const shotCount = ((level - 1) % 3) + 1;

    if (shotCount === 1) {
      // 1발: 중앙
      positions.push({ x: centerX - 2, y });
    } else if (shotCount === 2) {
      // 2발: 좌우
      positions.push({ x: centerX - 8, y });
      positions.push({ x: centerX + 4, y });
    } else if (shotCount === 3) {
      // 3발: 중앙, 좌, 우
      positions.push({ x: centerX - 2, y });
      positions.push({ x: centerX - 12, y });
      positions.push({ x: centerX + 8, y });
    }

    return positions;
  }

  // 현재 파워 레벨 반환 (총알의 굵기/데미지 결정)
  public getCurrentPowerLevel(): number {
    // 파워 티어: 레벨 1-3 → 티어 1, 레벨 4-6 → 티어 2, ...
    return Math.floor((this.powerUps.multiShot.level - 1) / 3) + 1;
  }

  // 현재 발사 개수 반환
  public getCurrentShotCount(): number {
    const level = this.powerUps.multiShot.level;
    return ((level - 1) % 3) + 1;
  }

  // 파워업 적용
  public applyPowerUp(powerUpType: PowerUpType): void {
    const currentTime = Date.now();

    switch (powerUpType) {
      case 'multiShot':
        this.powerUps.multiShot.active = true;
        if (this.powerUps.multiShot.level < this.powerUps.multiShot.maxLevel) {
          this.powerUps.multiShot.level++;
          console.log(`🚀 멀티샷 레벨: ${this.powerUps.multiShot.level}`);
        } else {
          console.log('🚀 멀티샷이 이미 최대 레벨입니다!');
        }
        break;
      case 'extraLife':
        // 이 기능은 GameEngine에서 처리
        break;
      case 'powerUp':
        this.powerUps.powerUp.active = true;
        this.powerUps.powerUp.endTime = currentTime + 10000; // 10초
        console.log('💫 Power Up 활성화! 10초간 2배 공격력');
        break;
      case 'shield':
        this.powerUps.shield.active = true;
        this.powerUps.shield.endTime = currentTime + 15000; // 15초
        this.powerUps.shield.hits = 3; // 3회 피격 방어
        console.log('🛡️ Shield 활성화! 15초간 또는 3회 피격 방어');
        break;
    }
  }

  // 파워업 상태 확인
  public getPowerUps(): Readonly<PlayerPowerUps> {
    return this.powerUps;
  }

  // 현재 공격력 배율 계산 (Power Up 효과 포함)
  public getCurrentDamageMultiplier(): number {
    return this.powerUps.powerUp.active
      ? this.powerUps.powerUp.multiplier
      : 1.0;
  }

  // Shield 피격 처리
  public handleShieldHit(): boolean {
    if (this.powerUps.shield.active && this.powerUps.shield.hits > 0) {
      this.powerUps.shield.hits--;
      console.log(`🛡️ Shield 피격! 남은 방어: ${this.powerUps.shield.hits}회`);

      if (this.powerUps.shield.hits <= 0) {
        this.powerUps.shield.active = false;
        console.log('🛡️ Shield 소진됨');
      }

      return true; // 피격 방어됨
    }
    return false; // 방어되지 않음
  }

  // Shield 상태 확인
  public hasShield(): boolean {
    return this.powerUps.shield.active && this.powerUps.shield.hits > 0;
  }

  // 플레이어를 캔버스 경계 내로 제한
  private constrainToCanvas(): void {
    if (this.position.x < 0) {
      this.position.x = 0;
    }
    if (this.position.x + this.size.width > this.canvasWidth) {
      this.position.x = this.canvasWidth - this.size.width;
    }
    if (this.position.y < 0) {
      this.position.y = 0;
    }
    if (this.position.y + this.size.height > this.canvasHeight) {
      this.position.y = this.canvasHeight - this.size.height;
    }
  }

  public render(ctx: CanvasRenderingContext2D): void {
    if (!this.active) return;

    ctx.save();

    // 파워업 레벨에 따른 색상 및 발광 효과 설정
    const powerTier = this.getCurrentPowerLevel();
    const tierColors = [
      '#00ffff',
      '#ffff00',
      '#ff8800',
      '#ff0088',
      '#8800ff',
      '#ff0000',
      '#ffffff',
    ];
    const baseColor =
      tierColors[Math.min(powerTier - 1, tierColors.length - 1)] || '#00ffff';

    if (this.powerUps.multiShot.level > 1) {
      ctx.shadowColor = baseColor;
      ctx.shadowBlur = 8 + powerTier * 2;
    }

    const { x, y } = this.position;
    const w = this.size.width;
    const h = this.size.height;

    // 전투기 동체 (Body)
    ctx.beginPath();
    ctx.moveTo(x + w * 0.5, y); // 1. Nose tip
    ctx.lineTo(x + w, y + h * 0.75); // 2. Right wing tip
    ctx.lineTo(x + w * 0.85, y + h); // 3. Right engine back
    ctx.lineTo(x + w * 0.15, y + h); // 4. Left engine back
    ctx.lineTo(x, y + h * 0.75); // 5. Left wing tip
    ctx.closePath();
    ctx.fillStyle = baseColor;
    ctx.fill();

    // 중앙 동체 (Center fuselage)
    ctx.beginPath();
    ctx.moveTo(x + w * 0.5, y + h * 0.1);
    ctx.lineTo(x + w * 0.65, y + h * 0.85);
    ctx.lineTo(x + w * 0.5, y + h);
    ctx.lineTo(x + w * 0.35, y + h * 0.85);
    ctx.closePath();
    ctx.fillStyle = '#cccccc'; // A slightly darker grey
    ctx.fill();

    // 콕핏 (Cockpit)
    ctx.beginPath();
    ctx.moveTo(x + w * 0.5, y + h * 0.2);
    ctx.lineTo(x + w * 0.6, y + h * 0.5);
    ctx.lineTo(x + w * 0.4, y + h * 0.5);
    ctx.closePath();
    ctx.fillStyle = '#ffffff'; // White cockpit
    ctx.strokeStyle = '#999999';
    ctx.lineWidth = 1;
    ctx.stroke();
    ctx.fill();

    // 엔진 부스터 불꽃 (Engine thrusters)
    const engineGlow = Math.random() * 0.2 + 0.8; // Flickering effect
    ctx.fillStyle = `rgba(255, 170, 0, ${engineGlow})`;
    ctx.beginPath();
    ctx.moveTo(x + w * 0.2, y + h);
    ctx.lineTo(x + w * 0.3, y + h + h * 0.2);
    ctx.lineTo(x + w * 0.4, y + h);
    ctx.closePath();
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(x + w * 0.8, y + h);
    ctx.lineTo(x + w * 0.7, y + h + h * 0.2);
    ctx.lineTo(x + w * 0.6, y + h);
    ctx.closePath();
    ctx.fill();

    // 멀티샷 레벨 표시
    if (this.powerUps.multiShot.level > 1) {
      ctx.translate(
        this.position.x + this.size.width / 2,
        this.position.y + this.size.height / 2
      );
      this.renderMultiShotIndicator(ctx);
    }

    // Shield 효과 렌더링
    if (this.hasShield()) {
      this.renderShieldEffect(ctx);
    }

    ctx.restore();
  }

  private renderMultiShotIndicator(ctx: CanvasRenderingContext2D): void {
    const shotCount = this.getCurrentShotCount();
    const powerTier = this.getCurrentPowerLevel();

    // 파워 티어별 색상 (발광 효과와 동일)
    const colors = [
      '#00ffff', // 티어 1
      '#ffff00', // 티어 2
      '#ff8800', // 티어 3
      '#ff0088', // 티어 4
      '#8800ff', // 티어 5
      '#ff0000', // 티어 6
      '#ffffff', // 티어 7+
    ];
    const color =
      colors[Math.min(powerTier - 1, colors.length - 1)] || '#00ffff';

    ctx.fillStyle = color;
    ctx.font = '8px monospace';
    ctx.textAlign = 'center';

    // 발사 개수 x 파워 티어 형태로 표시
    if (powerTier > 1) {
      ctx.fillText(
        `${shotCount}x T${powerTier} ★`,
        0,
        -this.size.height / 2 - 8
      );
    } else {
      ctx.fillText(`${shotCount}x T${powerTier}`, 0, -this.size.height / 2 - 8);
    }
  }

  private renderShieldEffect(ctx: CanvasRenderingContext2D): void {
    ctx.save();

    // Shield 원형 효과
    const centerX = this.position.x + this.size.width / 2;
    const centerY = this.position.y + this.size.height / 2;
    const radius = Math.max(this.size.width, this.size.height) / 2 + 10;

    // 시간에 따른 깜빡임 효과
    const time = Date.now() * 0.003;
    const alpha = ((Math.sin(time * 3) + 1) / 2) * 0.3 + 0.2; // 0.2 ~ 0.5

    // Shield 원형 그라디언트
    const gradient = ctx.createRadialGradient(
      centerX,
      centerY,
      radius * 0.7,
      centerX,
      centerY,
      radius
    );
    gradient.addColorStop(0, `rgba(0, 191, 255, ${alpha * 0.5})`);
    gradient.addColorStop(1, `rgba(0, 191, 255, ${alpha})`);

    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    ctx.fill();

    // Shield 외곽선
    ctx.strokeStyle = `rgba(0, 191, 255, ${alpha + 0.3})`;
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 5]);
    ctx.lineDashOffset = -time * 30; // 회전하는 점선
    ctx.stroke();
    ctx.setLineDash([]); // 점선 해제

    ctx.restore();
  }
}
