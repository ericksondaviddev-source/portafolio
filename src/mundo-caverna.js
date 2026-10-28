// Parámetros ajustables de la antorcha
const TORCH_RADIUS = 320;
const TORCH_SOFTNESS = 90;
const TORCH_INTENSITY = 1.4;
const GLYPH_BOOST = 0.65;
const STAR_BOOST = 0.7;

// Densidad base: se escala según el área de la pantalla (no por área de partículas)
const BASE_DENSITY = 1;
const MAX_DPR = 2;

const GLYPH_CHARS = ['⌖', '⌘', '⌬', '⌷', '◆', '◈', '{}', '/* */', '~', '≈', '♪', '♯', '∑', '∏', '∫', '∂'];

export class MundoCaverna {
  constructor(canvas, { mode = 'cueva' } = {}) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.mode = mode;
    this.blend = mode === 'jardin' ? 1 : 0;
    this.blendTarget = this.blend;
    this.sceneSeed = 0;   // variante de escena (sala actual)
    this.scrollOffset = 0; // parallax: desplazamiento del recorrido (px)
    this.stars = [];
    this.dust = [];
    this.glyphs = [];
    this.pollen = [];
    this.rocksFar = [];
    this.rocksNear = [];
    this.hills = [];
    this.t = 0;
    this.mx = 0.5;
    this.my = 0.5;
    this.running = false;
    this.rafId = null;
    this.resizeTimer = null;
    this.reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    this.onPointerMove = (e) => {
      const r = canvas.getBoundingClientRect();
      this.mx = (e.clientX - r.left) / r.width;
      this.my = (e.clientY - r.top) / r.height;
    };
    this.onVisibility = () => {
      if (document.hidden) this.stop();
      else if (this.shouldRun) this.start();
    };
    this.onResize = () => {
      clearTimeout(this.resizeTimer);
      this.resizeTimer = setTimeout(() => this.resize(), 150);
    };

    this.resize();
    window.addEventListener('resize', this.onResize);
    window.addEventListener('pointermove', this.onPointerMove, { passive: true });
    document.addEventListener('visibilitychange', this.onVisibility);

