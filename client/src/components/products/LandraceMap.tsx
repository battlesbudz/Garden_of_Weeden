import { useState, useRef, useMemo } from 'react';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import worldMapImage from "@assets/Winkel_triple_projection_SW_1754600003820.jpg";
import StrainDetails from './StrainDetails';

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
          {/* Strain Details Overlay */}
          {selectedStrain !== null && (
            <StrainDetails 
              strain={strains[selectedStrain]} 
              onClose={() => onStrainSelect(null)}
            />
          )}
          <TransformWrapper
            key="map-transform-wrapper"
            initialScale={transformRef.current.hasBeenSet ? transformRef.current.scale : 0.9}
            initialPositionX={transformRef.current.hasBeenSet ? transformRef.current.positionX : 0}
            initialPositionY={transformRef.current.hasBeenSet ? transformRef.current.positionY : 0}
            minScale={0.4}
            maxScale={4}
            limitToBounds={false}
            centerOnInit={!transformRef.current.hasBeenSet}
            wheel={{ step: 0.15 }}
            pinch={{ step: 8 }}
            doubleClick={{ disabled: false }}
            panning={{ 
              velocityDisabled: true
            }}
            alignmentAnimation={{ disabled: false }}
            disablePadding={true}
            onTransformed={(ref, state) => {
              transformRef.current = {
                scale: state.scale,
                positionX: state.positionX,
                positionY: state.positionY,
                hasBeenSet: true
              };
            }}
          >
            <TransformComponent
              wrapperClass="!w-full !h-96"
              contentClass="!w-full !h-full"
            >
              <div 
                className="relative w-full h-full min-w-[800px] min-h-[400px]"
                onClick={() => onStrainSelect(null)}
              >
                <img
                  src={worldMapImage}
                  alt="World Map with Cannabis Origins"
                  className="w-full h-full object-cover"
                  draggable={false}
                />
                
                {/* Strain Location Markers */}
                {strains.map((strain, index) => (
                  <div
                    key={strain.name}
                    className={`absolute w-4 h-4 -ml-2 -mt-2 cursor-pointer transition-all duration-200 z-20 ${
                      selectedStrain === index 
                        ? 'w-6 h-6 -ml-3 -mt-3' 
                        : 'hover:w-5 hover:h-5 hover:-ml-2.5 hover:-mt-2.5'
                    }`}
                    style={{
                      left: `${(strain.coordinates.x / 2058) * 100}%`,
                      top: `${(strain.coordinates.y / 1262) * 100}%`,
                      transform: 'translate(-50%, -50%)'
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      e.preventDefault();
                      onStrainSelect(selectedStrain === index ? null : index);
                    }}
                  >
                    <div className={`w-full h-full rounded-full border-2 border-white shadow-lg ${
                      selectedStrain === index 
                        ? 'bg-battles-gold animate-pulse' 
                        : 'bg-battles-gold/80 hover:bg-battles-gold'
                    }`} />
                    
                    {selectedStrain === index && (
                      <div className="absolute inset-0 rounded-full border-2 border-battles-gold animate-ping opacity-75" />
                    )}
                  </div>
                ))}
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