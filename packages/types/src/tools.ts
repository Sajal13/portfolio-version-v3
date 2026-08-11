export interface Tool {
  id: number,
  name: string,
  icon?: string
  docUrl: string;
}

export interface ToolPayload {
  name: string;
  icon?: string;
  docUrl: string;
}