import { COLOR_PALETTE } from "../../constants";
import { p5lib } from "../../main";
import { colorToRgb } from "../../utils";
import { IsoTile } from "../isoTile";
import { TileSate } from "./tileState";
import { TileStates } from "../../interfaces/tileStates";

export class SelectedTileState extends TileSate {
  private tile: IsoTile;

  constructor(tile: IsoTile) {
    super(TileStates.SELECTED);
    this.tile = tile;
  }

  public enter() {
    this.tile.color = p5lib.color(COLOR_PALETTE.TILE_SELECTED);
    [this.tile.red, this.tile.green, this.tile.blue] = colorToRgb(
      this.tile.color
    );
  }

  public exit() {}

  public handleInput() {}
}
