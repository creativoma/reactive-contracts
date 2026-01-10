import { Card } from '@/components/ui/card';
import { CodeBlock } from '@/components/shared/CodeBlock';
import { Terminal } from 'lucide-react';

const steps = [
  {
    number: 1,
    title: 'Install the packages',
    code: 'npm install @reactive-contracts/core @reactive-contracts/compiler',
  },
  {
    number: 2,
    title: 'Initialize your project',
    code: 'npx rcontracts init',
    description: 'This creates contracts/, rcontracts.config.ts, and generated/ directories.',
  },
  {
    number: 3,
    title: 'Compile your contracts',
    code: 'npx rcontracts compile',
    description: 'Validates contracts and generates types, resolvers, and negotiators.',
  },
];

export const Installation = () => {
  return (
    <section id="installation" className=" mx-auto px-4 py-16 md:py-24">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <h3 className="text-3xl md:text-5xl text-balance font-heading text-white">
            Installation
          </h3>
          <p className="text-white/70 text-lg">Get started in seconds</p>
        </div>

        <div className="space-y-4">
          {steps.map((step) => (
            <Card key={step.number} className="p-6 bg-white/3 border-white/20">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-white text-black flex items-center justify-center text-xs shrink-0 mt-1">
                    {step.number}
                  </div>
                  <div className="space-y-3 flex-1">
                    <h4 className=" text-white">{step.title}</h4>
                    <CodeBlock
                      code={step.code}
                      icon={<Terminal className="h-4 w-4 text-white/60" />}
                      inline
                    />
                    {step.description && (
                      <p className="text-sm text-white/60">{step.description}</p>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
