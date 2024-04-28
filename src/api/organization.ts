import { AxiosResponse } from "axios";
import axiosInstance from "../utils/axiosInstance";
import { APIResponse } from "../types/api";
import { Category, Subcategory } from "../types/categories";

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

export const createCategory = async (
  category: Partial<Category>
): Promise<AxiosResponse<APIResponse>> => {
  return axiosInstance.post(`/api/v2/categories`, {
    ...category,
  });
};

export const deleteCategory = async (
  categoryId: string
): Promise<AxiosResponse<APIResponse>> => {
  return axiosInstance.delete(`/api/v2/categories/${categoryId}`);
};

// Subcategories

type DataSubcategory = {
  subcategory: Subcategory;
};

export type SubcategoriesResponse = APIResponse<DataSubcategory> & {
  results: number;
};

export const addSubcategory = async (
  categoryId: string,
  subcategory: Partial<Category>
): Promise<AxiosResponse<APIResponse>> => {
  return axiosInstance.post(`/api/v2/categories/${categoryId}/subcategories`, {
    ...subcategory,
  });
};

export const updateSubcategory = async (
  categoryId: string,
  subcategory: Partial<Subcategory>
): Promise<AxiosResponse<APIResponse>> => {
  const subcategoryId = subcategory._id;
  delete subcategory._id;
  return axiosInstance.patch(
    `/api/v2/categories/${categoryId}/${subcategoryId}`,
    {
      ...subcategory,
    }
  );
};
