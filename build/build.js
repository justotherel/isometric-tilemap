var InputCode;
(function (InputCode) {
    InputCode["LMB_PRESSED"] = "left mouse button pressed";
    InputCode["LMB_RELEASED"] = "left mouse button released";
})(InputCode || (InputCode = {}));
function mousePressed() {
    switch (mouseButton) {
        case LEFT: {
            lastInput = InputCode.LMB_PRESSED;
            break;
        }
    }
}
function mouseReleased() {
    switch (mouseButton) {
        case LEFT: {
            lastInput = InputCode.LMB_RELEASED;
            break;
        }
    }
}
function drawLastInputStatusText() {
    textSize(32);
    text(`Last input: ${lastInput}`, 10, 30);
}
const COLOR_PALETTE = {
    BACKGROUND_DARK: '#003049',
    TILE_PRIMARY: '#D62828',
    TILE_SELECTED: 'F77F00'
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
function setup() {
    console.log("🚀 - Setup initialized - P5 is running");
    createCanvas(WIDTH, HEIGHT);
    frameRate(60);
    for (let i = 0; i < GRID_SIZE; i++) {
        for (let j = 0; j < GRID_SIZE; j++) {
            const iso = toIso(i * TILE_SIZE - TILE_SIZE, j * TILE_SIZE);
            grid.push(new IsoTile({
                i,
                j,
                x: iso.x + width / 2,
                y: iso.y + height / 4,
                size: TILE_SIZE,
            }));
        }
    }
    aStar = new AStar(GRID_SIZE, GRID_SIZE);
    const path = aStar.findPath(aStar.grid[0][0], aStar.grid[6][7]);
    path.forEach(el => grid.find(tile => tile.i === el.i && tile.j === el.j).isSelected = true);
}
function draw() {
    background(COLOR_PALETTE.BACKGROUND_DARK);
    drawLastInputStatusText();
    grid.forEach(el => {
        el.update(lastInput);
        el.draw();
    });
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
    return createVector(x * 0.5 + y * (-0.5), x * 0.25 + y * 0.25);
}
function hexToRgb(hex) {
    hex = hex.replace('#', '');
    var bigint = parseInt(hex, 16);
    var r = (bigint >> 16) & 255;
    var g = (bigint >> 8) & 255;
    var b = bigint & 255;
    return [r, g, b];
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
    }
    heuristic(a, b) {
        var d = dist(a.i, a.j, b.i, b.j);
        return d;
    }
    findPath(start, end) {
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
                return this.getPath(current);
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
}
class Tile {
    constructor(i, j) {
        this.heuristic = 0;
        this.goal = 0;
        this.cost = 0;
        this.neighbors = [];
        this.previous = undefined;
        this.addNeighbors = function (grid) {
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
            if (i > 0 && j > 0)
                this.neighbors.push(grid[i - 1][j - 1]);
            if (i > 0 && j < ROWS - 1)
                this.neighbors.push(grid[i - 1][j + 1]);
            if (i < COLS - 1 && j > 0)
                this.neighbors.push(grid[i + 1][j - 1]);
            if (i < COLS - 1 && j > ROWS - 1)
                this.neighbors.push(grid[i + 1][j + 1]);
        };
        this.i = i;
        this.j = j;
    }
}
class IsoTile {
    constructor(options) {
        this.color = color(COLOR_PALETTE.TILE_PRIMARY);
        this.isSelected = false;
        this.isStart = false;
        this.hoverOffset = 0;
        const { i, j, x, y, size } = options;
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
        ];
        this.currentState = this.states[TileStates.DEFAULT];
        [this.red, this.green, this.blue] = hexToRgb(this.color.toString("#rrggbb"));
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
    TileStates[TileStates["PATH_START"] = 3] = "PATH_START";
    TileStates[TileStates["PATH_END"] = 4] = "PATH_END";
})(TileStates || (TileStates = {}));
class TileSate {
    constructor(state) {
        this.state = state;
    }
    enter() {
    }
    handleInput() {
    }
}
class DefaultTileState extends TileSate {
    constructor(tile) {
        super(TileStates.DEFAULT);
        this.tile = tile;
    }
    enter() {
        this.tile.hoverOffset = 0;
        this.tile.color = color(COLOR_PALETTE.TILE_PRIMARY);
        [this.tile.red, this.tile.green, this.tile.blue] = hexToRgb(this.tile.color.toString("#rrggbb"));
    }
    handleInput() {
        switch (lastInput) {
            case InputCode.LMB_PRESSED: {
                console.log('DEAFULT TILE STATE INPUT HANDLER CALLED');
                if (this.tile.isPointInsidePolygon(mouseX, mouseY)) {
                    this.tile.setState(TileStates.HOVERED);
                }
                break;
            }
        }
    }
}
class HoveredTileState extends TileSate {
    constructor(tile) {
        super(TileStates.HOVERED);
        this.tile = tile;
    }
    enter() {
        this.tile.hoverOffset = 0.1 * this.tile.size;
        this.tile.color = color(COLOR_PALETTE.TILE_SELECTED);
        [this.tile.red, this.tile.green, this.tile.blue] = hexToRgb(this.tile.color.toString("#rrggbb"));
    }
    handleInput() {
        switch (lastInput) {
            case InputCode.LMB_PRESSED: {
                console.log('HOVERED TILE STATE INPUT HANDLER CALLED');
                if (this.tile.isPointInsidePolygon(mouseX, mouseY)) {
                    this.tile.setState(TileStates.DEFAULT);
                }
                break;
            }
        }
    }
}
class SelectedTileState extends TileSate {
    constructor(tile) {
        super(TileStates.SELECTED);
        this.tile = tile;
    }
    enter() { }
    handleInput() { }
}
//# sourceMappingURL=build.js.map