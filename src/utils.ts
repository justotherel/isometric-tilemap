function toCartesian(x: number, y: number): p5.Vector {
  const a = 0.5;
  const b = -0.5;
  const c = 0.25;
  const d = 0.25;
  const det = 1 / (a * d - b * c);
  return createVector(x * d * det + y * -b * det, x * -c * det + y * a * det);
}

function toIso(x: number, y: number): p5.Vector {
  return createVector(x * 0.5 + y * -0.5, x * 0.25 + y * 0.25);
}

function hexToRgb(hex: string): number[] {
  hex = hex.replace("#", "");

  var bigint = parseInt(hex, 16);

  var r = (bigint >> 16) & 255;
  var g = (bigint >> 8) & 255;
  var b = bigint & 255;

  return [r, g, b];
}

function toIndex(i: number, j: number) {
  return i * Game.instance.rows + j;
}

function colorToRgb(color: p5.Color): number[] {
  return color
    .toString()
    .replace(/[^\d,-]/g, '')
    .split(",")
    .map((el) => parseInt(el.trim(), 10));
}

function isEqual(obj1: object, obj2: object): boolean {
  return JSON.stringify(obj1) === JSON.stringify(obj2);
}
