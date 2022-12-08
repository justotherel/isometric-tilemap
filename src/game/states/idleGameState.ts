import { InputCode } from "../../interfaces/inputCodes"
import { game, p5lib } from "../../main";
import { GameState } from "./gameState";
import { GameStateType } from "../../interfaces/gameStateType";

export class IdleGameState extends GameState {
  constructor() {
    super(GameStateType.IDLE);
  }

  public override run(input?: InputCode) {
    super.run();

    switch (input) {
      case InputCode.LMB_PRESSED: {
        for (const tile of game.grid) {
          if (tile.isPointInsidePolygon(p5lib.mouseX, p5lib.mouseY)) {
            console.log('selected tile', tile.i, tile.j)
            game.setState(GameStateType.TILE_SELECTED, {
              selectedTile: {
                i: tile.i,
                j: tile.j,
              },
            });
            break;
          }
        }
        break;
      }
    }
  }

  override exit() {}
}
