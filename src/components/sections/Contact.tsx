import React from 'react';
import { Mail, Linkedin, Github, MapPin, Clock } from 'lucide-react';
import { SectionHeader } from '../ui/SectionHeader';
import { CONTACT_EMAIL } from '../../data/constants';

export const Contact: React.FC = () => {
  return (
    <section id="contact">
      <SectionHeader title="System Connection (Contact)" icon={Mail} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Contact Information */}
        <div className="space-y-6">
          <div className="border border-zinc-200 dark:border-zinc-800 rounded-lg bg-white dark:bg-zinc-950 p-6 shadow-sm dark:shadow-none">
            <h3 className="text-sm font-mono uppercase text-zinc-500 mb-4 flex items-center gap-2">
              <Mail className="w-4 h-4" />
              Direct Channels
            </h3>
            <div className="space-y-4">
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="flex items-center gap-3 p-3 rounded border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors group"
              >
                <div className="p-2 rounded bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform">
                  <Mail className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <div className="text-xs font-mono text-zinc-500 uppercase">Email</div>
                  <div className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                    {CONTACT_EMAIL}
                  </div>
                </div>
              </a>

              <a
                href="https://www.linkedin.com/in/robavelii"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-3 rounded border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors group"
              >
                <div className="p-2 rounded bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform">
                  <Linkedin className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <div className="text-xs font-mono text-zinc-500 uppercase">LinkedIn</div>
                  <div className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                    /in/robavelii
                  </div>
                </div>
              </a>

              <a
                href="https://github.com/robavelii"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-3 rounded border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors group"
              >
                <div className="p-2 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 group-hover:scale-110 transition-transform">
                  <Github className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <div className="text-xs font-mono text-zinc-500 uppercase">GitHub</div>
                  <div className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                    @robavelii
                  </div>
                </div>
              </a>
            </div>
          </div>

          {/* Location & Availability */}
          <div className="border border-zinc-200 dark:border-zinc-800 rounded-lg bg-white dark:bg-zinc-950 p-6 shadow-sm dark:shadow-none">
            <h3 className="text-sm font-mono uppercase text-zinc-500 mb-4">
              System Info
            </h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm">
                <MapPin className="w-4 h-4 text-zinc-400" />
                <span className="text-zinc-600 dark:text-zinc-400">Addis Ababa, Ethiopia</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Clock className="w-4 h-4 text-zinc-400" />
                <span className="text-zinc-600 dark:text-zinc-400">EAT (UTC+3)</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <div className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                </div>
                <span className="text-emerald-600 dark:text-emerald-500 font-medium">
                  Available for opportunities
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* CTA / Message */}
        <div className="border border-zinc-200 dark:border-zinc-800 rounded-lg bg-gradient-to-br from-zinc-50 to-white dark:from-zinc-900/50 dark:to-zinc-950 p-8 shadow-sm dark:shadow-none flex flex-col justify-center">
          <div className="space-y-6">
            <div>
              <h3 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-100 mb-2">
                Let's build something great together
              </h3>
              <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
                I'm always interested in discussing new projects, innovative ideas, or
                opportunities to be part of your vision. Whether you need a systems architect,
                backend engineer, or technical consultant — let's connect.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="inline-flex h-11 items-center justify-center rounded-md bg-zinc-900 dark:bg-zinc-100 px-6 font-medium text-zinc-50 dark:text-zinc-900 transition-all hover:bg-zinc-800 dark:hover:bg-zinc-200 focus:outline-none focus:ring-2 focus:ring-zinc-400 dark:focus:ring-zinc-400 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-zinc-900"
              >
                <Mail className="w-4 h-4 mr-2" />
                Send Email
              </a>
              <a
                href="https://www.linkedin.com/in/robavelii"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-11 items-center justify-center rounded-md border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-6 font-medium text-zinc-900 dark:text-zinc-100 transition-all hover:bg-zinc-50 dark:hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-zinc-400 dark:focus:ring-zinc-400 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-zinc-900"
              >
                <Linkedin className="w-4 h-4 mr-2" />
                Connect on LinkedIn
              </a>
            </div>

            <div className="pt-4 border-t border-zinc-200 dark:border-zinc-800">
              <p className="text-xs font-mono text-zinc-500">
                Response time: <span className="text-emerald-600 dark:text-emerald-500">~24 hours</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
