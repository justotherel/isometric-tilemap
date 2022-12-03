enum InputCode {
  LMB_PRESSED = 'left mouse button pressed',
  LMB_RELEASED = 'left mouse button released'
}

function mousePressed() {
  switch (mouseButton) {
    case LEFT: {
      lastInput = InputCode.LMB_PRESSED;
      break;
    }
  }
}

function mouseReleased() {
  switch (mouseButton) {
    case LEFT: {
      lastInput = InputCode.LMB_RELEASED;
      break;
    }
  }
}

function drawLastInputStatusText() {
  textSize(32);
  text(`Last input: ${lastInput}`, 10, 30);
}
