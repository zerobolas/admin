import { AxiosResponse } from "axios";
import axiosInstance from "../utils/axiosInstance";
import { APIResponse } from "../types/api";
import { Category } from "../types/categories";

type DataCategories = {
  categories: Category[];
};

export type CategoriesResponse = APIResponse<DataCategories> & {
  results: number;
};

export const getCategories = async (): Promise<
  AxiosResponse<CategoriesResponse>
> => {
  return axiosInstance.get(`/api/v2/categories`);
};

export const updateCategory = async (
  category: Partial<Category>
): Promise<AxiosResponse<APIResponse>> => {
  const categoryId = category._id;
  delete category._id;
  return axiosInstance.patch(`/api/v2/categories/${categoryId}`, {
    ...category,
  });
};
