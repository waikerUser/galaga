import { GameObject, Position, Size, Velocity, Rectangle } from '../types';

export abstract class BaseGameObject implements GameObject {
  public position: Position;
  public size: Size;
  public velocity: Velocity;
  public active: boolean;

  constructor(
    position: Position,
    size: Size,
    velocity: Velocity = { x: 0, y: 0 }
  ) {
    this.position = { ...position };
    this.size = { ...size };
    this.velocity = { ...velocity };
    this.active = true;
  }

  // 게임 객체의 경계 박스 반환
  public getBounds(): Rectangle {
    return {
      x: this.position.x,
      y: this.position.y,
      width: this.size.width,
      height: this.size.height,
    };
  }

  // 두 게임 객체 간의 충돌 감지
  public static checkCollision(obj1: GameObject, obj2: GameObject): boolean {
    const bounds1 = obj1.getBounds();
    const bounds2 = obj2.getBounds();

    return (
      bounds1.x < bounds2.x + bounds2.width &&
      bounds1.x + bounds1.width > bounds2.x &&
      bounds1.y < bounds2.y + bounds2.height &&
      bounds1.y + bounds1.height > bounds2.y
    );
  }

  // 화면 경계 검사
  public isOutOfBounds(canvasWidth: number, canvasHeight: number): boolean {
    return (
      this.position.x + this.size.width < 0 ||
      this.position.x > canvasWidth ||
      this.position.y + this.size.height < 0 ||
      this.position.y > canvasHeight
    );
  }

  // 위치 업데이트
  protected updatePosition(deltaTime: number): void {
    this.position.x += this.velocity.x * deltaTime;
    this.position.y += this.velocity.y * deltaTime;
  }

  // 추상 메서드들 - 각 클래스에서 구현해야 함
  public abstract update(deltaTime: number): void;
  public abstract render(ctx: CanvasRenderingContext2D): void;
}
