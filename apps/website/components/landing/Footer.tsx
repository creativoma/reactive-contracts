import Link from 'next/link';
import GithubIcon from '@/icons/github-icon';
import NpmIcon from '@/icons/npm-icon';
import { projectConfig } from '@/lib/project-config';

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-24">
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-sm text-white/60">
            {projectConfig.license} License © {currentYear} {projectConfig.author}
          </div>
          <div className="flex items-center gap-6">
            <Link
              href={projectConfig.repository.url}
              className="text-sm text-white/60 hover:text-white transition-colors flex items-center gap-1.5"
            >
              <GithubIcon className="h-3.5 w-3.5 grayscale" />
              GitHub
            </Link>
            <Link
              href={projectConfig.npm.core}
              className="text-sm text-white/60 hover:text-white transition-colors flex items-center gap-1.5"
            >
              <NpmIcon className="h-3.5 w-3.5 grayscale" />
              npm
            </Link>
            <Link
              href={projectConfig.repository.contributing}
              className="text-sm text-white/60 hover:text-white transition-colors"
            >
              Contributing
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
