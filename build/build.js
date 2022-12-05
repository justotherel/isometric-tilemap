class Game {
    constructor(gameParams) {
        this.FRAME_RATE = 60;
        this.WIDTH = 600;
        this.HEIGHT = 600;
        this.GRID_SIZE = 10;
        this.COLOR_PALETTE = {
            BACKGROUND_DARK: "#003049",
            TILE_PRIMARY: "#D62828",
            TILE_SELECTED: "#F77F00",
            TILE_PATH_END: '#EAE2B7',
            TILE_PATH: "#FCBF49"
        };
        this.lastInput = InputCode.NONE;
        this.states = [
            new IdleGameState(),
            new TileSelectedGameState(),
        ];
        this.grid = [];
        const { canvasHeight, canvasWidth, gridSize, tileSize, desiredFrameRate } = gameParams;
        if (canvasWidth)
            this.WIDTH = canvasWidth;
        if (canvasHeight)
            this.HEIGHT = canvasHeight;
        if (gridSize)
            this.GRID_SIZE = gridSize;
        if (desiredFrameRate)
            this.FRAME_RATE = desiredFrameRate;
        this.TILE_SIZE = tileSize ? tileSize : this.WIDTH / this.GRID_SIZE;
        console.log("🚀 - Setup initialized within Game Object - P5 and Game logic is running");
        createCanvas(this.WIDTH, this.HEIGHT);
        frameRate(this.FRAME_RATE);
        this.cols = this.GRID_SIZE;
        this.rows = this.GRID_SIZE;
        this.currentState = this.states[GameStateType.IDLE];
        this.aStar = new AStar(this.cols, this.rows);
        for (let i = 0; i < this.GRID_SIZE; i++) {
            for (let j = 0; j < this.GRID_SIZE; j++) {
                const iso = toIso(i * this.TILE_SIZE - this.TILE_SIZE, j * this.TILE_SIZE);
                this.grid.push(new IsoTile({
                    i,
                    j,
                    x: iso.x + this.WIDTH / 2,
                    y: iso.y + this.HEIGHT / 4,
                    size: this.TILE_SIZE,
                    tileColor: color(this.COLOR_PALETTE.TILE_PRIMARY)
                }));
            }
        }
    }
    drawLastInputStatusText() {
        textSize(32);
        text(`Last input: ${this.lastInput}`, 10, 30);
    }
    setState(state, payload) {
        this.currentState.exit();
        this.currentState = this.states[state];
        this.currentState.enter(payload);
    }
    update() {
        background(this.COLOR_PALETTE.BACKGROUND_DARK);
        this.grid.forEach((el) => el.draw());
        this.currentState.run(this.lastInput);
        this.drawLastInputStatusText();
    }
    static get instance() {
        if (!Game._instance) {
            Game._instance = new Game({});
        }
        return Game._instance;
    }
}
var GameStateType;
(function (GameStateType) {
    GameStateType[GameStateType["IDLE"] = 0] = "IDLE";
    GameStateType[GameStateType["TILE_SELECTED"] = 1] = "TILE_SELECTED";
})(GameStateType || (GameStateType = {}));
class GameState {
    constructor(state) {
        this.state = state;
    }
    enter(payload) { }
    run(input) {
        for (let i = 0; i < Game.instance.grid.length; i++) {
            if (Game.instance.grid[i].isPointInsidePolygon(mouseX, mouseY)) {
                Game.instance.grid[i].setState(TileStates.HOVERED);
            }
            else {
                if (Game.instance.grid[i].currentState.state === TileStates.HOVERED)
                    Game.instance.grid[i].setState(TileStates.DEFAULT);
            }
        }
    }
    exit() { }
}
class IdleGameState extends GameState {
    constructor() {
        super(GameStateType.IDLE);
    }
    run(input) {
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
    exit() { }
}
class TileSelectedGameState extends GameState {
    constructor() {
        super(GameStateType.TILE_SELECTED);
    }
    enter(enterData) {
        this.start = enterData.selectedTile;
    }
    clearPath() {
        this.path.forEach((el) => Game.instance.grid[toIndex(el.i, el.j)].setState(TileStates.DEFAULT));
    }
    exit() {
        this.clearPath();
        this.start = undefined;
        this.end = undefined;
    }
    run(input) {
        for (let i = 0; i < Game.instance.grid.length; i++) {
            if (Game.instance.grid[i].isPointInsidePolygon(mouseX, mouseY)) {
                Game.instance.grid[i].setState(TileStates.HOVERED);
                if (this.end) {
                    if (isEqual(this.end, {
                        i: Game.instance.grid[i].i,
                        j: Game.instance.grid[i].j,
                    }))
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
    setPath() {
        this.path = Game.instance.aStar.findPath(Game.instance.aStar.getTile(this.start), Game.instance.aStar.getTile(this.end));
        this.path.forEach((el, index) => {
            const tileIndex = toIndex(el.i, el.j);
            if (index === this.path.length - 1) {
                Game.instance.grid[tileIndex].setState(TileStates.PATH_END);
            }
            else {
                Game.instance.grid[tileIndex].setState(TileStates.PATH);
            }
        });
    }
}
var InputCode;
(function (InputCode) {
    InputCode["NONE"] = "NONE";
    InputCode["LMB_PRESSED"] = "left mouse button pressed";
    InputCode["LMB_RELEASED"] = "left mouse button released";
    InputCode["ESC_PRESSED"] = "escape key pressed";
})(InputCode || (InputCode = {}));
function mousePressed(event) {
    switch (mouseButton) {
        case LEFT: {
            Game.instance.lastInput = InputCode.LMB_PRESSED;
            break;
        }
    }
}
function mouseReleased(event) {
    switch (mouseButton) {
        case LEFT: {
            Game.instance.lastInput = InputCode.LMB_RELEASED;
            break;
        }
    }
}
function keyPressed(event) {
    switch (keyCode) {
        case ESCAPE: {
            Game.instance.lastInput = InputCode.ESC_PRESSED;
            break;
        }
    }
}
const COLOR_PALETTE = {
    BACKGROUND_DARK: "#003049",
    TILE_PRIMARY: "#D62828",
    TILE_SELECTED: "#F77F00",
    TILE_PATH_END: "#FCBF49",
    TILE_PATH: '#EAE2B7'
};
const WIDTH = 600;
const HEIGHT = 600;
const GRID_SIZE = 10;
const TILE_SIZE = WIDTH / GRID_SIZE;
let aStar;
let lastInput;
const grid = [];
let start;
let end;
let game;
function setup() {
    game = Game.instance;
}
function draw() {
    game.update();
}
function toCartesian(x, y) {
    const a = 0.5;
    const b = -0.5;
    const c = 0.25;
    const d = 0.25;
    const det = 1 / (a * d - b * c);
    return createVector(x * d * det + y * -b * det, x * -c * det + y * a * det);
}
function toIso(x, y) {
    return createVector(x * 0.5 + y * -0.5, x * 0.25 + y * 0.25);
}
function hexToRgb(hex) {
    hex = hex.replace("#", "");
    var bigint = parseInt(hex, 16);
    var r = (bigint >> 16) & 255;
    var g = (bigint >> 8) & 255;
    var b = bigint & 255;
    return [r, g, b];
}
function toIndex(i, j) {
    return i * Game.instance.rows + j;
}
function colorToRgb(color) {
    return color
        .toString()
        .replace(/[^\d,-]/g, '')
        .split(",")
        .map((el) => parseInt(el.trim(), 10));
}
function isEqual(obj1, obj2) {
    return JSON.stringify(obj1) === JSON.stringify(obj2);
}
class AStar {
    constructor(cols, rows) {
        this.grid = [];
        this.cols = cols;
        this.rows = rows;
        for (let i = 0; i < cols; i++) {
            this.grid[i] = new Array(this.rows);
        }
        for (let i = 0; i < this.cols; i++) {
            for (let j = 0; j < this.rows; j++) {
                this.grid[i][j] = new Tile(i, j);
            }
        }
        for (let i = 0; i < this.cols; i++) {
            for (let j = 0; j < this.rows; j++) {
                this.grid[i][j].addNeighbors(this.grid);
            }
        }
        this.cash = new Map();
    }
    heuristic(a, b) {
        var d = dist(a.i, a.j, b.i, b.j);
        return d;
    }
    reset() {
        for (let i = 0; i < this.cols; i++) {
            for (let j = 0; j < this.rows; j++) {
                this.grid[i][j].reset();
            }
        }
    }
    findPath(start, end) {
        this.reset();
        if (this.cash.has({ start, end })) {
            return this.cash.get({ start, end });
        }
        const openSet = new Set();
        const closedSet = new Set();
        openSet.add(start);
        while (openSet.size > 0) {
            const osArr = Array.from(openSet);
            let next = 0;
            for (let i = 0; i < osArr.length; i++) {
                if (osArr[i].cost < osArr[next].cost) {
                    next = i;
                }
            }
            let current = osArr[next];
            if (current === end) {
                const path = this.getPath(current);
                this.cash.set({ start, end }, path);
                return path;
            }
            openSet.delete(current);
            closedSet.add(current);
            let neighbors = current.neighbors;
            for (const neighbor of neighbors) {
                if (!closedSet.has(neighbor)) {
                    let tempGoal = current.goal + this.heuristic(neighbor, current);
                    let newPath = false;
                    if (openSet.has(neighbor)) {
                        if (tempGoal < neighbor.goal) {
                            neighbor.goal = tempGoal;
                            newPath = true;
                        }
                    }
                    else {
                        neighbor.goal = tempGoal;
                        newPath = true;
                        openSet.add(neighbor);
                    }
                    if (newPath) {
                        neighbor.heuristic = this.heuristic(neighbor, end);
                        neighbor.cost = neighbor.goal + neighbor.heuristic;
                        neighbor.previous = current;
                    }
                }
            }
        }
        return undefined;
    }
    getPath(current) {
        const path = [];
        let temp = current;
        path.push(temp);
        while (temp.previous) {
            path.push(temp.previous);
            temp = temp.previous;
        }
        return path;
    }
    getTile(coords) {
        return this.grid[coords.i][coords.j];
    }
}
class Tile {
    constructor(i, j, allowDiagonal) {
        this.allowDiagonal = false;
        this.heuristic = 0;
        this.goal = 0;
        this.cost = 0;
        this.neighbors = [];
        this.previous = undefined;
        this.addNeighbors = (grid) => {
            const COLS = grid.length;
            const ROWS = grid[0].length;
            const i = this.i;
            const j = this.j;
            if (i < COLS - 1)
                this.neighbors.push(grid[i + 1][j]);
            if (i > 0)
                this.neighbors.push(grid[i - 1][j]);
            if (j > 0)
                this.neighbors.push(grid[i][j - 1]);
            if (j < ROWS - 1)
                this.neighbors.push(grid[i][j + 1]);
            if (this.allowDiagonal) {
                if (i > 0 && j > 0)
                    this.neighbors.push(grid[i - 1][j - 1]);
                if (i > 0 && j < ROWS - 1)
                    this.neighbors.push(grid[i - 1][j + 1]);
                if (i < COLS - 1 && j > 0)
                    this.neighbors.push(grid[i + 1][j - 1]);
                if (i < COLS - 1 && j > ROWS - 1)
                    this.neighbors.push(grid[i + 1][j + 1]);
            }
        };
        this.i = i;
        this.j = j;
        this.allowDiagonal = !!allowDiagonal;
    }
    reset() {
        this.heuristic = 0;
        this.goal = 0;
        this.cost = 0;
        this.previous = undefined;
    }
}
class IsoTile {
    constructor(options) {
        this.color = color('#D62828');
        this.isSelected = false;
        this.isStart = false;
        this.hoverOffset = 0;
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
        if (color)
            this.color = tileColor;
        this.currentState = this.states[TileStates.DEFAULT];
        [this.red, this.green, this.blue] = colorToRgb(this.color);
        this.currentState.enter();
        this.calculateGeometry();
    }
    calculateGeometry() {
        this.A = createVector(this.x, this.y + 0.25 * this.size);
        this.B = createVector(this.x + 0.5 * this.size, this.y);
        this.C = createVector(this.x + this.size, this.y + 0.25 * this.size);
        this.D = createVector(this.x + 0.5 * this.size, this.y + 0.5 * this.size);
        this.E = createVector(this.x, this.y + 0.75 * this.size);
        this.F = createVector(this.x + this.size, this.y + 0.75 * this.size);
        this.G = createVector(this.x + 0.5 * this.size, this.y + this.size);
    }
    draw() {
        stroke(this.red * 0.3, this.green * 0.3, this.blue * 0.3);
        strokeWeight(2);
        fill(this.red * 0.75, this.green * 0.75, this.blue * 0.75);
        quad(this.A.x, this.A.y - this.hoverOffset, this.B.x, this.B.y - this.hoverOffset, this.C.x, this.C.y - this.hoverOffset, this.D.x, this.D.y - this.hoverOffset);
        fill(this.red * 0.9, this.green * 0.9, this.blue * 0.9);
        quad(this.A.x, this.A.y - this.hoverOffset, this.D.x, this.D.y - this.hoverOffset, this.G.x, this.G.y - this.hoverOffset, this.E.x, this.E.y - this.hoverOffset);
        fill(this.red, this.green, this.blue);
        quad(this.D.x, this.D.y - this.hoverOffset, this.C.x, this.C.y - this.hoverOffset, this.F.x, this.F.y - this.hoverOffset, this.G.x, this.G.y - this.hoverOffset);
    }
    update(input) {
        this.currentState.handleInput();
    }
    setState(state) {
        this.currentState.exit();
        this.currentState = this.states[state];
        this.currentState.enter();
    }
    isPointInsidePolygon(x, y) {
        let pX = [this.A.x, this.B.x, this.C.x, this.D.x];
        let pY = [this.A.y, this.B.y, this.C.y, this.D.y];
        let j = pX.length - 1;
        let odd;
        for (let i = 0; i < pX.length; i++) {
            if (((pY[i] < y && pY[j] >= y) || (pY[j] < y && pY[i] >= y)) &&
                (pX[i] <= x || pX[j] <= x)) {
                const tmp = pX[i] + ((y - pY[i]) * (pX[j] - pX[i])) / (pY[j] - pY[i]) < x;
                odd ^= +tmp;
            }
            j = i;
        }
        return !!odd;
    }
}
var TileStates;
(function (TileStates) {
    TileStates[TileStates["DEFAULT"] = 0] = "DEFAULT";
    TileStates[TileStates["SELECTED"] = 1] = "SELECTED";
    TileStates[TileStates["HOVERED"] = 2] = "HOVERED";
    TileStates[TileStates["PATH"] = 3] = "PATH";
    TileStates[TileStates["PATH_END"] = 4] = "PATH_END";
})(TileStates || (TileStates = {}));
class TileSate {
    constructor(state) {
        this.state = state;
    }
    enter() { }
    exit() { }
    handleInput() { }
}
class DefaultTileState extends TileSate {
    constructor(tile) {
        super(TileStates.DEFAULT);
        this.tile = tile;
    }
    enter() {
        this.tile.color = color(COLOR_PALETTE.TILE_PRIMARY);
        [this.tile.red, this.tile.green, this.tile.blue] = colorToRgb(this.tile.color);
    }
    exit() { }
    handleInput() { }
}
class SelectedTileState extends TileSate {
    constructor(tile) {
        super(TileStates.SELECTED);
        this.tile = tile;
    }
    enter() {
        this.tile.color = color(COLOR_PALETTE.TILE_SELECTED);
        [this.tile.red, this.tile.green, this.tile.blue] = colorToRgb(this.tile.color);
    }
    exit() { }
    handleInput() { }
}
class HoveredTileState extends TileSate {
    constructor(tile) {
        super(TileStates.HOVERED);
        this.tile = tile;
    }
    enter() {
        this.tile.hoverOffset = 0.1 * this.tile.size;
    }
    exit() {
        this.tile.hoverOffset = 0;
    }
    handleInput() { }
}
class PathTileState extends TileSate {
    constructor(tile) {
        super(TileStates.PATH);
        this.tile = tile;
    }
    enter() {
        this.tile.color = color(COLOR_PALETTE.TILE_PATH);
        [this.tile.red, this.tile.green, this.tile.blue] = colorToRgb(this.tile.color);
    }
    exit() { }
    handleInput() { }
}
class PathEndTileState extends TileSate {
    constructor(tile) {
        super(TileStates.PATH_END);
        this.tile = tile;
    }
    enter() {
        this.tile.color = color(COLOR_PALETTE.TILE_PATH_END);
        [this.tile.red, this.tile.green, this.tile.blue] = colorToRgb(this.tile.color);
    }
    exit() { }
    handleInput() { }
}
//# sourceMappingURL=build.js.map