import React, { useState } from 'react';
import { GitBranch, ChevronRight } from 'lucide-react';
import { PROJECTS } from '../../data/constants';
import { ArchitectureDiagram } from '../ArchitectureDiagram';
import { Badge } from '../ui/Badge';
import { SectionHeader } from '../ui/SectionHeader';

export const Projects: React.FC = () => {
  const [activeProject, setActiveProject] = useState<string | null>(null);

  return (
    <section id="projects">
      <SectionHeader title="System Architecture (Projects)" icon={GitBranch} />

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
                  Project ID
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
                  Tech Stack
                </th>
                <th
                  scope="col"
                  className="px-4 py-3 font-mono text-xs text-zinc-500 dark:text-zinc-400 font-medium uppercase text-right"
                >
                  Latency
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
              {PROJECTS.map((project) => (
                <React.Fragment key={project.id}>
                  <tr
                    className={`transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-900/30 ${
                      activeProject === project.id ? 'bg-zinc-50 dark:bg-zinc-900/50' : ''
                    }`}
                  >
                    <td className="px-4 py-3 text-center">
                      <button
                        type="button"
                        onClick={() =>
                          setActiveProject(activeProject === project.id ? null : project.id)
                        }
                        aria-expanded={activeProject === project.id}
                        aria-controls={`project-detail-${project.id}`}
                        className="inline-flex items-center justify-center rounded p-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
                      >
                        <span className="sr-only">
                          {activeProject === project.id ? 'Collapse' : 'Expand'} {project.name}
                        </span>
                        <ChevronRight
                          aria-hidden="true"
                          className={`w-4 h-4 text-zinc-500 dark:text-zinc-400 transition-transform duration-200 ${activeProject === project.id ? 'rotate-90 text-zinc-900 dark:text-zinc-100' : ''}`}
                        />
                      </button>
                    </td>
                    <td className="px-4 py-3 font-medium text-zinc-900 dark:text-zinc-100">
                      <div className="flex flex-col">
                        <span className="font-mono text-xs text-zinc-500 dark:text-zinc-400 mb-0.5">
                          {project.id}
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
                    <td className="px-4 py-3 text-right font-mono text-xs text-emerald-700 dark:text-emerald-400">
                      {project.latency}
                    </td>
                  </tr>

                  {/* Expanded Detail View */}
                  {activeProject === project.id && (
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
                              <div>
                                <h4 className="text-xs font-mono uppercase text-zinc-500 dark:text-zinc-400 mb-2">
                                  Architecture Pattern
                                </h4>
                                <div className="inline-flex items-center gap-2 px-2 py-1 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded text-xs font-mono text-zinc-600 dark:text-zinc-400">
                                  <GitBranch className="w-3 h-3" />
                                  {project.architecture.flow}
                                </div>
                              </div>
                            </div>

                            <div className="lg:col-span-2">
                              <h4 className="text-xs font-mono uppercase text-zinc-500 dark:text-zinc-400 mb-4">
                                System Diagram
                              </h4>
                              <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg p-4 overflow-hidden bg-grid">
                                <ArchitectureDiagram nodes={project.architecture.nodes} />
                              </div>
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};
