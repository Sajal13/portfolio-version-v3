import { ToolSummary } from "./blog";

export enum ExperienceType {
  education = 'Education',
  fullTime = 'FullTime',
  partTime = 'PartTime'
}

export enum ExperienceStatus {
  active = 'Active',
  inactive = 'Inactive'
}

export interface Experience {
  id: number;
  experienceType: ExperienceType;
  title: string;
  company: string;
  location: string;
  startDate: string;
  endDate: string;
  description: string;
  status: ExperienceStatus;
  order: number;
  tools: ToolSummary[];
  createdAt: string;
  updatedAt: string;
}

export interface ExperiencePayload {
  experienceType: ExperienceType;
  title: string;
  company: string;
  location: string;
  startDate: string;
  endDate?: string;
  description: string;
  status?: ExperienceStatus;
  tools: number[];
}

export interface PositionItem {
  id: number;
  order: number;
}

export interface UpdateExperiencePositionPayload {
  positions: PositionItem[];
}