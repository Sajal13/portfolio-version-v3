export interface ToolSummary {
  id: number;
  name: string;
  icon?: string;
  docUrl: string;
}

export interface BlogCategorySummary {
  id: number;
  name: string;
  slug: string;
}
export interface MarkdownSummary {
  id: string;
  content: string;
  originalName: string;
}

export interface Blog {
  id: number;
  title: string;
  description: string;
  slug: string;
  image: string;
  markdown: MarkdownSummary;
  tools: ToolSummary[];
  category: BlogCategorySummary;
  createdAt: Date;
  updatedAt: Date;
}

export interface BlogCategory {
  id: number;
  name: string;
  slug: string;
  createdAt: Date;
  updatedAt: Date;
}