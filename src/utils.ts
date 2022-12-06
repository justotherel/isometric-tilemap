import * as p5 from "p5";
import { Game } from "./game/game";
import { p5lib } from "./main";

export function toCartesian(x: number, y: number): p5.Vector {
  const a = 0.5;
  const b = -0.5;
  const c = 0.25;
  const d = 0.25;
  const det = 1 / (a * d - b * c);
  return p5lib.createVector(x * d * det + y * -b * det, x * -c * det + y * a * det);
}

export function toIso(x: number, y: number): p5.Vector {
  return p5lib.createVector(x * 0.5 + y * -0.5, x * 0.25 + y * 0.25);
}

export function toIndex(i: number, j: number) {
  return i * Game.instance.rows + j;
}

export function colorToRgb(color: p5.Color): number[] {
  return color
    .toString()
    .replace(/[^\d,-]/g, '')
    .split(",")
    .map((el: string) => parseInt(el.trim(), 10));
}

export function isEqual(obj1: unknown, obj2: unknown): boolean {
  return JSON.stringify(obj1) === JSON.stringify(obj2);
}
