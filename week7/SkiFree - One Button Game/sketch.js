// One Button Ski — all gameplay movement is frame independent and SPACE only.
const GAME = { START: 'start', PLAYING: 'playing', OVER: 'over' };
const DIFFICULTY_RAMP_METERS = 1000;
const JUMP_SECONDS = 0.78;
const PLAYER_Y_RATIO = 0.56;
const START_SPEED = 150;
const MAX_SPEED = 240;
const ACCELERATION = 2; // pixels/second gained each second

let gameState = GAME.START;
let skier;
let obstacles = [];
let snowflakes = [];
let distanceMeters = 0;
let elapsed = 0;
let spawnIn = 1.5;
let slopeOffset = 0;
let lastFrame = 0;
let crashTime = 0;
let scenery = [];
let tracks = [];
let sceneryTimer = 0;
let hazardCount = 0;
let burstRemaining = 0;
let lastArrival = -10;
let bearCount = 0;


function setup() {
  createCanvas(800, 680);
  pixelDensity(1);
  textFont('monospace');
  frameRate(60);
  skier = new Skier();
  seedScenery();
  for (let i = 0; i < 70; i++) snowflakes.push({ x: random(width), y: random(height), size: random(1, 3) });
  lastFrame = millis() / 1000;
}

function draw() {
  const now = millis() / 1000;
  const dt = min(0.05, max(0, now - lastFrame));
  lastFrame = now;
  drawSnow(dt);
  if (gameState === GAME.PLAYING) updateGame(dt);
  drawSlopeDetails();
  drawScenery();
  if (gameState === GAME.PLAYING || gameState === GAME.OVER) {
    drawObstacles();
    skier.draw();
    drawHUD();
  }
  if (gameState === GAME.START) drawTitle();
  if (gameState === GAME.OVER) drawEndCard();
}

function updateGame(dt) {
  const travel = slopeDistance(elapsed + dt) - slopeDistance(elapsed);
  elapsed += dt;
  const speed = worldSpeed();
  distanceMeters += travel * 0.105;
  slopeOffset += travel;
  skier.update(dt);
  updateScenery(dt, travel);


  for (const obstacle of obstacles) {
    // Yetis run upward from the bottom on their scheduled arrival beat.
    obstacle.y += obstacle.kind === 'yeti' ? obstacle.velocityY * dt : -travel;
    obstacle.x += obstacle.velocityX * dt;
    if (obstacle.kind !== 'mound' && obstacle.y >= skier.groundY - 13 && obstacle.y <= skier.groundY + 13) {
      const overlapsX = abs(obstacle.x - skier.x) < obstacle.hitW + 9;
      if (overlapsX && !skier.isSafelyAirborne()) {
        gameState = GAME.OVER;
        crashTime = 0;
        return;
      }
    }
  }
  // Keep incoming yetis below the screen until they enter; remove at the top.
  obstacles = obstacles.filter(o => o.y > -50);
  spawnIn -= dt;
  if (spawnIn <= 0) {
    spawnHazard();
    const progress = constrain(distanceMeters / DIFFICULTY_RAMP_METERS, 0, 1);
    if (burstRemaining > 0) {
      // Short sequences demand a fresh press soon after each landing.
      burstRemaining--;
      spawnIn = random(0.96, 1.15) - progress * 0.06;
    } else {
      // Vary both the rest and the next sequence length, rather than a fixed beat.
      spawnIn = random(1.35, 1.85) - progress * 0.20;
      burstRemaining = floor(random(1, progress > 0.45 ? 5 : 3));
    }
  }


}

function worldSpeed() {
  return min(MAX_SPEED, START_SPEED + ACCELERATION * elapsed);
}

// Integrate the speed ramp, then cruise at the cap. Used by movement and prediction.
function slopeDistance(time) {
  const rampTime = min(time, (MAX_SPEED - START_SPEED) / ACCELERATION);
  return START_SPEED * rampTime + ACCELERATION * rampTime * rampTime / 2
    + MAX_SPEED * (time - rampTime);
}

