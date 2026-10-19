// Use scene coordinates so resizing scales shapes and interactions together.
let oceanWidth = 900;
let oceanHeight = 600;
let sceneScale = 1;
let oceanMouseX = 0;
let oceanMouseY = 0;

let jellyfishGroup = [];
let plankton = [];
let particles = [];
let seaweed = [];
let bubbles = [];
let pops = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
  resizeOcean();

  for (let i = 0; i < 4; i++) {
    bubbles.push(new Bubble());
  }

  // Plant small clusters near both edges, leaving the center open.
  for (let i = 0; i < 10; i++) {
    seaweed.push(new Seaweed(25 + i * 20, random(80, 170)));
    seaweed.push(new Seaweed(oceanWidth - 25 - i * 20, random(80, 170)));
  }
  // Each call to new creates a separate creature with its own state.
  jellyfishGroup.push(new Jellyfish(oceanWidth / 4, oceanHeight / 2, 80, color(175, 100, 255)));
  jellyfishGroup.push(new Jellyfish(oceanWidth / 2, oceanHeight / 2, 80, color(70, 220, 245)));
  jellyfishGroup.push(new Jellyfish(oceanWidth * 3 / 4, oceanHeight / 2, 80, color(255, 120, 180)));

  // Decorative particles are separate from edible plankton.
  for (let i = 0; i < 40; i++) {
    particles.push(new OceanParticle(random(10, oceanWidth - 10), random(oceanHeight)));
  }

  // Add 25 separate plankton objects to the array.
  for (let i = 0; i < 25; i++) {
    plankton.push(new Plankton(random(10, oceanWidth - 10), random(10, oceanHeight - 10)));
  }
}

function draw() {
  updateOceanMouse();
  push();
  scale(sceneScale);
  // Repaint the water before drawing the particles and creature.
  drawOcean();

  for (let plant of seaweed) {
    plant.display();
  }

  // Draw these first so they appear behind the creature and food.
  for (let particle of particles) {
    particle.update();
    particle.display();
  }

  // Update and draw every particle in the array.
  for (let food of plankton) {
    food.update();
    food.display();
  }

  // Run the same behavior for each independent jellyfish.
  for (let jellyfish of jellyfishGroup) {
    if (!jellyfish.reactToMouse()) {
      jellyfish.findFood();
    }
    jellyfish.update();
    jellyfish.display();
  }

  for (let bubble of bubbles) {
    bubble.update();
    bubble.display();
  }

  // Work backward so removing a finished pop doesn't skip another one.
  for (let i = pops.length - 1; i >= 0; i--) {
    pops[i].update();
    if (pops[i].alpha <= 0) {
      pops.splice(i, 1);
    } else {
      pops[i].display();
    }
  }

  // Draw the panel last so it stays above the ocean scene.
  drawStatusPanel();
  pop();
}

function drawStatusPanel() {
  // Save drawing styles so the panel doesn't affect the rest of the sketch.
  push();
  noStroke();
  // Transparent tint and a soft reflection suggest a glass surface.
  fill(125, 170, 210, 22);
  stroke(220, 240, 255, 55);
  strokeWeight(1);
  rect(12, 12, 240, 28 + jellyfishGroup.length * 24, 10);
  noStroke();
  fill(235, 245, 255, 12);
  rect(16, 16, 232, 20, 7);
  stroke(240, 250, 255, 70);
  line(24, 13, 240, 13);
  noStroke();
  textAlign(LEFT, BASELINE);
  fill(225, 235, 250);
  textSize(10);
  text("JELLY", 24, 29);
  text("ENERGY", 78, 29);
  text("FOOD", 206, 29);

  for (let i = 0; i < jellyfishGroup.length; i++) {
    let jellyfish = jellyfishGroup[i];
    let rowY = 48 + i * 24;

    // Match each row to its creature's color.
    fill(jellyfish.bodyColor);
    circle(37, rowY - 4, 7);
    fill(235, 240, 255);
    textSize(12);
    textAlign(RIGHT, BASELINE);
    text(jellyfish.mealsEaten, 233, rowY);
    text(floor(jellyfish.energy), 188, rowY);
    textAlign(LEFT, BASELINE);

    // Energy determines how much of the bar is filled.
    fill(200, 220, 245, 30);
    rect(78, rowY - 8, 76, 5, 2);
    fill(jellyfish.bodyColor);
    if (jellyfish.energy > 0) {
      rect(78, rowY - 8, 76 * (jellyfish.energy / 100), 5, 2);
    }
  }
  pop();
}

function drawOcean() {
  let surfaceColor = color(12, 48, 68);
  let deepColor = color(2, 7, 22);
  strokeWeight(1);

  // Blend from the surface color to the deep color, one row at a time.
  for (let y = 0; y < oceanHeight; y++) {
    let depth = y / (oceanHeight - 1);
    stroke(lerpColor(surfaceColor, deepColor, depth));
    line(0, y, oceanWidth, y);
  }
}

