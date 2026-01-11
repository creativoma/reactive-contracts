import Link from 'next/link';
import { Button } from '@/components/ui/button';
import GithubIcon from '@/icons/github-icon';

export const Header = () => {
  return (
    <header className="border-b border-white/10">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link href="/" className="text-3xl text-balance font-heading">
            Reactive Contracts
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            <Link
              href="#how-it-works"
              className="text-sm text-white/60 hover:text-white transition-colors"
            >
              How It Works
            </Link>
            <Link
              href="#examples"
              className="text-sm text-white/60 hover:text-white transition-colors"
            >
              Examples
            </Link>
            <Link
              href="#packages"
              className="text-sm text-white/60 hover:text-white transition-colors"
            >
              Packages
            </Link>
            <Link href="#faq" className="text-sm text-white/60 hover:text-white transition-colors">
              FAQ
            </Link>
            <Link
              href="https://github.com/creativoma/reactive-contracts"
              className="text-sm text-white/60 hover:text-white transition-colors"
            >
              Docs
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" asChild className="text-white hover:bg-white/10">
            <Link
              href="https://github.com/creativoma/reactive-contracts"
              target="_blank"
              rel="noopener noreferrer"
            >
              <GithubIcon className="h-4 w-4 grayscale" />
            </Link>
          </Button>
          <Button
            size="sm"
            asChild
            className="hidden md:inline-flex bg-white text-black hover:bg-white/90"
          >
            <Link href="#installation">Get Started</Link>
          </Button>
        </div>
      </div>
    </header>
  );
};