function timeToContact(pixels) {
  if (pixels <= 0) return 0;
  let low = 0;
  let high = pixels / START_SPEED;
  const start = slopeDistance(elapsed);
  for (let i = 0; i < 24; i++) {
    const middle = (low + high) / 2;
    if (slopeDistance(elapsed + middle) - start < pixels) low = middle;
    else high = middle;
  }
  return (low + high) / 2;
}

function slalomX(timeSeconds) {
  // A smooth, learnable sine carve. Obstacle placement asks this same function
  // where the skier will be when the obstacle reaches the collision line.
  return width * 0.5 + sin(timeSeconds * 1.12 - HALF_PI) * width * 0.245;
}

function spawnHazard() {
  const spawnY = height + 35;
  // Acceleration must never compress consecutive arrival times below recovery.
  const minimumArrivalGap = JUMP_SECONDS + 0.16;
  const arrival = max(elapsed + timeToContact(spawnY - skier.groundY), lastArrival + minimumArrivalGap);
  const travelTime = arrival - elapsed;
  lastArrival = arrival;
  const targetX = slalomX(elapsed + travelTime);
  // Crossers share the hazard beat, so they cannot overlap a tree's jump window.
  const kind = hazardCount === 0 ? 'rock' : random(['tree', 'rock', 'bear', 'yeti']);
  const yeti = kind === 'yeti';
  const crossing = kind === 'bear';
  const plannedY = skier.groundY + slopeDistance(arrival) - slopeDistance(elapsed);
  const obstacle = new Obstacle(targetX, plannedY, kind, true);
  if (yeti) {
    // Run faster than the scrolling snow so the charge is clearly visible.
    // Start farther below the screen to preserve the scheduled collision time.
    obstacle.velocityY = -(worldSpeed() + 70);
    obstacle.y = skier.groundY - obstacle.velocityY * travelTime;
  } else if (crossing) {
    // Alternate edges; meet the player's predicted ground position, then keep running.
    // Count bears separately now that the hazard order is randomized.
    obstacle.x = bearCount++ % 2 === 0 ? -25 : width + 25;
    obstacle.velocityX = (targetX - obstacle.x) / travelTime;
  }
  hazardCount++;
  obstacles.push(obstacle);
  // Flanking rocks and trees make denser rows without adding a second jump beat.
  if (random() < 0.65) {
    for (const side of [-1, 1]) {
      const flankX = constrain(targetX + side * random(65, 100), 30, width - 30);
      obstacles.push(new Obstacle(flankX, plannedY, random(['tree', 'rock']), false));
    }
  }
}

function drawSnow(dt) {
  background('#ffffff');
}

function drawSlopeDetails() {
  stroke('#d8d8d8'); strokeWeight(1);
  for (const t of tracks) {
    line(t.x - 5, t.y, t.x - 5, t.y + 5);
    line(t.x + 5, t.y, t.x + 5, t.y + 5);
  }
  noStroke();
}

function drawObstacles() { for (const o of obstacles) o.draw(); }

class Skier {
  constructor() { this.jump = 0; this.groundY = height * PLAYER_Y_RATIO; this.x = slalomX(0); this.previousX = this.x; }
  update(dt) {
    this.groundY = height * PLAYER_Y_RATIO;
    this.previousX = this.x;
    this.x = slalomX(elapsed);
    if (this.jump > 0) this.jump = max(0, this.jump - dt);
  }
  startJump() { if (this.jump <= 0) this.jump = JUMP_SECONDS; }
  get jumpLift() {
    if (this.jump <= 0) return 0;
    const t = 1 - this.jump / JUMP_SECONDS;
    return sin(PI * t) * 62;
  }
  isSafelyAirborne() { return this.jump > 0.10 && this.jump < JUMP_SECONDS - 0.06; }
  draw() {
    noStroke(); fill('#c0c0c0'); rect(this.x-9,this.groundY+12,22,4);
    drawPixelSkier(this.x, this.groundY-this.jumpLift, '#0000ff', cos(elapsed*1.12-HALF_PI)*0.25);
  }
}

