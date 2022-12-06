export class Tile {
  public i: number;
  public j: number;

  private allowDiagonal = false;

  public heuristic = 0;
  public goal = 0;
  public cost = 0;

  public neighbors: Tile[] = [];
  public previous: Tile | undefined = undefined;

  constructor(i: number, j: number, allowDiagonal?: boolean) {
    this.i = i;
    this.j = j;
    this.allowDiagonal = !!allowDiagonal;
  }

  public reset() {
    this.heuristic = 0;
    this.goal = 0;
    this.cost = 0;

    this.previous = undefined;
  }

  public addNeighbors = (grid: Tile[][]) => {
    const COLS = grid.length;
    const ROWS = grid[0].length;

    const i = this.i;
    const j = this.j;

    if (i < COLS - 1) this.neighbors.push(grid[i + 1][j]);
    if (i > 0) this.neighbors.push(grid[i - 1][j]);

    if (j > 0) this.neighbors.push(grid[i][j - 1]);
    if (j < ROWS - 1) this.neighbors.push(grid[i][j + 1]);

    if (this.allowDiagonal) {
      if (i > 0 && j > 0) this.neighbors.push(grid[i - 1][j - 1]);
      if (i > 0 && j < ROWS - 1) this.neighbors.push(grid[i - 1][j + 1]);

      if (i < COLS - 1 && j > 0) this.neighbors.push(grid[i + 1][j - 1]);
      if (i < COLS - 1 && j > ROWS - 1) this.neighbors.push(grid[i + 1][j + 1]);
    }
  };
}
