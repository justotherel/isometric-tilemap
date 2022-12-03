// TODO: Fix janky tile selection 

enum TileStates {
  DEFAULT = 0,
  SELECTED = 1,
  HOVERED = 2,
  PATH_START = 3,
  PATH_END = 4,
}

class TileSate {
  public state: TileStates;
  constructor(state: TileStates) {
    this.state = state;
  }

  public enter() {

  } 

  public handleInput() {

  }
}

class DefaultTileState extends TileSate {
  private tile: IsoTile;

  constructor(tile: IsoTile) {
    super(TileStates.DEFAULT);
    this.tile = tile;
  }

  public enter() {
    this.tile.hoverOffset = 0;
    this.tile.color = color(COLOR_PALETTE.TILE_PRIMARY);
    [this.tile.red, this.tile.green, this.tile.blue] = hexToRgb(
      this.tile.color.toString("#rrggbb")
    );
  }

  override handleInput() {
    switch (lastInput) {
      case InputCode.LMB_PRESSED: {
        console.log('DEAFULT TILE STATE INPUT HANDLER CALLED');
        if (this.tile.isPointInsidePolygon(mouseX, mouseY)) {
          this.tile.setState(TileStates.HOVERED);
        }
        // lastInput = '';
        break;
      }
    }
  }
}

class HoveredTileState extends TileSate {
  private tile: IsoTile;

  constructor(tile: IsoTile) {
    super(TileStates.HOVERED);
    this.tile = tile;
  }

  public enter() {
    this.tile.hoverOffset = 0.1 * this.tile.size;
    this.tile.color = color(COLOR_PALETTE.TILE_SELECTED);
    [this.tile.red, this.tile.green, this.tile.blue] = hexToRgb(
      this.tile.color.toString("#rrggbb")
    );
  }

  override handleInput() {
    switch (lastInput) {
      case InputCode.LMB_PRESSED: {
        console.log('HOVERED TILE STATE INPUT HANDLER CALLED');
        if (this.tile.isPointInsidePolygon(mouseX, mouseY)) {
          this.tile.setState(TileStates.DEFAULT);

        }
        // lastInput = '';
        break;
      }
    }
  }
}

class SelectedTileState extends TileSate {
  private tile: IsoTile;
  constructor(tile: IsoTile) {
    super(TileStates.SELECTED);
    this.tile = tile;
  }

  public enter() {}

  handleInput() {}
}
