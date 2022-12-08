import * as p5 from "p5";

export function colorToRgb(color: p5.Color): number[] {
  return color
    .toString()
    .replace(/[^\d,-]/g, "")
    .split(",")
    .map((el: string) => parseInt(el.trim(), 10));
}

export function isEqual(obj1: unknown, obj2: unknown): boolean {
  return JSON.stringify(obj1) === JSON.stringify(obj2);
}
