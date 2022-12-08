import { TileTypes } from "../interfaces/tileTypes";
import { AStar } from "./pathfinding/aStar";
import { LogicalTile } from "./logicalTile";
import { Coordinates } from "../interfaces/Coordinates";

export class MapSystem {
  private cols: number;
  private rows: number;
  private levels: number;

  public grid: LogicalTile[];
  public groundLevel: LogicalTile[];

  private aStar: AStar;

  constructor() {
    this.aStar = new AStar({});
    this.grid = [];
    this.groundLevel = [];
  }

  public generateMap(options: {
    cols?: number;
    rows?: number;
    levels?: number;
  }) {
    const { cols = 10, rows = 10, levels = 1 } = options;

    this.cols = cols;
    this.rows = rows;
    this.levels = levels;

    this.grid = new Array(cols * rows * levels)
      .fill(undefined)
      .map((_, index) => {
        const coodrinates = this.to3D(index);
        const type = Math.random() > 0.4 ? TileTypes.GROUND : TileTypes.WATER;
        const isNavigable = type === TileTypes.GROUND ? true : false;
        return new LogicalTile({
          i: coodrinates[0],
          j: coodrinates[1],
          k: coodrinates[2],
          type,
          isNavigable,
        });
      });

    this.calculateGroundLevel();
    this.aStar.configureGrid(this.groundLevel);
  }

  public getPath(start: Coordinates, end: Coordinates) {
    const startPath = this.aStar.getTile(start);
    const endPath = this.aStar.getTile(end);
    
    return this.aStar.findPath(startPath, endPath);
  }

  private parseMapFile() {}

  private calculateGroundLevel(cantCross: TileTypes[] = []) {
    console.log("cant cross:", cantCross);
    this.grid.forEach((el) => {
      this.groundLevel.push(
        new LogicalTile({
          i: el.i,
          j: el.j,
          k: el.k,
          type: el.type,
          isNavigable: el.isNavigable,
        })
      );
    });
    // if (this.levels === 1) {
    //   this.groundLevel = this.grid.map((el) => {
    //     el.isNavigable = !!cantCross.find((type) => type === el.type);
    //     const newTile = new LogicalTile({
    //       i: el.i,
    //       j: el.j,
    //       k: el.k,
    //       type: el.type,
    //     });
    //     newTile.isNavigable = el.isNavigable;
    //     return newTile;
    //   });
    // }
  }

  public to1D(x: number, y: number, z: number) {
    return x + this.rows * (y + this.levels * z);
    // z * this.cols * this.rows + y * this.cols + x;
  }

  public to3D(index: number) {
    // const z = index / (this.cols * this.rows);
    // index -= z * this.cols * this.rows;
    // const y = index / this.cols;
    // const x = index % this.cols;

    // conscious desition was made to swap X and Y
    const x = index % this.cols;
    const y = ((index - x) / this.cols) % this.rows;
    const z = (index - x - this.rows * y) / (this.cols * this.rows);

    return [y, x, z];
  }
}
