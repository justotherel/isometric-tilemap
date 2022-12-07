import { Game } from "../game";
import { InputCode } from "../../interfaces/inputCodes";
import { p5lib } from "../../main";
import { TileStates } from "../../interfaces/tileStates";
import { isEqual, toIndex } from "../../utils";
import { GameState } from "./gameState";
import { Tile } from "../../pathfinding/tile";
import { Coordinates } from "../../interfaces/Coordinates";
import { GameStateType } from "../../interfaces/gameStateType";

export class TileSelectedGameState extends GameState {
  constructor() {
    super(GameStateType.TILE_SELECTED);
  }

  private start: Coordinates | undefined;
  private end: Coordinates | undefined;
  private path: Tile[] | undefined;

  // kinda dangerous and whack
  public enter(enterData?: { selectedTile: Coordinates }) {
    this.start = enterData!.selectedTile;
  }

  public exit() {
    this.clearPath();
    this.start = undefined;
    this.end = undefined;
  }

  public override run(input?: InputCode) {
    for (const tile of Game.instance.grid) {
      if (tile.isPointInsidePolygon(p5lib.mouseX, p5lib.mouseY)) {
        tile.setState(TileStates.HOVERED);
        if (this.end) {
          if (
            isEqual(this.end, {
              i: tile.i,
              j: tile.j,
            })
          )
            break;
          this.clearPath();
        }

        this.end = { i: tile.i, j: tile.j };
        this.setPath();
        break;
      }
    }

    switch (input) {
      case InputCode.ESC_PRESSED: {
        Game.instance.setState(GameStateType.IDLE);
        break;
      }
    }
  }

  private setPath() {
    this.path = Game.instance.aStar.findPath(
      Game.instance.aStar.getTile(this.start),
      Game.instance.aStar.getTile(this.end)
    );
    if (this.path)
      this.path.forEach((el, index) => {
        const tileIndex = toIndex(el.i, el.j);
        if (index === this.path!.length - 1) {
          Game.instance.grid[tileIndex].setState(TileStates.PATH_END);
        } else {
          Game.instance.grid[tileIndex].setState(TileStates.PATH);
        }
      });
  }

  private clearPath() {
    if (this.path)
      this.path.forEach((el) =>
        Game.instance.grid[toIndex(el.i, el.j)].setState(TileStates.DEFAULT)
      );
  }
}
