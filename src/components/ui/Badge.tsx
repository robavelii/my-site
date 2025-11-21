import React from 'react';

export const Badge: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = '',
}) => (
  <span
    className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono border ${className}`}
  >
    {children}
  </span>
);
