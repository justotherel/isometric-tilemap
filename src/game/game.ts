import * as p5 from "p5";

import { COLOR_PALETTE } from "../constants";
import { GameStateType } from "../interfaces/gameStateType";
import { InputCode } from "../interfaces/inputCodes";
import { TileTypes } from "../interfaces/tileTypes";
import { p5lib } from "../main";
import { MapSystem } from "../mapSystem/index";
import { GroundIsoTile } from "../tiles/gorundTile";
import { IsoTile } from "../tiles/isoTile";
import { WaterIsoTile } from "../tiles/waterIsoTile";
import { GameState } from "./states/gameState";
import { IdleGameState } from "./states/idleGameState";
import { TileSelectedGameState } from "./states/tileSelectedGameState";

export class Game {
  private static _instance: Game;

  public FRAME_RATE = 30;
  public WIDTH = 900;
  public HEIGHT = 900;
  public GRID_SIZE = 10;
  public TILE_SIZE = 90;

  public mapSystem: MapSystem;

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
      "🚀 - Setup initialized within Game Object - P5 and Game logic running"
    );
    p5lib.createCanvas(this.WIDTH, this.HEIGHT);
    p5lib.frameRate(this.FRAME_RATE);

    this.cols = this.GRID_SIZE;
    this.rows = this.GRID_SIZE;

    this.currentState = this.states[GameStateType.IDLE];

    this.mapSystem = new MapSystem();

    this.mapSystem.generateMap({});
    this.populateGrid();
  }

  private populateGrid() {
    this.mapSystem.grid.forEach((tile) => {
      const iso = this.toIso(
        tile.i * this.TILE_SIZE - this.TILE_SIZE,
        tile.j * this.TILE_SIZE
      );

      switch (tile.type) {
        case TileTypes.GROUND: {
          this.grid.push(
            new GroundIsoTile({
              i: tile.i,
              j: tile.j,
              x: iso.x + this.WIDTH / 2,
              y: iso.y + this.HEIGHT / 4,
              size: this.TILE_SIZE,
            })
          );
          break;
        }
        case TileTypes.WATER: {
          this.grid.push(
            new WaterIsoTile({
              i: tile.i,
              j: tile.j,
              x: iso.x + this.WIDTH / 2,
              y: iso.y + this.HEIGHT / 4,
              size: this.TILE_SIZE,
            })
          );
          break;
        }
        default:
          throw new Error("UNKNOWN TYPE OF TILE PASSED TO ISO TILE CREATION");
      }
    });
  }

  private drawLastInputStatusText() {
    p5lib.stroke(COLOR_PALETTE.TEXT_OUTLINE);
    p5lib.fill(COLOR_PALETTE.TEXT_PRIMARY);
    p5lib.textSize(32);
    p5lib.text(`Last input: ${this.lastInput}`, 10, 30);
  }

  public setState(state: GameStateType, payload?: unknown) {
    this.currentState.exit();
    this.currentState = this.states[state];
    this.currentState.enter(payload);
  }

  public update() {
    p5lib.background(COLOR_PALETTE.BACKGROUND_DARK);
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

  public toCartesian(x: number, y: number): p5.Vector {
    const a = 0.5;
    const b = -0.5;
    const c = 0.25;
    const d = 0.25;
    const det = 1 / (a * d - b * c);
    return p5lib.createVector(
      x * d * det + y * -b * det,
      x * -c * det + y * a * det
    );
  }

  public toIso(x: number, y: number): p5.Vector {
    return p5lib.createVector(x * 0.5 + y * -0.5, x * 0.25 + y * 0.25);
  }

  public toIndex(i: number, j: number): number {
    return i * this.rows + j;
  }
}
