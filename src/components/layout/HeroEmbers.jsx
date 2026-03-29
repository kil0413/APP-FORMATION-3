import { useEffect, useRef } from 'react';

export default function HeroEmbers() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let W, H;
    let animationFrameId;

    function resize() {
      W = canvas.width = window.innerWidth;
      H = canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    class Ember {
      constructor() { this.reset(true); }

      reset(init) {
        this.x = Math.random() * W;
        this.y = init ? Math.random() * H : H + 10;
        this.vx = (Math.random() - 0.5) * 0.3;
        this.vy = -(0.2 + Math.random() * 0.8);
        this.size = 0.5 + Math.random() * 2;
        this.life = 1;
        this.decay = 0.001 + Math.random() * 0.003;
        this.warmth = Math.random();
        this.phase = Math.random() * Math.PI * 2;
      }

      update() {
        this.life -= this.decay;
        if (this.life <= 0 || this.y < -20) { this.reset(false); return; }
        this.x += this.vx + Math.sin(this.phase + Date.now() * 0.0008) * 0.15;
        this.y += this.vy;
        this.phase += 0.01;
      }

      draw() {
        const flicker = 0.6 + Math.sin(this.phase * 3) * 0.4;
        const a = this.life * flicker * 0.6;
        const r = 200 + this.warmth * 55;
        const g = 60 + this.warmth * 60;

        ctx.beginPath();
        const grad = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.size * 2.5);
        grad.addColorStop(0, `rgba(${r},${g},20,${a})`);
        grad.addColorStop(1, `rgba(${r},${g},20,0)`);
        ctx.fillStyle = grad;
        ctx.arc(this.x, this.y, this.size * 2.5, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    const embers = Array.from({ length: 60 }, () => new Ember());

    function animate() {
      ctx.clearRect(0, 0, W, H);
      ctx.globalCompositeOperation = 'lighter';
      embers.forEach(e => { e.update(); e.draw(); });
      animationFrameId = requestAnimationFrame(animate);
    }
    animate();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <>
      <canvas 
        ref={canvasRef} 
        className="fixed top-0 left-0 w-full h-full z-0 pointer-events-none"
      />
      {/* Subtle radial warmth at bottom fixed so it's always at bottom of viewport */}
      <div 
        className="fixed bottom-[-20%] left-1/2 -translate-x-1/2 w-[120vw] h-[60vh] z-[1] pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at center, rgba(180,60,20,0.08) 0%, transparent 70%)' }}
      />
    </>
  );
}
