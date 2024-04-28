export type APIResponse<T = undefined> = {
  status: "success" | "error" | "fail";
  message: string;
  data?: Partial<T>;
};
