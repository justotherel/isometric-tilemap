import { TileTypes } from "../interfaces/tileTypes";
import { p5lib } from "../main";
import { IsoTile } from "./isoTile";
import { COLOR_PALETTE } from "../constants";

export class WaterIsoTile extends IsoTile {
  constructor(options: {
    i: number;
    j: number;
    x: number;
    y: number;
    size: number;
  }) {
    const { i, j, x, y, size } = options;
    super({
      i,
      j,
      x,
      y,
      size,
      type: TileTypes.WATER,
      tileColor: p5lib.color(COLOR_PALETTE.TILE_WATER),
    });
  }
}
