import React from 'react';
import { Download, Mail } from 'lucide-react';
import { Github, Linkedin } from '../components/ui/BrandIcons';
import { CONTACT_EMAIL, SERVICES, SOCIAL, TECH_STACK } from '../data/constants';
import { POSTS, postUrl } from '../blog/posts';
import { ServerView } from '../blog/explorables/ServerView';
import { WorkList } from './WorkList';

// The services were written as API endpoints; the page names them in words.
const SERVICE_NAMES: Record<string, string> = {
  '/api/system-architecture': 'System architecture',
  '/api/backend-development': 'Backend development',
  '/api/database-optimization': 'Databases',
  '/api/devops-automation': 'Delivery and infrastructure',
};

const sentence = (words: string[]) => words.map((w) => w.replace(/_/g, ' ')).join(', ');

const Hero: React.FC = () => {
  const latest = POSTS[0];
  return (
    <section className="home-hero" aria-labelledby="home-title">
      <div className="home-hero-text">
        <img
          className="home-avatar"
          src="/avatar.jpg"
          alt="Robel Fekadu"
          width={384}
          height={384}
          fetchPriority="high"
          decoding="async"
        />
        <h1 id="home-title">Building scalable distributed systems.</h1>
        <p className="home-lede">
          Senior Software Engineer building backends for health, diagnostics and developer tools.
        </p>
        <div className="home-actions">
          <a className="home-button home-button-primary" href={`mailto:${CONTACT_EMAIL}`}>
            <Mail className="icon" aria-hidden="true" />
            Email me
          </a>
          <a className="home-button" href="/resume.pdf" download>
            <Download className="icon" aria-hidden="true" />
            Download résumé
          </a>
        </div>
      </div>

      {latest && (
        <figure className="home-hero-figure">
          <ServerView compact />
          <figcaption>
            Live from my latest post, sealed in your browser: type a clip and see what my server
            stores. <a href={postUrl(latest.slug)}>Read {latest.title}</a>
          </figcaption>
        </figure>
      )}
    </section>
  );
};

const Services: React.FC = () => (
  <section id="services" className="home-section" aria-labelledby="services-title">
    <h2 id="services-title">What I’m hired for</h2>
    <dl className="home-services">
      {SERVICES.map((service) => (
        <div key={service.endpoint}>
          <dt>{SERVICE_NAMES[service.endpoint] ?? service.endpoint}</dt>
          <dd>
            <p>{service.description}</p>
            {service.params && <p className="home-quiet">{sentence(service.params)}</p>}
          </dd>
        </div>
      ))}
    </dl>
  </section>
);

const Stack: React.FC = () => (
  <section id="stack" className="home-section" aria-labelledby="stack-title">
    <h2 id="stack-title">The tools I reach for</h2>
    <table className="home-stack">
      <tbody>
        {TECH_STACK.map((row) => (
          <tr key={row.name}>
            <th scope="row">{row.name}</th>
            <td>{row.skills.join(', ')}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </section>
);

const Contact: React.FC = () => (
  <section id="contact" className="home-section home-contact" aria-labelledby="contact-title">
    <div>
      <h2 id="contact-title">Let’s build something great together</h2>
      <p className="home-contact-copy">
        I’m always interested in discussing new projects, innovative ideas, or opportunities to be
        part of your vision. Whether you need a systems architect, backend engineer, or technical
        consultant, let’s connect.
      </p>
      <p className="home-quiet">
        Addis Ababa, Ethiopia, EAT (UTC+3). Available for opportunities. Response time: about two
        hours.
      </p>
    </div>
    <ul className="home-channels">
      <li>
        <a href={`mailto:${CONTACT_EMAIL}`}>
          <Mail className="icon" aria-hidden="true" />
          <span>
            <span className="home-channel-name">Email</span>
            {CONTACT_EMAIL}
          </span>
        </a>
      </li>
      <li>
        <a href={SOCIAL.linkedin} target="_blank" rel="noopener noreferrer">
          <Linkedin className="icon" aria-hidden="true" />
          <span>
            <span className="home-channel-name">LinkedIn</span>
            /in/robavelii
          </span>
        </a>
      </li>
      <li>
        <a href={SOCIAL.github} target="_blank" rel="noopener noreferrer">
          <Github className="icon" aria-hidden="true" />
          <span>
            <span className="home-channel-name">GitHub</span>
            @robavelii
          </span>
        </a>
      </li>
    </ul>
  </section>
);

export const HomePage: React.FC = () => (
  <div className="home">
    <Hero />
    <WorkList />
    <Services />
    <Stack />
    <Contact />
  </div>
);
