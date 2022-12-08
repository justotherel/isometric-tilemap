import { p5lib } from "../../main";
import { colorToRgb } from "../../utils";
import { IsoTile } from "../isoTile";
import { TileSate } from "./tileState";
import { TileStates } from "../../interfaces/tileStates";
export class DefaultTileState extends TileSate {
  private tile: IsoTile;

  constructor(tile: IsoTile) {
    super(TileStates.DEFAULT);
    this.tile = tile;
  }

  public override enter() {
    this.tile.color = p5lib.color(this.tile.defaultColor);
    [this.tile.red, this.tile.green, this.tile.blue] = colorToRgb(
      this.tile.color
    );
  }

  public exit() { }

  public handleInput() { }
}
