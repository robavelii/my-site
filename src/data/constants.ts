import React from 'react';
import {
  Terminal as TerminalIcon,
  Server,
  Database,
  Layers,
  Hexagon,
  FileCode,
  Zap,
  Container,
  Network,
  Cloud,
  Atom,
  Box,
  Code2,
  Leaf,
  Wind,
  Search,
} from 'lucide-react';
import { Project, Service, TechCategory } from '../types';

export const SKILLS_DATA = {
  name: 'Robel Fekadu',
  role: 'Senior Software Engineer',
  status: 'online',
  stack: ['JavaScript', 'TypeScript', 'Node.js', 'Nest.js', 'Python', 'Go', 'Docker', 'K8s'],
  uptime: '99.99%',
  location: 'Addis Ababa, ET',
  focus: 'Distributed Systems',
};

// Shared by the header nav and the command palette so the two can never drift.
export const SECTIONS = [
  { id: 'services', label: 'Services' },
  { id: 'stack', label: 'Stack' },
  { id: 'projects', label: 'Projects' },
  { id: 'contact', label: 'Contact' },
] as const;

export const SOCIAL = {
  github: 'https://github.com/robavelii',
  linkedin: 'https://www.linkedin.com/in/robavelii',
} as const;

// Cloudflare Email Routing forwards this to the personal inbox.
export const CONTACT_EMAIL = 'contact@robelfekadu.com';

