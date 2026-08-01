export type SpriteSets = {
  idle: [number, number][];
  alert: [number, number][];
  tired: [number, number][];
  sleeping: [number, number][];
  scratchSelf: [number, number][];
  scratchWallN: [number, number][];
  scratchWallS: [number, number][];
  scratchWallE: [number, number][];
  scratchWallW: [number, number][];
  N: [number, number][];
  NE: [number, number][];
  E: [number, number][];
  SE: [number, number][];
  S: [number, number][];
  SW: [number, number][];
  W: [number, number][];
  NW: [number, number][];
};

export interface BreedConfig {
  src: string;
  spriteSets: SpriteSets;
  /** px gap between sprites in the sheet */
  gap: number;
  /** number of columns in the sprite sheet */
  cols: number;
  /** number of rows in the sprite sheet */
  rows: number;
}

/** Sprite layout for the breed PNG sheets (8 cols x 4 rows, 1px gap). */
export const breedSpriteSets: SpriteSets = {
  idle: [[0, 0]],
  alert: [[7, 0]],
  scratchSelf: [
    [2, 0],
    [3, 0],
  ],
  scratchWallN: [
    [4, 3],
    [5, 3],
  ],
  scratchWallS: [
    [0, 3],
    [1, 3],
  ],
  scratchWallE: [
    [2, 3],
    [3, 3],
  ],
  scratchWallW: [
    [6, 3],
    [7, 3],
  ],
  tired: [[4, 0]],
  sleeping: [
    [5, 0],
    [6, 0],
  ],
  N: [
    [0, 2],
    [1, 2],
  ],
  NE: [
    [6, 1],
    [7, 1],
  ],
  E: [
    [4, 1],
    [5, 1],
  ],
  SE: [
    [2, 1],
    [3, 1],
  ],
  S: [
    [0, 1],
    [1, 1],
  ],
  SW: [
    [6, 2],
    [7, 2],
  ],
  W: [
    [4, 2],
    [5, 2],
  ],
  NW: [
    [2, 2],
    [3, 2],
  ],
};

export enum NekoSizeVariations {
  SMALL = 32,
  MEDIUM = 38,
  LARGE = 42,
}

enum NekoOffset {
  SMALL = 3,
  MEDIUM = -2,
  LARGE = -6,
}

const defaultBreed: BreedConfig = {
  src: "/pet/dog.png",
  spriteSets: breedSpriteSets,
  gap: 1,
  cols: 8,
  rows: 4,
};

/**
 * Neko-style cursor pet engine, vendored from neko-ts (MIT, ABSanthosh) and
 * adapted for this app:
 *  - no `prefers-reduced-motion` gating — the pet shows for everyone;
 *  - instance-scoped animation interval (the upstream package used one global
 *    interval, which broke multiple mounts and teardown);
 *  - pointer listeners attach to `window`, so the pet can live inside a
 *    `pointer-events: none` overlay;
 *  - no global "one neko per page" guard — lifecycle is owned by React.
 */
export class Neko {
  public size: NekoSizeVariations = NekoSizeVariations.SMALL;
  public isAwake: boolean = true;

  private nekoEl: HTMLDivElement | undefined;
  private nekoId: number = 0;
  private nekoPosX: number = this.size / 2;
  private nekoPosY: number = this.size / 2;
  private mousePosX: number = this.size / 2;
  private mousePosY: number = this.size / 2;
  private mouseMoveController = new AbortController();
  private touchController = new AbortController();

  private frameCount: number = 0;
  private idleTime: number = 0;
  private idleAnimation: string | null = null;
  private idleAnimationFrame: number = 0;
  private nekoSpeed: number = 10;
  private animationSpeed: number = 100;
  private breed: BreedConfig = defaultBreed;
  private distanceFromMouse: number = 25;
  private origin = { x: 0, y: 0 };
  private maxNekoSpeed: number = 20;
  private minNekoSpeed: number = 10;
  private parent: HTMLElement = document.body;
  private intervalId: number | null = null;

