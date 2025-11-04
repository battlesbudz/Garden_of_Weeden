// Advanced gradient overlays for depth and atmosphere

interface GradientOverlayProps {
  className?: string;
}

// Multi-stop gradient for hero sections
export function HeroGradientOverlay({ className = '' }: GradientOverlayProps) {
  return (
    <div className={`absolute inset-0 pointer-events-none ${className}`}>
      <div className="absolute inset-0 bg-gradient-to-b from-black/90 via-black/60 to-black/90" />
      <div className="absolute inset-0 bg-gradient-to-r from-green-900/20 via-transparent to-green-900/20" />
    </div>
  );
}

// Radial gradient spotlight effect
export function SpotlightGradient({ className = '' }: GradientOverlayProps) {
  return (
    <div className={`absolute inset-0 pointer-events-none ${className}`}>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_0%,_black_70%)]" />
    </div>
  );
}

// Atmospheric depth gradient
export function AtmosphericGradient({ className = '' }: GradientOverlayProps) {
  return (
    <div className={`absolute inset-0 pointer-events-none ${className}`}>
      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80" />
      <div className="absolute inset-0 bg-gradient-to-b from-green-950/30 via-transparent to-transparent" />
    </div>
  );
}

// Vignette effect
export function VignetteOverlay({ intensity = 'medium', className = '' }: GradientOverlayProps & { intensity?: 'light' | 'medium' | 'strong' }) {
  const opacityMap = {
    light: 'opacity-30',
    medium: 'opacity-50',
    strong: 'opacity-70'
  };

  return (
    <div className={`absolute inset-0 pointer-events-none ${className}`}>
      <div className={`absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_0%,_black_100%)] ${opacityMap[intensity]}`} />
    </div>
  );
}

// Aurora/Northern Lights gradient effect
export function AuroraGradient({ className = '' }: GradientOverlayProps) {
  return (
    <div className={`absolute inset-0 pointer-events-none overflow-hidden ${className}`}>
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-green-500/10 rounded-full filter blur-3xl animate-pulse" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full filter blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-purple-500/5 rounded-full filter blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
    </div>
  );
}

// Mesh gradient background (modern aesthetic)
export function MeshGradient({ className = '' }: GradientOverlayProps) {
  return (
    <div className={`absolute inset-0 pointer-events-none ${className}`}>
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-0 left-0 w-1/2 h-1/2 bg-gradient-to-br from-green-600 to-transparent filter blur-3xl" />
        <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-gradient-to-bl from-blue-600 to-transparent filter blur-3xl" />
        <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-gradient-to-tr from-purple-600 to-transparent filter blur-3xl" />
        <div className="absolute bottom-0 right-0 w-1/2 h-1/2 bg-gradient-to-tl from-teal-600 to-transparent filter blur-3xl" />
      </div>
    </div>
  );
}

// Striped gradient effect for section backgrounds
export function StripedGradient({ className = '' }: GradientOverlayProps) {
  return (
    <div className={`absolute inset-0 pointer-events-none ${className}`}>
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `
            repeating-linear-gradient(
              45deg,
              transparent,
              transparent 35px,
              rgba(34, 197, 94, 0.1) 35px,
              rgba(34, 197, 94, 0.1) 70px
            )
          `
        }}
      />
    </div>
  );
}
