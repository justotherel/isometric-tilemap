// GLOBAL VARS & TYPES
interface Coordinates {
  i: number;
  j: number;
}

const COLOR_PALETTE = {
  BACKGROUND_DARK: '#003049',
  TILE_PRIMARY: '#D62828',
  TILE_SELECTED: 'F77F00'
}

const WIDTH = 600;
const HEIGHT = 600;
const GRID_SIZE = 10;
const TILE_SIZE = WIDTH / GRID_SIZE;

let aStar: AStar;
let lastInput: string;

const grid: IsoTile[] = [];

let start: Coordinates | undefined;
let end: Coordinates | undefined;

// P5 WILL AUTOMATICALLY USE GLOBAL MODE IF A DRAW() FUNCTION IS DEFINED
function setup() {
  console.log("🚀 - Setup initialized - P5 is running");
  createCanvas(WIDTH, HEIGHT);
  frameRate(60);

  for (let i = 0; i < GRID_SIZE; i++) {
    for (let j = 0; j < GRID_SIZE; j++) {
      const iso = toIso(i * TILE_SIZE - TILE_SIZE, j * TILE_SIZE);
      grid.push(
        new IsoTile({
          i,
          j,
          x: iso.x + width / 2,
          y: iso.y + height / 4,
          size: TILE_SIZE,
        })
      );
    }
  }
  aStar = new AStar(GRID_SIZE, GRID_SIZE);
  const path = aStar.findPath(aStar.grid[0][0], aStar.grid[6][7]);
  path!.forEach(el => grid.find(tile => tile.i === el.i && tile.j === el.j).isSelected = true);
}

// p5 WILL HANDLE REQUESTING ANIMATION FRAMES FROM THE BROWSER AND WIL RUN DRAW() EACH ANIMATION FROME
function draw() {
  background(COLOR_PALETTE.BACKGROUND_DARK);
  drawLastInputStatusText()
  grid.forEach(el => {
    el.update(lastInput);
    el.draw()
  });

}
