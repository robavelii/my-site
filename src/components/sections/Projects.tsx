import React, { useState } from 'react';
import { ExternalLink, GitBranch, Github, Lock } from 'lucide-react';
import { PROJECTS } from '../../data/constants';
import { ArchitectureDiagram } from '../ArchitectureDiagram';
import { Badge } from '../ui/Badge';
import { SectionHeader } from '../ui/SectionHeader';

export const Projects: React.FC = () => {
  const [activeProject, setActiveProject] = useState<string | null>(null);

  return (
    <section id="projects">
      <SectionHeader eyebrow="System Architecture" title="Projects" icon={GitBranch} />

      <div className="border border-zinc-200 dark:border-zinc-800 rounded-lg overflow-hidden bg-white dark:bg-zinc-950 shadow-sm dark:shadow-none">
        <div
          className="overflow-x-auto"
          tabIndex={0}
          role="group"
          aria-label="Projects table, scrolls horizontally"
        >
          <table className="w-full text-left text-sm">
            <thead className="bg-zinc-50 dark:bg-zinc-900/50 border-b border-zinc-200 dark:border-zinc-800">
              <tr>
                <th
                  scope="col"
                  className="px-4 py-3 font-mono text-xs text-zinc-500 dark:text-zinc-400 font-medium uppercase w-12"
                >
                  <span className="sr-only">Expand</span>
                </th>
                <th
                  scope="col"
                  className="px-4 py-3 font-mono text-xs text-zinc-500 dark:text-zinc-400 font-medium uppercase"
                >
                  Project
                </th>
                <th
                  scope="col"
                  className="px-4 py-3 font-mono text-xs text-zinc-500 dark:text-zinc-400 font-medium uppercase"
                >
                  Role
                </th>
                <th
                  scope="col"
                  className="px-4 py-3 font-mono text-xs text-zinc-500 dark:text-zinc-400 font-medium uppercase"
                >
                  Stack
                </th>
                <th
                  scope="col"
                  className="px-4 py-3 font-mono text-xs text-zinc-500 dark:text-zinc-400 font-medium uppercase text-right"
                >
                  Source
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
              {PROJECTS.map((project) => {
                const isOpen = activeProject === project.id;
                return (
                  <React.Fragment key={project.id}>
                    <tr
                      className={`transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-900/30 ${
                        isOpen ? 'bg-zinc-50 dark:bg-zinc-900/50' : ''
                      }`}
                    >
                      <td className="px-4 py-3 text-center">
                        <button
                          type="button"
                          onClick={() => setActiveProject(isOpen ? null : project.id)}
                          aria-expanded={isOpen}
                          aria-controls={`project-detail-${project.id}`}
                          className="inline-flex items-center justify-center rounded p-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
                        >
                          <span className="sr-only">
                            {isOpen ? 'Collapse' : 'Expand'} {project.name}
                          </span>
                          <GitBranch
                            aria-hidden="true"
                            className={`w-4 h-4 transition-colors ${
                              isOpen
                                ? 'text-emerald-700 dark:text-emerald-400'
                                : 'text-zinc-500 dark:text-zinc-400'
                            }`}
                          />
                        </button>
                      </td>

                      <td className="px-4 py-3 font-medium text-zinc-900 dark:text-zinc-100">
                        <div className="flex flex-col">
                          <span className="font-mono text-xs text-zinc-500 dark:text-zinc-400 mb-0.5">
                            {project.org} · {project.period}
                          </span>
                          <span>{project.name}</span>
                        </div>
                      </td>

                      <td className="px-4 py-3 text-zinc-600 dark:text-zinc-400 font-mono text-xs">
                        {project.role}
                      </td>

                      <td className="px-4 py-3">
                        <div className="flex flex-wrap gap-1.5">
                          {project.stack.map((tech) => (
                            <Badge
                              key={tech}
                              className="bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 border-zinc-200 dark:border-zinc-700"
                            >
                              {tech}
                            </Badge>
                          ))}
                        </div>
                      </td>

                      {/* Was a fabricated latency figure; now says whether you can go and read it. */}
                      <td className="px-4 py-3 text-right whitespace-nowrap">
                        {project.links?.repo ? (
                          <a
                            href={project.links.repo}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 font-mono text-xs text-emerald-700 dark:text-emerald-400 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 rounded"
                          >
                            <Github className="w-3.5 h-3.5" aria-hidden="true" />
                            Code
                            <span className="sr-only"> for {project.name} on GitHub</span>
                          </a>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 font-mono text-xs text-zinc-500 dark:text-zinc-400">
                            <Lock className="w-3.5 h-3.5" aria-hidden="true" />
                            Private
                          </span>
                        )}
                      </td>
                    </tr>

                    {isOpen && (
                      <tr>
                        <td
                          colSpan={5}
                          id={`project-detail-${project.id}`}
                          className="p-0 bg-zinc-50/50 dark:bg-zinc-900/20"
                        >
                          <div className="p-6 border-b border-zinc-200 dark:border-zinc-800 animate-in slide-in-from-top-2 duration-200">
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                              <div className="lg:col-span-1 space-y-4">
                                <div>
                                  <h4 className="text-xs font-mono uppercase text-zinc-500 dark:text-zinc-400 mb-2">
                                    Description
                                  </h4>
                                  <p className="text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed">
                                    {project.description}
                                  </p>
                                </div>

                                {project.highlights && (
                                  <div>
                                    <h4 className="text-xs font-mono uppercase text-zinc-500 dark:text-zinc-400 mb-2">
                                      Notes
                                    </h4>
                                    <ul className="space-y-1.5">
                                      {project.highlights.map((h) => (
                                        <li
                                          key={h}
                                          className="flex gap-2 text-sm text-zinc-700 dark:text-zinc-300"
                                        >
                                          <span
                                            aria-hidden="true"
                                            className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-emerald-600 dark:bg-emerald-400"
                                          />
                                          {h}
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                )}

                                {(project.links?.repo || project.links?.demo) && (
                                  <div className="flex flex-wrap gap-2 pt-1">
                                    {project.links.repo && (
                                      <a
                                        href={project.links.repo}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-2 rounded border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-3 py-1.5 text-xs font-medium text-zinc-900 dark:text-zinc-100 transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
                                      >
                                        <Github className="w-3.5 h-3.5" aria-hidden="true" />
                                        Repository
                                      </a>
                                    )}
                                    {project.links.demo && (
                                      <a
                                        href={project.links.demo}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-2 rounded border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-3 py-1.5 text-xs font-medium text-zinc-900 dark:text-zinc-100 transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
                                      >
                                        <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
                                        Live
                                      </a>
                                    )}
                                  </div>
                                )}
                              </div>

                              <div className="lg:col-span-2">
                                {project.image ? (
                                  <>
                                    <h4 className="text-xs font-mono uppercase text-zinc-500 dark:text-zinc-400 mb-4">
                                      Preview
                                    </h4>
                                    <img
                                      src={project.image}
                                      alt={`${project.name} interface`}
                                      loading="lazy"
                                      decoding="async"
                                      className="w-full rounded-lg border border-zinc-200 dark:border-zinc-800"
                                    />
                                  </>
                                ) : project.architecture ? (
                                  <>
                                    <h4 className="text-xs font-mono uppercase text-zinc-500 dark:text-zinc-400 mb-4">
                                      System Diagram
                                    </h4>
                                    <div className="relative bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg p-4 overflow-hidden bg-grid">
                                      <ArchitectureDiagram nodes={project.architecture.nodes} />
                                      <div
                                        aria-hidden="true"
                                        className="pointer-events-none absolute inset-y-0 right-0 w-10 bg-gradient-to-l from-white dark:from-zinc-900 to-transparent"
                                      />
                                    </div>
                                    <p className="mt-3 inline-flex items-center gap-2 rounded border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-2 py-1 text-xs font-mono text-zinc-600 dark:text-zinc-400">
                                      <GitBranch className="w-3 h-3" aria-hidden="true" />
                                      {project.architecture.flow}
                                    </p>
                                  </>
                                ) : null}
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};
