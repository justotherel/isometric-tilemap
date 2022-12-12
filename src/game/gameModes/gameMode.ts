export enum GameModes {
  EDITOR,
}

export default abstract class GameMode {
  public abstract states: unknown[];
  public abstract currentState: unknown;

  public abstract enter(): void;
  public abstract exit(): void;
  public abstract run(): void;
  
  public setState(state: number) {
    this.currentState = this.states[state];
  }
}