    this.loop = this.loop.bind(this);
    this.shouldRun = true;
    if (this.reducedMotion) this.renderStatic();
    else this.start();
  }

  // ── Ciclo de vida ──
  start() {
    if (this.running || this.reducedMotion) return;
    this.running = true;
    this.lastTime = performance.now();
    this.rafId = requestAnimationFrame(this.loop);
  }

  stop() {
    if (!this.running) return;
    this.running = false;
    if (this.rafId) cancelAnimationFrame(this.rafId);
    this.rafId = null;
  }

  destroy() {
    this.stop();
    clearTimeout(this.resizeTimer);
    window.removeEventListener('resize', this.onResize);
    window.removeEventListener('pointermove', this.onPointerMove);
    document.removeEventListener('visibilitychange', this.onVisibility);
  }

  // Pausa el bucle cuando el canvas no está en pantalla
  setVisible(visible) {
    this.shouldRun = visible;
    if (visible) this.start();
    else this.stop();
  }

  setMode(m) {
    this.mode = m;
    this.blendTarget = m === 'jardin' ? 1 : 0;
    if (this.reducedMotion) {
      this.blend = this.blendTarget;
      this.renderStatic();
    }
  }

  // Canal interno de la app: avance del scroll (parallax) + variante por sala.
  setScene({ scroll = this.scrollOffset, seed = this.sceneSeed } = {}) {
    if (seed !== this.sceneSeed) {
      this.sceneSeed = seed;
      this.cacheGradients(); // nuevas variantes de fondo por sala
    }
    this.scrollOffset = scroll;
    if (this.reducedMotion) this.renderStatic();
  }

  // Aleatorio determinista para las variantes de escena
  prand(i) {
    const f = Math.sin(i * 127.1 + this.sceneSeed * 311.7) * 43758.5453;
    return f - Math.floor(f);
  }

  resize() {
    const cssW = this.canvas.clientWidth || window.innerWidth;
    const cssH = this.canvas.clientHeight || window.innerHeight;
    const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);
    this.width = cssW;
    this.height = cssH;
    this.canvas.width = Math.round(cssW * dpr);
    this.canvas.height = Math.round(cssH * dpr);
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    this.dpr = dpr;
    this.init();
    if (this.reducedMotion) this.renderStatic();
  }

  // ── Partículas: se generan una vez y se recolocan, sin recrear arrays ──
  init() {
    const area = (this.width * this.height) / (1280 * 720);
    const density = Math.max(0.35, Math.min(1.35, area * BASE_DENSITY));
    const count = (n) => Math.max(12, Math.round(n * density));

    const prevW = this.prevWidth || this.width;
    const prevH = this.prevHeight || this.height;
    const sx = this.width / prevW;
    const sy = this.height / prevH;
    this.prevWidth = this.width;
    this.prevHeight = this.height;

    const fit = (arr, n) => {
      while (arr.length > n) arr.pop();
      while (arr.length < n) arr.push({});
    };

    fit(this.stars, count(220));
    this.stars.forEach((s) => {
      if (s.x === undefined) {
        s.x = Math.random() * this.width;
        s.y = Math.random() * this.height * 0.7;
        s.r = Math.random() * 1.4 + 0.3;
        s.a = Math.random() * Math.PI * 2;
        s.tw = Math.random() * 0.02 + 0.01;
      } else {
        s.x *= sx;
        s.y *= sy;
      }
    });

    fit(this.dust, count(140));
    this.dust.forEach((d) => {
      if (d.x === undefined) {
        d.x = Math.random() * this.width;
        d.y = Math.random() * this.height;
        d.v = Math.random() * 0.3 + 0.05;
        d.s = Math.random() * 1.5 + 0.5;
      } else {
        d.x *= sx;
        d.y *= sy;
      }
    });

    fit(this.glyphs, count(120));
    this.glyphs.forEach((g) => {
      if (g.x === undefined) {
        g.x = Math.random() * this.width;
        g.y = this.height * 0.55 + Math.random() * this.height * 0.45;
        g.ch = GLYPH_CHARS[Math.floor(Math.random() * GLYPH_CHARS.length)];
        g.s = Math.random() * 18 + 18;
        g.a = Math.random() * Math.PI * 2;
      } else {
        g.x *= sx;
        g.y = this.height * 0.55 + (g.y / prevH) * this.height * 0.45;
      }
    });

    fit(this.rocksFar, count(6));
    this.rocksFar.forEach((r) => {
      if (r.x === undefined) r.x = Math.random() * this.width;
      r.y = this.height * 0.65 + Math.random() * this.height * 0.2;
      r.w = this.width * 0.6 + Math.random() * this.width * 0.4;
      r.h = 80 + Math.random() * 60;
      r.a = Math.random() * 0.04 - 0.02;
    });

    fit(this.rocksNear, count(4));
    this.rocksNear.forEach((r) => {
      if (r.x === undefined) r.x = Math.random() * this.width;
      r.y = this.height * 0.75 + Math.random() * this.height * 0.2;
      r.w = this.width * 0.5 + Math.random() * this.width * 0.3;
      r.h = 100 + Math.random() * 80;
      r.a = Math.random() * 0.06 - 0.03;
    });

    fit(this.pollen, count(180));
    this.pollen.forEach((p) => {
      if (p.x === undefined) {
        p.x = Math.random() * this.width;
        p.y = Math.random() * this.height;
        p.v = Math.random() * 0.2 + 0.05;
        p.s = Math.random() * 1.6 + 0.6;
      } else {
        p.x *= sx;
        p.y *= sy;
      }
    });

    fit(this.hills, 2);
    this.hills.forEach((h, i) => {
      if (h.y === undefined) h.phase = Math.random() * Math.PI * 2;
      h.y = this.height * (0.65 + i * 0.08);
      h.amp = 40 + i * 20;
    });

    this.cacheGradients();
  }

  // Los gradientes de fondo cambian con tamaño y variante (sala); se cachean
  cacheGradients() {
    this._gradKey = null;
    this._gradCueva = null;
    this._gradJardin = null;

    const ctx = this.ctx;
    const w = this.width;
    const h = this.height;

    const p = (i) => this.prand(i);

    // Cueva: el centro del túnel varía por sala
    const cupX = w * (0.35 + p(1) * 0.3);
    const cupY = h * 0.2;
    const cupula = ctx.createRadialGradient(cupX, cupY, 50, cupX, cupY, Math.max(w, h));
    cupula.addColorStop(0, '#0b2e2a');
    cupula.addColorStop(0.4, '#0a1f18');
    cupula.addColorStop(1, '#040a08');
    this._bgCueva = cupula;

    const jardin = ctx.createLinearGradient(0, 0, 0, h);
    jardin.addColorStop(0, '#e8f6f3');
    jardin.addColorStop(1, '#fefcf7');
    this._bgJardin = jardin;

    // Jardín: el sol nace en un lugar distinto por sala
    this._sunX = w * (0.65 + p(2) * 0.3);
    this._sunY = h * (0.14 + p(3) * 0.12);
    const sunX = this._sunX;
    const sunY = this._sunY;
    const radial = ctx.createRadialGradient(sunX, sunY, 0, sunX, sunY, 220);
    radial.addColorStop(0, 'rgba(255,240,200,0.9)');
    radial.addColorStop(0.2, 'rgba(255,220,160,0.5)');
    radial.addColorStop(1, 'rgba(255,220,160,0)');
    this._sunGlow = radial;
  }

  // Desplazamiento con repetición: factor por capa (distantes lentos, cercanos rápidos)
  modX(x, w, factor = 1) {
    let px = x - (this.reducedMotion ? 0 : this.scrollOffset * factor);
    px = ((px % w) + w) % w;
    return px;
  }

  torchGradient(lx, ly, jardin) {
    const key = `${Math.round(lx / 4)}:${Math.round(ly / 4)}:${jardin ? 1 : 0}`;
    if (this._gradKey === key) return jardin ? this._gradJardin : this._gradCueva;
    const ctx = this.ctx;
    const r = TORCH_RADIUS + TORCH_SOFTNESS;
    const g = ctx.createRadialGradient(lx, ly, 0, lx, ly, r);
    if (jardin) {
      g.addColorStop(0, `rgba(255, 230, 180, ${0.22 * TORCH_INTENSITY})`);
      g.addColorStop(0.35, `rgba(255, 210, 140, ${0.12 * TORCH_INTENSITY})`);
    } else {
      g.addColorStop(0, `rgba(255, 220, 160, ${0.35 * TORCH_INTENSITY})`);
      g.addColorStop(0.3, `rgba(255, 190, 100, ${0.18 * TORCH_INTENSITY})`);
    }
    g.addColorStop(1, 'rgba(0,0,0,0)');
    this._gradKey = key;
    if (jardin) this._gradJardin = g;
    else this._gradCueva = g;
    return g;
  }

  loop(now) {
    if (!this.running) return;
    const dt = Math.min(0.05, (now - this.lastTime) / 1000);
    this.lastTime = now;
    this.t += dt;
    this.blend += (this.blendTarget - this.blend) * Math.min(1, dt * 2.5); // amanecer ~1s
    this.draw();
    this.rafId = requestAnimationFrame(this.loop);
  }

  draw() {
    const ctx = this.ctx;
    ctx.clearRect(0, 0, this.width, this.height);
    const b = this.blend;
    if (b < 0.99) this.drawCueva(b);
    if (b > 0.01) this.drawJardin(b);
  }

  drawCueva(b = 1) {
    const ctx = this.ctx;
    const w = this.width;
    const h = this.height;
    const cueva = 1 - b; // peso de la cueva: se apaga mientras amanece
    if (cueva <= 0.01) return;

    const g = this._bgCueva;
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, w, h);

    // Antorcha: sigue el mouse pero cada sala la coloca con un sesgo propio
    const lx = Math.min(Math.max(this.mx + (this.prand(7) - 0.5) * 0.3, 0.03), 0.97) * w;
    const ly = this.my * h;
    const ox = (this.mx - 0.5) * 20;
    const oy = (this.my - 0.5) * 20;

    ctx.save();
    ctx.translate(ox, oy);

    this.stars.forEach((s) => {
      s.a += s.tw;
      const px = this.modX(s.x, w, 0.015); // capas lejanas: casi fijas
      const baseAlpha = 0.4 + Math.sin(s.a) * 0.5;
      const d = Math.hypot(px - lx + ox, s.y - ly + oy);
      const fall = Math.max(0, 1 - d / TORCH_RADIUS);
      ctx.globalAlpha = Math.min(1, baseAlpha + fall * STAR_BOOST) * cueva;
      ctx.fillStyle = '#c9a45a';
      ctx.beginPath();
      ctx.arc(px, s.y, s.r, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.globalAlpha = 1;

    this.dust.forEach((d) => {
      d.y += d.v;
      if (d.y > h) { d.y = 0; d.x = Math.random() * w; }
      const px = this.modX(d.x, w, 0.05); // capa media
      ctx.globalAlpha = 0.04 * cueva;
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(px, d.y, d.s, d.s);
    });
    ctx.globalAlpha = 1;

    const drawRocks = (rocks, alphaBase, para, factor) => {
      ctx.globalAlpha = alphaBase * cueva;
      ctx.fillStyle = '#0a1a14';
      rocks.forEach((r) => {
        const px = this.modX(r.x, w, factor); // la piedra camina contigo
        const py = r.y + (this.my - 0.5) * para * 6;
        ctx.beginPath();
        ctx.ellipse(px, py, r.w, r.h, 0, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.globalAlpha = 1;
    };
    drawRocks(this.rocksFar, 0.18, 0.4, 0.03);
    drawRocks(this.rocksNear, 0.32, 0.8, 0.08);

    ctx.fillStyle = '#a8c07a';
    this.glyphs.forEach((gc) => {
      const px = this.modX(gc.x, w, 0.14); // capa cercana: corre
      const d = Math.hypot(px - lx + ox, gc.y - ly + oy);
      const fall = Math.max(0, 1 - d / TORCH_RADIUS);
      const baseAlpha = 0.35 + Math.sin(this.t * 0.8 + gc.a) * 0.15;
      ctx.globalAlpha = Math.min(1, baseAlpha + fall * GLYPH_BOOST) * cueva;
      ctx.font = `bold ${gc.s}px monospace`;
      ctx.fillText(gc.ch, px, gc.y);
    });
    ctx.globalAlpha = 1;
    ctx.restore();

    ctx.globalCompositeOperation = 'screen';
    ctx.globalAlpha = cueva;
    ctx.fillStyle = this.torchGradient(lx, ly, false);
    ctx.beginPath();
    ctx.arc(lx, ly, TORCH_RADIUS + TORCH_SOFTNESS, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;
    ctx.globalCompositeOperation = 'source-over';
  }

  drawJardin(b = 1) {
    const ctx = this.ctx;
    const w = this.width;
    const h = this.height;
    if (b <= 0.01) return;

    ctx.globalAlpha = b;
    const g = this._bgJardin;
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, w, h);

    const sunX = this._sunX;
    const sunY = this._sunY;
    ctx.fillStyle = this._sunGlow;
    ctx.beginPath();
    ctx.arc(sunX, sunY, 220, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#ffdca0';
    ctx.beginPath();
    ctx.arc(sunX, sunY, 70, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;

    const ox = (this.mx - 0.5) * 15;
    const oy = (this.my - 0.5) * 15;
    ctx.save();
    ctx.translate(ox, oy);
    ctx.globalAlpha = b;

    this.pollen.forEach((p) => {
      p.y += p.v;
      if (p.y > h) { p.y = 0; p.x = Math.random() * w; }
      const px = this.modX(p.x, w, 0.06);
      ctx.fillStyle = 'rgba(176,138,58,0.55)';
      ctx.beginPath();
      ctx.arc(px, p.y, p.s, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.restore();
    ctx.globalAlpha = b;

    this.hills.forEach((hill, i) => {
      ctx.globalAlpha = (0.18 + i * 0.08) * b;
      ctx.fillStyle = i === 0 ? '#7a8f4a' : '#5c6f35';
      ctx.beginPath();
      ctx.moveTo(0, h);
      for (let x = 0; x <= w; x += 20) {
        // los perfiles caminan con el scroll: sensación de avanzar por el jardín
        const y = hill.y + Math.sin((x * 0.01) + this.t * 0.3 + hill.phase + (this.reducedMotion ? 0 : this.scrollOffset * 0.0004)) * hill.amp;
        ctx.lineTo(x, y);
      }
      ctx.lineTo(w, h);
      ctx.closePath();
      ctx.fill();
    });
    ctx.globalAlpha = 1;

    const lx = this.mx * w;
    const ly = this.my * h;
    ctx.globalCompositeOperation = 'screen';
    ctx.globalAlpha = b;
    ctx.fillStyle = this.torchGradient(lx, ly, true);
    ctx.beginPath();
    ctx.arc(lx, ly, TORCH_RADIUS + TORCH_SOFTNESS, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;
    ctx.globalCompositeOperation = 'source-over';
  }

  // Modo sin animación: un solo cuadro, sin bucle
  renderStatic() {
    const prevT = this.t;
    this.t = 0.35;
    this.blend = this.blendTarget;
    this.draw();
    this.t = prevT;
  }
}
