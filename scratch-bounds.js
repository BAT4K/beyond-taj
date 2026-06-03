const fs = require('fs');
const svg = fs.readFileSync('public/logo.svg', 'utf-8');

let minX = Infinity;
let minY = Infinity;
let maxX = -Infinity;
let maxY = -Infinity;

const numRegex = /-?\d+(?:\.\d+)?/g;

let match;
while ((match = numRegex.exec(svg)) !== null) {
  // Rough heuristic: in SVG paths, coordinates often alternate X and Y, or come in pairs.
  // A much better way is to use an NPM package:
}
