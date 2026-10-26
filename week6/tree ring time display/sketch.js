/* TREE RING — 288 five-minute rings record one local calendar day.
   Open index.html with Live Server. P previews time; D changes theme.
   Every ring has a permanent, naturally varied contour; no history is hidden.
   The darker outer line traces one revolution in exactly 300 seconds. */
const SECONDS_PER_RING = 5 * 60;
const RINGS_PER_DAY = 86400 / SECONDS_PER_RING;
const TAU = Math.PI * 2;
let rings = [], completedLayer, cachedCount = -1;
let clockRadius, ringAspectX = 1, ringAspectY = 1;
let centerX, centerY, zoomLevel = 1;
let previewMode = false, previewSeconds = 0, lastDate = '', lastLabel = '';
let ui;
let treeSeed = [0, 0];

// Pure time calculation: never accumulate frame deltas, which can drift.
// Using local calendar fields also handles midnight and system-clock changes.
function timeState(date, secondsOverride = null) {
  const seconds = secondsOverride === null
    ? date.getHours() * 3600 + date.getMinutes() * 60 + date.getSeconds() + date.getMilliseconds() / 1000
    : secondsOverride;
  return { seconds, completed: Math.floor(seconds / SECONDS_PER_RING), fraction: (seconds % SECONDS_PER_RING) / SECONDS_PER_RING };
}

class TreeRing {
  constructor(index, radius, spacing) {
    this.index = index;
    this.points = [];
    this.path = new Path2D();
    // Each five-minute interval has its own path and permanent radius.
    // Thin strokes leave air between neighboring rings, even late in the day.
    this.radius = radius;
    this.weight = Math.min(.5, spacing * .32);
    this.opacity = .38 + .12 * noise(index * .19, 20);
  }

  pointAt(angle) {
    // Interpolate the precomputed closed contour for a smoothly moving tip.
    const position = ((angle + Math.PI / 2) / TAU % 1 + 1) % 1 * (this.points.length - 1);
    const j = Math.floor(position), t = position - j;
    const a = this.points[j], b = this.points[j + 1];
    return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];
  }

  display(context, fraction = 1, active = false) {
    if (fraction <= 0) return;
    context.lineWidth = active ? 1.35 : this.weight;
    context.strokeStyle = `rgba(35,39,32,${active ? .95 : this.opacity})`;
    if (fraction >= 1) { context.stroke(this.path); return; }
    // Seconds AND milliseconds determine the traced angle, starting at noon.
    const position = fraction * (this.points.length - 1);
    const whole = Math.floor(position);
    context.beginPath();
    context.moveTo(...this.points[0]);
    for (let j = 1; j <= whole; j++) context.lineTo(...this.points[j]);
    context.lineTo(...this.pointAt(-Math.PI / 2 + TAU * fraction));
    context.stroke();
  }
}

function setup() {
  const canvas = createCanvas(windowWidth, windowHeight);
  canvas.parent('art');
  pixelDensity(Math.min(window.devicePixelRatio || 1, 2));
  frameRate(60);
  noiseSeed(24271); // Stable across reloads, themes, days and resizes.
  ui = Object.fromEntries(['date', 'time', 'period', 'progress', 'progress-label', 'preview', 'scrubber', 'ring-count', 'preview-toggle', 'theme', 'zoom'].map(id => [id, document.getElementById(id)]));
  ui['preview-toggle'].onclick = togglePreview;
  ui.theme.onclick = toggleTheme;
  ui.zoom.onclick = () => { zoomLevel = zoomLevel === 4 ? 1 : zoomLevel * 2; ui.zoom.textContent = `${zoomLevel}×`; rebuildCache(); };
  ui.scrubber.oninput = event => { previewSeconds = Number(event.target.value); };
  document.addEventListener('keydown', event => {
    if (event.repeat || event.metaKey || event.ctrlKey || event.altKey) return;
    if (event.key.toLowerCase() === 'p') togglePreview();
    if (event.key.toLowerCase() === 'd') toggleTheme();
  });
  buildTreeRingGeometry();
}

function buildTreeRingGeometry() {
  centerX = width / 2;
  centerY = height / 2;
  // Use both screen dimensions: a wide window gets a broad, organic oval.
  // Normalize the irregular outer contour to fit the available screen.
  const shortSide = Math.min(width, height);
  clockRadius = Math.max(4.1, shortSide * .46);
  ringAspectX = width / shortSide;
  ringAspectY = height / shortSide;
  if (completedLayer) completedLayer.remove();
  completedLayer = createGraphics(width, height);
  completedLayer.pixelDensity(pixelDensity());
  prepareAllRings();
  rebuildCache();
}

