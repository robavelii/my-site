import React from 'react';
import { Terminal as TerminalIcon, ArrowRight, Download, FileText } from 'lucide-react';
import { Terminal } from '../Terminal';
import { SKILLS_DATA } from '../../data/constants';

export const Hero: React.FC = () => {
  return (
    <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center min-h-[500px]">
      <div className="space-y-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded border border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-900/50 text-xs font-mono text-zinc-600 dark:text-zinc-400 transition-colors">
          <TerminalIcon className="w-3 h-3" />
          <span>Initialized session: user_visitor</span>
        </div>

        {/* User Image with Pink Hover Effect */}
        <div className="relative w-24 h-24 md:w-32 md:h-32 group">
          {/* Pink glow effect on hover */}
          <div className="absolute -inset-1 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full opacity-0 blur transition duration-500 group-hover:opacity-75"></div>
          
          {/* Image container */}
          <div className="relative w-full h-full rounded-full bg-zinc-200 dark:bg-zinc-800 border-2 border-zinc-100 dark:border-zinc-700 overflow-hidden">
            <img
              src="/robel-fekadu.jpg"
              alt="Robel Fekadu"
              className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
            />
          </div>
        </div>

        <h1 className="text-4xl md:text-6xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100 transition-colors">
          Building scalable <br />
          <span className="text-zinc-500">distributed systems.</span>
        </h1>

        <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed max-w-md transition-colors">
          Senior Software Engineer specializing in high-volume data systems, microservices
          architecture, and enterprise solutions for healthcare and fintech.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 pt-4">
          {/* Connect to System Button - Improved */}
          <button
            onClick={() =>
              document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })
            }
            className="group relative inline-flex h-12 items-center justify-center overflow-hidden rounded-md bg-zinc-900 dark:bg-zinc-100 px-8 text-base font-medium text-zinc-50 dark:text-zinc-900 transition-all hover:bg-zinc-800 dark:hover:bg-zinc-200 focus:outline-none focus:ring-2 focus:ring-zinc-400 dark:focus:ring-zinc-400 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-zinc-900"
          >
            <span className="mr-2 text-sm font-mono">[C]</span> Connect to System
            <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
          </button>

          {/* Download Resume Button - Redesigned with PDF icon on hover */}
          <a
            href="/resume.pdf"
            download
            className="group relative inline-flex h-12 items-center justify-center overflow-hidden rounded-md border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-8 text-base font-medium text-zinc-900 dark:text-zinc-100 transition-all hover:bg-zinc-50 dark:hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-zinc-400 dark:focus:ring-zinc-400 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-zinc-900"
          >
            {/* Icon that changes on hover */}
            <Download className="mr-2 w-4 h-4 transition-all group-hover:opacity-0 group-hover:-translate-y-2" />
            <FileText className="mr-2 w-4 h-4 absolute left-8 opacity-0 translate-y-2 transition-all group-hover:opacity-100 group-hover:translate-y-0 text-red-500" />
            <span className="ml-2 text-sm">Download Resume</span>
          </a>

          <div className="flex items-center gap-4 px-4 h-12 text-sm text-zinc-500 font-mono">
            <span>Latency: 12ms</span>
            <span className="w-px h-4 bg-zinc-300 dark:bg-zinc-800"></span>
            <span>Region: et-east-1</span>
          </div>
        </div>
      </div>

      {/* Right Side: Terminal Block */}
      <div className="h-[400px] relative group">
        <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-emerald-500 rounded-lg opacity-20 blur transition duration-500 group-hover:opacity-30"></div>
        <Terminal key={JSON.stringify(SKILLS_DATA)} data={SKILLS_DATA} />
      </div>
    </section>
  );
};
