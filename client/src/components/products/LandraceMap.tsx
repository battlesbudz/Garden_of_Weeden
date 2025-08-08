import { useState, useRef, useMemo } from 'react';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import worldMapImage from "@assets/Winkel_triple_projection_SW_1754600003820.jpg";

interface LandraceStrain {
  name: string;
  location: string;
  coordinates: { x: number; y: number };
  notes: string;
  thc: string;
  cbd: string;
  flowering: string;
  chemotype: string;
}

interface LandraceMapProps {
  strains: LandraceStrain[];
  selectedStrain: number | null;
  onStrainSelect: (index: number | null) => void;
}

export default function LandraceMap({ strains, selectedStrain, onStrainSelect }: LandraceMapProps) {
  const [tooltip, setTooltip] = useState<{ x: number; y: number; content: string } | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  
  const transformRef = useRef({
    scale: 0.9,
    positionX: 0,
    positionY: 0,
    hasBeenSet: false
  });

  return (
    <div className="relative">
      <div className="bg-gray-800 rounded-lg p-8 border border-battles-gold/20">
        <h3 className="text-2xl font-bold text-battles-gold mb-6 text-center">Global Landrace Origins</h3>
        
        <div className="relative bg-slate-800 rounded-lg overflow-hidden border border-battles-gold/30">
          <TransformWrapper
            initialScale={0.9}
            minScale={0.5}
            maxScale={3}
            centerOnInit={true}
            wheel={{ step: 0.1 }}
            pinch={{ step: 0.1 }}
            doubleClick={{ disabled: false }}
            limitToBounds={true}
            smooth={true}
          >
            <TransformComponent>
              <div className="relative">
                <img
                  src={worldMapImage}
                  alt="World Map showing landrace cannabis origins"
                  className="w-full h-auto"
                  style={{ minWidth: '800px', minHeight: '500px' }}
                />
                
                <svg
                  ref={svgRef}
                  className="absolute inset-0 w-full h-full pointer-events-auto"
                  viewBox="0 0 1600 900"
                  preserveAspectRatio="xMidYMid meet"
                >
                  {strains.map((strain, index) => (
                    <g key={index}>
                      <circle
                        cx={strain.coordinates.x}
                        cy={strain.coordinates.y}
                        r={selectedStrain === index ? "12" : "8"}
                        fill={selectedStrain === index ? "#FFD700" : "#D4AF37"}
                        stroke="#000"
                        strokeWidth="2"
                        className="cursor-pointer transition-all duration-300 hover:r-12 hover:fill-yellow-400 drop-shadow-lg"
                        onClick={() => onStrainSelect(selectedStrain === index ? null : index)}
                        onMouseEnter={(e) => {
                          const rect = svgRef.current?.getBoundingClientRect();
                          if (rect) {
                            setTooltip({
                              x: e.clientX - rect.left,
                              y: e.clientY - rect.top - 10,
                              content: `${strain.name} - ${strain.location}`
                            });
                          }
                        }}
                        onMouseLeave={() => setTooltip(null)}
                      />
                      
                      {selectedStrain === index && (
                        <g>
                          <circle
                            cx={strain.coordinates.x}
                            cy={strain.coordinates.y}
                            r="20"
                            fill="none"
                            stroke="#FFD700"
                            strokeWidth="2"
                            opacity="0.6"
                            className="animate-ping"
                          />
                        </g>
                      )}
                    </g>
                  ))}
                  
                  {tooltip && (
                    <g>
                      <rect
                        x={tooltip.x - 60}
                        y={tooltip.y - 25}
                        width="120"
                        height="20"
                        fill="rgba(0,0,0,0.8)"
                        rx="4"
                      />
                      <text
                        x={tooltip.x}
                        y={tooltip.y - 10}
                        textAnchor="middle"
                        fill="#FFD700"
                        fontSize="12"
                        fontWeight="bold"
                      >
                        {tooltip.content}
                      </text>
                    </g>
                  )}
                </svg>
              </div>
            </TransformComponent>
          </TransformWrapper>
        </div>
        
        <div className="mt-6 text-center">
          <p className="text-gray-400 text-sm mb-2">
            Click markers to explore genetic origins • Zoom and pan to explore
          </p>
          <div className="flex justify-center space-x-4 text-xs text-gray-500">
            <span>🔍 Zoom: Mouse wheel</span>
            <span>👆 Pan: Click and drag</span>
            <span>📍 Info: Click markers</span>
          </div>
        </div>
      </div>
    </div>
  );
}