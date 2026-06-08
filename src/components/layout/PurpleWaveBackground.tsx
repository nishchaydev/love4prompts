import React from 'react';

/**
 * Wave background for charcoal base with purple accent glows.
 * Base: #131316 (charcoal) 
 * Accent: #8B5CF6 (purple), #D83F87 (cerise), #E98074 (coral)
 */
interface PurpleWaveBackgroundProps {
  mode?: 'hero' | 'ambient';
}

export const PurpleWaveBackground: React.FC<PurpleWaveBackgroundProps> = ({ mode = 'hero' }) => {
  const isHero = mode === 'hero';

  return (
    <div
      className={`pointer-events-none overflow-hidden ${
        isHero ? 'absolute inset-0 z-0' : 'fixed inset-0 z-0'
      }`}
      aria-hidden="true"
    >
      {/* ── Primary purple glow — center ──────────────────────── */}
      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(ellipse 120% 60% at 50% 45%,
            rgba(139, 92, 246, ${isHero ? 0.12 : 0.04}) 0%,
            transparent 60%)`,
          animation: 'wG1 16s ease-in-out infinite',
        }}
      />

      {/* ── Cerise accent — upper right ──────────────────────── */}
      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(ellipse 70% 45% at 80% 30%,
            rgba(216, 63, 135, ${isHero ? 0.08 : 0.02}) 0%,
            transparent 55%)`,
          animation: 'wG2 20s ease-in-out infinite',
        }}
      />

      {/* ── Deep violet — bottom left ────────────────────────── */}
      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(ellipse 80% 50% at 20% 80%,
            rgba(68, 49, 141, ${isHero ? 0.1 : 0.03}) 0%,
            transparent 50%)`,
          animation: 'wG1 22s ease-in-out infinite reverse',
        }}
      />

      {/* ── SVG Wave Layers (hero only) ──────────────────────── */}
      {isHero && (
        <>
          {/* Wave 1 — large, slow, rear */}
          <svg
            className="absolute bottom-0 left-0 w-[200%] h-[50%] opacity-[0.06]"
            viewBox="0 0 1440 400"
            preserveAspectRatio="none"
            style={{ animation: 'wS1 30s linear infinite' }}
          >
            <path
              d="M0,200 C180,100 360,300 540,200 C720,100 900,300 1080,200 C1260,100 1440,300 1440,200 L1440,400 L0,400 Z"
              fill="url(#wg1)"
            />
            <defs>
              <linearGradient id="wg1" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="var(--color-accent-violet)" stopOpacity="0.6" />
                <stop offset="50%" stopColor="var(--color-primary)" stopOpacity="0.4" />
                <stop offset="100%" stopColor="var(--color-accent-violet)" stopOpacity="0.6" />
              </linearGradient>
            </defs>
          </svg>
 
          {/* Wave 2 — counter-direction */}
          <svg
            className="absolute bottom-0 left-0 w-[200%] h-[35%] opacity-[0.04]"
            viewBox="0 0 1440 320"
            preserveAspectRatio="none"
            style={{ animation: 'wS2 24s linear infinite' }}
          >
            <path
              d="M0,160 C240,80 480,240 720,160 C960,80 1200,240 1440,160 L1440,320 L0,320 Z"
              fill="url(#wg2)"
            />
            <defs>
              <linearGradient id="wg2" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="var(--color-primary)" stopOpacity="0.5" />
                <stop offset="50%" stopColor="var(--color-accent-violet)" stopOpacity="0.3" />
                <stop offset="100%" stopColor="var(--color-primary)" stopOpacity="0.5" />
              </linearGradient>
            </defs>
          </svg>

          {/* Purple light source behind text */}
          <div
            className="absolute top-[20%] left-1/2 -translate-x-1/2 w-[600px] h-[300px]"
            style={{
              background: 'radial-gradient(ellipse at center, rgba(139,92,246,0.12) 0%, transparent 60%)',
              filter: 'blur(60px)',
            }}
          />

          {/* Coral warm whisper — bottom right */}
          <div
            className="absolute bottom-[15%] right-[15%] w-[300px] h-[200px]"
            style={{
              background: 'radial-gradient(ellipse at center, rgba(233,128,116,0.06) 0%, transparent 70%)',
              filter: 'blur(40px)',
              animation: 'wG2 18s ease-in-out infinite',
            }}
          />
        </>
      )}

      {/* ── Edge fade to blend into charcoal base ────────────── */}
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(to bottom,
            rgba(19, 19, 22, ${isHero ? 0.3 : 0.6}) 0%,
            transparent 30%,
            transparent 70%,
            rgba(19, 19, 22, ${isHero ? 0.85 : 0.95}) 100%)`,
        }}
      />

      {/* ── Keyframes ────────────────────────────────────────── */}
      <style>{`
        @keyframes wG1 {
          0%, 100% { transform: translate(0%, 0%) scale(1); opacity: 0.8; }
          33% { transform: translate(3%, -2%) scale(1.05); opacity: 1; }
          66% { transform: translate(-2%, 2%) scale(0.97); opacity: 0.7; }
        }
        @keyframes wG2 {
          0%, 100% { transform: translate(0%, 0%) scale(1); opacity: 0.7; }
          50% { transform: translate(-3%, 1%) rotate(0.5deg) scale(1.06); opacity: 1; }
        }
        @keyframes wS1 {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
        @keyframes wS2 {
          0% { transform: translateX(-50%); }
          100% { transform: translateX(0%); }
        }
      `}</style>
    </div>
  );
};
