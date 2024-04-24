import { AxiosResponse } from "axios";
import { User } from "../types/users";
import axiosInstance from "../utils/axiosInstance";

type UsersResponse = {
  totalAvailable: number;
  results: number;
  status: string;
  data: {
    users: User[];
  };
};

export const getUsers = async ({
  page,
  rowsPerPage,
}: {
  page: number;
  rowsPerPage: number;
}): Promise<AxiosResponse<UsersResponse>> => {
  return axiosInstance.get(`/api/v1/users`, {
    params: {
      limit: rowsPerPage,
      page: page + 1,
    },
  });
};

export const exportUsers = async (): Promise<AxiosResponse<Blob>> => {
  return axiosInstance.get(`/api/v1/users/export-users`, {
    responseType: "blob",
  });
};

export const deleteUser = async (id: string): Promise<AxiosResponse<void>> => {
  return axiosInstance.delete(`/api/v1/users/${id}`);
};