export const PROJECTS: Project[] = [
  // ---------------------------------------------------------------------------
  // Open source - every one of these is a real, browsable repository.
  // ---------------------------------------------------------------------------
  {
    id: 'rivet',
    name: 'Rivet',
    org: 'Personal',
    role: 'Author',
    period: '2026',
    visibility: 'public',
    stack: ['NestJS', 'TypeScript', 'PostgreSQL', 'Redis'],
    description:
      'Multi-tenant workflow automation platform in the same space as Zapier, n8n and Make, written as an open-source reference for enterprise NestJS backend architecture.',
    highlights: ['Multi-tenant by design', 'Open source', 'Work in progress'],
    links: { repo: 'https://github.com/robavelii/rivet' },
    architecture: {
      flow: 'Event-driven workflow engine',
      nodes: [
        { name: 'API', details: 'NestJS REST + auth', type: 'gateway' },
        { name: 'Scheduler', details: 'Trigger evaluation', type: 'service' },
        { name: 'Queue', details: 'Redis-backed jobs', type: 'queue' },
        { name: 'Runner', details: 'Step execution', type: 'service' },
        { name: 'Postgres', details: 'Tenant-scoped state', type: 'database' },
      ],
    },
  },
  {
    id: 'doc-hub-rag',
    name: 'Doc Hub RAG',
    org: 'Personal',
    role: 'Author',
    period: '2026',
    visibility: 'public',
    stack: ['Python', 'FastAPI', 'PostgreSQL', 'pgvector'],
    description:
      'Multi-tenant SaaS where a company uploads its knowledge base and gets a private AI assistant over it. Each tenant is fully isolated.',
    highlights: ['Per-tenant isolation', 'Retrieval-augmented generation'],
    links: { repo: 'https://github.com/robavelii/doc-hub-rag' },
    architecture: {
      flow: 'Ingest, embed, retrieve, answer',
      nodes: [
        { name: 'Upload API', details: 'FastAPI ingest', type: 'gateway' },
        { name: 'Chunker', details: 'Document splitting', type: 'service' },
        { name: 'Embedder', details: 'Vector generation', type: 'service' },
        { name: 'pgvector', details: 'Tenant-scoped index', type: 'database' },
        { name: 'Chat API', details: 'Grounded answers', type: 'service' },
      ],
    },
  },
  {
    id: 'hellgate',
    name: 'Hellgate',
    org: 'Personal',
    role: 'Author',
    period: '2025',
    visibility: 'public',
    stack: ['Java', 'Spring Boot', 'JWT', 'Redis'],
    description:
      'API gateway and authentication service for microservice deployments, deliberately technology-agnostic so the services behind it can be written in anything.',
    highlights: ['Language-agnostic by design', 'Gateway + auth in one'],
    links: { repo: 'https://github.com/robavelii/hellgate' },
    architecture: {
      flow: 'Edge authentication and routing',
      nodes: [
        { name: 'Client', details: 'Any consumer', type: 'client' },
        { name: 'Gateway', details: 'Routing + rate limits', type: 'gateway' },
        { name: 'Auth', details: 'Token issue/verify', type: 'service' },
        { name: 'Redis', details: 'Session + limits', type: 'database' },
        { name: 'Services', details: 'Any stack', type: 'service' },
      ],
    },
  },
  {
    id: 'api-showcase',
    name: 'FastAPI Showcase',
    org: 'Personal',
    role: 'Author',
    period: '2026',
    visibility: 'public',
    stack: ['Python', 'FastAPI', 'Docker', 'Monorepo'],
    description:
      'Monorepo of five fully documented FastAPI applications, each demonstrating a different slice of modern backend practice.',
    highlights: ['5 applications', 'Documented end to end'],
    links: { repo: 'https://github.com/robavelii/api-showcase' },
  },
  {
    id: 'nest-ecommerce',
    name: 'NestJS Commerce API',
    org: 'Personal',
    role: 'Author',
    period: '2025',
    visibility: 'public',
    stack: ['NestJS', 'TypeORM', 'PostgreSQL'],
    description:
      'Full-featured e-commerce REST API built to mirror the architectural patterns and standards of a production commerce backend.',
    highlights: ['Production-shaped architecture', 'Open source'],
    links: { repo: 'https://github.com/robavelii/nest-ecommerce' },
  },

  // ---------------------------------------------------------------------------
  // Client and product work - private repositories, described but not linked.
  // NOTE: wording here needs Robel's sign-off before this ships.
  // ---------------------------------------------------------------------------
  {
    id: 'unvrs-platform',
    name: 'unvrs.ai Platform Backend',
    org: 'unvrs.ai',
    role: 'Backend Lead',
    period: '2026',
    visibility: 'private',
    stack: ['Python', 'FastAPI', 'PostgreSQL', 'ML Pipelines'],
    description:
      'Backend services for an AI-driven visual inspection platform: ingestion, model-serving endpoints and the APIs the operator tooling runs on.',
    highlights: ['Primary backend author', 'Model serving + data ingestion'],
    architecture: {
      flow: 'Capture, infer, review',
      nodes: [
        { name: 'Capture', details: 'Scanning clients', type: 'client' },
        { name: 'Ingest API', details: 'FastAPI intake', type: 'gateway' },
        { name: 'Inference', details: 'Model serving', type: 'service' },
        { name: 'Store', details: 'Results + audit', type: 'database' },
        { name: 'Dashboard', details: 'Operator review', type: 'service' },
      ],
    },
  },
  {
    id: 'unvrs-ops',
    name: 'unvrs.ai Operations Tooling',
    org: 'unvrs.ai',
    role: 'Sole Author',
    period: '2026',
    visibility: 'private',
    stack: ['TypeScript', 'React', 'Python'],
    description:
      'Operator dashboard plus the QC evaluation pipeline that scores model output against labelled test sets and reports regressions between runs.',
    highlights: ['Sole author on both repos', 'Automated QC evaluation'],
  },
  {
    id: 'leanhealth',
    name: 'LeanHealth Clinical Platform',
    org: 'Mereb Tech',
    role: 'Integration Engineer',
    period: '2025 - 2026',
    visibility: 'private',
    stack: ['Java', 'Python', 'JavaScript', 'Odoo'],
    description:
      'Integration and deployment work across a clinical stack built on Bahmni, OpenELIS and Odoo: PACS imaging, lab-machine interfaces, data imports and the front end clinicians use.',
    highlights: ['PACS + lab-machine integration', 'Bahmni / OpenELIS / Odoo stack'],
    architecture: {
      flow: 'Clinical workflow integration',
      nodes: [
        { name: 'Clinician', details: 'Web front end', type: 'client' },
        { name: 'Bahmni', details: 'EMR core', type: 'service' },
        { name: 'OpenELIS', details: 'Lab information', type: 'service' },
        { name: 'PACS', details: 'Imaging (dcm4chee)', type: 'service' },
        { name: 'Odoo', details: 'ERP + billing', type: 'service' },
      ],
    },
  },
];

