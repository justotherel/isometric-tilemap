import { Coordinates } from "../interfaces/Coordinates";
import {  p5lib } from "../main";
import { Tile } from "./tile";

// TODO: Make cashing work, reset() messes cash up
interface Query {
  start: Tile;
  end: Tile;
}
export class AStar {
  private cols: number;
  private rows: number;

  private cash: Map<Query, Tile[]>;

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

    this.cash = new Map<Query, Tile[]>();
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

  public findPath(start: Tile, end: Tile): Tile[] | undefined {
    // this might make cash always empty ?
    this.reset();

    // cash is indeed always empty
    if (this.cash.has({ start, end })) {
      return this.cash.get({ start, end });
    }

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
        // console.log('DONE');
        const path = this.getPath(current);
        this.cash.set({ start, end }, path);
        return path;
      }

      openSet.delete(current);
      closedSet.add(current);

      const neighbors = current.neighbors;

      for (const neighbor of neighbors) {
        if (!closedSet.has(neighbor)) {
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

    // console.log('No solution');
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

  public getTile(coords: Coordinates) {
    // would be a good idea to check for out of boundaries
    return this.grid[coords.i][coords.j];
  }
}
