import { Coordinates } from "../../interfaces/Coordinates";
import { GameStateType } from "../../interfaces/gameStateType";
import { InputCode } from "../../interfaces/inputCodes";
import { TileStates } from "../../interfaces/tileStates";
import { game, p5lib } from "../../main";
import { Tile } from "../../mapSystem/pathfinding/tile";
import { isEqual } from "../../utils";
import { GameState } from "./gameState";

export class TileSelectedGameState extends GameState {
  constructor() {
    super(GameStateType.TILE_SELECTED);
  }

  private start: Coordinates | undefined;
  private end: Coordinates | undefined;
  private previousEnd: Coordinates | undefined;
  private previousValidEnd: Coordinates | undefined;
  private path: Tile[] | undefined;

  // kinda dangerous and whack
  public enter(enterData?: { selectedTile: Coordinates }) {
    this.start = enterData!.selectedTile;
  }

  public exit() {
    this.clearPath();
    this.start = undefined;
    this.end = undefined;
    this.previousEnd = undefined;
    this.previousValidEnd = undefined;
    this.path = undefined;
  }

  public override run(input?: InputCode) {
    // would need to be rewrtitten when 3rd dimension added
    for (const tile of game.gameGrid) {
      if (tile.isPointInsidePolygon(p5lib.mouseX, p5lib.mouseY)) {
        tile.setState(TileStates.HOVERED);
        const newEnd = { i: tile.i, j: tile.j };

        if (this.end) {
          if (isEqual(this.end, newEnd)) break;
          this.previousEnd = { i: this.end.i, j: this.end.j };
          this.clearPath();
        }

        this.end = newEnd;
        this.setPath();
        break;
      }
    }

    switch (input) {
      case InputCode.ESC_PRESSED: {
        game.setState(GameStateType.IDLE);
        break;
      }
    }
  }

  // this is where neihgbors of each cell would come in handy
  // checking all the cell's neighbors to find a nearst path to it would've been a solution
  // alternatively, we can store last valid path and backtrack to it anytime we encounter multiple unreachable tiles in a row
  private setPath() {
    this.path = game.mapSystem.getPath(this.start, this.end);

    if (this.path) {
      this.previousValidEnd = { i: this.end.i, j: this.end.j };
    }

    if (!this.path && this.previousValidEnd === undefined) {
      game.gameGrid[game.toIndex(this.start.i, this.start.j)].setState(
        TileStates.SELECTED
      );
      return;
    }

    if (!this.path && this.previousValidEnd !== undefined) {
      this.path = game.mapSystem.getPath(this.start, this.previousValidEnd);
    }

    this.path.forEach((el) => {
      const tileIndex = game.toIndex(el.i, el.j);
      game.gameGrid[tileIndex].setState(TileStates.PATH);
    });
    const last = this.path[this.path.length - 1];
    game.gameGrid[game.toIndex(this.path[0].i, this.path[0].j)].setState(
      TileStates.PATH_END
    );
    game.gameGrid[game.toIndex(last.i, last.j)].setState(TileStates.SELECTED);
  }

  private clearPath() {
    game.gameGrid[game.toIndex(this.start.i, this.start.j)].setState(
      TileStates.DEFAULT
    );
    if (this.previousEnd) {
      game.gameGrid[
        game.toIndex(this.previousEnd.i, this.previousEnd.j)
      ].setState(TileStates.DEFAULT);
    }
    if (this.path)
      this.path.forEach((el) =>
        game.gameGrid[game.toIndex(el.i, el.j)].setState(TileStates.DEFAULT)
      );
  }
}
