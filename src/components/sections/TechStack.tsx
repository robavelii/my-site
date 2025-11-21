import React from 'react';
import { Layers, Cpu, Database, Server, Globe } from 'lucide-react';
import { TECH_STACK, getTechConfig } from '../../data/constants';
import { SectionHeader } from '../ui/SectionHeader';

export const TechStack: React.FC = () => {
  return (
    <section>
      <SectionHeader title="Infrastructure & Stack" icon={Layers} />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
        {TECH_STACK.map((cat, idx) => (
          <div key={idx} className="space-y-3">
            <h3 className="text-xs font-mono uppercase text-zinc-500 pl-1 flex items-center gap-2">
              {cat.name === 'Compute' && <Cpu className="w-3 h-3" />}
              {cat.name === 'Data' && <Database className="w-3 h-3" />}
              {cat.name === 'Infra' && <Server className="w-3 h-3" />}
              {cat.name === 'Interface' && <Globe className="w-3 h-3" />}
              {cat.name}
            </h3>
            <div className="grid grid-cols-1 gap-2">
              {cat.skills.map((skill) => {
                const config = getTechConfig(skill);
                const Icon = config.icon;
                return (
                  <div
                    key={skill}
                    className={`
                      flex items-center gap-3 p-2 rounded border border-zinc-200 dark:border-zinc-800 
                      bg-white dark:bg-zinc-900 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 
                      transition-all duration-200 group cursor-default
                      ${config.border}
                    `}
                  >
                    <div
                      className={`p-1.5 rounded ${config.bg} ${config.color} group-hover:scale-110 transition-transform`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-mono text-zinc-700 dark:text-zinc-300 group-hover:text-zinc-900 dark:group-hover:text-zinc-100 transition-colors">
                      {skill}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
