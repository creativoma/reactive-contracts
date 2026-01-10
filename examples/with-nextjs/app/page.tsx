import { ContractsDemo } from '../components/ContractsDemo';

export default function Home() {
  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <header className="text-center py-8 border-b border-zinc-800 mb-8">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-violet-500 to-purple-500 bg-clip-text text-transparent">
            🔄 Reactive Contracts Demo
          </h1>
          <p className="text-zinc-500 text-lg mb-4">
            Bidirectional API contracts that put frontend in control
          </p>
          <span className="inline-block bg-gradient-to-r from-zinc-800 to-zinc-700 px-4 py-1 rounded-full text-sm text-zinc-300">
            Next.js App Router
          </span>
        </header>

        {/* Main content */}
        <main>
          <ContractsDemo />
        </main>

        {/* Footer */}
        <footer className="text-center py-8 border-t border-zinc-800 mt-8 text-zinc-500 text-sm">
          <p>
            Open the browser console to see contract requests and responses.
            <br />
            Check{' '}
            <code className="bg-zinc-900 px-2 py-0.5 rounded text-violet-400">
              contracts/*.contract.ts
            </code>{' '}
            for contract definitions.
          </p>
        </footer>
      </div>
    </div>
  );
}