class Obstacle {
  constructor(x, y, kind, targeted, sizeFactor) {
    this.x = x; this.y = y; this.kind = kind; this.targeted = targeted;
    // Pick once at creation, never during drawing, so sprites do not flicker.
    this.sizeFactor = sizeFactor ?? (kind === 'tree' || kind === 'rock' ? random(0.85, 1.15) : 1);
    this.velocityX = 0;
    this.velocityY = 0;
    this.hitW = kind === 'yeti' ? 18 : kind === 'bear' ? 21 : kind === 'tree' ? 15 : kind === 'rock' ? 13 : 12;
    this.hitW *= this.sizeFactor;
  }
  draw() {
    if (this.kind === 'yeti') {
      drawYeti(this.x, this.y);
    } else if (this.kind === 'bear') {
      drawBear(this.x, this.y, Math.sign(this.velocityX));
    } else if (this.kind === 'tree') drawPine(this.x, this.y, 0.92 * this.sizeFactor);
    else if (this.kind === 'rock') {
      push(); translate(this.x, this.y); scale(this.sizeFactor);
      noStroke(); fill('#71818b'); ellipse(0, 6, 27, 17);
      fill('#9baab0'); ellipse(-3, 3, 15, 9);
      fill('#d7e5eb'); rect(-7, 1, 5, 2);
      pop();
    } else {
      noStroke(); fill('#c9e4ef'); ellipse(this.x, this.y + 7, 29, 11);
      fill('#fff'); ellipse(this.x - 3, this.y + 3, 17, 8);
    }
  }
}

function drawPine(x, y, treeScale) {
  push(); translate(round(x), round(y)); scale(treeScale); noStroke();
  fill('#808080'); rect(5, 14, 22, 4);
  fill('#804000'); rect(-3, 7, 6, 13);
  // Stepped silhouettes echo the tiny bitmap sprites of early Windows games.
  fill('#003d00');
  for (let tier = 0; tier < 3; tier++) {
    const top = -38 + tier * 14;
    for (let row = 0; row < 6; row++) {
      const half = 3 + row * 3 + tier * 2;
      rect(-half, top + row * 4, half * 2, 4);
    }
  }
  fill('#008000'); rect(-4, -32, 4, 9); rect(-10, -13, 5, 13); rect(-15, 7, 7, 7);
  fill('#ffffff'); rect(-3, -39, 6, 4); rect(-9, -20, 9, 3);
  pop();
}

function drawHUD() {
  noStroke(); fill('#c0c0c0'); rect(0, 0, width, 48);
  stroke('#ffffff'); line(0, 0, width, 0); stroke('#808080'); line(0, 47, width, 47);
  noStroke(); textStyle(BOLD); textSize(14); textAlign(LEFT, CENTER); fill('#000080'); text('SkiFree', 16, 17);
  textStyle(NORMAL); fill('#000000'); textSize(12);
  text('Distance: ' + floor(distanceMeters) + ' m', 130, 17);
  text('Speed: ' + round(worldSpeed() * 0.105 * 3.6) + ' km/h', 330, 17); text('SPACE: jump', 570, 17);
  fill('#000000'); textSize(10); text('ENDLESS RUN — ski as far as you can', 16, 35);
}

function drawTitle() {
  drawPanel(width/2-210, 170, 420, 290);
  textAlign(CENTER,CENTER); fill('#000000'); textSize(32); textStyle(BOLD); text('SkiFree',width/2,235);
  textStyle(NORMAL); textSize(12); text('ONE BUTTON / A WHOLE MOUNTAIN',width/2,270);
  drawPixelSkier(width/2,310,'#0000ff',0);
  text('SPACE to Start • SPACE to Jump',width/2,370);
  textSize(11); text('Jump trees and rocks. Steering is automatic.',width/2,400);
  text('Watch below for bears and charging yetis!',width/2,421);
}

function drawPreviewSkier(x, y) {
  push(); translate(x, y + sin(millis() / 430) * 3);
  stroke('#d94338'); strokeWeight(4); line(-7, 5, -12, 28); line(7, 5, 12, 28);
  noStroke(); fill('#2478a6'); rect(-9, -8, 18, 17, 2); fill('#f1c99c'); ellipse(0, -14, 11, 11); fill('#243f52'); rect(-6, -20, 12, 4);
  pop();
}