  constructor(options?: {
    nekoId?: number | null;
    nekoSize?: NekoSizeVariations | null;
    speed?: number | null;
    origin?: { x: number; y: number };
    parent?: HTMLElement;
    defaultState?: "awake" | "sleep";
    animationSpeed?: number;
    breed?: BreedConfig;
  }) {
    if (options?.speed) {
      this.nekoSpeed =
        options.speed > this.maxNekoSpeed
          ? this.maxNekoSpeed
          : options.speed < this.minNekoSpeed
            ? this.minNekoSpeed
            : options.speed;
    }

    if (options?.origin) {
      this.nekoPosX = options.origin.x;
      this.nekoPosY = options.origin.y + this.getOffset(this.size);
      this.mousePosX = this.nekoPosX;
      this.mousePosY = this.nekoPosY;
      this.origin.x = options.origin.x;
      this.origin.y = options.origin.y;
    }

    if (options?.parent) {
      this.parent = options.parent;
    }

    if (options?.defaultState === "sleep") {
      this.isAwake = false;
    }

    this.size = options?.nekoSize ?? NekoSizeVariations.SMALL;
    this.nekoId = options?.nekoId ?? this.nekoId;

    if (options?.animationSpeed !== undefined) {
      this.animationSpeed = Math.max(16, options.animationSpeed);
    }

    if (options?.breed) {
      this.breed = options.breed;
    }

    this.create();
  }

  private getOffset(size: NekoSizeVariations) {
    switch (size) {
      case NekoSizeVariations.SMALL:
        return NekoOffset.SMALL;
      case NekoSizeVariations.MEDIUM:
        return NekoOffset.MEDIUM;
      case NekoSizeVariations.LARGE:
        return NekoOffset.LARGE;
    }
  }

  private create() {
    this.nekoEl = document.createElement("div");
    this.nekoEl.dataset.neko = `${this.nekoId}`;
    this.nekoEl.id = `neko-${this.nekoId}`;
    this.nekoEl.style.width = `${this.size}px`;
    this.nekoEl.style.height = `${this.size}px`;
    this.nekoEl.style.left = `${this.nekoPosX - this.size / 2}px`;
    this.nekoEl.style.top = `${this.nekoPosY - this.size / 2}px`;
    this.nekoEl.style.position = "fixed";
    this.nekoEl.style.imageRendering = "pixelated";
    this.nekoEl.style.backgroundImage = `url(${this.breed.src})`;

    const { cols, rows, gap } = this.breed;
    const sheetW = cols * this.size + (cols - 1) * gap;
    const sheetH = rows * this.size + (rows - 1) * gap;
    this.nekoEl.style.backgroundSize = `${sheetW}px ${sheetH}px`;
    this.nekoEl.style.userSelect = "none";
    this.nekoEl.style.pointerEvents = "none";
    this.nekoEl.style.zIndex = "5";

    this.parent.appendChild(this.nekoEl);
    this.intervalId = window.setInterval(this.frame.bind(this), this.animationSpeed);

    if (!this.isAwake) {
      this.idle();
      return;
    }

    this.mouseMoveController = new AbortController();
    this.touchController = new AbortController();
    window.addEventListener(
      "mousemove",
      (event: MouseEvent) => {
        this.mousePosX = event.clientX;
        this.mousePosY = event.clientY;
      },
      { signal: this.mouseMoveController.signal }
    );
    window.addEventListener(
      "touchmove",
      (event: TouchEvent) => {
        this.mousePosX = event.touches[0].clientX;
        this.mousePosY = event.touches[0].clientY;
      },
      { signal: this.touchController.signal }
    );
  }

  private setSprite(name: string, frame: number) {
    const { spriteSets, gap } = this.breed;
    const frames = spriteSets[name as keyof typeof spriteSets];
    if (!frames) return;
    const sprite = frames[frame % frames.length];
    const cellSize = this.size + gap;
    this.nekoEl!.style.backgroundPosition = `${-sprite[0] * cellSize}px ${-sprite[1] * cellSize}px`;
  }

  private resetIdleAnimation() {
    this.idleAnimation = null;
    this.idleAnimationFrame = 0;
  }

  private idle() {
    this.idleTime += 1;

    if (
      this.idleTime > 5 &&
      Math.floor(Math.random() * 100) === 0 &&
      this.idleAnimation == null
    ) {
      const availableIdleAnimations = ["sleeping", "scratchSelf"];
      if (this.nekoPosX < 32) availableIdleAnimations.push("scratchWallW");
      if (this.nekoPosY < 32) availableIdleAnimations.push("scratchWallN");
      if (this.nekoPosX > window.innerWidth - 32) availableIdleAnimations.push("scratchWallE");
      if (this.nekoPosY > window.innerHeight - 32) availableIdleAnimations.push("scratchWallS");
      this.idleAnimation =
        availableIdleAnimations[Math.floor(Math.random() * availableIdleAnimations.length)];
    }

    switch (this.idleAnimation) {
      case "sleeping":
        if (this.idleAnimationFrame < 8) {
          this.setSprite("tired", 0);
          break;
        }
        this.setSprite("sleeping", Math.floor(this.idleAnimationFrame / 4));
        if (this.idleAnimationFrame > 192) {
          this.resetIdleAnimation();
        }
        break;
      case "scratchWallN":
      case "scratchWallS":
      case "scratchWallE":
      case "scratchWallW":
      case "scratchSelf":
        this.setSprite(this.idleAnimation, this.idleAnimationFrame);
        if (this.idleAnimationFrame > 9) {
          this.resetIdleAnimation();
        }
        break;
      default:
        this.setSprite("idle", 0);
        return;
    }
    this.idleAnimationFrame += 1;
  }

