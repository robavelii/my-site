import React, { useState } from 'react';
import { ExternalLink, FileText } from 'lucide-react';
import { Github } from '../components/ui/BrandIcons';
import { PROJECTS } from '../data/constants';
import type { Project } from '../types';

/** A system as its parts in order: the diagram, set as an ordered list. */
const SystemFlow: React.FC<{ project: Project }> = ({ project }) =>
  project.architecture ? (
    <figure className="work-flow">
      <ol>
        {project.architecture.nodes.map((node) => (
          <li key={node.name}>
            <span className="work-flow-name">{node.name}</span>
            <span className="work-flow-detail">{node.details}</span>
          </li>
        ))}
      </ol>
      <figcaption>{project.architecture.flow}</figcaption>
    </figure>
  ) : null;

const Links: React.FC<{ project: Project }> = ({ project }) => {
  const { repo, demo, post } = project.links ?? {};
  if (!repo && !demo && !post) return <p className="home-quiet">Private repository</p>;
  return (
    <ul className="work-links">
      {post && (
        <li>
          <a href={post}>
            <FileText className="icon" aria-hidden="true" />
            Read the write-up
          </a>
        </li>
      )}
      {repo && (
        <li>
          <a href={repo} target="_blank" rel="noopener noreferrer">
            <Github className="icon" aria-hidden="true" />
            Source
          </a>
        </li>
      )}
      {demo && (
        <li>
          <a href={demo} target="_blank" rel="noopener noreferrer">
            <ExternalLink className="icon" aria-hidden="true" />
            Live
          </a>
        </li>
      )}
    </ul>
  );
};

/** Every project as a row; one opens at a time to show what it is and how it's built. */
export const WorkList: React.FC = () => {
  const [open, setOpen] = useState<string | null>(PROJECTS[0]?.id ?? null);

  return (
    <section id="projects" className="home-section" aria-labelledby="projects-title">
      <h2 id="projects-title">Selected work, 2025 to 2026</h2>
      <ul className="work">
        {PROJECTS.map((project) => {
          const isOpen = open === project.id;
          return (
            <li key={project.id} className={isOpen ? 'work-item is-open' : 'work-item'}>
              <h3>
                <button
                  type="button"
                  className="work-toggle"
                  aria-expanded={isOpen}
                  aria-controls={`work-${project.id}`}
                  onClick={() => setOpen(isOpen ? null : project.id)}
                >
                  <span className="work-name">{project.name}</span>
                  <span className="work-meta">
                    {project.org}, {project.period}
                  </span>
                  <span className="work-role">{project.role}</span>
                  <span className="work-stack">{project.stack.join(', ')}</span>
                </button>
              </h3>
              <div id={`work-${project.id}`} className="work-detail" hidden={!isOpen}>
                <div className="work-detail-text">
                  <p>{project.description}</p>
                  {project.highlights && (
                    <ul className="work-highlights">
                      {project.highlights.map((h) => (
                        <li key={h}>{h}</li>
                      ))}
                    </ul>
                  )}
                  <Links project={project} />
                </div>
                <SystemFlow project={project} />
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
};