// p5.js calls this function once for each mouse press.
function mousePressed() {
  updateOceanMouse();
  if (oceanMouseX >= 0 && oceanMouseX < oceanWidth && oceanMouseY >= 0 && oceanMouseY < oceanHeight) {
    // Pop a clicked bubble before considering whether to add food.
    for (let bubble of bubbles) {
      if (dist(oceanMouseX, oceanMouseY, bubble.x, bubble.y) <= bubble.size / 2) {
        // Save the bubble's position before reset moves it away.
        pops.push(new Pop(bubble.x, bubble.y, bubble.size));
        bubble.reset();
        return; // End this mouse press so it doesn't also create plankton.
      }
    }
    plankton.push(new Plankton(oceanMouseX, oceanMouseY));
  }
}

class Pop {
  constructor(x, y, size) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.alpha = 200;
  }

  update() {
    this.size += 1.5;
    this.alpha -= 8;
  }

  display() {
    noFill();
    stroke(255, 200, 220, this.alpha);
    strokeWeight(2);
    circle(this.x, this.y, this.size);
  }
}

class Bubble {
  constructor() {
    this.size = 22;
    this.reset();
    // Spread the first bubbles through the water.
    this.y = random(oceanHeight);
  }

  reset() {
    this.x = random(30, oceanWidth - 30);
    this.y = oceanHeight + random(30, 150);
    this.speedY = random(0.6, 1);
  }

  update() {
    this.y -= this.speedY;
    if (this.y < -this.size / 2) {
      this.reset();
    }

    for (let jellyfish of jellyfishGroup) {
      let distance = dist(this.x, this.y, jellyfish.x, jellyfish.y);
      // Approximate the inner bell with a circle, just as we do for eating.
      if (distance < this.size / 2 + jellyfish.size * 0.3) {
        jellyfish.energy = max(0, jellyfish.energy - 10);
        jellyfish.hurtTimer = 15;
        this.reset();
        break; // This bubble can hit only one jellyfish before restarting.
      }
    }
  }

  display() {
    fill(255, 100, 140, 20);
    stroke(255, 145, 175, 170);
    strokeWeight(1.5);
    circle(this.x, this.y, this.size);
    noStroke();
    fill(255, 220, 230, 180);
    circle(this.x - 4, this.y - 5, 4);
  }
}

class Seaweed {
  constructor(x, plantHeight) {
    this.x = x;
    this.plantHeight = plantHeight;
    this.phase = random(TWO_PI);
    this.plantColor = color(25, random(90, 140), 100);
    this.swayStrength = 18;
  }

  display() {
    stroke(this.plantColor);
    let previousX = this.x;
    let previousY = oceanHeight;
    let targetStrength = 18;
    let mouseInside = oceanMouseX >= 0 && oceanMouseX < oceanWidth && oceanMouseY >= 0 && oceanMouseY < oceanHeight;

    // Draw from the anchored base upward, narrowing toward the tip.
    for (let segment = 1; segment <= 20; segment++) {
      let progress = segment / 20;
      let sway = sin(frameCount * 0.02 + this.phase + progress * 2) * this.swayStrength * progress;
      let nextX = this.x + sway;
      let nextY = oceanHeight - this.plantHeight * progress;

      // Hovering near any part of this strand increases its sway.
      if (mouseInside && dist(oceanMouseX, oceanMouseY, nextX, nextY) < 35) {
        targetStrength = 45;
      }
      strokeWeight(10 * (1 - progress) + 1);
      line(previousX, previousY, nextX, nextY);
      previousX = nextX;
      previousY = nextY;
    }

    // Ease toward the target so the strand settles gently after hovering.
    this.swayStrength = lerp(this.swayStrength, targetStrength, 0.08);
  }
}

class OceanParticle {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.size = random(1, 3);
    this.speedY = random(0.1, 0.4);
    this.phase = random(TWO_PI);
  }

  update() {
    this.y -= this.speedY;
    if (this.y < -this.size) {
      this.y = oceanHeight;
    }
  }

  display() {
    // Different phases keep the particles from swaying together.
    let sway = sin(frameCount * 0.01 + this.phase) * 8;
    noStroke();
    fill(180, 220, 240, 45);
    circle(this.x + sway, this.y, this.size);
  }
}

class Plankton {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.size = 6;
    this.speedY = random(0.1, 0.3);
  }

  update() {
    this.y -= this.speedY;

    // When a particle leaves the top, bring it back at the bottom.
    if (this.y < -this.size / 2) {
      this.y = oceanHeight - this.size / 2;
    }
  }

  display() {
    noStroke();
    fill(170, 230, 160);
    circle(this.x, this.y, this.size);
  }
}

