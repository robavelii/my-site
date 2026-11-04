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
  // Newest first. Public work links to its repository; private work is
  // described but never linked.
  {
    id: 'clipsync',
    name: 'ClipSync',
    org: 'Personal',
    role: 'Author',
    period: '2026',
    visibility: 'public',
    stack: ['TypeScript', 'Cloudflare Workers', 'Durable Objects', 'D1', 'Tauri'],
    description:
      'End-to-end encrypted clipboard sync across your own devices. Copy on one machine, paste on another; the server relays and stores ciphertext only.',
    highlights: [
      'AES-GCM-256 under a per-account vault key',
      'Linux, macOS and Windows agents, plus a phone web app',
      'Runs on Cloudflare, or self-hosted from the same binary',
      'Open source under AGPL-3.0',
    ],
    links: {
      repo: 'https://github.com/robavelii/clipboard-worker',
      demo: 'https://clip.rfh.et',
    },
    architecture: {
      flow: 'Copy, seal, relay, paste',
      nodes: [
        { name: 'Agent', details: 'Seals on copy', type: 'client' },
        { name: 'API', details: 'Hono on Workers', type: 'gateway' },
        { name: 'D1', details: 'Ciphertext history', type: 'database' },
        { name: 'Sync room', details: 'Durable Object fan-out', type: 'service' },
        { name: 'Devices', details: 'Decrypt and paste', type: 'client' },
      ],
    },
  },
  {
    id: 'spectwin',
    name: 'SpecTwin',
    org: 'Personal',
    role: 'Author',
    period: '2026',
    visibility: 'public',
    stack: ['TypeScript', 'NestJS', 'Fastify', 'Next.js', 'PostgreSQL'],
    description:
      'Import an OpenAPI contract and get a hosted, stateful sandbox of that API. Scenarios are versioned JSON with a seed, a controlled clock, idempotency rules and injected failures, so a test can replay "three 429s, then success" the same way every time.',
    highlights: [
      'Scenarios are drafts until approved',
      'Seeded state and a controlled clock per session',
      'Fault injection and idempotency replay',
    ],
    links: { repo: 'https://github.com/robavelii/api-sandbox' },
    architecture: {
      flow: 'Contract in, sandbox out',
      nodes: [
        { name: 'Dashboard', details: 'Next.js', type: 'client' },
        { name: 'API', details: 'NestJS on Fastify', type: 'gateway' },
        { name: 'Engine', details: 'Contract compiler', type: 'service' },
        { name: 'Postgres', details: 'Sessions and state', type: 'database' },
      ],
    },
  },
  {
    id: 'lyfe-uk',
    name: 'Lyfe UK Platform',
    org: 'Lyfe',
    role: 'Senior Software Engineer',
    period: '2026',
    visibility: 'private',
    stack: ['Python', 'FastAPI', 'PostgreSQL', 'Next.js', 'AWS Cognito'],
    description:
      'The platform behind at-home blood testing in the UK: a FastAPI backend that receives lab results over HL7 and turns them into structured biomarkers, the consumer storefront, and the staff back office.',
    highlights: [
      'HL7 lab results into structured biomarkers',
      'Staff back office, including data-subject requests',
      'End-to-end suite gating every deploy',
    ],
    architecture: {
      flow: 'Order, test, result',
      nodes: [
        { name: 'Storefront', details: 'Next.js', type: 'client' },
        { name: 'Back office', details: 'Staff admin', type: 'client' },
        { name: 'API', details: 'FastAPI', type: 'gateway' },
        { name: 'Lab link', details: 'HL7 results', type: 'service' },
        { name: 'Postgres', details: 'Orders and results', type: 'database' },
      ],
    },
  },
  {
    id: 'unvrs',
    name: 'UNVRS Platform',
    org: 'UNVRS',
    role: 'Lead Engineer',
    period: '2026',
    visibility: 'private',
    stack: ['Python', 'AWS Lambda', 'DynamoDB', 'FastAPI', 'TypeScript'],
    description:
      'AI that checks a blood sample before it reaches the lab: a serverless AWS backend, the image-inference service for sample quality, a QC pipeline that scores model output against labelled sets, and the company site.',
    highlights: [
      'Serverless, event-driven backend',
      'Image inference for sample quality',
      'QC evaluation against labelled test sets',
      'Company site on S3 and CloudFront, deployed with SST',
    ],
    architecture: {
      flow: 'Capture, infer, review',
      nodes: [
        { name: 'Capture', details: 'Scanning app', type: 'client' },
        { name: 'API', details: 'API Gateway + Lambda', type: 'gateway' },
        { name: 'Inference', details: 'Sample-quality models', type: 'service' },
        { name: 'Store', details: 'DynamoDB + S3', type: 'database' },
        { name: 'QC', details: 'Evaluation pipeline', type: 'service' },
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
    id: 'medassist-ai',
    name: 'MedAssist AI',
    org: 'Personal',
    role: 'Author',
    period: '2026',
    visibility: 'public',
    stack: ['Python', 'FastAPI', 'LiteLLM', 'PostgreSQL'],
    description:
      'Clinical decision support for healthcare professionals: triage, medication, lab and radiology modules behind one chat, with prompt-injection guards, a response cache and per-endpoint cost tracking.',
    highlights: [
      '10 clinical modules',
      'Prompt-injection guards',
      'Response cache with cost tracking',
    ],
    links: { repo: 'https://github.com/robavelii/medassist-ai' },
  },
  {
    id: 'clinical-platform',
    name: 'Clinical Platform',
    org: 'Mereb Tech',
    role: 'Maintainer & Platform Engineer',
    period: '2025 - 2026',
    visibility: 'private',
    stack: ['Java', 'Python', 'JavaScript', 'Docker'],
    description:
      "Maintained and extended a hospital's clinical platform: shipping payments and billing, running data migrations, building lab and imaging interfaces, and owning deployment and infrastructure across the stack.",
    highlights: [
      'Payments and billing features',
      'Data migrations',
      'Imaging and lab-machine interfaces',
      'Deployment and infrastructure ownership',
    ],
    architecture: {
      flow: 'Clinical workflow platform',
      nodes: [
        { name: 'Clinician', details: 'Web front end', type: 'client' },
        { name: 'Records', details: 'Patient records', type: 'service' },
        { name: 'Lab', details: 'Lab information', type: 'service' },
        { name: 'PACS', details: 'Imaging', type: 'service' },
        { name: 'Billing', details: 'Payments', type: 'service' },
        { name: 'Deploy', details: 'Docker + on-prem', type: 'service' },
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
