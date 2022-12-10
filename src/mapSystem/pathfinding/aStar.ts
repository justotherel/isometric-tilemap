import { Coordinates } from "../../interfaces/Coordinates";
import { p5lib } from "../../main";
import { LogicalTile } from "../logicalTile";
import { Tile } from "./tile";

export class AStar {
  private cols: number;
  private rows: number;

  public grid: Tile[][] = [];

  constructor(options: { groundLevel?: LogicalTile[] }) {
    const { groundLevel } = options;
    if (groundLevel) this.configureGrid(groundLevel);
  }

  public configureGrid(groundLevel: LogicalTile[]) {
    this.cols = Math.max(...groundLevel.map((el) => el.i)) + 1;
    this.rows = Math.max(...groundLevel.map((el) => el.j)) + 1;

    for (let i = 0; i < this.cols; i++) {
      this.grid[i] = new Array(this.rows).fill(undefined);
    }

    for (let i = 0; i < this.cols; i++) {
      for (let j = 0; j < this.rows; j++) {
        this.grid[i][j] = new Tile(
          i,
          j,
          groundLevel[this.toIndex(i, j)].isNavigable
        );
      }
    }

    for (let i = 0; i < this.cols; i++) {
      for (let j = 0; j < this.rows; j++) {
        this.grid[i][j].addNeighbors(this.grid);
      }
    }
  }

  public findPath(start: Tile, end: Tile): Tile[] | undefined {
    this.reset();

    if (!start.isNavigable) return undefined;

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

      const current = osArr[next];

      if (current === end) {
        // DONE
        const path = this.getPath(current);
        return path;
      }

      openSet.delete(current);
      closedSet.add(current);

      const neighbors = current.neighbors;

      for (const neighbor of neighbors) {
        if (!closedSet.has(neighbor) && neighbor.isNavigable) {
          const tempGoal = current.goal + this.heuristic(neighbor, current);

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

    // No solution
    return undefined;
  }

  public getPath(current: Tile): Tile[] {
    const path = [];
    let temp = current;
    path.push(temp);
    while (temp.previous) {
      path.push(temp.previous);
      temp = temp.previous;
    }
    return path;
  }

  private heuristic(a: Tile, b: Tile): number {
    return p5lib.dist(a.i, a.j, b.i, b.j);
  }

  private reset() {
    for (let i = 0; i < this.cols; i++) {
      for (let j = 0; j < this.rows; j++) {
        this.grid[i][j].reset();
      }
    }
  }

  public getTile(coords: Coordinates) {
    // would be a good idea to check for out of boundaries
    return this.grid[coords.i][coords.j];
  }

  private toIndex(i: number, j: number) {
    return i * this.rows + j;
  }
}
