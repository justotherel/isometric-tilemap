import { game, p5lib } from "../../main";
import { TileStates } from "../../interfaces/tileStates";
import { GameStateType } from "../../interfaces/gameStateType";
import { InputCode } from "../../interfaces/inputCodes";
import { EditorModeStates } from "../gameModes/editorGameMode/editorMode";

export class GameState {
  public state: GameStateType | EditorModeStates;

  constructor(state: GameStateType | EditorModeStates) {
    this.state = state;
  }

  public enter(payload?: unknown) {
    if (payload) true;
  }

  // Handles tile hovering
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public run(input?: InputCode) {
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
