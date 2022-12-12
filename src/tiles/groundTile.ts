import { TileTypes } from "../interfaces/tileTypes";
import { p5lib } from "../main";
import { IsoTile } from "./isoTile";
import { COLOR_PALETTE } from "../constants";

export class GroundIsoTile extends IsoTile {

  constructor(options: {
    i: number;
    j: number;
    k?: number;
    x: number;
    y: number;
    size: number;
  }) {
    const { i, j, k, x, y, size } = options;
    super({
      i,
      j,
      k,
      x,
      y,
      size,
      type: TileTypes.GROUND,
      tileColor: p5lib.color(COLOR_PALETTE.TILE_GROUND),
    });
  }
}
