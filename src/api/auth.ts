import { AxiosResponse } from "axios";
import instance from "../utils/axiosInstance";

// set the JWT token in the Authorization header
export const setAxiosAuthHeader = (token: string) => {
  instance.interceptors.request.use((config) => {
    const jwt = token || localStorage.getItem("jwt");
    console.log("🚀 ~ instance.interceptors.request.use ~ jwt:", jwt);

    if (jwt) {
      config.headers.Authorization = `Bearer ${jwt}`;
      return config;
    }

    throw new Error("No JWT token found");
  });
};

export const login = async (
  email: string,
  password: string
): Promise<AxiosResponse> => {
  return instance.post("/auth/login?role=admin", { email, password });
};

export const getMe = async (): Promise<AxiosResponse> => {
  return instance.get("/api/v1/users/me");
};
