import { COLOR_PALETTE } from "../constants";
import { TileTypes } from "../interfaces/tileTypes";
import { p5lib } from "../main";
import { IsoTile } from "./isoTile";

export class EditorPlaceholderIsoTile extends IsoTile {

  constructor(options: {
    i: number;
    j: number;
    k?: number;
    x: number;
    y: number;
    size: number;
  }) {
    super({
      ...options,
      type: TileTypes.PLACEHOLDER,
      tileColor: p5lib.color(COLOR_PALETTE.TEXT_PRIMARY),
    });
  }

  public draw() {
    p5lib.stroke(this.red * 0.3, this.green * 0.3, this.blue * 0.3);
    p5lib.strokeWeight(2);
    p5lib.noFill();
    
    p5lib.quad(
      this.A.x,
      this.A.y - this.hoverOffset,
      this.B.x,
      this.B.y - this.hoverOffset,
      this.C.x,
      this.C.y - this.hoverOffset,
      this.D.x,
      this.D.y - this.hoverOffset
    );

    p5lib.quad(
      this.A.x,
      this.A.y - this.hoverOffset,
      this.D.x,
      this.D.y - this.hoverOffset,
      this.G.x,
      this.G.y - this.hoverOffset,
      this.E.x,
      this.E.y - this.hoverOffset
    );

    p5lib.quad(
      this.D.x,
      this.D.y - this.hoverOffset,
      this.C.x,
      this.C.y - this.hoverOffset,
      this.F.x,
      this.F.y - this.hoverOffset,
      this.G.x,
      this.G.y - this.hoverOffset
    );
  }
}