function drawEndCard() {
  drawPanel(55, 205, width - 110, 220);
  textAlign(CENTER, CENTER); textStyle(BOLD); textSize(24); fill('#a24b43');
  text('GAME OVER', width / 2, 255);
  textStyle(NORMAL); textSize(13); fill('#476473'); text(`${floor(distanceMeters)} meters`, width / 2, 294);
  textSize(11); text('The next jump is yours to time.', width / 2, 329);
  fill('#244456'); text('Press SPACE to Try Again', width / 2, 372);
  drawCrashSparkles();
}

function drawCrashSparkles() {
  const t = crashTime++;
  stroke('#e4a83e'); strokeWeight(2);
  for (let i = 0; i < 7; i++) {
    const a = TWO_PI * i / 7;
    const r = 12 + (t % 18) * 0.7;
    line(skier.x + cos(a) * r, skier.groundY + sin(a) * r, skier.x + cos(a) * (r + 5), skier.groundY + sin(a) * (r + 5));
  }
}

function drawPanel(x, y, w, h) {
  noStroke(); fill('#808080'); rect(x + 5, y + 5, w, h);
  fill('#c0c0c0'); rect(x, y, w, h);
  stroke('#ffffff'); strokeWeight(2); line(x, y, x+w, y); line(x,y,x,y+h);
  stroke('#404040'); line(x+w,y,x+w,y+h); line(x,y+h,x+w,y+h);
  noStroke(); fill('#000080'); rect(x+4,y+4,w-8,23);
  textAlign(LEFT,CENTER); textSize(12); textStyle(BOLD); fill('#ffffff'); text('SkiFree — One Button Edition',x+12,y+16); textStyle(NORMAL);
}

function resetRun() {
  obstacles = []; distanceMeters = 0; elapsed = 0; spawnIn = 0; slopeOffset = 0; crashTime = 0;
  lastFrame = millis() / 1000;
  skier = new Skier(); gameState = GAME.PLAYING;
  tracks = []; sceneryTimer = 0; hazardCount = 0; burstRemaining = 1; lastArrival = -10; bearCount = 0; seedScenery();
}

function keyPressed(event) {
  if (keyCode !== 32) return true;
  // Browser repeat events do not start another jump, even after landing.
  if (event && event.repeat) return false;
  if (gameState === GAME.PLAYING) skier.startJump();
  else resetRun();
  return false;
}

function drawPixelSkier(x, y, jacket, lean) {
  push(); translate(round(x), round(y)); rotate(lean); noStroke();
  fill('#000000'); rect(-9,5,3,23); rect(6,5,3,23);
  fill('#ff0000'); rect(-9,23,3,6); rect(6,23,3,6);
  fill('#000080'); rect(-6,2,5,12); rect(2,2,5,12);
  fill(jacket); rect(-7,-11,14,14); rect(-12,-8,5,9); rect(7,-8,5,9);
  fill('#ffcc99'); rect(-4,-19,8,8); rect(-13,0,3,4); rect(10,0,3,4);
  fill('#ff0000'); rect(-5,-22,10,4);
  fill('#000000'); rect(-3,-16,7,2); rect(-15,3,1,15); rect(14,3,1,15);
  pop();
}

function seedScenery() {
  scenery = [];
  for (let y = 70; y < height + 90; y += 65) addSceneryRow(y);
}

function addSceneryRow(y) {
  for (let i = 0; i < 7; i++) {
    let x = random(25, width-25);
    // Reserve the future route over the full contact interval.
    // Dense scenery never adds surprise collisions.
    const arrival = elapsed + timeToContact(y-skier.groundY);
    if (y >= skier.groundY-40 && abs(x-slalomX(arrival)) < 90) continue;
    if (abs(y-skier.groundY)<60 && abs(x-skier.x)<90) continue;
    scenery.push({x,y,sizeFactor:random(0.85,1.15),kind:random(['tree','tree','tree','rock','mound','flag']),phase:random(TWO_PI),color:random(['#ff0000','#ff00ff','#008080','#800080'])});
  }
}

function updateScenery(dt, travel) {
  sceneryTimer -= dt;
  if (sceneryTimer <= 0) { addSceneryRow(height+65); sceneryTimer = 0.43; }
  for (const item of scenery) item.y -= travel;
  scenery = scenery.filter(item=>item.y>-70);
  for (const t of tracks) t.y -= travel;
  if (skier.jump===0) tracks.push({x:skier.x,y:skier.groundY+23});
  tracks = tracks.filter(t=>t.y>48);
}

