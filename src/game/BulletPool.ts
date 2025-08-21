import { Bullet } from './Bullet';
import { Position, BulletType } from '../types';

export class BulletPool {
  private pool: Bullet[] = [];
  private poolSize: number;

  constructor(poolSize: number = 100) {
    this.poolSize = poolSize;
    this.initializePool();
  }

  private initializePool(): void {
    // 풀을 미리 생성된 총알 객체들로 채움
    for (let i = 0; i < this.poolSize; i++) {
      const bullet = new Bullet({ x: 0, y: 0 }, 'player', 0, 1, 0);
      bullet.active = false; // 초기에는 비활성화
      this.pool.push(bullet);
    }
  }

  public getBullet(
    position: Position,
    bulletType: BulletType,
    speed: number = 500,
    powerLevel: number = 1,
    angle: number = 0
  ): Bullet | null {
    // 비활성화된 총알을 찾아서 재사용
    for (const bullet of this.pool) {
      if (!bullet.active) {
        bullet.reset(position, bulletType, speed, powerLevel, angle);
        bullet.active = true;
        return bullet;
      }
    }

    // 풀에 사용 가능한 총알이 없으면 새로 생성 (비상용)
    console.warn('BulletPool: 풀이 부족합니다. 새 총알을 생성합니다.');
    const bullet = new Bullet(position, bulletType, speed, powerLevel, angle);
    this.pool.push(bullet);
    return bullet;
  }

  public returnBullet(bullet: Bullet): void {
    bullet.active = false;
    // 총알을 풀로 반환 (이미 배열에 있으므로 추가 작업 불필요)
  }

  public getActiveCount(): number {
    return this.pool.filter((bullet) => bullet.active).length;
  }

  public getTotalCount(): number {
    return this.pool.length;
  }
}
