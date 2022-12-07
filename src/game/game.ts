import { TileSelectedGameState } from "./states/tileSelectedGameState";
import { GameStateType } from "../interfaces/gameStateType";
import { IdleGameState } from "./states/idleGameState";
import { GameState } from "./states/gameState";
import { InputCode } from "../interfaces/inputCodes";
import { p5lib } from "../main";
import { IsoTile } from "../tiles/isoTile";
import { toIso } from "../utils";
import { AStar } from "../pathfinding/aStar";

export class Game {
  private static _instance: Game;

  public FRAME_RATE = 30;
  public WIDTH = 900;
  public HEIGHT = 900;
  public GRID_SIZE = 10;
  public TILE_SIZE = 90;

  public aStar: AStar;

  public COLOR_PALETTE = {
    BACKGROUND_DARK: "#003049",
    TILE_PRIMARY: "#D62828",
    TILE_SELECTED: "#F77F00",
    TILE_PATH_END: "#EAE2B7",
    TILE_PATH: "#FCBF49",
  };

  public lastInput = InputCode.NONE;

  private states: GameState[] = [
    new IdleGameState(),
    new TileSelectedGameState(),
  ];
  private currentState: GameState;

  public rows: number;
  public cols: number;

  public grid: IsoTile[] = [];

  private constructor(gameParams?: {
    canvasWidth?: number;
    canvasHeight?: number;
    gridSize?: number;
    tileSize?: number;
    desiredFrameRate?: number;
  }) {
    const { canvasHeight, canvasWidth, gridSize, tileSize, desiredFrameRate } =
      gameParams;
    if (canvasWidth) this.WIDTH = canvasWidth;
    if (canvasHeight) this.HEIGHT = canvasHeight;
    if (gridSize) this.GRID_SIZE = gridSize;
    if (desiredFrameRate) this.FRAME_RATE = desiredFrameRate;
    this.TILE_SIZE = tileSize ? tileSize : this.WIDTH / this.GRID_SIZE;

    console.log(
      "🚀 - Setup initialized within Game Object - P5 and Game logic is running"
    );
    p5lib.createCanvas(this.WIDTH, this.HEIGHT);
    p5lib.frameRate(this.FRAME_RATE);

    this.cols = this.GRID_SIZE;
    this.rows = this.GRID_SIZE;

    this.currentState = this.states[GameStateType.IDLE];

    this.aStar = new AStar(this.cols, this.rows);

    for (let i = 0; i < this.GRID_SIZE; i++) {
      for (let j = 0; j < this.GRID_SIZE; j++) {
        const iso = toIso(
          i * this.TILE_SIZE - this.TILE_SIZE,
          j * this.TILE_SIZE
        );
        this.grid.push(
          new IsoTile({
            i,
            j,
            x: iso.x + this.WIDTH / 2,
            y: iso.y + this.HEIGHT / 4,
            size: this.TILE_SIZE,
            tileColor: p5lib.color(this.COLOR_PALETTE.TILE_PRIMARY),
          })
        );
      }
    }
  }

  private drawLastInputStatusText() {
    p5lib.textSize(32);
    p5lib.text(`Last input: ${this.lastInput}`, 10, 30);
  }

  public setState(state: GameStateType, payload?: unknown) {
    this.currentState.exit();
    this.currentState = this.states[state];
    this.currentState.enter(payload);
  }

  public update() {
    p5lib.background(this.COLOR_PALETTE.BACKGROUND_DARK);
    this.grid.forEach((el) => el.draw());
    this.currentState.run(this.lastInput);
    this.drawLastInputStatusText();
  }

  public static get instance() {
    if (!Game._instance) {
      Game._instance = new Game({});
    }
    return Game._instance;
  }
}
