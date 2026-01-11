import { CodeBlock } from '@/components/shared/CodeBlock';
import { CheckCircle, XCircle } from 'lucide-react';

const beforeExample = `// Traditional API - No type safety
const data = await fetch('/api/users/123')
  .then(r => r.json());

// What fields exist? What's the shape?
// Typos caught only at runtime
console.log(data.usrename); // Runtime error!`;

const afterExample = `// With Reactive Contracts - Full type safety
const { data } = useContract('getUser', { id: '123' });

// TypeScript knows exact shape
// Autocomplete, refactoring, errors at build time
console.log(data.username); // Type-safe!
//           ^^^^^^^^ Autocomplete works!`;

const buildTimeError = `// Contract changes caught at BUILD TIME
export const getUser = contract({
  name: 'getUser',
  input: { id: z.string() },
  output: { username: z.string() }, // Changed from "name"
});

// Backend forgot to update:
implementContract(getUser, async ({ id }) => {
  return { name: 'John' }; // Type error!
  //       ^^^^ Property 'username' is missing
});`;

export const TypeSafetyShowcase = () => {
  return (
    <section id="type-safety" className="mx-auto px-4 py-16 md:py-24">
      <div className="max-w-6xl mx-auto space-y-12">
        <div className="text-center space-y-4">
          <h3 className="text-3xl md:text-5xl text-balance font-heading text-white">
            Type Safety First
          </h3>
          <p className="text-white/70 text-lg max-w-2xl mx-auto">
            Catch errors before they reach production. Reactive Contracts provides end-to-end type
            safety from contract definition to runtime execution.
          </p>
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <XCircle className="h-5 w-5 text-red-400" />
              <h4 className="text-lg font-semibold text-white">Without Contracts</h4>
            </div>
            <CodeBlock code={beforeExample} />
          </div>
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-400" />
              <h4 className="text-lg font-semibold text-white">With Contracts</h4>
            </div>
            <CodeBlock code={afterExample} />
          </div>
        </div>
        <div className="space-y-4">
          <div className="flex items-center gap-2 justify-center">
            <CheckCircle className="h-5 w-5 text-amber-400" />
            <h4 className="text-lg font-semibold text-white">
              Contract Violations Caught at Build Time
            </h4>
          </div>
          <div className="max-w-3xl mx-auto">
            <CodeBlock code={buildTimeError} showLineNumbers />
          </div>
        </div>
        <div className="grid md:grid-cols-3 gap-6 pt-8">
          <div className="p-6 bg-white/3 border border-white/10 rounded-xl space-y-2">
            <h5 className="font-semibold text-white">Auto-completion</h5>
            <p className="text-sm text-white/60">
              IDEs provide full autocomplete for contract inputs, outputs, and constraints.
            </p>
          </div>
          <div className="p-6 bg-white/3 border border-white/10 rounded-xl space-y-2">
            <h5 className="font-semibold text-white">Refactoring Safety</h5>
            <p className="text-sm text-white/60">
              Rename fields with confidence. TypeScript ensures all usages are updated.
            </p>
          </div>
          <div className="p-6 bg-white/3 border border-white/10 rounded-xl space-y-2">
            <h5 className="font-semibold text-white">Zero Runtime Errors</h5>
            <p className="text-sm text-white/60">
              Contract mismatches caught at compile time, not in production logs.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
