class IsoTile {
  public i: number;
  public j: number;
  public x: number;
  public y: number;
  public size: number;

  public color = color(COLOR_PALETTE.TILE_PRIMARY);

  public red: number;
  public green: number;
  public blue: number;

  public isSelectable: boolean;
  public isSelected = false;
  public isStart = false;

  public states: TileSate[];
  public currentState: TileSate;

  public hoverOffset = 0;

  private A: p5.Vector;
  private B: p5.Vector;
  private C: p5.Vector;
  private D: p5.Vector;
  private E: p5.Vector;
  private F: p5.Vector;
  private G: p5.Vector;

  constructor(options: {
    i: number;
    j: number;
    x: number;
    y: number;
    size: number;
    tileColor?: p5.Color;
  }) {
    const { i, j, x, y, size, tileColor } = options;

    this.i = i;
    this.j = j;
    this.x = x;
    this.y = y;
    this.size = size;
    this.isSelected = false;
    this.isStart = false;

    this.states = [
      new DefaultTileState(this),
      new SelectedTileState(this),
      new HoveredTileState(this),
      new PathTileState(this),
      new PathEndTileState(this)
    ];
    if (color) this.color = tileColor;
    this.currentState = this.states[TileStates.DEFAULT];
    [this.red, this.green, this.blue] = colorToRgb(this.color);
    this.currentState.enter();
    this.calculateGeometry();
  }

  private calculateGeometry() {
    this.A = createVector(this.x, this.y + 0.25 * this.size);
    this.B = createVector(this.x + 0.5 * this.size, this.y);
    this.C = createVector(this.x + this.size, this.y + 0.25 * this.size);
    this.D = createVector(this.x + 0.5 * this.size, this.y + 0.5 * this.size);
    this.E = createVector(this.x, this.y + 0.75 * this.size);
    this.F = createVector(this.x + this.size, this.y + 0.75 * this.size);
    this.G = createVector(this.x + 0.5 * this.size, this.y + this.size);
  }

  public draw() {
    stroke(this.red * 0.3, this.green * 0.3, this.blue * 0.3);
    strokeWeight(2);

    fill(this.red * 0.75, this.green * 0.75, this.blue * 0.75);
    quad(
      this.A.x,
      this.A.y - this.hoverOffset,
      this.B.x,
      this.B.y - this.hoverOffset,
      this.C.x,
      this.C.y - this.hoverOffset,
      this.D.x,
      this.D.y - this.hoverOffset
    );

    fill(this.red * 0.9, this.green * 0.9, this.blue * 0.9);
    quad(
      this.A.x,
      this.A.y - this.hoverOffset,
      this.D.x,
      this.D.y - this.hoverOffset,
      this.G.x,
      this.G.y - this.hoverOffset,
      this.E.x,
      this.E.y - this.hoverOffset
    );

    fill(this.red, this.green, this.blue);
    quad(
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

  public update(input: string) {
    this.currentState.handleInput();
  }

  public setState(state: TileStates) {
    this.currentState.exit();
    this.currentState = this.states[state];
    this.currentState.enter();
  }

  public isPointInsidePolygon(x: number, y: any): boolean {
    let pX = [this.A.x, this.B.x, this.C.x, this.D.x];
    let pY = [this.A.y, this.B.y, this.C.y, this.D.y];
    let j = pX.length - 1;
    let odd: number;

    for (let i = 0; i < pX.length; i++) {
      if (
        ((pY[i] < y && pY[j] >= y) || (pY[j] < y && pY[i] >= y)) &&
        (pX[i] <= x || pX[j] <= x)
      ) {
        const tmp =
          pX[i] + ((y - pY[i]) * (pX[j] - pX[i])) / (pY[j] - pY[i]) < x;
        odd ^= +tmp;
      }
      j = i;
    }
    return !!odd;
  }
}
