// I = COL
// J = ROW

import * as p5 from "p5";
import { Game } from "./game/game";
import { InputCode } from "./interfaces/inputCodes";

export let game: Game;

const sketch = (p: p5) => {
  p.setup = () => {
    game = Game.instance;
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
    }
  };
};

export const p5lib = new p5(sketch);
