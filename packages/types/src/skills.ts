import { ToolSummary } from "./blog";

export interface Skill {
  id: number;
  title: ToolSummary | null;
  progress: number;
  category: string;
  parent: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface SkillsPayload {
  title: number;
  progress: number;
  category: string;
  parent: string;
  isActive: boolean;
}