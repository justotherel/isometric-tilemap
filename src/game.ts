class Game {
  private static _instance: Game;

  public FRAME_RATE = 60;
  public WIDTH = 600;
  public HEIGHT = 600;
  public GRID_SIZE = 10;
  public TILE_SIZE: number;

  public aStar: AStar;

  public COLOR_PALETTE = {
    BACKGROUND_DARK: "#003049",
    TILE_PRIMARY: "#D62828",
    TILE_SELECTED: "#F77F00",
    TILE_PATH_END: '#EAE2B7', 
    TILE_PATH: "#FCBF49"
  };

  public lastInput = InputCode.NONE;

  private states: GameState[] = [
    new IdleGameState(),
    new TileSelectedGameState(),
  ];
  private currentState: GameState;

  public rows: number;
  public cols: number;

  public grid: IsoTile[] = [];

  private constructor(gameParams?: {
    canvasWidth?: number;
    canvasHeight?: number;
    gridSize?: number;
    tileSize?: number;
    desiredFrameRate?: number;
  }) {
    const { canvasHeight, canvasWidth, gridSize, tileSize, desiredFrameRate } =
      gameParams;
    if (canvasWidth) this.WIDTH = canvasWidth;
    if (canvasHeight) this.HEIGHT = canvasHeight;
    if (gridSize) this.GRID_SIZE = gridSize;
    if (desiredFrameRate) this.FRAME_RATE = desiredFrameRate;
    this.TILE_SIZE = tileSize ? tileSize : this.WIDTH / this.GRID_SIZE;

    console.log(
      "🚀 - Setup initialized within Game Object - P5 and Game logic is running"
    );
    createCanvas(this.WIDTH, this.HEIGHT);
    frameRate(this.FRAME_RATE);

    this.cols = this.GRID_SIZE;
    this.rows = this.GRID_SIZE;

    this.currentState = this.states[GameStateType.IDLE];

    this.aStar = new AStar(this.cols, this.rows);

    for (let i = 0; i < this.GRID_SIZE; i++) {
      for (let j = 0; j < this.GRID_SIZE; j++) {
        const iso = toIso(
          i * this.TILE_SIZE - this.TILE_SIZE,
          j * this.TILE_SIZE
        );
        this.grid.push(
          new IsoTile({
            i,
            j,
            x: iso.x + this.WIDTH / 2,
            y: iso.y + this.HEIGHT / 4,
            size: this.TILE_SIZE,
            tileColor: color(this.COLOR_PALETTE.TILE_PRIMARY)
          })
        );
      }
    }
  }

  private drawLastInputStatusText() {
    textSize(32);
    text(`Last input: ${this.lastInput}`, 10, 30);
  }

  public setState(state: GameStateType, payload?: object) {
    this.currentState.exit();
    this.currentState = this.states[state];
    this.currentState.enter(payload);
  }

  public update() {
    background(this.COLOR_PALETTE.BACKGROUND_DARK);
    this.grid.forEach((el) => el.draw());
    this.currentState.run(this.lastInput);
    this.drawLastInputStatusText();
  }

  public static get instance() {
    if (!Game._instance) {
      Game._instance = new Game({});
    }
    return Game._instance;
  }
}
