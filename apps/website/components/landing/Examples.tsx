import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, Layers } from 'lucide-react';
import AstroIcon from '@/icons/astro-icon';
import NextjsIcon from '@/icons/nextjs-icon';
import ViteIcon from '@/icons/vite-icon';
import { projectConfig } from '@/lib/project-config';

const examples = [
  {
    title: 'Basic Usage',
    description: 'Simple setup with React + Express server. Perfect for learning the fundamentals.',
    framework: 'React + Express',
    href: projectConfig.examples.basicUsage,
    icon: Layers,
    features: ['Contract definitions', 'Mock server', 'Basic hooks'],
  },
  {
    title: 'Next.js',
    description: 'App Router with Client Components. Full-stack TypeScript with server actions.',
    framework: 'Next.js 16',
    href: projectConfig.examples.nextjs,
    icon: NextjsIcon,
    features: ['App Router', 'Server Components', 'TypeScript'],
  },
  {
    title: 'Vite',
    description: 'Fast development with HMR and auto-compile plugin. Instant feedback loop.',
    framework: 'Vite + React',
    href: projectConfig.examples.vite,
    icon: ViteIcon,
    features: ['HMR support', 'Vite plugin', 'Fast builds'],
  },
  {
    title: 'Astro',
    description: 'Server-rendered with React islands. Perfect for content-heavy sites.',
    framework: 'Astro + React',
    href: projectConfig.examples.astro,
    icon: AstroIcon,
    features: ['Islands architecture', 'Partial hydration', 'SSR'],
  },
];

export const Examples = () => {
  return (
    <section id="examples" className=" mx-auto px-4 py-16 md:py-24">
      <div className="max-w-5xl mx-auto space-y-12">
        <div className="text-center space-y-4">
          <h3 className="text-3xl md:text-5xl text-balance font-heading text-white">Examples</h3>
          <p className="text-white/70 text-lg max-w-2xl mx-auto">
            Ready-to-run examples for different frameworks. Each includes contracts, generated code,
            and a working server.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {examples.map((example) => {
            const Icon = example.icon;
            return (
              <Card
                key={example.title}
                className="p-6 bg-white/3 border-white/10 hover:border-white/30 transition-colors group"
              >
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-6 grayscale">
                      <Icon className="size-10" />
                      <div>
                        <h4 className=" text-white">{example.title}</h4>
                        <span className="text-xs text-white/50">{example.framework}</span>
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-white/70 leading-relaxed">{example.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {example.features.map((feature) => (
                      <span
                        key={feature}
                        className="px-2 py-1 text-xs bg-white/10 rounded text-white/70"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    asChild
                    className="text-white/70 hover:text-white px-6 py-2 h-auto"
                  >
                    <Link href={example.href} target="_blank">
                      View Example
                      <ArrowRight className="h-3 w-3 ml-1 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};
