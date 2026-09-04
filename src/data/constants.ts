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

// Cloudflare Email Routing forwards this to the personal inbox.
export const CONTACT_EMAIL = 'contact@robelfekadu.com';

export const PROJECTS: Project[] = [
  {
    id: 'p1',
    name: 'LeanHealth EMR Ecosystem',
    role: 'Lead Architect',
    stack: ['Python', 'Docker', 'PostgreSQL'],
    latency: '45ms',
    description:
      'End-to-end clinical workflow system integrating Bahmni, Odoo ERP, and OpenMRS with custom microservices.',
    architecture: {
      nodes: [
        { name: 'Client', details: 'Web Dashboard & Tablet Interface', type: 'client' },
        { name: 'Nginx LB', details: 'SSL Termination & Reverse Proxy', type: 'gateway' },
        { name: 'Auth Svc', details: 'OAuth2 Centralized Identity Provider', type: 'service' },
        { name: 'EMR Core', details: 'Bahmni/OpenMRS Clinical Logic', type: 'service' },
        { name: 'ERP Sync', details: 'Odoo Inventory & Billing Connector', type: 'service' },
        { name: 'Postgres', details: 'Primary-Replica HA Cluster', type: 'database' },
      ],
      flow: 'High-availability cluster configuration',
    },
  },
  {
    id: 'p2',
    name: 'Ethiopian Stat Bank',
    role: 'Backend Lead',
    stack: ['Node.js', 'Microservices', 'Redis'],
    latency: '12ms',
    description:
      'National statistics portal handling high-volume data ingestion and public dissemination.',
    architecture: {
      nodes: [
        { name: 'Public API', details: 'GraphQL & REST Endpoints', type: 'gateway' },
        { name: 'Gateway', details: 'Rate Limiting & Access Control', type: 'gateway' },
        { name: 'Ingestion', details: 'BullMQ Job Queue Worker', type: 'queue' },
        { name: 'Redis', details: 'L2 Caching Layer', type: 'database' },
        { name: 'Elastic', details: 'Full-text Search Engine', type: 'database' },
        { name: 'Worker', details: 'Data Processor', type: 'service' },
        { name: 'Archive', details: 'Cold Storage (S3)', type: 'database' },
      ],
      flow: 'Event-driven data pipeline',
    },
  },
  {
    id: 'p3',
    name: 'MedaShi Live Gaming',
    role: 'Infrastructure Eng',
    stack: ['Go', 'WebSockets', 'AWS'],
    latency: '<5ms',
    description:
      'Real-time backend infrastructure for live TV game show handling concurrent socket connections.',
    architecture: {
      nodes: [
        { name: 'Mobile App', details: 'Flutter Client (iOS/Android)', type: 'client' },
        { name: 'WS Gateway', details: 'Gorilla Mux Connection Handler', type: 'gateway' },
        { name: 'Engine', details: 'Go Routines Game Logic', type: 'service' },
        { name: 'State Store', details: 'Redis Pub/Sub & State', type: 'database' },
        { name: 'Fan-out', details: 'Broadcaster Service', type: 'service' },
      ],
      flow: 'Real-time bi-directional streaming',
    },
  },
  {
    id: 'p4',
    name: 'FinTech Payment Gateway',
    role: 'Senior Backend Engineer',
    stack: ['NestJS', 'PostgreSQL', 'Kafka'],
    latency: '18ms',
    description:
      'Secure payment processing platform with multi-provider integration and fraud detection.',
    architecture: {
      nodes: [
        { name: 'API Gateway', details: 'Rate Limiting & Auth', type: 'gateway' },
        { name: 'Payment Svc', details: 'Transaction Processing', type: 'service' },
        { name: 'Fraud Det', details: 'ML-based Risk Analysis', type: 'service' },
        { name: 'Kafka', details: 'Event Streaming', type: 'queue' },
        { name: 'Postgres', details: 'Transaction Store', type: 'database' },
        { name: 'Providers', details: 'External Payment APIs', type: 'service' },
      ],
      flow: 'Event-sourced transaction processing',
    },
  },
  {
    id: 'p5',
    name: 'E-Commerce Platform',
    role: 'Full Stack Engineer',
    stack: ['Next.js', 'MongoDB', 'Redis'],
    latency: '22ms',
    description:
      'Scalable e-commerce solution with inventory management, payment integration, and analytics.',
    architecture: {
      nodes: [
        { name: 'Next.js', details: 'SSR Frontend & API Routes', type: 'client' },
        { name: 'API Layer', details: 'REST & GraphQL', type: 'gateway' },
        { name: 'Cart Svc', details: 'Shopping Cart Logic', type: 'service' },
        { name: 'Order Svc', details: 'Order Processing', type: 'service' },
        { name: 'MongoDB', details: 'Product Catalog', type: 'database' },
        { name: 'Redis', details: 'Session & Cache', type: 'database' },
      ],
      flow: 'Microservices with API gateway',
    },
  },
  {
    id: 'p6',
    name: 'IoT Device Management',
    role: 'Backend Architect',
    stack: ['Python', 'MQTT', 'TimescaleDB'],
    latency: '8ms',
    description:
      'IoT platform for managing thousands of devices with real-time telemetry and command execution.',
    architecture: {
      nodes: [
        { name: 'Devices', details: 'IoT Sensors & Actuators', type: 'client' },
        { name: 'MQTT Broker', details: 'Message Queue', type: 'gateway' },
        { name: 'Ingest Svc', details: 'Data Validation', type: 'service' },
        { name: 'TimescaleDB', details: 'Time-series Storage', type: 'database' },
        { name: 'Analytics', details: 'Real-time Processing', type: 'service' },
      ],
      flow: 'MQTT-based pub/sub architecture',
    },
  },
  {
    id: 'p7',
    name: 'CI/CD Pipeline Automation',
    role: 'DevOps Engineer',
    stack: ['Terraform', 'K8s', 'GitHub Actions'],
    latency: 'N/A',
    description:
      'Automated deployment pipeline with infrastructure as code, container orchestration, and monitoring.',
    architecture: {
      nodes: [
        { name: 'GitHub', details: 'Source Control & Actions', type: 'client' },
        { name: 'Build', details: 'Docker Image Creation', type: 'service' },
        { name: 'Registry', details: 'Container Registry', type: 'database' },
        { name: 'K8s Cluster', details: 'Orchestration Layer', type: 'service' },
        { name: 'Monitoring', details: 'Prometheus & Grafana', type: 'service' },
      ],
      flow: 'GitOps-based deployment',
    },
  },
  {
    id: 'p8',
    name: 'API Rate Limiter Service',
    role: 'Systems Engineer',
    stack: ['Go', 'Redis', 'gRPC'],
    latency: '<3ms',
    description: 'High-performance distributed rate limiting service using token bucket algorithm.',
    architecture: {
      nodes: [
        { name: 'gRPC API', details: 'Rate Check Endpoint', type: 'gateway' },
        { name: 'Limiter', details: 'Token Bucket Logic', type: 'service' },
        { name: 'Redis', details: 'Distributed Counter', type: 'database' },
        { name: 'Metrics', details: 'Usage Analytics', type: 'service' },
      ],
      flow: 'Distributed rate limiting',
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

export const getTechConfig = (techName: string) => {
  const config: Record<
    string,
    { icon: React.ElementType; color: string; bg: string; border: string }
  > = {
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

  return (
    config[techName] || {
      icon: Box,
      color: 'text-zinc-500',
      bg: 'bg-zinc-100 dark:bg-zinc-800',
      border: 'hover:border-zinc-300',
    }
  );
};
