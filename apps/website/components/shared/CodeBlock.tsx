'use client';

import { useState, useEffect, type ReactNode } from 'react';
import { Card } from '@/components/ui/card';
import { Check, Copy } from 'lucide-react';
import { codeToHtml } from 'shiki';

interface CodeBlockProps {
  code: string;
  language?: string;
  icon?: ReactNode;
  inline?: boolean;
  showLineNumbers?: boolean;
}

export const CodeBlock = ({
  code,
  language = 'typescript',
  icon,
  inline = false,
}: CodeBlockProps) => {
  const [copied, setCopied] = useState(false);
  const [highlightedCode, setHighlightedCode] = useState<string>('');

  useEffect(() => {
    if (!inline) {
      codeToHtml(code, {
        lang: language,
        theme: 'github-dark-dimmed',
      })
        .then((html) => setHighlightedCode(html))
        .catch(() => setHighlightedCode(''));
    }
  }, [code, language, inline]);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (inline) {
    return (
      <Card className="p-4 bg-white/3 border-white/20 group relative overflow-hidden min-w-0">
        <div className="flex items-center gap-3 text-xs font-mono overflow-x-auto">
          {icon && <span className="shrink-0">{icon}</span>}
          <code className="text-white whitespace-nowrap">{code}</code>
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

  return (
    <Card className="p-6 bg-white/3 border-white/20 group relative overflow-hidden min-w-0">
      <button
        onClick={handleCopy}
        className="absolute top-4 right-4 z-10 opacity-0 group-hover:opacity-100 transition-opacity p-2 hover:bg-white/10 rounded"
        aria-label="Copy to clipboard"
      >
        {copied ? (
          <Check className="h-4 w-4 text-green-400" />
        ) : (
          <Copy className="h-4 w-4 text-white/60" />
        )}
      </button>
      <div
        className="shiki-wrapper overflow-x-auto [&>pre]:bg-transparent! [&>pre]:p-0! [&>pre]:m-0! [&>pre]:text-xs [&>pre]:font-mono [&>pre]:whitespace-pre"
        dangerouslySetInnerHTML={{
          __html: highlightedCode || `<pre><code>${code}</code></pre>`,
        }}
      />
    </Card>
  );
};
