type Locales = {
  en: string;
  es: string;
};

export type ProductType = {
  _id: string;
  name: Locales;
  handle: Locales;
};

export type Subcategory = {
  _id: string;
  subcategoryId: string;
  name: Locales;
  handle: Locales;
  category: string;
  productTypes: ProductType[];
  createdAt: string;
  updatedAt: string;
  index: number;
};

export type Category = {
  _id: string;
  name: Locales;
  handle: Locales;
  image: string;
  categoryId: string;
  requiresCondition: boolean;
  requiresBrand: boolean;
  subcategories: Subcategory[];
  createdAt: string;
  updatedAt: string;
  index: number;
};