class Jellyfish {
  constructor(x, y, size, bodyColor) {
    // Each jellyfish stores its own properties.
    this.x = x;
    this.y = y;
    this.size = size;
    this.bodyColor = bodyColor;
    this.speedX = 1;
    this.speedY = -0.5;
    this.detectionRange = 180;
    this.swimSpeed = 1.2;
    this.energy = 80;
    this.hurtTimer = 0; // Frames remaining in the damage flash.
    this.mealsEaten = 0;
    this.tentacleCount = 3;
    this.mouseRange = 100;
  }

  reactToMouse() {
    // Ignore the mouse when it is outside the canvas.
    if (oceanMouseX < 0 || oceanMouseX >= oceanWidth || oceanMouseY < 0 || oceanMouseY >= oceanHeight) {
      return false;
    }

    let distance = dist(this.x, this.y, oceanMouseX, oceanMouseY);
    if (distance < this.mouseRange) {
      if (distance > 0) {
        // Point away from the mouse, using the same steady swimming speed.
        this.speedX = (this.x - oceanMouseX) / distance * this.swimSpeed;
        this.speedY = (this.y - oceanMouseY) / distance * this.swimSpeed;
      } else {
        // At the exact center, choose a direction without dividing by zero.
        this.speedX = this.swimSpeed;
        this.speedY = 0;
      }
      return true;
    }
    return false;
  }

  findFood() {
    let closestIndex = -1; // -1 means we haven't found food yet.
    let closestDistance = this.detectionRange;

    for (let i = 0; i < plankton.length; i++) {
      let food = plankton[i];

      // Only chase food inside our swimming area.
      if (food.x >= this.size / 2 && food.x <= oceanWidth - this.size / 2 &&
          food.y >= this.size * 0.3 &&
          food.y <= oceanHeight - this.size * 1.2) {
        let distance = dist(this.x, this.y, food.x, food.y);

        if (distance < closestDistance) {
          closestDistance = distance;
          closestIndex = i;
        }
      }
    }

    if (closestIndex !== -1) {
      let food = plankton[closestIndex];

      // Use a small circle inside the bell as our eating area.
      if (closestDistance < this.size * 0.3 + food.size / 2) {
        plankton.splice(closestIndex, 1);
        this.eat();
      } else {
        // Turn the direction toward food into a steady swimming speed.
        this.speedX = (food.x - this.x) / closestDistance * this.swimSpeed;
        this.speedY = (food.y - this.y) / closestDistance * this.swimSpeed;
      }
    }
  }

  separate() {
    for (let other of jellyfishGroup) {
      // Don't compare this jellyfish with itself.
      if (other !== this) {
        let distance = dist(this.x, this.y, other.x, other.y);
        let personalSpace = (this.size + other.size) / 2 + 15;

        if (distance > 0 && distance < personalSpace) {
          // Push more strongly when the two centers are closer together.
          let nudge = (1 - distance / personalSpace) * 2;
          this.x += (this.x - other.x) / distance * nudge;
          this.y += (this.y - other.y) / distance * nudge;
        } else if (distance === 0) {
          // Choose a direction if their centers match exactly.
          this.x += 1;
        }
      }
    }
  }

  eat() {
    this.energy = min(this.energy + 15, 100);
    this.mealsEaten += 1;
    this.size = min(this.size + 2, 140);

    // The remainder is zero after every third meal.
    if (this.mealsEaten % 3 === 0) {
      this.tentacleCount = min(this.tentacleCount + 1, 9);
    }
  }

  update() {
    // Swimming uses energy. Low energy makes swimming slower.
    if (this.hurtTimer > 0) {
      this.hurtTimer -= 1;
    }
    this.energy = max(this.energy - 0.02, 0);
    let speedMultiplier = 1;
    if (this.energy < 25) {
      speedMultiplier = 0.5;
    }

    this.x += this.speedX * speedMultiplier;
    this.y += this.speedY * speedMultiplier;

    this.separate();

    // Turn around when the bell reaches either side.
    if (this.x > oceanWidth - this.size / 2 || this.x < this.size / 2) {
      this.speedX *= -1;
    }

    // Keep the bell and tentacles inside the canvas.
    if (this.y < this.size * 0.3 ||
        this.y > oceanHeight - this.size * 1.2) {
      this.speedY *= -1;
    }

    // Growth changes the boundaries, so keep the larger body inside them.
    this.x = constrain(this.x, this.size / 2, oceanWidth - this.size / 2);
    this.y = constrain(this.y, this.size * 0.3, oceanHeight - this.size * 1.2);
  }

