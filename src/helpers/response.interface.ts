export interface IHelperResponse {
  success: boolean;
  status: number;
  data?: { token?: string };
  error?: string;
  message?: string;
}
