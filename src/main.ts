// GLOBAL VARS & TYPES

// I = COL
// J = ROW
interface Coordinates {
  i: number;
  j: number;
}

const COLOR_PALETTE = {
  BACKGROUND_DARK: "#003049",
  TILE_PRIMARY: "#D62828",
  TILE_SELECTED: "#F77F00",
  TILE_PATH_END: "#FCBF49",
  TILE_PATH: '#EAE2B7'
};

let game: Game;

// P5 WILL AUTOMATICALLY USE GLOBAL MODE IF A DRAW() FUNCTION IS DEFINED
function setup() {
 game = Game.instance;
}

// p5 WILL HANDLE REQUESTING ANIMATION FRAMES FROM THE BROWSER AND WIL RUN DRAW() EACH ANIMATION FROME
function draw() {
  game.update()
}
