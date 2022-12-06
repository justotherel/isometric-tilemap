import * as p5 from "p5";
import { IsoTile } from "./isoTile";

export class GroundIsoTile extends IsoTile {
  constructor(options: {
    i: number;
    j: number;
    x: number;
    y: number;
    size: number;
    tileColor?: p5.Color;
  }) {
    const { i, j, x, y, size, tileColor } = options;
    super({ i, j, x, y, size, tileColor });
  }
}
