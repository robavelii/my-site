import React, { useState } from 'react';
import { Server, Workflow, Box, Code2, ArrowRight } from 'lucide-react';
import { SERVICES } from '../../data/constants';
import { SectionHeader } from '../ui/SectionHeader';

export const Services: React.FC = () => {
  const [activeService, setActiveService] = useState<string | null>(SERVICES[0].endpoint);

  return (
    <section id="services">
      <SectionHeader title="System Interface (Services)" icon={Server} />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 border border-zinc-200 dark:border-zinc-800 rounded-lg bg-white dark:bg-zinc-950 shadow-sm dark:shadow-none overflow-hidden">
        {/* Sidebar (Endpoint List) */}
        <div className="lg:col-span-4 border-b lg:border-b-0 lg:border-r border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/30">
          <div className="p-4 border-b border-zinc-200 dark:border-zinc-800">
            <h3 className="text-xs font-mono uppercase text-zinc-500 dark:text-zinc-400 font-medium">
              Available Endpoints
            </h3>
          </div>
          <div className="divide-y divide-zinc-200 dark:divide-zinc-800">
            {SERVICES.map((service, idx) => (
              <button
                key={idx}
                onClick={() => setActiveService(service.endpoint)}
                className={`w-full text-left px-4 py-3 flex items-center gap-3 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors ${activeService === service.endpoint ? 'bg-zinc-100 dark:bg-zinc-800 border-l-2 border-emerald-500 -ml-px' : ''}`}
              >
                <span
                  className={`
                  text-[10px] font-bold font-mono w-12 text-center py-0.5 rounded
                  ${service.method === 'POST' ? 'bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-400' : ''}
                  ${service.method === 'GET' ? 'bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-400' : ''}
                  ${service.method === 'PUT' ? 'bg-orange-100 dark:bg-orange-900/50 text-orange-700 dark:text-orange-400' : ''}
                  ${service.method === 'PATCH' ? 'bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-400' : ''}
                `}
                >
                  {service.method}
                </span>
                <span
                  className={`text-xs font-mono truncate ${activeService === service.endpoint ? 'text-zinc-900 dark:text-zinc-100 font-medium' : 'text-zinc-500 dark:text-zinc-400'}`}
                >
                  {service.endpoint}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Detail View (System Design/Playground) */}
        <div className="lg:col-span-8 min-h-[400px] flex flex-col">
          {SERVICES.map((service) => {
            if (service.endpoint !== activeService) return null;
            return (
              <div
                key={service.endpoint}
                className="flex flex-col h-full animate-in fade-in duration-300"
              >
                {/* Header */}
                <div className="p-6 border-b border-zinc-200 dark:border-zinc-800">
                  <div className="flex items-center gap-4 mb-4">
                    <span className="text-2xl font-semibold text-zinc-900 dark:text-zinc-100">
                      {service.method}
                    </span>
                    <span className="font-mono text-zinc-500 dark:text-zinc-400 text-sm md:text-base">
                      {service.endpoint}
                    </span>
                  </div>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400 max-w-xl leading-relaxed">
                    {service.description}
                  </p>
                </div>

                {/* System Design / Flow View */}
                <div className="p-6 flex-1 space-y-8">
                  {/* System Flow Visualization */}
                  <div>
                    <h4 className="text-xs font-mono uppercase text-zinc-500 dark:text-zinc-400 mb-4 flex items-center gap-2">
                      <Workflow className="w-3 h-3" /> System Flow
                    </h4>
                    <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
                      {service.flow.map((step, i) => (
                        <React.Fragment key={i}>
                          <div className="px-3 py-1.5 rounded border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 shadow-sm">
                            {step}
                          </div>
                          {i < service.flow.length - 1 && (
                            <ArrowRight className="w-3 h-3 text-zinc-500 dark:text-zinc-400" />
                          )}
                        </React.Fragment>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Request Parameters */}
                    <div>
                      <h4 className="text-xs font-mono uppercase text-zinc-500 dark:text-zinc-400 mb-3 flex items-center gap-2">
                        <Box className="w-3 h-3" /> Request Body Schema
                      </h4>
                      <div className="bg-zinc-50 dark:bg-zinc-900/50 rounded border border-zinc-200 dark:border-zinc-800 p-3">
                        <div className="flex flex-col gap-2">
                          {service.params?.map((param, i) => (
                            <div key={i} className="flex justify-between text-xs font-mono">
                              <span className="text-blue-600 dark:text-blue-400">{param}</span>
                              <span className="text-zinc-500 dark:text-zinc-400">string</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Response Preview */}
                    <div>
                      <h4 className="text-xs font-mono uppercase text-zinc-500 dark:text-zinc-400 mb-3 flex items-center gap-2">
                        <Code2 className="w-3 h-3" /> Response Preview
                      </h4>
                      <div className="bg-zinc-950 rounded border border-zinc-800 p-3 overflow-hidden relative group">
                        <div className="absolute top-2 right-2 flex gap-1.5">
                          <div className="w-2 h-2 rounded-full bg-red-500/50"></div>
                          <div className="w-2 h-2 rounded-full bg-yellow-500/50"></div>
                          <div className="w-2 h-2 rounded-full bg-green-500/50"></div>
                        </div>
                        <pre className="text-[10px] font-mono text-zinc-300 overflow-x-auto pt-2">
                          {JSON.stringify(service.response, null, 2)}
                        </pre>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
