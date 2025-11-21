export interface ArchitectureNode {
  name: string;
  details: string;
  type?: 'service' | 'database' | 'client' | 'gateway' | 'queue';
}

export interface Project {
  id: string;
  name: string;
  role: string;
  stack: string[];
  latency: string;
  description: string;
  architecture: {
    nodes: ArchitectureNode[];
    flow: string;
  };
}

export interface Service {
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  endpoint: string;
  description: string;
  params?: string[];
}

export interface TechCategory {
  name: string;
  skills: string[];
}
