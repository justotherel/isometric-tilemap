import EditorMode, { EditorModeStates } from "../editorMode";
import { InputCode } from "../../../../interfaces/inputCodes";
import { TileStates } from "../../../../interfaces/tileStates";
import { game, p5lib } from "../../../../main";
import { GameState } from "../../../states/gameState";

export class IdleEditorState extends GameState {
  private editorModeObj: EditorMode;

  constructor(editModeObj: EditorMode) {
    super(EditorModeStates.IDLE);
    this.editorModeObj = editModeObj;
  }

  public run(input?: InputCode) {
    for (const tile of game.grid) {
      if (tile.isPointInsidePolygon(p5lib.mouseX, p5lib.mouseY)) {
        tile.setState(TileStates.HOVERED);
        // could cause preformance issues if we were to have gorrilion tiles?
        // break;
      } else {
        if (tile.currentState.state === TileStates.HOVERED)
          tile.setState(TileStates.DEFAULT);
      }
    }

    switch (input) {
      case InputCode.ARROW_UP_PRESSED: {
        this.editorModeObj.currentLevel++;
        game.grid = this.editorModeObj.getGridToDraw();
        break;
      }
      case InputCode.ARROW_DOWN_PRESSED: {
        this.editorModeObj.currentLevel--;
        game.grid = this.editorModeObj.getGridToDraw();
        break;
      }
      case InputCode.A_KEY_PRESSSED: {
        this.editorModeObj.setState(EditorModeStates.ADD_TILE);
        break;
      }
      default:
        break;
    }
  }
}
