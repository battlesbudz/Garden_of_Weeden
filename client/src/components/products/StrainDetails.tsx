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

interface StrainDetailsProps {
  strain: LandraceStrain;
  onClose: () => void;
}

export default function StrainDetails({ strain, onClose }: StrainDetailsProps) {
  return (
    <div className="absolute top-4 right-4 bg-black/95 backdrop-blur-sm p-6 rounded-lg border border-battles-gold/30 shadow-2xl z-30 max-w-sm">
      <div className="flex justify-between items-start mb-4">
        <h4 className="text-xl font-bold text-battles-gold">{strain.name}</h4>
        <button 
          onClick={onClose}
          className="text-gray-400 hover:text-white text-xl flex-shrink-0 ml-2"
        >
          ×
        </button>
      </div>
      
      <div className="space-y-4">
        <div>
          <p className="text-sm text-gray-400 mb-1">Origin</p>
          <p className="text-battles-gold font-semibold mb-3">{strain.location}</p>
          
          <p className="text-sm text-gray-400 mb-1">Profile</p>
          <p className="text-gray-300 mb-3 text-sm leading-relaxed">{strain.notes}</p>
        </div>
        
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-400">THC Range:</span>
            <span className="text-battles-gold font-semibold">{strain.thc}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">CBD Range:</span>
            <span className="text-battles-gold font-semibold">{strain.cbd}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Flowering:</span>
            <span className="text-battles-gold font-semibold">{strain.flowering}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Chemotype:</span>
            <span className="text-battles-gold font-semibold">{strain.chemotype}</span>
          </div>
        </div>
      </div>
    </div>
  );
}