export interface ExtendedService extends Service {
  response: object;
  flow: string[];
}

export const SERVICES: ExtendedService[] = [
  {
    method: 'POST',
    endpoint: '/api/system-architecture',
    description:
      'Design of scalable, fault-tolerant distributed systems tailored for high availability.',
    params: ['load_balancing', 'microservices', 'disaster_recovery'],
    flow: ['Request', 'Gateway', 'Load Balancer', 'Service Mesh', 'Cluster'],
    response: {
      status: '201 Created',
      data: {
        architecture: 'Microservices',
        scalability: 'Horizontal',
        ha_enabled: true,
      },
    },
  },
  {
    method: 'GET',
    endpoint: '/api/backend-development',
    description:
      'Production-grade API development using Node.js, Python, or Go with strict type safety.',
    params: ['rest', 'graphql', 'grpc'],
    flow: ['Client', 'Auth Guard', 'Controller', 'Service Layer', 'DTO Response'],
    response: {
      status: '200 OK',
      data: {
        runtime: 'Node.js / Go',
        type_safety: 'Strict',
        performance: 'High',
      },
    },
  },
  {
    method: 'PUT',
    endpoint: '/api/database-optimization',
    description: 'Query optimization, schema design, and migration strategies for legacy datasets.',
    params: ['postgres', 'redis', 'elasticsearch'],
    flow: ['Query Analyzer', 'Index Check', 'Query Rewrite', 'Execution', 'Cache'],
    response: {
      status: '200 OK',
      data: {
        query_time: '12ms',
        cache_hit: true,
        optimized: true,
      },
    },
  },
  {
    method: 'PATCH',
    endpoint: '/api/devops-automation',
    description: 'CI/CD pipeline setup, containerization (Docker), and orchestration (K8s).',
    params: ['github_actions', 'terraform', 'docker'],
    flow: ['Commit', 'CI Build', 'Test Suite', 'Docker Push', 'K8s Rolling Update'],
    response: {
      status: '202 Accepted',
      data: {
        pipeline: 'Active',
        containers: 'Healthy',
        deployment: 'Rolling',
      },
    },
  },
];

export const TECH_STACK: TechCategory[] = [
  { name: 'Compute', skills: ['Node.js', 'Python', 'Go', 'NestJS', 'Django'] },
  { name: 'Data', skills: ['PostgreSQL', 'Redis', 'ElasticSearch', 'MongoDB'] },
  { name: 'Infra', skills: ['Docker', 'Kubernetes', 'AWS', 'Nginx', 'Linux'] },
  { name: 'Interface', skills: ['React', 'TypeScript', 'Next.js', 'Tailwind'] },
];

interface TechConfig {
  icon: React.ElementType;
  color: string;
  bg: string;
  border: string;
}

