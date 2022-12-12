// I = COL
// J = ROW

import * as p5 from "p5";
import { Game } from "./game/game";
import { GameModes } from "./game/gameModes/gameMode";
import { InputCode } from "./interfaces/inputCodes";
import { KeyCodes } from "./interfaces/keyCodes";

export let game: Game;

const sketch = (p: p5) => {
  p.setup = () => {
    game = Game.instance;
    game.setMode(GameModes.EDITOR);
  };

  p.draw = () => {
    game.update();
  };

  p.mousePressed = () => {
    switch (p.mouseButton) {
      case p.LEFT: {
        game.lastInput = InputCode.LMB_PRESSED;
        break;
      }
    }
  };

  p.mouseReleased = () => {
    switch (p.mouseButton) {
      case p.LEFT: {
        game.lastInput = InputCode.LMB_RELEASED;
        break;
      }
    }
  };

  p.keyPressed = () => {
    switch (p5lib.keyCode) {
      case p5lib.ESCAPE: {
        game.lastInput = InputCode.ESC_PRESSED;
        break;
      }
      case p5lib.UP_ARROW: {
        game.lastInput = InputCode.ARROW_UP_PRESSED;
        break;
      }
      case p5lib.DOWN_ARROW: {
        game.lastInput = InputCode.ARROW_DOWN_PRESSED;
        break;
      }
      case KeyCodes.A: {
        game.lastInput = InputCode.A_KEY_PRESSSED
      }
    }
  };

  p.keyReleased = () => {
    switch (p5lib.keyCode) {
      case p5lib.UP_ARROW: {
        game.lastInput = InputCode.ARROW_UP_RELEASED;
        break;
      }
      case p5lib.DOWN_ARROW: {
        game.lastInput = InputCode.ARROW_DOWN_RELEASED;
        break;
      }
      case KeyCodes.A: {
        game.lastInput = InputCode.A_KEY_RELEASED
      }
    }
  };
};

export const p5lib = new p5(sketch);
