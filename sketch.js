let url = 'https://coolors.co/ee6055-60d394-aaf683-ffd97d-ff9b85';
let palette = url.replace('https://coolors.co/', '').split('-').map(c => `#${ c }`);
let vmin, vmax;
let font;
let fs;
let points;
let bounds;
let contours = [];
let txt = 'Émile Blais';
let ctx;

function preload() {
  font = loadFont('AllertaStencil-Regular.ttf');
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  vmin = (width < height) ? width : height;
  vmax = (width > height) ? width : height;
  fs = vmin * 0.0085;
  points = font.textToPoints(txt, 0, 0, fs, {
    sampleFactor: 8,
    simplifyThreshold: 0
  });
  bounds = font.textBounds(txt, 0, 0, fs);
  
  for (let i = 0; i < points.length; i++) {
    let p1 = points[i];
    if (i === 0) {
      contours.push([]);
    } else {
      let p0 = points[i - 1];
      let d = dist(p0.x, p0.y, p1.x, p1.y);
      if (d > fs / 10) {
        contours.push([]);
      }
    }
    contours[contours.length - 1].push(p1);
  }
  
  contours.sort(function (a, b) {
    let avrAx = 0;
    for (let i = 0; i < a.length; i++) {
      avrAx += a[i].x;
    }
    avrAx /= a.length;
    let avrBx = 0;
    for (let i = 0; i < b.length; i++) {
      avrBx += b[i].x;
    }
    avrBx /= b.length;
    return avrAx - avrBx;
  });
  
  ctx = drawingContext;
  ctx.shadowBlur = fs * 3;
  strokeWeight(fs * 0.0225);
  strokeJoin(ROUND);
  noFill();
}

function neon(drawStroke) {
  for (let i = 0; i < contours.length; i++) {
    let points = contours[i];
    beginShape(TESS);
    for (let j = 0; j < points.length; j++) {
      let p = points[j];
      let c = color(palette[i % palette.length]);
      let r = c.levels[0];
      let g = c.levels[1];
      let b = c.levels[2];
      let n = noise(i, frameCount * (drawStroke ? 0.03 : 6));
      n = 1.0 - n * n;
      let a = (floor(n * 2) / 2 + 0.1)  * 255;
      ctx.shadowColor = `rgba(${ r }, ${ g }, ${ b }, ${ drawStroke ? 1 : n })`;
      if (drawStroke) {
        stroke(r, g, b, a);
      } else {
        stroke(0);
      }
      vertex(p.x, p.y);
    }
    endShape(CLOSE);
  }
}

function draw() {
  background(20);
  blendMode(ADD);
  
  translate(width / 2, height / 2);
  scale((vmin * 0.175) / fs);
  translate(-bounds.w / 2, bounds.h / 2);
  
  neon(false);
  neon(true);
  
  blendMode(BLEND);
}