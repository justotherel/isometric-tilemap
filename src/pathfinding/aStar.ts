class AStar {
  private cols: number;
  private rows: number;

  public grid: Tile[][] = [];

  constructor(cols: number, rows: number) {
    this.cols = cols;
    this.rows = rows;

    for (let i = 0; i < cols; i++) {
      this.grid[i] = new Array(this.rows);
    }

    for (let i = 0; i < this.cols; i++) {
      for (let j = 0; j < this.rows; j++) {
        this.grid[i][j] = new Tile(i, j);
      }
    }

    for (let i = 0; i < this.cols; i++) {
      for (let j = 0; j < this.rows; j++) {
        this.grid[i][j].addNeighbors(this.grid);
      }
    }
  }

  heuristic(a: Tile, b: Tile) {
    var d = dist(a.i, a.j, b.i, b.j);
    return d;
  }

  findPath(start: Tile, end: Tile): Tile[] | undefined {
    const openSet = new Set<Tile>();
    const closedSet = new Set<Tile>();

    openSet.add(start);

    while (openSet.size > 0) {
      const osArr = Array.from(openSet);
      let next = 0;

      for (let i = 0; i < osArr.length; i++) {
        if (osArr[i].cost < osArr[next].cost) {
          next = i;
        }
      }

      let current = osArr[next];

      if (current === end) {
        // console.log('DONE');
        return this.getPath(current);
      }

      openSet.delete(current);
      closedSet.add(current);

      let neighbors = current.neighbors;

      for (const neighbor of neighbors) {
        if (!closedSet.has(neighbor)) {
          let tempGoal = current.goal + this.heuristic(neighbor, current);

          let newPath = false;
          if (openSet.has(neighbor)) {
            if (tempGoal < neighbor.goal) {
              neighbor.goal = tempGoal;
              newPath = true;
            }
          } else {
            neighbor.goal = tempGoal;
            newPath = true;
            openSet.add(neighbor);
          }

          if (newPath) {
            neighbor.heuristic = this.heuristic(neighbor, end);
            neighbor.cost = neighbor.goal + neighbor.heuristic;
            neighbor.previous = current;
          }
        }
      }
    }

    // console.log('No solution');
    return undefined;
  }

  getPath(current: Tile): Tile[] {
    const path = [];
    let temp = current;
    path.push(temp);
    while (temp.previous) {
      path.push(temp.previous);
      temp = temp.previous;
    }
    return path;
  }
}

class Tile {
  public i: number;
  public j: number;
  
  public heuristic = 0;
  public goal = 0;
  public cost = 0;

  public neighbors: Tile[] = [];
  public previous: Tile | undefined = undefined;

  constructor(i: number, j: number) {
    this.i = i;
    this.j = j;
  }


  public addNeighbors = function (grid: Tile[][]) {
    const COLS = grid.length;
    const ROWS = grid[0].length;

    const i = this.i;
    const j = this.j;

    if (i < COLS - 1) this.neighbors.push(grid[i + 1][j]);
    if (i > 0) this.neighbors.push(grid[i - 1][j]);

    if (j > 0) this.neighbors.push(grid[i][j - 1]);

    if (j < ROWS - 1) this.neighbors.push(grid[i][j + 1]);

    if (i > 0 && j > 0) this.neighbors.push(grid[i - 1][j - 1]);
    if (i > 0 && j < ROWS - 1) this.neighbors.push(grid[i - 1][j + 1]);

    if (i < COLS - 1 && j > 0) this.neighbors.push(grid[i + 1][j - 1]);
    if (i < COLS - 1 && j > ROWS - 1) this.neighbors.push(grid[i + 1][j + 1]);
  };
}
