import React from 'react';

export const SectionHeader: React.FC<{
  eyebrow: string;
  title: string;
  icon: React.ElementType;
}> = ({ eyebrow, title, icon: Icon }) => (
  <div className="mb-6 border-b border-zinc-200 dark:border-zinc-800 pb-3 transition-colors">
    <div className="flex items-center gap-2 text-zinc-500 dark:text-zinc-400">
      <Icon className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
      <span className="font-mono text-[11px] uppercase tracking-[0.14em]">{eyebrow}</span>
    </div>
    <h2 className="mt-1.5 text-xl md:text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
      {title}
    </h2>
  </div>
);
