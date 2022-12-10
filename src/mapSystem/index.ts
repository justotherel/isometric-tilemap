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
    const { cols = 10, rows = 10, levels = 5 } = options;

    this.cols = cols;
    this.rows = rows;
    this.levels = levels;

    this.grid = new Array(cols * rows * levels)
      .fill(undefined)
      .map((_, index) => {
        const coodrinates = this.to3D(index);
        let type: TileTypes;
        let isNavigable: boolean;
        let isAtGroundLevel: boolean;

        if (coodrinates[2] === levels - 1) {
          type = Math.random() > 0.4 ? TileTypes.GROUND : TileTypes.WATER;
          isNavigable = type === TileTypes.GROUND ? true : false;
          isAtGroundLevel = true;
        } else {
          type = TileTypes.GROUND;
          isNavigable = false;
          isAtGroundLevel = false;
        }

        return new LogicalTile({
          i: coodrinates[0],
          j: coodrinates[1],
          k: coodrinates[2],
          type,
          isNavigable,
          isAtGroundLevel,
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

  // cantCross would be used in the future
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private calculateGroundLevel(cantCross: TileTypes[] = []) {
    // console.log("cant cross:", cantCross);
    this.grid.forEach((el) => {
      if (el.k === this.levels - 1)
        // probably unnecessary to create separate objects for groundLevel
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
  }

  public to1D(x: number, y: number, z: number) {
    return x + this.rows * (y + this.levels * z);
    // z * this.cols * this.rows + y * this.cols + x;
  }

  public to3D(index: number) {
    // conscious desition was made to swap X and Y
    const x = index % this.cols;
    const y = ((index - x) / this.cols) % this.rows;
    const z = (index - x - this.rows * y) / (this.cols * this.rows);

    return [y, x, z];
  }
}
