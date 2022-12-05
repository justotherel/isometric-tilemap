// TODO: Tiles can be at different states at the same time ??? Hovered + Selected;

enum TileStates {
  DEFAULT = 0,
  SELECTED = 1,
  HOVERED = 2,
  PATH = 3,
  PATH_END = 4,
}

class TileSate {
  public state: TileStates;
  constructor(state: TileStates) {
    this.state = state;
  }

  public enter() {}

  public exit() {}

  // TODO: Rename to update / draw ???
  // Handles state-specific draw logic ?
  public handleInput() {}
}

class DefaultTileState extends TileSate {
  private tile: IsoTile;

  constructor(tile: IsoTile) {
    super(TileStates.DEFAULT);
    this.tile = tile;
  }

  public enter() {
    this.tile.color = color(COLOR_PALETTE.TILE_PRIMARY);
    [this.tile.red, this.tile.green, this.tile.blue] = colorToRgb(
      this.tile.color
    );
  }

  public exit() {}

  public handleInput() {}
}

class SelectedTileState extends TileSate {
  private tile: IsoTile;

  constructor(tile: IsoTile) {
    super(TileStates.SELECTED);
    this.tile = tile;
  }

  public enter() {
    this.tile.color = color(COLOR_PALETTE.TILE_SELECTED);
    [this.tile.red, this.tile.green, this.tile.blue] = colorToRgb(
      this.tile.color
    );
  }

  public exit() {}

  public handleInput() {}
}

class HoveredTileState extends TileSate {
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

  public handleInput() {}
}

class PathTileState extends TileSate {
  private tile: IsoTile;
  constructor(tile: IsoTile) {
    super(TileStates.PATH);
    this.tile = tile;
  }

  public enter() {
    this.tile.color = color(COLOR_PALETTE.TILE_PATH);
    [this.tile.red, this.tile.green, this.tile.blue] = colorToRgb(
      this.tile.color
    );
  }

  public exit() {}

  public handleInput() {}
}

class PathEndTileState extends TileSate {
  private tile: IsoTile;
  constructor(tile: IsoTile) {
    super(TileStates.PATH_END);
    this.tile = tile;
  }

  public enter() {
    this.tile.color = color(COLOR_PALETTE.TILE_PATH_END);
    [this.tile.red, this.tile.green, this.tile.blue] = colorToRgb(
      this.tile.color
    );
  }

  public exit() {}

  public handleInput() {}
}