// Module scope, not rebuilt inside getTechConfig: it was being reconstructed
// on every call, once per skill per render.
const TECH_CONFIG: Record<string, TechConfig> = {
  // Compute
  'Node.js': {
    icon: Hexagon,
    color: 'text-green-600 dark:text-green-500',
    bg: 'bg-green-100 dark:bg-green-900/20',
    border: 'hover:border-green-500 dark:hover:border-green-500',
  },
  Python: {
    icon: FileCode,
    color: 'text-yellow-600 dark:text-yellow-500',
    bg: 'bg-yellow-100 dark:bg-yellow-900/20',
    border: 'hover:border-yellow-500 dark:hover:border-yellow-500',
  },
  Go: {
    icon: Zap,
    color: 'text-cyan-600 dark:text-cyan-400',
    bg: 'bg-cyan-100 dark:bg-cyan-900/20',
    border: 'hover:border-cyan-500 dark:hover:border-cyan-400',
  },
  NestJS: {
    icon: Hexagon,
    color: 'text-red-600 dark:text-red-500',
    bg: 'bg-red-100 dark:bg-red-900/20',
    border: 'hover:border-red-500 dark:hover:border-red-500',
  },
  Django: {
    icon: Layers,
    color: 'text-emerald-700 dark:text-emerald-500',
    bg: 'bg-emerald-100 dark:bg-emerald-900/20',
    border: 'hover:border-emerald-500 dark:hover:border-emerald-500',
  },

  // Data
  PostgreSQL: {
    icon: Database,
    color: 'text-blue-600 dark:text-blue-400',
    bg: 'bg-blue-100 dark:bg-blue-900/20',
    border: 'hover:border-blue-500 dark:hover:border-blue-500',
  },
  Redis: {
    icon: Database,
    color: 'text-red-600 dark:text-red-500',
    bg: 'bg-red-100 dark:bg-red-900/20',
    border: 'hover:border-red-500 dark:hover:border-red-500',
  },
  ElasticSearch: {
    icon: Search,
    color: 'text-yellow-600 dark:text-yellow-500',
    bg: 'bg-yellow-100 dark:bg-yellow-900/20',
    border: 'hover:border-yellow-500 dark:hover:border-yellow-500',
  },
  MongoDB: {
    icon: Leaf,
    color: 'text-green-600 dark:text-green-500',
    bg: 'bg-green-100 dark:bg-green-900/20',
    border: 'hover:border-green-500 dark:hover:border-green-500',
  },

  // Infra
  Docker: {
    icon: Container,
    color: 'text-blue-500 dark:text-blue-400',
    bg: 'bg-blue-50 dark:bg-blue-900/20',
    border: 'hover:border-blue-400 dark:hover:border-blue-400',
  },
  Kubernetes: {
    icon: Network,
    color: 'text-blue-700 dark:text-blue-300',
    bg: 'bg-blue-100 dark:bg-blue-900/20',
    border: 'hover:border-blue-600 dark:hover:border-blue-400',
  },
  AWS: {
    icon: Cloud,
    color: 'text-orange-600 dark:text-orange-500',
    bg: 'bg-orange-100 dark:bg-orange-900/20',
    border: 'hover:border-orange-500 dark:hover:border-orange-500',
  },
  Nginx: {
    icon: Server,
    color: 'text-green-700 dark:text-green-400',
    bg: 'bg-green-100 dark:bg-green-900/20',
    border: 'hover:border-green-600 dark:hover:border-green-500',
  },
  Linux: {
    icon: TerminalIcon,
    color: 'text-zinc-700 dark:text-zinc-300',
    bg: 'bg-zinc-100 dark:bg-zinc-900/20',
    border: 'hover:border-zinc-400 dark:hover:border-zinc-500',
  },

  // Interface
  React: {
    icon: Atom,
    color: 'text-cyan-500 dark:text-cyan-400',
    bg: 'bg-cyan-100 dark:bg-cyan-900/20',
    border: 'hover:border-cyan-400 dark:hover:border-cyan-400',
  },
  TypeScript: {
    icon: Code2,
    color: 'text-blue-600 dark:text-blue-400',
    bg: 'bg-blue-100 dark:bg-blue-900/20',
    border: 'hover:border-blue-500 dark:hover:border-blue-500',
  },
  'Next.js': {
    icon: Zap,
    color: 'text-zinc-900 dark:text-zinc-100',
    bg: 'bg-zinc-100 dark:bg-zinc-800',
    border: 'hover:border-zinc-900 dark:hover:border-zinc-100',
  },
  Tailwind: {
    icon: Wind,
    color: 'text-cyan-500 dark:text-cyan-400',
    bg: 'bg-cyan-100 dark:bg-cyan-900/20',
    border: 'hover:border-cyan-400 dark:hover:border-cyan-400',
  },
};

const FALLBACK_TECH_CONFIG: TechConfig = {
  icon: Box,
  color: 'text-zinc-500 dark:text-zinc-400',
  bg: 'bg-zinc-100 dark:bg-zinc-800',
  border: 'hover:border-zinc-300',
};

export const getTechConfig = (techName: string): TechConfig =>
  TECH_CONFIG[techName] ?? FALLBACK_TECH_CONFIG;
