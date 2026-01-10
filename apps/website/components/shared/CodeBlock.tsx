'use client';

import { useState, type ReactNode } from 'react';
import { Card } from '@/components/ui/card';
import { Check, Copy } from 'lucide-react';

interface CodeBlockProps {
  code: string;
  language?: string;
  icon?: ReactNode;
  inline?: boolean;
  showLineNumbers?: boolean;
}

export const CodeBlock = ({
  code,
  icon,
  inline = false,
  showLineNumbers = false,
}: CodeBlockProps) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (inline) {
    return (
      <Card className="p-4 bg-white/3 border-white/20 group relative overflow-hidden">
        <div className="flex items-center gap-3 text-sm font-mono overflow-x-auto">
          {icon && <span className="shrink-0">{icon}</span>}
          <code className="text-white">{code}</code>
          <button
            onClick={handleCopy}
            className="shrink-0 opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-white/10 rounded"
            aria-label="Copy to clipboard"
          >
            {copied ? (
              <Check className="h-4 w-4 text-green-400" />
            ) : (
              <Copy className="h-4 w-4 text-white/60" />
            )}
          </button>
        </div>
      </Card>
    );
  }

  const lines = code.split('\n');

  return (
    <Card className="p-6 bg-white/3 border-white/20 overflow-hidden group relative">
      <button
        onClick={handleCopy}
        className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity p-2 hover:bg-white/10 rounded"
        aria-label="Copy to clipboard"
      >
        {copied ? (
          <Check className="h-4 w-4 text-green-400" />
        ) : (
          <Copy className="h-4 w-4 text-white/60" />
        )}
      </button>
      <pre className="text-sm overflow-x-auto">
        <code className="font-mono text-white">
          {showLineNumbers
            ? lines.map((line, i) => (
                <div key={i} className="flex">
                  <span className="text-white/30 select-none w-8 text-right pr-4">{i + 1}</span>
                  <span>{line}</span>
                </div>
              ))
            : code}
        </code>
      </pre>
    </Card>
  );
};
