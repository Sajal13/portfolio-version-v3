export type ApiEnvelope<T> = {
  success: boolean;
  message: string;
  statusCode?: number;
  data: T;
};
