import { Card } from '@/components/ui/card';

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
        </div>
      </section>
    </div>
  );
};
