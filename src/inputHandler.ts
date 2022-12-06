export enum InputCode {
  NONE = 'NONE',
  LMB_PRESSED = 'left mouse button pressed',
  LMB_RELEASED = 'left mouse button released',
  ESC_PRESSED = 'escape key pressed'
}

// p5lib.mousePressed(event?: object) {s
//   switch (p5lib.mouseButton) {
//     case p5lib.LEFT: {
//       Game.instance.lastInput = InputCode.LMB_PRESSED;
//       break;
//     }
//   }
// }

// function mouseReleased(event: object) {
//   switch (p5lib.mouseButton) {
//     case p5lib.LEFT: {
//       Game.instance.lastInput = InputCode.LMB_RELEASED;
//       break;
//     }
//   }
// }

// function keyPressed(event: object) {
//   switch (p5lib.keyCode) {
//     case p5lib.ESCAPE: {
//       Game.instance.lastInput = InputCode.ESC_PRESSED;
//       break;
//     }
//   }
// }
