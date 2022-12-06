// I = COL
// J = ROW

import * as p5 from "p5";
import { Game } from "./game/game";
import { InputCode } from "./inputHandler";

let game: Game;

const sketch = (p: p5) => {

  p.setup = () => {
    game = Game.instance;
  };

  p.draw = () => {
    game.update()
  };

  p.mousePressed = () => {
    switch (p.mouseButton) {
      case p.LEFT: {
        Game.instance.lastInput = InputCode.LMB_PRESSED;
        break;
      }
    }
  };

  p.mouseReleased = () => {
    switch (p.mouseButton) {
      case p.LEFT: {
        Game.instance.lastInput = InputCode.LMB_RELEASED;
        break;
      }
    }
  };

  p.keyPressed = () => {
    switch (p5lib.keyCode) {
      case p5lib.ESCAPE: {
        Game.instance.lastInput = InputCode.ESC_PRESSED;
        break;
      }
    }
  }
};

export const p5lib = new p5(sketch);

// // P5 WILL AUTOMATICALLY USE GLOBAL MODE IF A DRAW() FUNCTION IS DEFINED
// function setup() {
//  game = Game.instance;
// }

// // p5 WILL HANDLE REQUESTING ANIMATION FRAMES FROM THE BROWSER AND WIL RUN DRAW() EACH ANIMATION FROME
// function draw() {
//   game.update()
// }
