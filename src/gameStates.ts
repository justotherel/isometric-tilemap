enum GameStateType {
  IDLE = 0,
  TILE_SELECTED = 1,
}

interface Coordinates {
  i: number;
  j: number;
}

class GameState {
  public state: GameStateType;

  constructor(state: GameStateType) {
    this.state = state;
  }

  public enter(payload?: object) {}

  // Handles tile hovering
  public run(input?: InputCode) {
    for (let i = 0; i < Game.instance.grid.length; i++) {
      if (Game.instance.grid[i].isPointInsidePolygon(mouseX, mouseY)) {
        Game.instance.grid[i].setState(TileStates.HOVERED);
        // could cause preformance issues if we were to have gorrilion tiles?
        // break;
      } else {
        if (Game.instance.grid[i].currentState.state === TileStates.HOVERED)
          Game.instance.grid[i].setState(TileStates.DEFAULT);
      }
    }
  }

  public exit() {}
}

class IdleGameState extends GameState {
  constructor() {
    super(GameStateType.IDLE);
  }

  override run(input?: InputCode) {
    super.run();

    switch (input) {
      case InputCode.LMB_PRESSED: {
        for (let i = 0; i < Game.instance.grid.length; i++) {
          if (Game.instance.grid[i].isPointInsidePolygon(mouseX, mouseY)) {
            Game.instance.setState(GameStateType.TILE_SELECTED, {
              selectedTile: {
                i: Game.instance.grid[i].i,
                j: Game.instance.grid[i].j,
              },
            });
            break;
          }
        }
        break;
      }
    }
  }

  override exit() {}
}

class TileSelectedGameState extends GameState {
  constructor() {
    super(GameStateType.TILE_SELECTED);
  }

  private start: Coordinates;
  private end: Coordinates;
  private path: Tile[];

  // kinda dangerous and whack
  public enter(enterData?: { selectedTile: Coordinates }) {
    this.start = enterData!.selectedTile;
  }

  private clearPath() {
    this.path.forEach((el) =>
      Game.instance.grid[toIndex(el.i, el.j)].setState(TileStates.DEFAULT)
    );
  }

  public exit() {
    this.clearPath();
    this.start = undefined;
    this.end = undefined;
  }

  public run(input?: InputCode) {
    for (let i = 0; i < Game.instance.grid.length; i++) {
      if (Game.instance.grid[i].isPointInsidePolygon(mouseX, mouseY)) {
        Game.instance.grid[i].setState(TileStates.HOVERED);
        if (this.end) {
          if (
            isEqual(this.end, {
              i: Game.instance.grid[i].i,
              j: Game.instance.grid[i].j,
            })
          )
            break;
          this.clearPath();
        }
        this.end = { i: Game.instance.grid[i].i, j: Game.instance.grid[i].j };
        this.setPath();
        break;
      }
    }

    switch (input) {
      case InputCode.ESC_PRESSED: {
        Game.instance.setState(GameStateType.IDLE);
        break;
      }
    }
  }

  private setPath() {
    this.path = Game.instance.aStar.findPath(
      Game.instance.aStar.getTile(this.start),
      Game.instance.aStar.getTile(this.end)
    );
    this.path.forEach((el, index) => {
      const tileIndex = toIndex(el.i, el.j);
      if (index === this.path.length - 1) {
        Game.instance.grid[tileIndex].setState(TileStates.PATH_END);
      } else {
        Game.instance.grid[tileIndex].setState(TileStates.PATH);
      }
    });
  }
}
