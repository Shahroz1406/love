/* =============================================
   I LOVE YOU WEBSITE — script.js
   ============================================= */

/* ── Falling Petals ─────────────────────────── */
(function spawnPetals() {
  const container = document.getElementById('petals-container');
  const symbols = ['🌸', '🌹', '❤️', '💕', '🌺', '🍃', '💖', '🌷'];
  const count = 28;

  for (let i = 0; i < count; i++) {
    const el = document.createElement('div');
    el.className = 'petal';
    el.textContent = symbols[Math.floor(Math.random() * symbols.length)];
    const left  = Math.random() * 100;
    const dur   = 6 + Math.random() * 9;
    const delay = Math.random() * 10;
    const size  = 0.9 + Math.random() * 1.1;
    el.style.cssText = `
      left: ${left}%;
      font-size: ${size}rem;
      animation-duration: ${dur}s;
      animation-delay: ${-delay}s;
    `;
    container.appendChild(el);
  }
})();


/* ── Sparkle Row ────────────────────────────── */
(function buildSparkles() {
  const row = document.getElementById('sparkle-row');
  const sparkles = ['✦', '✧', '✦', '✧', '✦', '✧', '✦'];
  sparkles.forEach((s, i) => {
    const span = document.createElement('span');
    span.className = 'sparkle';
    span.textContent = s;
    span.style.cssText = `
      color: hsl(${340 + i * 4}deg 90% 70%);
      animation-delay: ${i * 0.18}s;
    `;
    row.appendChild(span);
  });
})();


/* ── Floating Hearts Row ────────────────────── */
(function buildHearts() {
  const row = document.getElementById('hearts-row');
  const hearts = ['💗', '💓', '💞', '❤️', '💖', '💗', '💓'];
  hearts.forEach((h, i) => {
    const span = document.createElement('span');
    span.className = 'heart-float';
    span.textContent = h;
    span.style.cssText = `
      animation-duration: ${1.8 + i * 0.2}s;
      animation-delay: ${i * 0.15}s;
    `;
    row.appendChild(span);
  });
})();


/* ── Envelope Open ──────────────────────────── */
(function setupEnvelope() {
  const screen = document.getElementById('envelope-screen');
  const env    = document.getElementById('envelope');
  const main   = document.getElementById('main-content');

  screen.addEventListener('click', () => {
    env.classList.add('opening');
    setTimeout(() => {
      screen.classList.add('hidden');
      main.classList.remove('hidden');
      startTypewriter();
      drawHeartbeat();
    }, 600);
  });
})();


/* ── Typewriter Final Message ───────────────── */
function startTypewriter() {
  const el = document.getElementById('final-text');
  const msg = '✦ You are my everything ✦';
  let i = 0;
  function type() {
    if (i <= msg.length) {
      el.textContent = msg.slice(0, i);
      i++;
      setTimeout(type, 65);
    }
  }
  setTimeout(type, 400);
}


/* ── Heartbeat SVG Animation ────────────────── */
function drawHeartbeat() {
  const poly  = document.getElementById('heartbeat-line');
  const W = 400, H = 80, mid = H / 2;

  // Heartbeat path: flat → spike up → spike down → flat → repeat
  const template = [
    [0,   mid],
    [40,  mid],
    [55,  mid - 5],
    [65,  mid + 30],
    [75,  mid - 40],
    [85,  mid + 20],
    [95,  mid],
    [135, mid],
    [150, mid - 5],
    [160, mid + 30],
    [170, mid - 40],
    [180, mid + 20],
    [190, mid],
    [230, mid],
    [245, mid - 5],
    [255, mid + 30],
    [265, mid - 40],
    [275, mid + 20],
    [285, mid],
    [325, mid],
    [340, mid - 5],
    [350, mid + 30],
    [360, mid - 40],
    [370, mid + 20],
    [380, mid],
    [W,   mid],
  ];

  let progress = 0;
  const total  = template.length;

  function step() {
    if (progress < total) {
      progress++;
      const pts = template.slice(0, progress).map(p => p.join(',')).join(' ');
      poly.setAttribute('points', pts);
      setTimeout(step, 28);
    } else {
      // Pulse: fade out and redraw
      setTimeout(() => {
        progress = 0;
        poly.setAttribute('points', '');
        setTimeout(step, 300);
      }, 1800);
    }
  }
  step();
}


/* ── Fireworks ──────────────────────────────── */
function launchFireworks() {
  const canvas = document.getElementById('fireworks-canvas');
  const ctx    = canvas.getContext('2d');
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;

  const colors = [
    '#e63950', '#ff6b81', '#c0152a', '#8b0000',
    '#f5d76e', '#d4a017', '#ffb347', '#ff4757',
    '#ff6348', '#ff1744'
  ];

  const particles = [];

  function Particle(x, y) {
    this.x  = x;
    this.y  = y;
    const angle = Math.random() * Math.PI * 2;
    const speed = 2 + Math.random() * 5;
    this.vx  = Math.cos(angle) * speed;
    this.vy  = Math.sin(angle) * speed - 2;
    this.gravity = 0.12;
    this.alpha   = 1;
    this.decay   = 0.015 + Math.random() * 0.015;
    this.size    = 3 + Math.random() * 3;
    this.color   = colors[Math.floor(Math.random() * colors.length)];
    this.trail   = [];
  }

  Particle.prototype.update = function() {
    this.trail.push({ x: this.x, y: this.y });
    if (this.trail.length > 5) this.trail.shift();
    this.vy   += this.gravity;
    this.x    += this.vx;
    this.y    += this.vy;
    this.alpha -= this.decay;
  };

  Particle.prototype.draw = function() {
    ctx.save();
    // Trail
    this.trail.forEach((pt, i) => {
      ctx.globalAlpha = (this.alpha * i) / this.trail.length * 0.4;
      ctx.fillStyle   = this.color;
      ctx.beginPath();
      ctx.arc(pt.x, pt.y, this.size * 0.5, 0, Math.PI * 2);
      ctx.fill();
    });
    // Head
    ctx.globalAlpha = this.alpha;
    ctx.fillStyle   = this.color;
    ctx.shadowColor = this.color;
    ctx.shadowBlur  = 10;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  };

  function burst(x, y) {
    const count = 80 + Math.floor(Math.random() * 60);
    for (let i = 0; i < count; i++) particles.push(new Particle(x, y));
  }

  // Launch multiple bursts
  const bx = [.25, .5, .75, .35, .65];
  const by = [.3,  .2, .3,  .5,  .5];
  bx.forEach((rx, i) => {
    setTimeout(() => {
      burst(rx * canvas.width, by[i] * canvas.height);
    }, i * 200);
  });

  // Heart shape burst at center
  setTimeout(() => {
    const cx = canvas.width / 2, cy = canvas.height * 0.35;
    for (let t = 0; t < Math.PI * 2; t += 0.12) {
      const hx = 16 * Math.pow(Math.sin(t), 3);
      const hy = -(13 * Math.cos(t) - 5 * Math.cos(2*t) - 2 * Math.cos(3*t) - Math.cos(4*t));
      const p = new Particle(cx + hx * 6, cy + hy * 6);
      p.vx *= 0.5; p.vy *= 0.5;
      particles.push(p);
    }
  }, 1000);

  let animId;
  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.update();
      p.draw();
      if (p.alpha <= 0) particles.splice(i, 1);
    }
    if (particles.length > 0) {
      animId = requestAnimationFrame(animate);
    } else {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  }
  animate();

  // Resize canvas if needed
  window.addEventListener('resize', () => {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
  }, { once: true });
}
