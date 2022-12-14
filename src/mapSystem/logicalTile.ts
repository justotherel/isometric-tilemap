import { TileTypes } from "../interfaces/tileTypes";

export class LogicalTile {
  public i: number;
  public j: number;
  public k: number;

  public type: TileTypes;

  public isAtGroundLevel: boolean;
  public isNavigable: boolean;

  constructor(options: {
    i: number;
    j: number;
    k: number;
    type: TileTypes;
    isNavigable?: boolean;
    isAtGroundLevel?: boolean;
  }) {
    const { i, j, k, type, isNavigable, isAtGroundLevel } = options;

    this.i = i;
    this.j = j;
    this.k = k;
    this.type = type;

    if (isNavigable) this.isNavigable = isNavigable;
    if (isAtGroundLevel) this.isAtGroundLevel = isAtGroundLevel;
  }
}
