import { Contact } from "./contact";
import { Coordinates } from "./coordinates";
import { User } from "./users";

export type Address = {
  location: Coordinates;
  city: string;
  region: string;
  postal: string;
  country: string;
  countryName: string;
};

export type ShippingAddress = {
  user: User;
  firstName: string;
  lastName: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  region: string;
  postal: string;
  country: string;
  contact: Contact;
  isDefault: boolean;
};
