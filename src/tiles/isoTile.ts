import * as p5 from "p5";
import { TileStates } from "../interfaces/tileStates";
import { TileTypes } from "../interfaces/tileTypes";
import { p5lib } from "../main";
import { colorToRgb } from "../utils";
import { DefaultTileState } from "./states/defaultTileState";
import { HoveredTileState } from "./states/hoveredTileState";
import { PathEndTileState } from "./states/pathEndTileState";
import { PathTileState } from "./states/pathTileState";
import { SelectedTileState } from "./states/selectedTileState";
import { TileSate } from "./states/tileState";

export class IsoTile {
  public i: number;
  public j: number;
  public k: number;
  public x: number;
  public y: number;
  public size: number;

  public color: p5.Color;
  public readonly defaultColor: p5.Color;

  public red: number;
  public green: number;
  public blue: number;

  public type: TileTypes;
  public states: TileSate[];
  public currentState: TileSate;

  public hoverOffset = 0;

  protected A: p5.Vector;
  protected B: p5.Vector;
  protected C: p5.Vector;
  protected D: p5.Vector;
  protected E: p5.Vector;
  protected F: p5.Vector;
  protected G: p5.Vector;

  constructor(options: {
    i: number;
    j: number;
    k?: number;
    x: number;
    y: number;
    size: number;
    type: TileTypes;
    tileColor: p5.Color;
  }) {
    const { i, j, k, x, y, size, type, tileColor } = options;

    this.i = i;
    this.j = j;

    if (typeof k !== undefined) this.k = k;

    this.x = x;
    this.y = y;
    this.size = size;

    this.type = type;

    this.states = [
      new DefaultTileState(this),
      new SelectedTileState(this),
      new HoveredTileState(this),
      new PathTileState(this),
      new PathEndTileState(this),
    ];

    this.color = tileColor;
    this.defaultColor = tileColor;
    [this.red, this.green, this.blue] = colorToRgb(this.color);

    this.currentState = this.states[TileStates.DEFAULT];
    this.currentState.enter();
    this.calculateGeometry();
  }

  private calculateGeometry() {
    this.A = p5lib.createVector(this.x, this.y + 0.25 * this.size);
    this.B = p5lib.createVector(this.x + 0.5 * this.size, this.y);
    this.C = p5lib.createVector(this.x + this.size, this.y + 0.25 * this.size);
    this.D = p5lib.createVector(
      this.x + 0.5 * this.size,
      this.y + 0.5 * this.size
    );
    this.E = p5lib.createVector(this.x, this.y + 0.75 * this.size);
    this.F = p5lib.createVector(this.x + this.size, this.y + 0.75 * this.size);
    this.G = p5lib.createVector(this.x + 0.5 * this.size, this.y + this.size);
  }

  public draw() {
    p5lib.stroke(this.red * 0.3, this.green * 0.3, this.blue * 0.3);
    p5lib.strokeWeight(2);

    p5lib.fill(this.red * 0.75, this.green * 0.75, this.blue * 0.75);
    p5lib.quad(
      this.A.x,
      this.A.y - this.hoverOffset,
      this.B.x,
      this.B.y - this.hoverOffset,
      this.C.x,
      this.C.y - this.hoverOffset,
      this.D.x,
      this.D.y - this.hoverOffset
    );

    p5lib.fill(this.red * 0.9, this.green * 0.9, this.blue * 0.9);
    p5lib.quad(
      this.A.x,
      this.A.y - this.hoverOffset,
      this.D.x,
      this.D.y - this.hoverOffset,
      this.G.x,
      this.G.y - this.hoverOffset,
      this.E.x,
      this.E.y - this.hoverOffset
    );

    p5lib.fill(this.red, this.green, this.blue);
    p5lib.quad(
      this.D.x,
      this.D.y - this.hoverOffset,
      this.C.x,
      this.C.y - this.hoverOffset,
      this.F.x,
      this.F.y - this.hoverOffset,
      this.G.x,
      this.G.y - this.hoverOffset
    );
  }

  // input?: string
  public update() {
    this.currentState.handleInput();
  }

  public setState(state: TileStates) {
    this.currentState.exit();
    this.currentState = this.states[state];
    this.currentState.enter();
  }

  public isPointInsidePolygon(x: number, y: number): boolean {
    const pX = [this.A.x, this.B.x, this.C.x, this.D.x];
    const pY = [this.A.y, this.B.y, this.C.y, this.D.y];
    let j = pX.length - 1;
    let odd: number;

    for (let i = 0; i < pX.length; i++) {
      if (
        ((pY[i] < y && pY[j] >= y) || (pY[j] < y && pY[i] >= y)) &&
        (pX[i] <= x || pX[j] <= x)
      ) {
        const tmp =
          pX[i] + ((y - pY[i]) * (pX[j] - pX[i])) / (pY[j] - pY[i]) < x;
        odd ^= +tmp;
      }
      j = i;
    }
    return !!odd;
  }
}
