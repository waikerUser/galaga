// 게임 객체의 기본 위치와 크기 타입
export interface Position {
  x: number;
  y: number;
}

export interface Size {
  width: number;
  height: number;
}

export interface Velocity {
  x: number;
  y: number;
}

// 게임 객체의 기본 인터페이스
export interface GameObject {
  position: Position;
  size: Size;
  velocity: Velocity;
  active: boolean;

  update(deltaTime: number): void;
  render(ctx: CanvasRenderingContext2D): void;
  getBounds(): Rectangle;
}

// 충돌 감지를 위한 경계 박스
export interface Rectangle {
  x: number;
  y: number;
  width: number;
  height: number;
}

// 게임 상태 타입
export type GameState =
  | 'start'
  | 'difficulty'
  | 'playing'
  | 'paused'
  | 'boss'
  | 'gameOver'
  | 'levelUp'
  | 'bossIntro';

// 게임 메시지 타입
export interface GameMessage {
  text: string;
  type: 'levelUp' | 'bossWarning' | 'powerUp' | 'achievement';
  duration: number;
  startTime: number;
}

// 난이도 타입
export type Difficulty = 'easy' | 'normal' | 'hard';

// 입력 키 상태
export interface KeyState {
  left: boolean;
  right: boolean;
  up: boolean;
  down: boolean;
  space: boolean;
  enter: boolean;
  escape: boolean;
}

// 적의 타입
export type EnemyType = 'basic' | 'fast' | 'strong' | 'boss';

// 총알 타입
export type BulletType = 'player' | 'enemy';

// 게임 설정
export interface GameConfig {
  canvasWidth: number;
  canvasHeight: number;
  playerSpeed: number;
  bulletSpeed: number;
  enemySpeed: number;
  enemySpawnRate: number;
  maxLives: number;
}

// 파워업 타입 (단순화: 미사일 강화와 생명력만)
export type PowerUpType = 'multiShot' | 'extraLife' | 'powerUp' | 'shield';

// 파워업 아이템 인터페이스
export interface PowerUpItem extends GameObject {
  powerUpType: PowerUpType;
  duration?: number;
  collectSound?: string;
}

// 플레이어 파워업 상태 (단순화)
export interface PlayerPowerUps {
  multiShot: {
    active: boolean;
    level: number;
    maxLevel: number;
  };
  powerUp: {
    active: boolean;
    endTime: number;
    multiplier: number;
  };
  shield: {
    active: boolean;
    endTime: number;
    hits: number;
  };
}

// 난이도별 설정
export interface DifficultyConfig {
  enemySpeed: number;
  enemySpawnRate: number;
  enemyHealth: number;
  powerUpDropRate: number;
  scoreMultiplier: number;
}

// 게임 통계
export interface GameStats {
  score: number;
  lives: number;
  level: number;
  stage: number;
  enemiesKilled: number;
  bulletsShot: number;
  accuracy: number;
  difficulty: Difficulty;
  bossesKilled: number;
  itemsCollected: number;
  levelStartTime: number;
  totalPlayTime: number;
  consecutiveHits: number;
}
