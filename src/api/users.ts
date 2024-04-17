import { AxiosResponse } from "axios";
import { User } from "../types/users";
import axiosInstance from "../utils/axiosInstance";

export const getUsers = async (): Promise<AxiosResponse<User[]>> => {
  return axiosInstance.get(`/api/v1/users`);
};
