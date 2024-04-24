export type APIResponse<T = undefined> = {
  status: "success" | "error";
  message: string;
  data?: Partial<T>;
};
