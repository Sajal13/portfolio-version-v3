export interface Skill {
    id: number,
    title: string,
    progress: number,
    category: string,
    parent: string,
    isActive: boolean,
    createdAt: string,
    updatedAt: string
  }

  export interface SkillsPayload {
    title: string,
    progress: number,
    category: string,
    parent: string,
    isActive: boolean,
  }