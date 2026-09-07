export interface ArchitectureNode {
  name: string;
  details: string;
  type?: 'service' | 'database' | 'client' | 'gateway' | 'queue';
}

export type ProjectVisibility = 'public' | 'private';

export interface ProjectLinks {
  repo?: string;
  demo?: string;
}

export interface Project {
  id: string;
  name: string;
  /** Who the work was for: "Personal", "Mereb Tech", "unvrs.ai". */
  org: string;
  role: string;
  period: string;
  /** Private work gets described but never linked. */
  visibility: ProjectVisibility;
  stack: string[];
  description: string;
  /** Concrete, verifiable notes - replaces the invented latency figures. */
  highlights?: string[];
  links?: ProjectLinks;
  /** Optional screenshot; falls back to the architecture diagram. */
  image?: string;
  architecture?: {
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
