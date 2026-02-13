export type Language = "it" | "en" | "fr" | "de" | "es";

export type MenuItem = {
  name: Record<Language, string>;
  description?: Record<Language, string> | string;
  price?: number;
  priceNote?: string;
  glassPrice?: number;
  bottlePrice?: number;
  tag?: string;
  allergens?: string[];
  allergenAdd?: string[];
  allergenRemove?: string[];
};

export type MenuSection = {
  id?: string;
  title: Record<Language, string>;
  items: MenuItem[];
};
