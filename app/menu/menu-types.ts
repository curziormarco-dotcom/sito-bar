export type Language = "it" | "en" | "fr" | "de" | "es";

export type MenuItem = {
  name: Record<Language, string>;
  description?: Record<Language, string> | string;
  price?: number;
  priceNote?: string;
  variants?: { name: Record<Language, string>; price: number }[];
  glassPrice?: number;
  bottlePrice?: number;
  tag?: string;
  unavailable?: boolean;
  allergens?: string[];
  allergenAdd?: string[];
  allergenRemove?: string[];
};

export type MenuSection = {
  introTitle?: Record<Language, string>;
  description?: Record<Language, string>;
  id?: string;
  title: Record<Language, string>;
  items: MenuItem[];
};
