import { game, p5lib } from "../../main";
import { TileStates } from "../../interfaces/tileStates";
import { GameStateType } from "../../interfaces/gameStateType";
import { InputCode } from "../../interfaces/inputCodes";

export class GameState {
  public state: GameStateType;

  constructor(state: GameStateType) {
    this.state = state;
  }

  public enter(payload?: unknown) {
    if (payload) true;
  }

  // Handles tile hovering
  // input?: InputCode
  public run(input?: InputCode) {
    if (input) true;
    for (const tile of game.gameGrid) {
      if (tile.isPointInsidePolygon(p5lib.mouseX, p5lib.mouseY)) {
        tile.setState(TileStates.HOVERED);
        // could cause preformance issues if we were to have gorrilion tiles?
        // break;
      } else {
        if (tile.currentState.state === TileStates.HOVERED)
          tile.setState(TileStates.DEFAULT);
      }
    }
  }

  public exit() {}
}
