import { BaseGameObject } from './BaseGameObject';
import { Position, Size, PowerUpType } from '../../shared/types';

export class PowerUp extends BaseGameObject {
  private powerUpType: PowerUpType;
  private rotationSpeed: number;
  private glowIntensity: number;
  private timeAlive: number;
  private bobOffset: number;

  constructor(position: Position, powerUpType: PowerUpType) {
    const size: Size = { width: 20, height: 20 };
    const velocity = { x: 0, y: 50 }; // 천천히 아래로 이동

    super(position, size, velocity);

    this.powerUpType = powerUpType;
    this.rotationSpeed = 0.05;
    this.glowIntensity = 0;
    this.timeAlive = 0;
    this.bobOffset = Math.random() * Math.PI * 2; // 랜덤한 위상차
  }

  public update(deltaTime: number): void {
    this.timeAlive += deltaTime;
    this.updatePosition(deltaTime);

    // 위아래로 부드럽게 움직이는 효과
    const bobAmount = Math.sin(this.timeAlive * 3 + this.bobOffset) * 10;
    this.position.y += bobAmount * deltaTime;

    // 화면 밖으로 나가면 비활성화
    if (this.isOutOfBounds(800, 600)) {
      this.active = false;
    }
  }

  public getPowerUpType(): PowerUpType {
    return this.powerUpType;
  }

  public render(ctx: CanvasRenderingContext2D): void {
    if (!this.active) return;

    ctx.save();
    ctx.translate(
      this.position.x + this.size.width / 2,
      this.position.y + this.size.height / 2
    );

    // 회전 효과
    ctx.rotate(this.timeAlive * this.rotationSpeed);

    // 발광 효과
    this.glowIntensity = (Math.sin(this.timeAlive * 5) + 1) / 2;
    ctx.shadowBlur = 10 + this.glowIntensity * 10;

    // 파워업 타입에 따른 렌더링
    switch (this.powerUpType) {
      case 'multiShot':
        this.renderMultiShot(ctx);
        break;
      case 'extraLife':
        this.renderExtraLife(ctx);
        break;
      case 'powerUp':
        this.renderPowerUp(ctx);
        break;
      case 'shield':
        this.renderShield(ctx);
        break;
    }

    ctx.restore();
  }

  private renderMultiShot(ctx: CanvasRenderingContext2D): void {
    // 멀티샷 아이콘 (세 개의 화살표)
    ctx.strokeStyle = '#00ffff';
    ctx.fillStyle = '#00cccc';
    ctx.shadowColor = '#00ffff';
    ctx.lineWidth = 2;

    // 배경 원
    ctx.beginPath();
    ctx.arc(0, 0, this.size.width / 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // 세 개의 화살표
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1;

    for (let i = 0; i < 3; i++) {
      const angle = (i - 1) * 0.5; // -0.5, 0, 0.5 라디안
      const x1 = Math.sin(angle) * 6;
      const y1 = 4;
      const x2 = Math.sin(angle) * 6;
      const y2 = -4;

      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.lineTo(x2 - 2, y2 + 2);
      ctx.moveTo(x2, y2);
      ctx.lineTo(x2 + 2, y2 + 2);
      ctx.stroke();
    }
  }

  private renderExtraLife(ctx: CanvasRenderingContext2D): void {
    // 생명 아이콘 (하트 모양)
    ctx.strokeStyle = '#00ff00';
    ctx.fillStyle = '#00cc00';
    ctx.shadowColor = '#00ff00';
    ctx.lineWidth = 2;

    // 배경 원
    ctx.beginPath();
    ctx.arc(0, 0, this.size.width / 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // 하트 모양
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.moveTo(0, 3);
    ctx.bezierCurveTo(-3, -1, -6, -1, -3, -4);
    ctx.bezierCurveTo(0, -6, 0, -6, 0, -3);
    ctx.bezierCurveTo(0, -6, 0, -6, 3, -4);
    ctx.bezierCurveTo(6, -1, 3, -1, 0, 3);
    ctx.fill();
  }

  private renderPowerUp(ctx: CanvasRenderingContext2D): void {
    // 원형 배경 (황금색)
    ctx.shadowColor = '#ffd700';
    ctx.fillStyle = '#ffd700';
    ctx.strokeStyle = '#ffff00';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(0, 0, this.size.width / 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // 번개 모양 (파워업 표시)
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.moveTo(-2, -6);
    ctx.lineTo(2, -2);
    ctx.lineTo(-1, -2);
    ctx.lineTo(2, 6);
    ctx.lineTo(-2, 2);
    ctx.lineTo(1, 2);
    ctx.closePath();
    ctx.fill();
  }

  private renderShield(ctx: CanvasRenderingContext2D): void {
    // 원형 배경 (파란색)
    ctx.shadowColor = '#00bfff';
    ctx.fillStyle = '#00bfff';
    ctx.strokeStyle = '#0080ff';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(0, 0, this.size.width / 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // 방패 모양
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.moveTo(0, -6);
    ctx.lineTo(-4, -2);
    ctx.lineTo(-4, 2);
    ctx.lineTo(0, 6);
    ctx.lineTo(4, 2);
    ctx.lineTo(4, -2);
    ctx.closePath();
    ctx.fill();

    // 십자가 문양
    ctx.strokeStyle = '#00bfff';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, -2);
    ctx.lineTo(0, 2);
    ctx.moveTo(-2, 0);
    ctx.lineTo(2, 0);
    ctx.stroke();
  }
}
