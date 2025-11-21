import React from 'react';

export const SectionHeader: React.FC<{ title: string; icon: React.ElementType }> = ({
  title,
  icon: Icon,
}) => (
  <div className="flex items-center gap-2 mb-6 text-zinc-500 dark:text-zinc-400 border-b border-zinc-200 dark:border-zinc-800 pb-2 transition-colors">
    <Icon className="w-4 h-4" />
    <h2 className="text-sm font-mono uppercase tracking-wider">{title}</h2>
  </div>
);
