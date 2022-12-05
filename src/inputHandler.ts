enum InputCode {
  NONE = 'NONE',
  LMB_PRESSED = 'left mouse button pressed',
  LMB_RELEASED = 'left mouse button released',
  ESC_PRESSED = 'escape key pressed'
}

function mousePressed(event: object) {
  switch (mouseButton) {
    case LEFT: {
      Game.instance.lastInput = InputCode.LMB_PRESSED;
      break;
    }
  }
}

function mouseReleased(event: object) {
  switch (mouseButton) {
    case LEFT: {
      Game.instance.lastInput = InputCode.LMB_RELEASED;
      break;
    }
  }
}

function keyPressed(event: object) {
  switch (keyCode) {
    case ESCAPE: {
      Game.instance.lastInput = InputCode.ESC_PRESSED;
      break;
    }
  }
}
