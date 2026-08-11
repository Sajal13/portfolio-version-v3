export interface SuccessApiResponse<T = undefined> {
  data?: T;
  message: string;
  success: boolean;
}