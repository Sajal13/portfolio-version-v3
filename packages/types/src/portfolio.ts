import { ToolSummary } from './blog';

// NOTE: only "Featured" was shown in your CreatePortfolioDto example
// (ProjectType.featured). Add/rename members here to match whatever
// your backend's ProjectType enum actually contains.
export enum ProjectType {
  featured = 'Featured',
  fullstack = 'FullStack',
  frontend = 'Frontend',
  backend = 'Backend',
  native = 'Native'
}


export interface Portfolio {
  id: number;
  title: string;
  description: string;
  publishedDate?: string;
  projectType: ProjectType;
  tools: ToolSummary[];
  image: string;
  liveLink: string;
  githubLink: string;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface PortfolioPayload {
  title: string;
  description: string;
  publishedDate?: string;
  projectType: ProjectType;
  tools: number[];
  image: string;
  liveLink: string;
  githubLink: string;
}

export interface PortfolioPositionItem {
  id: number;
  order: number;
}

export interface UpdatePortfolioPositionPayload {
  positions: PortfolioPositionItem[];
}