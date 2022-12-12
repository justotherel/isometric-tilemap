import { TileTypes } from "../../../interfaces/tileTypes";
import { game } from "../../../main";
import { EditorPlaceholderIsoTile } from "../../../tiles/editorPlaceholdIsoTile";
import { GroundIsoTile } from "../../../tiles/groundTile";
import { IsoTile } from "../../../tiles/isoTile";
import { GameState } from "../../states/gameState";
import GameMode from "../gameMode";
import { AddTileEditorState } from "./states/addTileEditorState";
import { DeleteTileEditorState } from "./states/deleteTileEditorState";
import { IdleEditorState } from "./states/idleEditorState";

export enum EditorModeStates {
  IDLE,
  ADD_TILE,
  REMOVE_TILE,
}

export default class EditorMode extends GameMode {
  public states: GameState[] = [
    new IdleEditorState(this),
    new AddTileEditorState(this),
    new DeleteTileEditorState(this),
  ];
  public currentState: GameState;

  public editorGrid: IsoTile[];
  private _currentLevel: number;

  constructor() {
    super();
  }

  public enter() {
    this._currentLevel = 0;
    this.editorGrid = [];

    game.mapSystem.assignDimensions({ cols: 10, rows: 10, levels: 6 });
    game.mapSystem.grid.forEach((_, index) => {
      const [i, j, k] = game.mapSystem.to3D(index);
      const iso = game.toIso(
        i * game.TILE_SIZE - game.TILE_SIZE,
        j * game.TILE_SIZE
      );

      const x = iso.x + game.WIDTH / 2;
      const y =
        iso.y + game.HEIGHT / 2 - 0.5 * k * game.TILE_SIZE - game.TILE_SIZE;
      this.editorGrid.push(
        new EditorPlaceholderIsoTile({
          i,
          j,
          k,
          x,
          y,
          size: game.TILE_SIZE,
        })
      );
    });

    game.grid = this.getGridToDraw();
    this.setState(EditorModeStates.IDLE);
    // generate empty grid and prepare it for drawing
  }

  public getGridToDraw() {
    return this.editorGrid.filter(
      (el) => el.k === this._currentLevel || el.type !== TileTypes.PLACEHOLDER
    );
  }

  public createNewTile(type?: TileTypes, tileToCopyFrom?: IsoTile): IsoTile {
    const { i, j, k, x, y, size } = tileToCopyFrom;
    if (typeof type === undefined) type = TileTypes.GROUND;
    switch (type) {
      case TileTypes.GROUND: {
        return new GroundIsoTile({
          i,
          j,
          k,
          x,
          y,
          size,
        });
      }
      case TileTypes.PLACEHOLDER: {
        return new EditorPlaceholderIsoTile({ i, j, k, x, y, size });
      }
    }
  }

  public run() {
    this.currentState.run(game.lastInput);
  }

  public exit() {
    // ? convert map into a data string
    // ? configure data for MapSystem
  }

  public get currentLevel(): number {
    return this._currentLevel;
  }

  // ? make the value loop
  public set currentLevel(value: number) {
    if (value < game.mapSystem.levels - 1 && value >= 0)
      this._currentLevel = value;
  }
}
