import { TileStates } from "../../interfaces/tileStates";

export class TileSate {
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
