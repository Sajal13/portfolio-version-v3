export interface Profile {
  id: number,
  description: string;
  totalYearsOfExperience: number,
  totalProjects: number,
  totalClients: number
}

export interface ProfilePayload {
  totalYearsOfExperience: number,
  totalProjects: number,
  totalClients: number
  description: string;
}