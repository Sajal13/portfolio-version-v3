export interface ApiError {
  message: string;
  statusCode: number;
  errors?: string[];
}