  display() {
    // A repeating pulse gently contracts and expands the bell.
    let pulse = 0.95 + sin(frameCount * 0.05) * 0.05;
    let bellWidth = this.size * pulse;

    // Extract this creature's color so each layer can use a different alpha.
    // Keep at least 30% brightness, even when energy reaches zero.
    let brightness = 0.3 + (this.energy / 100) * 0.7;
    let displayColor = this.bodyColor;
    if (this.hurtTimer > 0) {
      displayColor = color(255);
      brightness = 1; // Damage stays visible even when energy is low.
    }
    let r = red(displayColor);
    let g = green(displayColor);
    let b = blue(displayColor);
    let highlight = lerpColor(displayColor, color(255), 0.55);
    highlight.setAlpha(190 * brightness);

    // Layer larger, faint bells behind the body for a colored halo.
    noStroke();
    for (let layer = 4; layer >= 1; layer--) {
      fill(r, g, b, 7 * brightness);
      this.drawBell(bellWidth + layer * 6, this.size * 0.56 + layer * 4);
    }

    // Short connected lines let each tentacle taper toward its tip.
    noFill();
    stroke(r, g, b, 170 * brightness);
    for (let i = 0; i < this.tentacleCount; i++) {
      let spacing = (this.size / 2) / (this.tentacleCount - 1);
      let tentacleX = this.x - this.size / 4 + i * spacing;
      // Repeat three lengths without choosing new random values each frame.
      let tentacleLength = this.size * (0.7 + (i % 3) * 0.2);
      let previousX = tentacleX;
      let previousY = this.y + this.size * 0.1;

      for (let segment = 1; segment <= 24; segment++) {
        let progress = segment / 24;
        let sway = sin(frameCount * 0.025 - progress * 5 + i) * this.size * 0.12 * progress;
        let tipX = tentacleX + sway;
        let tipY = this.y + this.size * 0.1 + progress * tentacleLength;
        strokeWeight(3 * (1 - progress) + 0.5);
        line(previousX, previousY, tipX, tipY);
        previousX = tipX;
        previousY = tipY;
      }
    }

    // Draw the bell over the tops of the tentacles.
    noStroke();
    fill(r, g, b, 95 * brightness);
    this.drawBell(bellWidth, this.size * 0.56 * pulse);

    // An inner layer suggests light passing through the bell.
    fill(r, g, b, 45 * brightness);
    this.drawBell(bellWidth * 0.8, this.size * 0.48 * pulse);

    // Trace the curved lower rim with a broad glow and a fine bright line.
    noFill();
    for (let layer = 0; layer < 2; layer++) {
      if (layer === 0) {
        stroke(r, g, b, 45 * brightness);
        strokeWeight(6);
      } else {
        stroke(highlight);
        strokeWeight(1.5);
      }
      beginShape();
      vertex(this.x - bellWidth / 2, this.y + this.size * 0.12);
      bezierVertex(this.x - bellWidth / 4, this.y + this.size * 0.23,
                   this.x + bellWidth / 4, this.y + this.size * 0.23,
                   this.x + bellWidth / 2, this.y + this.size * 0.12);
      endShape();
    }
    noStroke();
  }

  // Reuse the same dome shape for the body and its glow layers.
  drawBell(bellWidth, bellHeight) {
    let rimY = this.y + this.size * 0.12;
    beginShape();
    vertex(this.x - bellWidth / 2, rimY);
    // Two control points pull the top edge upward into a dome.
    bezierVertex(this.x - bellWidth / 2, rimY - bellHeight,
                 this.x + bellWidth / 2, rimY - bellHeight,
                 this.x + bellWidth / 2, rimY);
    // Return along the gently curved bottom edge.
    bezierVertex(this.x + bellWidth / 4, rimY + this.size * 0.11,
                 this.x - bellWidth / 4, rimY + this.size * 0.11,
                 this.x - bellWidth / 2, rimY);
    endShape(CLOSE);
  }
}

// p5.js calls this whenever the browser window changes size.
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  resizeOcean();
}

function resizeOcean() {
  let oldWidth = oceanWidth;
  let oldHeight = oceanHeight;

  // One scale for both directions preserves the shapes' proportions.
  sceneScale = min(width / 900, height / 600);
  oceanWidth = width / sceneScale;
  oceanHeight = height / sceneScale;

  // Keep existing objects in the same relative part of the ocean.
  let groups = [jellyfishGroup, plankton, particles, bubbles, pops];
  for (let group of groups) {
    for (let item of group) {
      item.x *= oceanWidth / oldWidth;
      item.y *= oceanHeight / oldHeight;
    }
  }
  for (let plant of seaweed) {
    plant.x *= oceanWidth / oldWidth;
  }
}

function updateOceanMouse() {
  // Convert browser-canvas pixels back into the scene's coordinates.
  oceanMouseX = mouseX / sceneScale;
  oceanMouseY = mouseY / sceneScale;
}
