import { IsoTile } from "../isoTile";
import { TileSate } from "./tileState";
import { TileStates } from "../../interfaces/tileStates";


export class HoveredTileState extends TileSate {
  private tile: IsoTile;
  constructor(tile: IsoTile) {
    super(TileStates.HOVERED);
    this.tile = tile;
  }

  public enter() {
    this.tile.hoverOffset = 0.1 * this.tile.size;
  }

  public exit() {
    this.tile.hoverOffset = 0;
  }

  public handleInput() { }
}
