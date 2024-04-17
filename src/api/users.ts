import { AxiosResponse } from "axios";
import { User } from "../types/users";
import axiosInstance from "../utils/axiosInstance";

type UsersResponse = {
  data: {
    users: User[];
  };
};

export const getUsers = async (): Promise<AxiosResponse<UsersResponse>> => {
  return axiosInstance.get(`/api/v1/users`);
};