  private frame() {
    this.frameCount += 1;
    const diffX = this.nekoPosX - this.mousePosX;
    const diffY = this.nekoPosY - this.mousePosY;
    const distance = Math.sqrt(diffX ** 2 + diffY ** 2);

    if (distance < this.nekoSpeed || distance < this.distanceFromMouse) {
      this.idle();
      return;
    }

    this.idleAnimation = null;
    this.idleAnimationFrame = 0;

    if (this.idleTime > 1) {
      this.setSprite("alert", 0);
      this.idleTime = Math.min(this.idleTime, 7);
      this.idleTime -= 1;
      return;
    }

    let direction = "";
    direction += diffY / distance > 0.5 ? "N" : "";
    direction += diffY / distance < -0.5 ? "S" : "";
    direction += diffX / distance > 0.5 ? "W" : "";
    direction += diffX / distance < -0.5 ? "E" : "";
    this.setSprite(direction, this.frameCount);

    this.nekoPosX -= (diffX / distance) * this.nekoSpeed;
    this.nekoPosY -= (diffY / distance) * this.nekoSpeed;

    this.nekoPosX = Math.min(
      Math.max(this.size / 2, this.nekoPosX),
      window.innerWidth - this.size / 2
    );
    this.nekoPosY = Math.min(
      Math.max(this.size / 2, this.nekoPosY),
      window.innerHeight - this.size / 2
    );

    this.nekoEl!.style.left = `${this.nekoPosX - this.size / 2}px`;
    this.nekoEl!.style.top = `${this.nekoPosY - this.size / 2}px`;
  }

  public destroy(id?: number) {
    if (id && id !== this.nekoId) return;
    this.mouseMoveController.abort();
    this.touchController.abort();
    if (this.intervalId !== null) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    this.nekoEl?.remove();
    this.nekoEl = undefined;
  }

  public sleep() {
    if (!this.isAwake) return;
    this.mouseMoveController.abort();
    this.touchController.abort();
    this.mousePosX = this.nekoPosX;
    this.mousePosY = this.nekoPosY;
    this.isAwake = false;
  }

  public wake() {
    if (this.isAwake) return;
    this.mouseMoveController = new AbortController();
    this.touchController = new AbortController();
    window.addEventListener(
      "mousemove",
      (event: MouseEvent) => {
        this.mousePosX = event.clientX;
        this.mousePosY = event.clientY;
      },
      { signal: this.mouseMoveController.signal }
    );
    window.addEventListener(
      "touchmove",
      (event: TouchEvent) => {
        this.mousePosX = event.touches[0].clientX;
        this.mousePosY = event.touches[0].clientY;
      },
      { signal: this.touchController.signal }
    );
    this.isAwake = true;
  }

  public setSize(size: NekoSizeVariations) {
    this.size = size;
    this.nekoEl!.style.width = `${this.size}px`;
    this.nekoEl!.style.height = `${this.size}px`;
    const { cols, rows, gap } = this.breed;
    const sheetW = cols * this.size + (cols - 1) * gap;
    const sheetH = rows * this.size + (rows - 1) * gap;
    this.nekoEl!.style.backgroundSize = `${sheetW}px ${sheetH}px`;
  }

  public setBreed(breed: BreedConfig) {
    this.breed = breed;
    this.nekoEl!.style.backgroundImage = `url(${breed.src})`;
    const { cols, rows, gap } = breed;
    const sheetW = cols * this.size + (cols - 1) * gap;
    const sheetH = rows * this.size + (rows - 1) * gap;
    this.nekoEl!.style.backgroundSize = `${sheetW}px ${sheetH}px`;
  }

  public setSpeed(speed: number) {
    this.nekoSpeed = Math.max(this.minNekoSpeed, Math.min(this.maxNekoSpeed, speed));
  }

  public setAnimationSpeed(ms: number) {
    this.animationSpeed = Math.max(16, ms);
    if (this.intervalId !== null) clearInterval(this.intervalId);
    this.intervalId = window.setInterval(this.frame.bind(this), this.animationSpeed);
  }

  public get position(): { x: number; y: number } {
    return { x: this.nekoPosX, y: this.nekoPosY };
  }
}
