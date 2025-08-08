import { LucideIcon } from 'lucide-react';

interface CultivationMethod {
  icon: LucideIcon;
  title: string;
  description: string;
}

interface CultivationMethodsProps {
  methods: CultivationMethod[];
}

export default function CultivationMethods({ methods }: CultivationMethodsProps) {
  return (
    <section className="py-16 bg-gray-900">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-battles-gold mb-4">Cultivation Excellence</h2>
          <p className="text-lg text-gray-400 max-w-3xl mx-auto">
            Indoor precision meets traditional cultivation wisdom for optimal genetic preservation
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {methods.map((method, index) => {
            const IconComponent = method.icon;
            return (
              <div key={index} className="bg-black p-6 rounded-lg border border-battles-gold/20 hover:border-battles-gold/40 transition-all">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-battles-gold/20 rounded-lg flex items-center justify-center">
                    <IconComponent className="h-6 w-6 text-battles-gold" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-battles-gold mb-2">{method.title}</h3>
                    <p className="text-gray-300">{method.description}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}