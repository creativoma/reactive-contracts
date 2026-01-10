import { CodeBlock } from '@/components/shared/CodeBlock';

const contractExample = `import { contract, derive, max } from '@reactive-contracts/core';

export const UserProfileContract = contract({
  name: 'UserProfile',
  intent: 'Display user profile with activity summary',

  shape: {
    user: {
      id: 'string',
      name: 'string',
      avatar: 'URL<optimized:200x200>',
      joinedAt: 'Date',
    },
    activity: {
      postsCount: 'number',
      lastActive: 'Date',
      status: derive(ctx =>
        ctx.lastActive > daysAgo(7) ? 'active' : 'inactive'
      ),
    },
  },

  constraints: {
    latency: max('100ms', { fallback: 'cachedVersion' }),
  },

  reactivity: {
    realtime: ['activity.status'],
    static: ['user.name', 'user.avatar'],
    polling: [{ field: 'activity.postsCount', interval: '30s' }],
  },
});`;

const reactExample = `import { useContract } from '@reactive-contracts/react';
import { UserProfileContract } from '../contracts/user-profile.contract';

export function UserProfile({ userId }: { userId: string }) {
  const { data, loading, contractStatus } = useContract(UserProfileContract, {
    params: { userId },
  });

  if (contractStatus.latency === 'degraded') {
    return <UserProfileSkeleton hint="Using cached data" />;
  }

  return (
    <div>
      <Avatar src={data.user.avatar} />
      <h1>{data.user.name}</h1>
      <StatusBadge status={data.activity.status} />
    </div>
  );
}`;

export const QuickStart = () => {
  return (
    <section id="quick-start" className=" mx-auto px-4 py-16 md:py-24">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <h3 className="text-3xl md:text-5xl text-balance font-heading text-white">Quick Start</h3>
          <p className="text-white/70 text-lg">Define your contract in minutes</p>
        </div>

        <div className="space-y-6">
          <div className="space-y-3">
            <h4 className="text-lg  text-white flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-white text-black flex items-center justify-center text-xs">
                1
              </span>
              Define a Contract
            </h4>
            <CodeBlock code={contractExample} language="typescript" showLineNumbers />
          </div>

          <div className="space-y-3">
            <h4 className="text-lg  text-white flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-white text-black flex items-center justify-center text-xs">
                2
              </span>
              Use in React
            </h4>
            <CodeBlock code={reactExample} language="tsx" showLineNumbers />
          </div>
        </div>
      </div>
    </section>
  );
};