function drawScenery() {
  for (const item of scenery) {
    if (item.kind==='tree') drawPine(item.x,item.y,0.85 * item.sizeFactor);
    else if (item.kind==='flag') {
      stroke('#000000'); strokeWeight(1); line(item.x,item.y-24,item.x,item.y+10);
      noStroke(); fill('#ff0000'); rect(item.x,item.y-24,16,9);
    } else new Obstacle(item.x,item.y,item.kind,false,item.kind === 'rock' ? item.sizeFactor : 1).draw();
  }
}

// Side-on pixel bear, mirrored to face its crossing direction.
function drawBear(x, y, direction) {
  push(); translate(round(x), round(y)); scale(direction, 1); noStroke();
  const stride = floor(elapsed * 10) % 2 === 0 ? 3 : -3;
  fill('#c0c0c0'); rect(-22, 12, 47, 4);
  fill('#56351f'); rect(-22, -10, 34, 22); rect(-16, -15, 23, 8);
  rect(7, -16, 19, 19); rect(9, -22, 7, 8); rect(21, -19, 6, 7);
  rect(-20 + stride, 7, 9, 13); rect(4 - stride, 7, 9, 13);
  fill('#805331'); rect(-17, -9, 25, 12); rect(11, -13, 11, 9);
  fill('#bd9564'); rect(21, -7, 10, 8);
  fill('#17120e'); rect(28, -7, 5, 4); rect(20, -13, 3, 3);
  rect(-21 + stride, 17, 11, 4); rect(3 - stride, 17, 11, 4);
  pop();
}

// Classic snow-monster silhouette, drawn as crisp two-pixel blocks.
function drawYeti(x, y) {
  push(); translate(round(x), round(y)); noStroke();
  const step = floor(elapsed * 9) % 2 === 0 ? 3 : -3;
  fill('#d0d0d0'); rect(-18, 18, 36, 3);

  // Long, bent arms and splayed fingers swing with the running stride.
  fill('#202020');
  for (const side of [-1, 1]) {
    push(); scale(side, 1);
    const swing = step * side;
    rect(12, -17, 8, 3);
    rect(18, -26 + swing, 3, 12 - swing);
    rect(20, -29 + swing, 8, 3);
    rect(25, -35 + swing, 2, 8);
    rect(29, -33 + swing, 2, 7);
    rect(22, -34 + swing, 2, 7);
    // Thin knees and broad, clawed feet.
    rect(5, 3, 3, 10 + swing);
    rect(7, 10 + swing, 5, 3);
    rect(10, 12 + swing, 3, 7);
    rect(10, 17 + swing, 11, 3);
    rect(15, 20 + swing, 2, 3);
    rect(20, 19 + swing, 2, 3);
    pop();
  }

  // A rounded torso sits below a distinct, narrow neck.
  fill('#202020');
  rect(-12, -17, 24, 4); rect(-16, -13, 32, 17);
  rect(-13, 4, 26, 7); rect(-9, 11, 18, 4);
  fill('#bdbdbd');
  rect(-12, -13, 24, 17); rect(-10, 4, 20, 6);
  rect(-6, 10, 12, 2);
  fill('#202020'); rect(-6, -22, 12, 7);
  fill('#bdbdbd'); rect(-3, -21, 6, 5);

  // Separate square head, raised brows, and open mouth from the reference.
  fill('#202020');
  rect(-10, -43, 20, 25); rect(-7, -46, 14, 3);
  rect(-13, -43, 6, 3); rect(7, -43, 6, 3);
  fill('#bdbdbd'); rect(-7, -40, 14, 19);
  fill('#202020'); rect(-7, -40, 4, 5); rect(3, -40, 4, 5);
  fill('#ff2020'); rect(-5, -34, 2, 2); rect(3, -34, 2, 2);
  fill('#202020'); rect(-7, -29, 14, 9);
  fill('#ff2020'); rect(-3, -25, 6, 4);
  fill('#ffff00');
  for (let tooth = -6; tooth <= 6; tooth += 4) {
    rect(tooth, -30, 2, 3);
    rect(tooth, -22, 2, 3);
  }
  pop();
}
