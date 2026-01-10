import Link from 'next/link';
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
              className="text-sm text-white/60 hover:text-white transition-colors"
            >
              GitHub
            </Link>
            <Link
              href={projectConfig.npm.core}
              className="text-sm text-white/60 hover:text-white transition-colors"
            >
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
