import { Address, ShippingAddress } from "./addresses";

export type User = {
  id: string;
  _id: string;
  name: string;
  handle: string;
  email: string;
  role: "user" | "admin";
  image: string;
  rating: number;
  ratingCount: number;
  productCount: number;
  acceptsTerms: boolean;
  acceptsMarketing: boolean;
  isConfirmed: boolean;
  isVerified: boolean;
  active: boolean;
  address: Address;
  contact: string;
  gender: "male" | "female" | "unknown";
  shippingAddresses: ShippingAddress;
  salesCount: number;
  purchasesCount: number;
  createdAt: string;
  updatedAt: string;
  shortName: string;
};
