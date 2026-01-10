export const ProblemSolution = () => {
  return (
    <section className=" mx-auto px-4 py-16 md:py-24">
      <div className="max-w-4xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12">
          <div className="space-y-4">
            <h3 className="text-3xl md:text-5xl text-balance font-heading text-white">
              The Problem
            </h3>
            <p className="text-white/70 leading-relaxed">
              Today's frontend is a second-class citizen. We consume whatever the backend decides to
              expose, deal with overfetching and underfetching, and pray that API changes don't
              break production.
            </p>
          </div>
          <div className="space-y-4">
            <h3 className="text-3xl md:text-5xl text-balance font-heading text-white">
              The Solution
            </h3>
            <p className="text-white/70 leading-relaxed">
              Reactive Contracts inverts this relationship. The frontend declares exactly what it
              needs, how it needs it, and the compiler ensures both sides honor the agreement—at
              build time, not runtime.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