function prepareAllRings() {
  rings = [];
  const segments = 900;
  const bands = [];
  // Slow growth periods pack rings tightly; faster periods leave wider gaps.
  // Deterministic noise keeps these growth bands stable across refreshes.
  for (let i = 0; i < RINGS_PER_DAY; i++) {
    const band = .22 + 3.8 * Math.pow(noise(i * .065, 14), 2.5);
    const pulse = .45 + 1.3 * noise(i * .41, 31);
    bands.push(band * pulse);
    const ring = new TreeRing(i, 0, clockRadius / RINGS_PER_DAY);
    ring.weight = .35 + .35 * noise(i * .23, 8);
    ring.opacity = .32 + .3 * noise(i * .14, 40);
    rings.push(ring);
  }
  let maxX = 0, maxY = 0;
  // Nested loops: sample directions around the trunk, then accumulate every
  // growth ring along that direction. Positive increments keep rings nested.
  for (let j = 0; j < segments; j++) {
    const angle = -Math.PI / 2 + TAU * j / segments;
    const c = Math.cos(angle), s = Math.sin(angle);
    const outline = 1 + .12 * Math.sin(3 * angle + .5)
      + .045 * Math.sin(7 * angle - .7)
      + .13 * (noise(4 + c * 2.4, 4 + s * 2.4) - .5);
    const increments = [];
    let total = 0;
    for (let i = 0; i < RINGS_PER_DAY; i++) {
      // Shared noise creates folds that migrate gently through neighboring
      // rings, like uneven wood growth, rather than copies of one outline.
      const growth = bands[i] * (.3 + 2.1 * noise(8 + c * 1.7, 8 + s * 1.7, i * .045));
      increments.push(growth);
      total += growth;
    }
    let accumulated = 0;
    for (let i = 0; i < RINGS_PER_DAY; i++) {
      accumulated += increments[i];
      const depth = accumulated / total;
      const radius = .008 + .992 * depth;
      // An eccentric heart and gradually shifting centers mimic the reference.
      const x = radius * outline * c - .12 * (1 - depth);
      const y = radius * outline * s + .16 * (1 - depth);
      rings[i].points.push([x, y]);
      maxX = Math.max(maxX, Math.abs(x));
      maxY = Math.max(maxY, Math.abs(y));
    }
  }
  const scaleX = width * .475 / maxX, scaleY = height * .475 / maxY;
  for (const ring of rings) {
    ring.points = ring.points.map(([x, y]) => [x * scaleX, y * scaleY]);
    ring.points.push([...ring.points[0]]);
    for (let j = 0; j < ring.points.length; j++) {
      if (j === 0) ring.path.moveTo(...ring.points[j]);
      else ring.path.lineTo(...ring.points[j]);
    }
    ring.path.closePath();
  }
  // The seed follows the eccentric heart of the trunk.
  treeSeed = [-.12 * scaleX, .16 * scaleY];
}

function rebuildCache() {
  completedLayer.clear();
  cachedCount = -1;
}

function withArtTransform(context, callback) {
  context.save();
  context.translate(centerX, centerY);
  context.scale(zoomLevel, zoomLevel);
  context.lineJoin = 'round';
  context.lineCap = 'round';
  callback(context);
  context.restore();
}

function draw() {
  const now = new Date();
  const state = timeState(now, previewMode ? previewSeconds : null);
  const dateKey = `${now.getFullYear()}-${now.getMonth()}-${now.getDate()}`;
  // Reset at midnight, when scrubbing backwards, or after a clock correction.
  if (dateKey !== lastDate || state.completed < cachedCount) rebuildCache();
  lastDate = dateKey;
  if (cachedCount !== state.completed) {
    completedLayer.clear();
    withArtTransform(completedLayer.drawingContext, context => {
      for (let i = 0; i < state.completed; i++) rings[i].display(context);
    });
    cachedCount = state.completed;
  }
  clear(); // Transparent artwork lets CSS smoothly transition the background.
  image(completedLayer, 0, 0);
  withArtTransform(drawingContext, context => {
    context.fillStyle = 'rgba(35,39,32,.65)';
    context.beginPath(); context.arc(treeSeed[0], treeSeed[1], 1.4, 0, TAU); context.fill();
    if (state.completed < RINGS_PER_DAY) rings[state.completed].display(context, state.fraction, true);
  });
  updateLabels(now, state);
}

function updateLabels(now, state) {
  const seconds = Math.floor(state.seconds);
  const h = Math.floor(seconds / 3600), m = Math.floor(seconds / 60) % 60, s = seconds % 60;
  const label = `${h % 12 || 12}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  if (label !== lastLabel) { ui.time.textContent = label; lastLabel = label; }
  ui.period.textContent = h >= 12 ? 'PM' : 'AM';
  ui.date.textContent = now.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' }).toUpperCase();
  ui.progress.style.transform = `scaleX(${state.seconds / 86400})`;
  ui['progress-label'].textContent = `${Math.floor(state.seconds / 86400 * 100)}% OF DAY`;
  if (previewMode) ui['ring-count'].textContent = `${state.completed} / ${RINGS_PER_DAY} RINGS`;
}

function togglePreview() {
  previewMode = !previewMode;
  if (previewMode) { previewSeconds = timeState(new Date()).seconds; ui.scrubber.value = previewSeconds; }
  ui.preview.hidden = !previewMode;
  ui['preview-toggle'].setAttribute('aria-pressed', String(previewMode));
}

function toggleTheme() {
  const dark = document.body.classList.toggle('dark');
  ui.theme.innerHTML = `${dark ? 'Light' : 'Dark'} <kbd>D</kbd>`;
  ui.theme.setAttribute('aria-pressed', String(dark));
  document.querySelector('meta[name="theme-color"]').content = dark ? '#151715' : '#f5f3ed';
  // The transparent monochrome cache is recolored by CSS, avoiding regeneration.
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  buildTreeRingGeometry();
}
