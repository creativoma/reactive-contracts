import { Card } from '@/components/ui/card';
import { Check, X, Clock, Zap } from 'lucide-react';

const comparisons = [
  {
    title: 'vs. GraphQL',
    description: (
      <>
        <a
          href="https://graphql.org/"
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:text-blue-400"
        >
          GraphQL
        </a>{' '}
        exposes a schema that frontend queries. Reactive Contracts inverts this: frontend declares
        requirements, backend proves it can satisfy them.
      </>
    ),
  },
  {
    title: 'vs. tRPC',
    description: (
      <>
        <a
          href="https://trpc.io/"
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:text-blue-400"
        >
          tRPC
        </a>{' '}
        shares types but doesn&apos;t validate constraints (latency, freshness) or support
        declarative reactivity at build time.
      </>
    ),
  },
  {
    title: 'vs. REST + OpenAPI',
    description: (
      <>
        <a
          href="https://www.openapis.org/"
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:text-blue-400"
        >
          OpenAPI
        </a>{' '}
        documents what exists. Reactive Contracts enforce what&apos;s required—and fail builds when
        requirements can&apos;t be met.
      </>
    ),
  },
];

export const Comparison = () => {
  return (
    <div className="w-full bg-black relative">
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `
            linear-gradient(to left, #e2e8f020 1px, transparent 0px),
            linear-gradient(to bottom, #e2e8f020 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
          WebkitMaskImage: 'radial-gradient(ellipse 70% 60% at 50% 0%, #000 60%, transparent 100%)',
          maskImage: 'radial-gradient(ellipse 70% 60% at 50% 0%, #000 60%, transparent 100%)',
        }}
      />
      <section className="mx-auto px-4 py-16 md:py-24 relative z-10">
        <div className="max-w-4xl mx-auto space-y-12">
          <div className="text-center space-y-4">
            <h3 className="text-3xl md:text-5xl text-balance font-heading text-white">
              Why Reactive Contracts?
            </h3>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {comparisons.map((item, index) => (
              <Card key={index} className="p-6 bg-black border-white/10">
                <div className="space-y-3">
                  <h4 className=" text-white">{item.title}</h4>
                  <p className="text-sm text-white/70 leading-relaxed">{item.description}</p>
                </div>
              </Card>
            ))}
          </div>

          {/* Build-time vs Runtime Comparison */}
          <div className="pt-12 space-y-6">
            <div className="text-center space-y-2">
              <h4 className="text-2xl md:text-3xl font-heading text-white">
                Build-time vs Runtime Validation
              </h4>
              <p className="text-white/60 text-sm max-w-xl mx-auto">
                Most tools validate at runtime when errors are expensive. Reactive Contracts
                validates at build time when errors are free.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              {/* Runtime Validation */}
              <Card className="p-6 bg-red-500/5 border-red-500/20">
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-red-400" />
                    <h5 className="text-lg font-semibold text-white">Runtime Validation</h5>
                  </div>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2 text-white/70">
                      <X className="h-4 w-4 text-red-400 shrink-0 mt-0.5" />
                      <span>Errors discovered in production</span>
                    </li>
                    <li className="flex items-start gap-2 text-white/70">
                      <X className="h-4 w-4 text-red-400 shrink-0 mt-0.5" />
                      <span>Manual type synchronization required</span>
                    </li>
                    <li className="flex items-start gap-2 text-white/70">
                      <X className="h-4 w-4 text-red-400 shrink-0 mt-0.5" />
                      <span>API changes break silently</span>
                    </li>
                    <li className="flex items-start gap-2 text-white/70">
                      <X className="h-4 w-4 text-red-400 shrink-0 mt-0.5" />
                      <span>Performance issues found by users</span>
                    </li>
                  </ul>
                </div>
              </Card>

              {/* Build-time Validation */}
              <Card className="p-6 bg-green-500/5 border-green-500/20">
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Zap className="h-5 w-5 text-green-400" />
                    <h5 className="text-lg font-semibold text-white">Build-time Validation</h5>
                  </div>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2 text-white/70">
                      <Check className="h-4 w-4 text-green-400 shrink-0 mt-0.5" />
                      <span>Errors caught during compilation</span>
                    </li>
                    <li className="flex items-start gap-2 text-white/70">
                      <Check className="h-4 w-4 text-green-400 shrink-0 mt-0.5" />
                      <span>Types auto-generated and synced</span>
                    </li>
                    <li className="flex items-start gap-2 text-white/70">
                      <Check className="h-4 w-4 text-green-400 shrink-0 mt-0.5" />
                      <span>Breaking changes fail the build</span>
                    </li>
                    <li className="flex items-start gap-2 text-white/70">
                      <Check className="h-4 w-4 text-green-400 shrink-0 mt-0.5" />
                      <span>Latency constraints verified upfront</span>
                    </li>
                  </ul>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
