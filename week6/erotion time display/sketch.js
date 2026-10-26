/* Erosion Clock. The geometry is derived from local time, never accumulated
   frame by frame: a refresh always produces the same amount of stone. */
const DAY = 86400;
let rock, wave, ui, preview = false, previewSeconds = 43200, dark = false;
let theme = 0, previousLabel = '', reducedMotion = false;
const view = { yaw: .35, elevation: .32, pointer: null, x: 0, y: 0 };
// Orthographic camera: rotate world coordinates, then project onto the canvas.
function project3D(p) {
  const x=p.x*Math.cos(view.yaw)-p.z*Math.sin(view.yaw);
  const z=p.x*Math.sin(view.yaw)+p.z*Math.cos(view.yaw);
  return {x, y:p.y*Math.cos(view.elevation)+z*Math.sin(view.elevation),
    depth:z*Math.cos(view.elevation)-p.y*Math.sin(view.elevation)};
}
function attachOrbit(element) {
  element.tabIndex=0;
  element.setAttribute('aria-label','3D erosion rock. Drag to orbit, arrow keys to rotate, R to reset view.');
  element.addEventListener('pointerdown',e=>{
    if(e.button!==0 || view.pointer!==null) return;
    view.pointer=e.pointerId; view.x=e.clientX; view.y=e.clientY;
    element.setPointerCapture(e.pointerId); element.classList.add('dragging'); element.focus();
  });
  element.addEventListener('pointermove',e=>{
    if(e.pointerId!==view.pointer) return;
    view.yaw-=(e.clientX-view.x)*.007;
    view.elevation=constrain(view.elevation+(e.clientY-view.y)*.005,.12,1.15);
    view.x=e.clientX; view.y=e.clientY;
  });
  const release=()=>{view.pointer=null;element.classList.remove('dragging');};
  element.addEventListener('pointerup',release);
  element.addEventListener('pointercancel',release);
  element.addEventListener('lostpointercapture',release);
  element.addEventListener('keydown',e=>{
    if(e.key==='ArrowLeft') view.yaw-=.12;
    else if(e.key==='ArrowRight') view.yaw+=.12;
    else if(e.key==='ArrowUp') view.elevation=constrain(view.elevation+.08,.12,1.15);
    else if(e.key==='ArrowDown') view.elevation=constrain(view.elevation-.08,.12,1.15);
    else if(e.key.toLowerCase()==='r') {view.yaw=.35;view.elevation=.32;}
    else return;
    e.preventDefault();
  });
}
const lightPalette = [[244,242,237],[142,145,138],[77,83,77],[153,164,157]];
const darkPalette = [[25,28,29],[150,158,153],[63,76,70],[126,147,139]];
function setup() {
  const canvas = createCanvas(windowWidth, windowHeight);
  canvas.parent('art'); attachOrbit(canvas.elt); pixelDensity(Math.min(window.devicePixelRatio || 1, 2));
  noiseSeed(72); frameRate(60);
  rock = new Rock(); wave = new Wave();
  ui = Object.fromEntries(['date','time','period','progress-label','progress-fill','preview','preview-status','timeline','preview-toggle','theme-toggle','theme-label'].map(id => [id,document.getElementById(id)]));
  ui['preview-toggle'].addEventListener('click', togglePreview);
  ui['theme-toggle'].addEventListener('click', toggleTheme);
  ui.timeline.addEventListener('input', e => { previewSeconds = Number(e.target.value); });
  reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
}
function localSeconds(date) {
  return date.getHours()*3600 + date.getMinutes()*60 + date.getSeconds() + date.getMilliseconds()/1000;
}
function draw() {
  const now = new Date();
  const seconds = preview ? previewSeconds : localSeconds(now);
  const progress = seconds / DAY;
  theme = lerp(theme, dark ? 1 : 0, 1-Math.exp(-Math.min(deltaTime,100)/240));
  const palette = lightPalette.map((c,i) => c.map((v,j) => lerp(v,darkPalette[i][j],theme)));
  background(...palette[0]);
  updateClock(now, seconds, progress);
  const base = Math.min(width*.24,height*.21,190);
  const cx = width*.5, cy = height*.49;
  rock.update(progress,base);
  // The fractional wall-clock second drives every wave cycle, even in preview.
  wave.update(reducedMotion ? .45 : now.getMilliseconds()/1000);
  push(); translate(cx,cy);
  wave.display(palette,rock);
  rock.display(palette);
  wave.contact(palette,rock);
  pop();
}
function updateClock(now, seconds, progress) {
  const whole = Math.floor(seconds), h = Math.floor(whole/3600), m = Math.floor(whole/60)%60, s = whole%60;
  const label = `${h%12 || 12}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
  if (label !== previousLabel) { ui.time.textContent = label; previousLabel = label; }
  ui.period.textContent = h<12 ? 'AM' : 'PM';
  ui.date.textContent = now.toLocaleDateString('en-US',{weekday:'long',month:'long',day:'numeric'}).toUpperCase();
  ui['progress-label'].textContent = `${Math.floor(progress*100)}% OF DAY`;
  ui['progress-fill'].style.width = `${progress*100}%`;
  document.querySelector('.track').setAttribute('aria-valuenow',(progress*100).toFixed(1));
  if(preview) ui.timeline.setAttribute('aria-valuetext',`${label} ${h<12?'AM':'PM'}`);
}
// A real three-dimensional mesh rendered with a small orthographic software
// renderer. Keeping the existing p5 canvas avoids extra libraries or assets.
class Rock {
  constructor() { this.triangles=[]; this.radius=1; this.lastProgress=-1; this.base=0; }
  waterline() { return this.radius*.43; }
  surface(theta,phi,progress) {
    const x=Math.sin(theta)*Math.cos(phi), y=-Math.cos(theta), z=Math.sin(theta)*Math.sin(phi);
    const broad=noise(3+x*1.3,3+y*1.3,3+z*1.3)-.5;
    const fine=noise(12+x*4,12+y*4,12+z*4)-.5;
    const grain=noise(35+x*8,35+y*8,35+z*8)-.5;
    const soft=noise(22+x*1.8,22+y*1.8,22+z*1.8);
    // Persistent lobes and uneven wear retain an irregular core at late times.
    const r=(1+broad*.55+fine*.08*(1-progress*.6)+grain*.022*(1-progress*.5)+.065*x*z)
      *Math.exp(-progress*(soft-.5)*.9);
    return {x:x*r*1.12,y:y*r*.94,z:z*r*.86};
  }
  update(progress,base) {
    if(Math.abs(progress-this.lastProgress)<.00002 && base===this.base) return;
    this.lastProgress=progress; this.base=base;
    this.radius=base*Math.sqrt(Math.max(.00025,1-progress));
    this.triangles=[];
    const rows=48, columns=96, grid=[];
    // Outer loop walks latitudes; inner loop samples a closed ring in 3D.
    for(let row=0;row<=rows;row++) {
      const ring=[];
      for(let col=0;col<=columns;col++) ring.push(this.surface(row/rows*PI,col/columns*TWO_PI,progress));
      grid.push(ring);
    }
    // Normalize surface area so visible scale follows the day's remaining share.
    let area=0; const faces=[];
    for(let row=0;row<rows;row++) for(let col=0;col<columns;col++) {
      for(const face of [[grid[row][col],grid[row+1][col],grid[row][col+1]],
                         [grid[row][col+1],grid[row+1][col],grid[row+1][col+1]]]) {
        const [a,b,c]=face, u={x:b.x-a.x,y:b.y-a.y,z:b.z-a.z},v={x:c.x-a.x,y:c.y-a.y,z:c.z-a.z};
        area+=Math.hypot(u.y*v.z-u.z*v.y,u.z*v.x-u.x*v.z,u.x*v.y-u.y*v.x)/2;
        faces.push(face);
      }
    }
    // Average adjoining face normals at shared positions for smooth lighting.
    const normals=new Map();
    const key=p=>[p.x,p.y,p.z].map(v=>v.toFixed(6)).join(',');
    for(const [a,b,c] of faces) {
      const u={x:b.x-a.x,y:b.y-a.y,z:b.z-a.z},v={x:c.x-a.x,y:c.y-a.y,z:c.z-a.z};
      let n={x:u.y*v.z-u.z*v.y,y:u.z*v.x-u.x*v.z,z:u.x*v.y-u.y*v.x};
      if(n.x*a.x+n.y*a.y+n.z*a.z<0) n={x:-n.x,y:-n.y,z:-n.z};
      for(const p of [a,b,c]) {const k=key(p),sum=normals.get(k)||{x:0,y:0,z:0};sum.x+=n.x;sum.y+=n.y;sum.z+=n.z;normals.set(k,sum);}
    }
    const scale=this.radius*Math.sqrt(4*PI/area);
    const shading=p=>{
      const n=normals.get(key(p)),length=Math.hypot(n.x,n.y,n.z)||1;
      const light=(-n.x*.45-n.y*.78+n.z*.43)/length;
      const mineral=(noise(40+p.x*7,40+p.y*7,40+p.z*7)-.5)*6;
      const wet=constrain((p.y*scale-this.waterline()+this.radius*.18)/(this.radius*.18),0,1);
      return light*20-3+mineral-wet*5;
    };
    for(const face of faces) {
      const scaled=face.map(p=>({x:p.x*scale,y:p.y*scale,z:p.z*scale,shade:shading(p)}));
      // Split at the water plane: the submerged half gets a faint water tint.
      // Separate polygons keep the waterline crisp without revealing mesh layers.
      for(const submerged of [false,true]) {
        const clipped=[];
        for(let i=0;i<3;i++) {
          const a=scaled[i],b=scaled[(i+1)%3];
          const inside=submerged?a.y>=this.waterline():a.y<=this.waterline();
          const next=submerged?b.y>=this.waterline():b.y<=this.waterline();
          if(inside) clipped.push(a);
          if(inside!==next) {
            const t=(this.waterline()-a.y)/(b.y-a.y);
            clipped.push({x:lerp(a.x,b.x,t),y:this.waterline(),z:lerp(a.z,b.z,t),shade:lerp(a.shade,b.shade,t)});
          }
        }
        for(let i=1;i<clipped.length-1;i++) {
          const triangle=[clipped[0],clipped[i],clipped[i+1]];
          triangle.submerged=submerged;
          this.triangles.push(triangle);
        }
      }
    }
  }
  display(palette) {
    const faces=this.triangles.map(points=>{
      const projected=points.map(project3D);
      return {points,projected,depth:projected.reduce((sum,p)=>sum+p.depth,0)/3};
    }).sort((a,b)=>a.depth-b.depth);
    // Painter's algorithm draws far faces first. Lighting stays fixed in world space.
    for(const face of faces) {
      const [a,b,c]=face.projected, shades=face.points.map(p=>p.shade);
      const dx=b.x-a.x,dy=b.y-a.y,ex=c.x-a.x,ey=c.y-a.y;
      const det=dx*ey-dy*ex; if(Math.abs(det)<.00001) continue;
      // Interpolate light continuously across each triangle, eliminating flat facets.
      const gx=((shades[1]-shades[0])*ey-(shades[2]-shades[0])*dy)/det;
      const gy=(dx*(shades[2]-shades[0])-ex*(shades[1]-shades[0]))/det;
      const magnitude=gx*gx+gy*gy,lo=Math.min(...shades),hi=Math.max(...shades);
      // Blend underwater stone toward the water/background color. Opaque tinting
      // avoids stacked translucent triangles making the hidden side too dark.
      const visibility=face.points.submerged ? .11 : 1;
      const color=s=>`rgb(${palette[1].map((v,i)=>lerp(palette[0][i],constrain(v+s,0,255),visibility)).join(',')})`;
      const ctx=drawingContext;
      let paint=color(shades[0]);
      if(magnitude>1e-8 && hi-lo>.0001) {
        paint=ctx.createLinearGradient(a.x+gx*(lo-shades[0])/magnitude,a.y+gy*(lo-shades[0])/magnitude,
          a.x+gx*(hi-shades[0])/magnitude,a.y+gy*(hi-shades[0])/magnitude);
        paint.addColorStop(0,color(lo)); paint.addColorStop(1,color(hi));
      }
      ctx.fillStyle=paint;ctx.strokeStyle=paint;ctx.lineWidth=.45;
      ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.lineTo(c.x,c.y);ctx.closePath();ctx.fill();ctx.stroke();
    }
  }
}
class Wave {
  constructor() { this.phase=0; }
  update(phase) { this.phase=phase; }
  ring(radius,y,opacity,palette) {
    noFill(); stroke(...palette[3],opacity); strokeWeight(.85);
    beginShape();
    for(let j=0;j<=100;j++) {
      const a=j/100*TWO_PI;
      const ripple=Math.sin(a*5+this.phase*TWO_PI)*1.2;
      const p=project3D({x:Math.cos(a)*(radius+ripple),y,z:Math.sin(a)*(radius+ripple)});
      vertex(p.x,p.y);
    }
    endShape(CLOSE);
  }
  display(palette,stone) {
    const r=stone.radius,extent=Math.min(width*.28,270);
    for(let ring=0;ring<5;ring++) {
      const t=(ring+this.phase)/5;
      this.ring(r*1.05+15+t*extent,stone.waterline(),(1-t)*66,palette);
    }
    // An incoming crest reaches the stone each second, then fades outward.
    const approach=constrain(this.phase/.48,0,1);
    this.ring(r*1.05+(1-approach)**2*65,stone.waterline(),Math.sin(this.phase*PI)*110,palette);
  }
  contact(palette,stone) {
    // Draw just the near half over the stone, so the far crest is occluded.
    const wash=Math.max(0,Math.sin(constrain((this.phase-.30)/.70,0,1)*PI));
    noFill();stroke(...palette[3],wash*120);strokeWeight(1.4);
    beginShape();
    for(let j=0;j<=60;j++) {
      const a=-view.yaw+j/60*PI;
      const p=project3D({x:Math.cos(a)*stone.radius*1.04,y:stone.waterline()-.8,z:Math.sin(a)*stone.radius*1.04});
      vertex(p.x,p.y);
    }
    endShape();
  }
}
function toggleTheme() {
  dark=!dark; document.body.classList.toggle('dark',dark);
  ui['theme-toggle'].setAttribute('aria-pressed',String(dark));
  ui['theme-label'].textContent=dark?'Light mode':'Dark mode';
}
function togglePreview() {
  preview=!preview;
  if(preview) { previewSeconds=Math.floor(localSeconds(new Date())); ui.timeline.value=previewSeconds; }
  ui.preview.hidden=!preview; ui['preview-status'].hidden=!preview;
  ui['preview-toggle'].setAttribute('aria-pressed',String(preview));
}
function keyPressed(event) {
  if(event.repeat || event.ctrlKey || event.metaKey || event.altKey) return;
  if(key==='d'||key==='D') toggleTheme();
  if(key==='p'||key==='P') togglePreview();
}
function windowResized() { resizeCanvas(windowWidth,windowHeight); }
