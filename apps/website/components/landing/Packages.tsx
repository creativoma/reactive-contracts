'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check, Copy, ExternalLink } from 'lucide-react';
import NpmIcon from '@/icons/npm-icon';
import { projectConfig } from '@/lib/project-config';

const packages = [
  {
    name: '@reactive-contracts/core',
    description:
      'Core types and contract definitions. Zero dependencies, framework-agnostic foundation.',
    installCommand: 'npm install @reactive-contracts/core',
    href: projectConfig.npm.core,
    features: ['Zero dependencies', 'Type-safe contracts', 'Framework agnostic'],
  },
  {
    name: '@reactive-contracts/react',
    description:
      'React hooks for consuming contracts. Includes useContract, useContractSuspense, and useContractMutation.',
    installCommand: 'npm install @reactive-contracts/react',
    href: projectConfig.npm.react,
    features: ['useContract hook', 'Suspense support', 'Mutation helpers'],
  },
  {
    name: '@reactive-contracts/server',
    description:
      'Backend utilities for implementing contracts. Type-safe resolver functions with full validation.',
    installCommand: 'npm install @reactive-contracts/server',
    href: projectConfig.npm.server,
    features: ['implementContract', 'Type validation', 'Error handling'],
  },
  {
    name: '@reactive-contracts/compiler',
    description:
      'CLI tool and build-time validation. Ensures both frontend and backend honor the contract agreement.',
    installCommand: 'npm install -D @reactive-contracts/compiler',
    href: projectConfig.npm.compiler,
    features: ['Build-time checks', 'Code generation', 'CLI commands'],
  },
];

export const Packages = () => {
  return (
    <section id="packages" className="mx-auto px-4 py-16 md:py-24">
      <div className="max-w-5xl mx-auto space-y-12">
        <div className="text-center space-y-4">
          <h3 className="text-3xl md:text-5xl text-balance font-heading text-white">Packages</h3>
          <p className="text-white/70 text-lg max-w-2xl mx-auto">
            A complete toolkit for bidirectional API contracts. Install only what you need, from
            core types to build-time validation.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {packages.map((pkg) => (
            <PackageCard key={pkg.name} {...pkg} />
          ))}
        </div>
      </div>
    </section>
  );
};

interface PackageCardProps {
  name: string;
  description: string;
  installCommand: string;
  href: string;
  features: string[];
}

const PackageCard = ({ name, description, installCommand, href, features }: PackageCardProps) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(installCommand);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Card className="p-6 bg-white/3 border-white/10 hover:border-white/30 transition-colors group">
      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <NpmIcon className="size-6" />
            <div>
              <h4 className="text-white font-mono text-sm">{name}</h4>
            </div>
          </div>
        </div>

        <p className="text-sm text-white/70 leading-relaxed">{description}</p>

        <div className="flex flex-wrap gap-2">
          {features.map((feature) => (
            <span key={feature} className="px-2 py-1 text-xs bg-white/10 rounded text-white/70">
              {feature}
            </span>
          ))}
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2 p-3 bg-white/5 border border-white/10 rounded font-mono text-xs text-white/90 group/install">
            <code className="flex-1">{installCommand}</code>
            <button
              onClick={handleCopy}
              className="shrink-0 p-1.5 hover:bg-white/10 rounded transition-colors"
              aria-label="Copy install command"
            >
              {copied ? (
                <Check className="h-3.5 w-3.5 text-green-400" />
              ) : (
                <Copy className="h-3.5 w-3.5 text-white/60" />
              )}
            </button>
          </div>

          <Button
            variant="ghost"
            size="sm"
            asChild
            className="text-white/70 hover:text-white px-4 py-2 h-auto w-full justify-center"
          >
            <Link href={href} target="_blank">
              <NpmIcon className="h-3 w-3 mr-1.5 grayscale" />
              View on npm
              <ExternalLink className="h-3 w-3 ml-1.5" />
            </Link>
          </Button>
        </div>
      </div>
    </Card>
  );
};
