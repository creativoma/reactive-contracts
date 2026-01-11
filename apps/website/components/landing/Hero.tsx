import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, Terminal, AlertCircle } from 'lucide-react';
import GithubIcon from '@/icons/github-icon';
import { CodeBlock } from '@/components/shared/CodeBlock';
import { projectConfig, getVersionBadge, isPreRelease } from '@/lib/project-config';

export const Hero = () => {
  return (
    <div className="w-full bg-black relative">
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `
            linear-gradient(to right, #e2e8f020 1px, transparent 0px),
            linear-gradient(to bottom, #e2e8f020 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
          WebkitMaskImage: 'radial-gradient(ellipse 70% 60% at 50% 0%, #000 60%, transparent 100%)',
          maskImage: 'radial-gradient(ellipse 70% 60% at 50% 0%, #000 60%, transparent 100%)',
        }}
      />
      <section className="mx-auto px-4 py-24 md:py-32 relative z-10">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="flex flex-col items-center justify-center gap-4">
            <div className="inline-block px-3 py-2 text-xs border border-white/20 rounded-full bg-black text-white">
              {getVersionBadge()} • {projectConfig.license} License
            </div>
            {isPreRelease() && (
              <div className="inline-flex gap-2 items-center px-3 py-2 bg-amber-500/10 border border-amber-500/30 rounded-full text-amber-200 text-xs">
                <AlertCircle className="h-4 w-4" />
                <span className="font-medium">Beta Release</span>
                <span className="text-amber-200/70">•</span>
                <span className="text-amber-200/90">Production Ready for Early Adopters</span>
                <Link
                  href="https://github.com/creativoma/reactive-contracts/blob/main/ROADMAP.md"
                  className="text-amber-100 hover:text-amber-50 underline underline-offset-2 transition-colors"
                  target="_blank"
                >
                  View Roadmap
                </Link>
              </div>
            )}
          </div>
          <h2 className="text-6xl md:text-8xl tracking-tight text-balance font-heading text-white">
            Bidirectional API Contracts
          </h2>
          <p className="text-lg md:text-xl text-white/70 max-w-md mx-auto text-balance">
            Put frontend in control. Stop consuming APIs. Start negotiating contracts.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Button size="lg" className="gap-2 bg-white text-black hover:bg-white/90" asChild>
              <Link href="#installation">
                Get Started
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="gap-2 bg-transparent border-white/20 text-white hover:bg-white/10"
              asChild
            >
              <Link href="https://github.com/creativoma/reactive-contracts" target="_blank">
                <GithubIcon className="h-4 w-4 grayscale" />
                View on GitHub
              </Link>
            </Button>
          </div>
          <div className="pt-8 w-fit mx-auto">
            <CodeBlock
              code="npm install @reactive-contracts/core"
              icon={<Terminal className="h-4 w-4 text-white/60" />}
              inline
            />
          </div>
        </div>
      </section>
    </div>
  );
};
