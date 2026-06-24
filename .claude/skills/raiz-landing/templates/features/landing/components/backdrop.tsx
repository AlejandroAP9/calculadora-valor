/**
 * Fondo de marca: dos auroras cálidas que respiran + grano fino encima.
 * 100% CSS/SVG, sin video ni API externa (costo cero). Fijo detrás de todo.
 * Si prefieres un hero con video, reemplaza este componente; no es obligatorio.
 */
export function Backdrop() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-background">
      <div className="aurora aurora-a" />
      <div className="aurora aurora-b" />
      <div className="grain" />
      <style>{`
        .aurora {
          position: absolute; border-radius: 9999px; filter: blur(80px); opacity: .5;
          animation: drift 18s ease-in-out infinite alternate;
        }
        .aurora-a {
          width: 46rem; height: 46rem; top: -14rem; left: -10rem;
          background: radial-gradient(circle, var(--color-accent) 0%, transparent 60%);
        }
        .aurora-b {
          width: 40rem; height: 40rem; bottom: -16rem; right: -8rem;
          background: radial-gradient(circle, var(--color-sap) 0%, transparent 60%);
          opacity: .35; animation-delay: -6s;
        }
        @keyframes drift {
          from { transform: translate3d(0,0,0) scale(1); }
          to   { transform: translate3d(2rem,-1.5rem,0) scale(1.08); }
        }
        .grain {
          position: absolute; inset: 0; opacity: .035; mix-blend-mode: overlay;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
        }
        @media (prefers-reduced-motion: reduce) { .aurora { animation: none; } }
      `}</style>
    </div>
  );
}
