import { InputCode } from "../../../../interfaces/inputCodes";
import { TileStates } from "../../../../interfaces/tileStates";
import { TileTypes } from "../../../../interfaces/tileTypes";
import { game, p5lib } from "../../../../main";
import { GameState } from "../../../states/gameState";
import EditorMode, { EditorModeStates } from "../editorMode";

export class AddTileEditorState extends GameState {
  private editorModeObj: EditorMode;

  constructor(editModeObj: EditorMode) {
    super(EditorModeStates.ADD_TILE);
    this.editorModeObj = editModeObj;
  }

  public run(input: InputCode) {
    let currentTileIndex: number;

    for (const tile of game.grid) {
      if (tile.isPointInsidePolygon(p5lib.mouseX, p5lib.mouseY)) {
        currentTileIndex = this.editorModeObj.editorGrid.indexOf(tile);
        tile.setState(TileStates.HOVERED);
        // could cause preformance issues if we were to have gorrilion tiles?
        // break;
      } else {
        if (tile.currentState.state === TileStates.HOVERED)
          tile.setState(TileStates.DEFAULT);
      }
    }

    switch (input) {
      case InputCode.LMB_PRESSED: {
        if (currentTileIndex === undefined) {
          break;
        }
        if (
          this.editorModeObj.editorGrid[currentTileIndex].type ===
          TileTypes.PLACEHOLDER
        ) {
          this.editorModeObj.editorGrid[currentTileIndex] =
            this.editorModeObj.createNewTile(
              TileTypes.GROUND,
              this.editorModeObj.editorGrid[currentTileIndex]
            );
          game.grid = this.editorModeObj.getGridToDraw();
        }
        break;
      }
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
      case InputCode.D_KEY_PRESSED: {
        this.editorModeObj.setState(EditorModeStates.REMOVE_TILE);
        break;
      }
      default:
        break;
    }
  }
}
