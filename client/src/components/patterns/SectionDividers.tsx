// Organic flowing shapes for section transitions

interface DividerProps {
  className?: string;
  flip?: boolean;
}

// Wave Divider - Smooth organic flow
export function WaveDivider({ className = '', flip = false }: DividerProps) {
  return (
    <div className={`w-full ${flip ? 'rotate-180' : ''} ${className}`}>
      <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="w-full h-12 md:h-16 lg:h-20">
        <path
          d="M0,0 C300,100 900,0 1200,50 L1200,120 L0,120 Z"
          className="fill-current text-gray-900"
        />
      </svg>
    </div>
  );
}

// Mountain/Hill Divider - Inspired by Buffalo terrain
export function MountainDivider({ className = '', flip = false }: DividerProps) {
  return (
    <div className={`w-full ${flip ? 'rotate-180' : ''} ${className}`}>
      <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="w-full h-16 md:h-20 lg:h-24">
        <path
          d="M0,120 L0,40 L200,80 L400,20 L600,60 L800,10 L1000,50 L1200,30 L1200,120 Z"
          className="fill-current text-gray-900"
        />
        <path
          d="M0,120 L0,60 L200,90 L400,50 L600,80 L800,40 L1000,70 L1200,60 L1200,120 Z"
          className="fill-current text-black opacity-50"
        />
      </svg>
    </div>
  );
}

// Cloud Divider - Organic and whimsical
export function CloudDivider({ className = '', flip = false }: DividerProps) {
  return (
    <div className={`w-full ${flip ? 'rotate-180' : ''} ${className}`}>
      <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="w-full h-12 md:h-16 lg:h-20">
        <path
          d="M0,50 Q100,20 200,50 T400,50 Q500,30 600,50 T800,50 Q900,20 1000,50 T1200,50 L1200,120 L0,120 Z"
          className="fill-current text-gray-900"
        />
      </svg>
    </div>
  );
}

// Leaf Flow Divider - Cannabis-inspired organic shape
export function LeafFlowDivider({ className = '', flip = false }: DividerProps) {
  return (
    <div className={`w-full ${flip ? 'rotate-180' : ''} ${className}`}>
      <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="w-full h-14 md:h-18 lg:h-22">
        <path
          d="M0,60 C150,10 250,80 400,40 C550,0 700,100 800,50 C900,0 1050,90 1200,40 L1200,120 L0,120 Z"
          className="fill-current text-gray-900"
        />
        <path
          d="M0,80 C200,40 350,100 500,60 C650,20 800,110 950,70 C1100,30 1150,80 1200,60 L1200,120 L0,120 Z"
          className="fill-current text-black opacity-30"
        />
      </svg>
    </div>
  );
}

// Geometric Angular Divider - Military precision meets organic
export function AngularDivider({ className = '', flip = false }: DividerProps) {
  return (
    <div className={`w-full ${flip ? 'rotate-180' : ''} ${className}`}>
      <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="w-full h-10 md:h-14 lg:h-16">
        <path
          d="M0,120 L0,60 L300,30 L600,80 L900,20 L1200,70 L1200,120 Z"
          className="fill-current text-gray-900"
        />
      </svg>
    </div>
  );
}

// Gradient Fade Divider - Smooth transition
export function GradientFadeDivider({ className = '', fromColor = 'from-black', toColor = 'to-gray-900' }: DividerProps & { fromColor?: string; toColor?: string }) {
  return (
    <div className={`w-full h-24 md:h-32 bg-gradient-to-b ${fromColor} ${toColor} ${className}`} />
  );
}
