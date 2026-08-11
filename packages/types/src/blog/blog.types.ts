export interface ToolSummary {
  id: number;
  name: string;
}

export interface MarkdownSummary {
  id: string;
  content: string;
  originalName: string;
}

export interface Blog {
  id: number;
  title: string;
  slug: string;
  image: string;
  markdown: MarkdownSummary;
  tools: ToolSummary[];
  createdAt: Date;
  updatedAt: Date;
}