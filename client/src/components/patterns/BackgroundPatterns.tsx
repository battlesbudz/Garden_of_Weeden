// Cannabis Leaf Pattern - Subtle watermark background
export function CannabisLeafPattern({ opacity = 0.05, className = '' }: { opacity?: number; className?: string }) {
  return (
    <div className={`absolute inset-0 pointer-events-none ${className}`} style={{ opacity }}>
      <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="cannabis-leaf-pattern" x="0" y="0" width="200" height="200" patternUnits="userSpaceOnUse">
            <g transform="translate(100, 100)">
              {/* Simplified cannabis leaf icon */}
              <path
                d="M0-40 C-5-30,-8-20,-8-10 C-8-5,-6-2,-3,0 C-6,2,-8,5,-8,10 C-8,20,-5,30,0,40 C5,30,8,20,8,10 C8,5,6,2,3,0 C6-2,8-5,8-10 C8-20,5-30,0-40 Z
                   M-15-35 C-18-28,-20-20,-18-12 C-16-8,-12-6,-8-5 C-10-3,-11-1,-11,2 C-11,8,-9,15,-5,20 C-2,15,0,10,2,5 C0,2,-1,0,-2-2 C0-4,2-6,5-7 C3-9,1-11,0-14 C-3-20,-8-28,-15-35 Z
                   M15-35 C18-28,20-20,18-12 C16-8,12-6,8-5 C10-3,11-1,11,2 C11,8,9,15,5,20 C2,15,0,10,-2,5 C0,2,1,0,2-2 C0-4,-2-6,-5-7 C-3-9,-1-11,0-14 C3-20,8-28,15-35 Z"
                fill="currentColor"
                className="text-green-500"
              />
            </g>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#cannabis-leaf-pattern)" />
      </svg>
    </div>
  );
}

// Military-Inspired Geometric Pattern
export function MilitaryGeometricPattern({ opacity = 0.03, className = '' }: { opacity?: number; className?: string }) {
  return (
    <div className={`absolute inset-0 pointer-events-none ${className}`} style={{ opacity }}>
      <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="military-geometric" x="0" y="0" width="80" height="80" patternUnits="userSpaceOnUse">
            {/* Hexagonal tactical pattern */}
            <path
              d="M40,10 L55,20 L55,40 L40,50 L25,40 L25,20 Z
                 M0,10 L15,20 L15,40 L0,50 L-15,40 L-15,20 Z
                 M80,10 L95,20 L95,40 L80,50 L65,40 L65,20 Z
                 M40,50 L55,60 L55,80 L40,90 L25,80 L25,60 Z
                 M0,50 L15,60 L15,80 L0,90 L-15,80 L-15,60 Z
                 M80,50 L95,60 L95,80 L80,90 L65,80 L65,60 Z"
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
              className="text-green-600"
            />
            {/* Corner accent lines */}
            <line x1="40" y1="10" x2="40" y2="5" stroke="currentColor" strokeWidth="2" className="text-green-500" />
            <line x1="55" y1="20" x2="58" y2="20" stroke="currentColor" strokeWidth="2" className="text-green-500" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#military-geometric)" />
      </svg>
    </div>
  );
}

// Topographic/Contour Pattern for terrain feel
export function TopographicPattern({ opacity = 0.04, className = '' }: { opacity?: number; className?: string }) {
  return (
    <div className={`absolute inset-0 pointer-events-none ${className}`} style={{ opacity }}>
      <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="topographic" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
            <path
              d="M10,50 Q30,40 50,50 T90,50
                 M10,60 Q30,50 50,60 T90,60
                 M10,70 Q30,60 50,70 T90,70
                 M10,30 Q30,20 50,30 T90,30
                 M10,40 Q30,30 50,40 T90,40"
              fill="none"
              stroke="currentColor"
              strokeWidth="0.5"
              className="text-green-600"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#topographic)" />
      </svg>
    </div>
  );
}

// Dots Pattern - Simple and clean
export function DotsPattern({ opacity = 0.05, className = '' }: { opacity?: number; className?: string }) {
  return (
    <div className={`absolute inset-0 pointer-events-none ${className}`} style={{ opacity }}>
      <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="dots" x="0" y="0" width="30" height="30" patternUnits="userSpaceOnUse">
            <circle cx="15" cy="15" r="1.5" fill="currentColor" className="text-green-500" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#dots)" />
      </svg>
    </div>
  );
}
