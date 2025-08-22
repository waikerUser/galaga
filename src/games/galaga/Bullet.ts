import { BaseGameObject } from './BaseGameObject';
import { Position, Size, BulletType } from '../../shared/types';

export class Bullet extends BaseGameObject {
  private bulletType: BulletType;
  private damage: number;
  private powerLevel: number;
  private bulletColor: string;

  constructor(
    position: Position,
    bulletType: BulletType,
    speed: number = 500,
    powerLevel: number = 1,
    angle: number = 0 // 각도 추가 (라디안)
  ) {
    // 파워 레벨에 따른 크기 조정 (powerLevel은 이미 파워 티어)
    const baseSize = { width: 4, height: 8 };
    const sizeMultiplier = 1 + (powerLevel - 1) * 0.5; // 1x, 1.5x, 2x, 2.5x...

    const size: Size = {
      width: Math.floor(baseSize.width * sizeMultiplier),
      height: Math.floor(baseSize.height * sizeMultiplier),
    };

    // 각도에 따른 속도 계산
    let velocity;
    if (angle !== 0) {
      // 각도가 지정된 경우 (보스 총알) - Canvas 좌표계에서 y축 반전
      velocity = {
        x: Math.sin(angle) * speed,
        y: -Math.cos(angle) * speed, // y축 반전으로 아래쪽 방향 보정
      };
    } else {
      // 기본 직선 이동 (플레이어/일반 적 총알)
      velocity = {
        x: 0,
        y: bulletType === 'player' ? -speed : speed,
      };
    }

    super(position, size, velocity);

    this.bulletType = bulletType;
    this.powerLevel = powerLevel;

    // 파워 레벨에 따른 데미지 조정
    this.damage = bulletType === 'player' ? powerLevel : 1;

    // 파워 레벨에 따른 색상 설정
    this.bulletColor = this.getBulletColor(powerLevel);
  }

  public update(deltaTime: number): void {
    this.updatePosition(deltaTime);

    // 화면 밖으로 나가면 비활성화 (여유 공간을 둬서 너무 빨리 사라지지 않게)
    const margin = 50;
    if (
      this.position.x < -margin ||
      this.position.x > 800 + margin ||
      this.position.y < -margin ||
      this.position.y > 600 + margin
    ) {
      this.active = false;
    }
  }

  public getBulletType(): BulletType {
    return this.bulletType;
  }

  public getDamage(): number {
    return this.damage;
  }

  public getPowerLevel(): number {
    return this.powerLevel;
  }

  // 객체 풀링을 위한 reset 메서드
  public reset(
    position: Position,
    bulletType: BulletType,
    speed: number = 500,
    powerLevel: number = 1,
    angle: number = 0
  ): void {
    this.position = { ...position };
    this.bulletType = bulletType;
    this.powerLevel = powerLevel;

    // 파워 레벨에 따른 크기 재계산
    const baseSize = { width: 4, height: 8 };
    const sizeMultiplier = 1 + (powerLevel - 1) * 0.5;
    this.size = {
      width: Math.floor(baseSize.width * sizeMultiplier),
      height: Math.floor(baseSize.height * sizeMultiplier),
    };

    // 각도에 따른 속도 재계산
    if (angle !== 0) {
      // 각도가 지정된 경우 (보스 총알) - Canvas 좌표계에서 y축 반전
      this.velocity = {
        x: Math.sin(angle) * speed,
        y: -Math.cos(angle) * speed,
      };
    } else {
      // 기본 직선 이동 (플레이어/일반 적 총알)
      this.velocity = {
        x: 0,
        y: bulletType === 'player' ? -speed : speed,
      };
    }

    // 파워 레벨에 따른 데미지 재계산
    this.damage = bulletType === 'player' ? powerLevel : 1;

    // 파워 레벨에 따른 색상 재설정
    this.bulletColor = this.getBulletColor(powerLevel);

    // 활성화
    this.active = true;
  }

  private getBulletColor(powerLevel: number): string {
    // 파워 레벨은 이미 파워 티어를 의미함 (GameEngine에서 getCurrentPowerLevel() 호출)
    const colors = [
      '#00ffff', // 티어 1: 시안
      '#ffff00', // 티어 2: 노랑
      '#ff8800', // 티어 3: 주황
      '#ff0088', // 티어 4: 분홍
      '#8800ff', // 티어 5: 보라
      '#ff0000', // 티어 6: 빨강
      '#ffffff', // 티어 7+: 흰색
    ];
    return colors[Math.min(powerLevel - 1, colors.length - 1)] || '#00ffff';
  }

  public render(ctx: CanvasRenderingContext2D): void {
    if (!this.active) return;

    ctx.save();

    if (this.bulletType === 'player') {
      // 갤러그 스타일 플레이어 총알 패턴
      const bulletPattern =
        this.powerLevel > 3
          ? [
              // 강화된 총알 (티어 4+): 더 굵음
              [1, 1],
              [2, 2], // 2는 핵심부
              [2, 2],
              [1, 1],
            ]
          : [
              // 기본 총알 (티어 1-3): 얇음
              [1],
              [2], // 2는 핵심부
              [2],
              [1],
            ];

      // 발광 효과
      ctx.shadowColor = this.bulletColor;
      ctx.shadowBlur = 3 + (this.powerLevel - 1) * 2;

      // 픽셀 크기
      const pixelSize = 2;
      const startX =
        this.position.x +
        this.size.width / 2 -
        ((bulletPattern[0]?.length || 1) * pixelSize) / 2;
      const startY = this.position.y;

      // 도트 그리기
      bulletPattern.forEach((row, y) => {
        row.forEach((pixel, x) => {
          if (pixel > 0) {
            let color = this.bulletColor;
            if (pixel === 2) {
              color = '#ffffff'; // 핵심부는 흰색
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
    } else {
      // 갤러그 스타일 적 총알
      if (this.velocity.x !== 0) {
        // 보스 총알: 더 큰 다이아몬드 패턴
        const bossBulletPattern = [
          [0, 1, 0],
          [1, 2, 1], // 2는 핵심부
          [0, 1, 0],
        ];

        ctx.shadowColor = '#ff3300';
        ctx.shadowBlur = 6;

        const pixelSize = 3;
        const startX =
          this.position.x +
          this.size.width / 2 -
          ((bossBulletPattern[0]?.length || 1) * pixelSize) / 2;
        const startY =
          this.position.y +
          this.size.height / 2 -
          (bossBulletPattern.length * pixelSize) / 2;

        bossBulletPattern.forEach((row, y) => {
          row.forEach((pixel, x) => {
            if (pixel > 0) {
              let color = '#ff3300';
              if (pixel === 2) {
                color = '#ffaa00'; // 핵심부
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
      } else {
        // 일반 적 총알: 작은 사각형 패턴
        const enemyBulletPattern = [
          [1, 1],
          [1, 1],
        ];

        ctx.shadowColor = '#ff0066';
        ctx.shadowBlur = 2;

        const pixelSize = 2;
        const startX =
          this.position.x +
          this.size.width / 2 -
          ((enemyBulletPattern[0]?.length || 1) * pixelSize) / 2;
        const startY =
          this.position.y +
          this.size.height / 2 -
          (enemyBulletPattern.length * pixelSize) / 2;

        enemyBulletPattern.forEach((row, y) => {
          row.forEach((pixel, x) => {
            if (pixel > 0) {
              ctx.fillStyle = '#ff0066';
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
    }

    ctx.restore();
  }
}
