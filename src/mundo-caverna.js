// Parámetros ajustables de la antorcha
const TORCH_RADIUS = 320;
const TORCH_SOFTNESS = 90;
const TORCH_INTENSITY = 1.4;
const GLYPH_BOOST = 0.65;
const STAR_BOOST = 0.7;

export class MundoCaverna {
  constructor(canvas, { mode = 'cueva' } = {}) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.mode = mode;
    this.width = canvas.width = canvas.clientWidth || 800;
    this.height = canvas.height = canvas.clientHeight || 600;
    this.stars = [];
    this.dust = [];
    this.glyphs = [];
    this.pollen = [];
    this.t = 0;
    this.mx = 0.5;
    this.my = 0.5;
    this.init();
    window.addEventListener('resize', () => this.resize());
    window.addEventListener('pointermove', e => {
      const r = canvas.getBoundingClientRect();
      this.mx = (e.clientX - r.left) / r.width;
      this.my = (e.clientY - r.top) / r.height;
    });
    this.loop = this.loop.bind(this);
    requestAnimationFrame(this.loop);
  }
  resize() {
    this.width = this.canvas.width = this.canvas.clientWidth || window.innerWidth;
    this.height = this.canvas.height = this.canvas.clientHeight || window.innerHeight;
    this.init();
  }
  init() {
    this.stars = Array.from({ length: 220 }, () => ({
      x: Math.random() * this.width,
      y: Math.random() * this.height * 0.7,
      r: Math.random() * 1.4 + 0.3,
      a: Math.random() * Math.PI * 2,
      tw: Math.random() * 0.02 + 0.01
    }));
    this.dust = Array.from({ length: 140 }, () => ({
      x: Math.random() * this.width,
      y: Math.random() * this.height,
      v: Math.random() * 0.3 + 0.05,
      s: Math.random() * 1.5 + 0.5
    }));
    const glyphChars = ['⌖','⌘','⌬','⌷','◆','◈','{}','/* */','~','≈','♪','♯','∑','∏','∫','∂'];
    this.glyphs = Array.from({ length: 120 }, () => ({
      x: Math.random() * this.width,
      y: this.height * 0.55 + Math.random() * this.height * 0.45,
      ch: glyphChars[Math.floor(Math.random()*glyphChars.length)],
      s: Math.random() * 18 + 18,
      a: Math.random() * Math.PI * 2
    }));
    this.rocksFar = Array.from({ length: 6 }, () => ({
      x: Math.random()*this.width,
      y: this.height*0.65 + Math.random()*this.height*0.2,
      w: this.width*0.6 + Math.random()*this.width*0.4,
      h: 80 + Math.random()*60,
      a: Math.random()*0.04 - 0.02
    }));
    this.rocksNear = Array.from({ length: 4 }, () => ({
      x: Math.random()*this.width,
      y: this.height*0.75 + Math.random()*this.height*0.2,
      w: this.width*0.5 + Math.random()*this.width*0.3,
      h: 100 + Math.random()*80,
      a: Math.random()*0.06 - 0.03
    }));
    this.pollen = Array.from({ length: 180 }, () => ({
      x: Math.random() * this.width,
      y: Math.random() * this.height,
      v: Math.random() * 0.2 + 0.05,
      s: Math.random() * 1.6 + 0.6
    }));
    this.hills = Array.from({ length: 2 }, (_,i)=>({
      y: this.height*(0.65 + i*0.08),
      amp: 40 + i*20,
      phase: Math.random()*Math.PI*2
    }));
  }
  setMode(m) { this.mode = m; }
  loop() {
    this.t += 0.016;
    const ctx = this.ctx;
    ctx.clearRect(0,0,this.width,this.height);
    if (this.mode === 'cueva') {
      // cúpula
      const g = ctx.createRadialGradient(this.width*0.5, this.height*0.2, 50, this.width*0.5, this.height*0.2, Math.max(this.width,this.height));
      g.addColorStop(0, '#0b2e2a');
      g.addColorStop(0.4, '#0a1f18');
      g.addColorStop(1, '#040a08');
      ctx.fillStyle = g;
      ctx.fillRect(0,0,this.width,this.height);
      const lx = this.mx * this.width;
      const ly = this.my * this.height;
      // parallax offset
      const ox = (this.mx - 0.5) * 20;
      const oy = (this.my - 0.5) * 20;
      ctx.save();
      ctx.translate(ox, oy);
      // estrellas titilando con revelado
      this.stars.forEach(s => {
        s.a += s.tw;
        const baseAlpha = 0.4 + Math.sin(s.a) * 0.5;
        const d = Math.hypot(s.x - lx + ox, s.y - ly + oy);
        const fall = Math.max(0, 1 - d / TORCH_RADIUS);
        const boost = fall * STAR_BOOST;
        ctx.globalAlpha = Math.min(1, baseAlpha + boost);
        ctx.fillStyle = '#c9a45a';
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI*2);
        ctx.fill();
      });
      ctx.globalAlpha = 1;
      // polvo
      this.dust.forEach(d => {
        d.y += d.v;
        if (d.y > this.height) { d.y = 0; d.x = Math.random()*this.width; }
        ctx.fillStyle = 'rgba(255,255,255,0.04)';
        ctx.fillRect(d.x, d.y, d.s, d.s);
      });
      // siluetas roca
      const drawRocks = (rocks, alphaBase, para) => {
        ctx.globalAlpha = alphaBase;
        ctx.fillStyle = '#0a1a14';
        rocks.forEach(r => {
          const px = r.x + (this.mx - 0.5) * para * 10;
          const py = r.y + (this.my - 0.5) * para * 6;
          ctx.beginPath();
          ctx.ellipse(px, py, r.w, r.h, 0, 0, Math.PI*2);
          ctx.fill();
        });
        ctx.globalAlpha = 1;
      };
      drawRocks(this.rocksFar, 0.18, 0.4);
      drawRocks(this.rocksNear, 0.32, 0.8);
      // jeroglíficos con revelado
      ctx.fillStyle = '#a8c07a';
      this.glyphs.forEach(gc => {
        const d = Math.hypot(gc.x - lx + ox, gc.y - ly + oy);
        const fall = Math.max(0, 1 - d / TORCH_RADIUS);
        const baseAlpha = 0.35 + Math.sin(this.t*0.8 + gc.a) * 0.15;
        ctx.globalAlpha = Math.min(1, baseAlpha + fall * GLYPH_BOOST);
        ctx.font = `bold ${gc.s}px monospace`;
        ctx.fillText(gc.ch, gc.x, gc.y);
      });
      ctx.globalAlpha = 1;
      ctx.restore();
      // antorcha radial
      const torchGrad = ctx.createRadialGradient(lx, ly, 0, lx, ly, TORCH_RADIUS + TORCH_SOFTNESS);
      torchGrad.addColorStop(0, `rgba(255, 220, 160, ${0.35 * TORCH_INTENSITY})`);
      torchGrad.addColorStop(0.3, `rgba(255, 190, 100, ${0.18 * TORCH_INTENSITY})`);
      torchGrad.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.globalCompositeOperation = 'screen';
      ctx.fillStyle = torchGrad;
      ctx.beginPath();
      ctx.arc(lx, ly, TORCH_RADIUS + TORCH_SOFTNESS, 0, Math.PI*2);
      ctx.fill();
      ctx.globalCompositeOperation = 'source-over';

    } else {
      const lx = this.mx * this.width;
      const ly = this.my * this.height;
      // jardín
      const g = ctx.createLinearGradient(0,0,0,this.height);
      g.addColorStop(0, '#e8f6f3');
      g.addColorStop(1, '#fefcf7');
      ctx.fillStyle = g;
      ctx.fillRect(0,0,this.width,this.height);
      // sol con resplandor
      const sunX = this.width*0.8, sunY = this.height*0.22;
      const radial = ctx.createRadialGradient(sunX, sunY, 0, sunX, sunY, 220);
      radial.addColorStop(0, 'rgba(255,240,200,0.9)');
      radial.addColorStop(0.2, 'rgba(255,220,160,0.5)');
      radial.addColorStop(1, 'rgba(255,220,160,0)');
      ctx.fillStyle = radial;
      ctx.beginPath();
      ctx.arc(sunX, sunY, 220, 0, Math.PI*2);
      ctx.fill();
      // disco sol
      ctx.fillStyle = '#ffdca0';
      ctx.beginPath();
      ctx.arc(sunX, sunY, 70, 0, Math.PI*2);
      ctx.fill();
      const ox = (this.mx - 0.5) * 15;
      const oy = (this.my - 0.5) * 15;
      ctx.save();
      ctx.translate(ox, oy);
      // polen más visible
      this.pollen.forEach(p => {
        p.y += p.v;
        if (p.y > this.height) { p.y = 0; p.x = Math.random()*this.width; }
        ctx.fillStyle = 'rgba(176,138,58,0.55)';
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.s, 0, Math.PI*2);
        ctx.fill();
      });
      ctx.restore();
      // vegetación en capas onduladas
      this.hills.forEach((h,i)=>{
        ctx.globalAlpha = 0.18 + i*0.08;
        ctx.fillStyle = i===0 ? '#7a8f4a' : '#5c6f35';
        ctx.beginPath();
        ctx.moveTo(0, this.height);
        for(let x=0; x<=this.width; x+=20){
          const y = h.y + Math.sin((x*0.01) + this.t*0.3 + h.phase) * h.amp;
          ctx.lineTo(x, y);
        }
        ctx.lineTo(this.width, this.height);
        ctx.closePath();
        ctx.fill();
      });
      ctx.globalAlpha = 1;
      // halo cálido siguiendo puntero
      const halo = ctx.createRadialGradient(lx, ly, 0, lx, ly, TORCH_RADIUS + TORCH_SOFTNESS);
      halo.addColorStop(0, `rgba(255, 230, 180, ${0.22 * TORCH_INTENSITY})`);
      halo.addColorStop(0.35, `rgba(255, 210, 140, ${0.12 * TORCH_INTENSITY})`);
      halo.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.globalCompositeOperation = 'screen';
      ctx.fillStyle = halo;
      ctx.beginPath();
      ctx.arc(lx, ly, TORCH_RADIUS + TORCH_SOFTNESS, 0, Math.PI*2);
      ctx.fill();
      ctx.globalCompositeOperation = 'source-over';
    }
    requestAnimationFrame(this.loop);
  }
}
