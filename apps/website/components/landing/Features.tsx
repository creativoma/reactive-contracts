import { Card } from '@/components/ui/card';
import { Check } from 'lucide-react';

const features = [
  {
    title: 'Bidirectional Contracts',
    description:
      'Frontend declares needs, backend provides capabilities. Compiler validates compatibility.',
  },
  {
    title: 'Build-Time Validation',
    description: 'API mismatches fail compilation, not production. Catch errors before deployment.',
  },
  {
    title: 'Latency Contracts',
    description:
      'Declare acceptable latency with automatic fallback strategies for degraded performance.',
  },
  {
    title: 'Derived Fields',
    description: 'Compute values at the optimal layer—client, edge, or origin—automatically.',
  },
  {
    title: 'Selective Reactivity',
    description: 'Specify which fields need real-time updates vs. static fetching with precision.',
  },
  {
    title: 'Zero Runtime Overhead',
    description:
      'Contracts compile away. No reflection, no runtime negotiation, just pure performance.',
  },
];

export const Features = () => {
  return (
    <section id="features" className=" mx-auto px-4 py-16 md:py-24">
      <div className="max-w-4xl mx-auto space-y-12">
        <div className="text-center space-y-4">
          <h3 className="text-3xl md:text-5xl text-balance font-heading text-white">
            Key Features
          </h3>
          <p className="text-white/70 text-lg">Build-time validation, zero runtime overhead</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="p-6 bg-white/3 border-white/10 hover:border-white/30 transition-colors"
            >
              <div className="flex gap-4">
                <div className="shrink-0 mt-1">
                  <div className="w-5 h-5 rounded-full bg-white flex items-center justify-center">
                    <Check className="h-3 w-3 text-black" />
                  </div>
                </div>
                <div className="space-y-2">
                  <h4 className=" text-white">{feature.title}</h4>
                  <p className="text-sm text-white/70 leading-relaxed">{feature.description}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
