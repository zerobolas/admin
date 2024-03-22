import axios, { AxiosResponse } from "axios";
import { User } from "../types/users";

const API_URL = "https://zerobolas.com/api/";

export const getUsers = async (): Promise<AxiosResponse<User[]>> => {
  return axios.get(`${API_URL}/v1/users`);
};
