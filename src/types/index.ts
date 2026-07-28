export type ProductCategory =
  | "shoes"
  | "clothing"
  | "jackets"
  | "hoodies"
  | "accessories"
  | "bags"
  | "caps";

export type ProductCondition =
  | "new"
  | "like-new"
  | "excellent"
  | "good"
  | "fair";

export type ProductAvailability = "available" | "sold" | "reserved";

export interface ProductImage {
  src: string;
  alt: string;
  /** Set to true when using a real image URL instead of a placeholder key */
  isPlaceholder?: boolean;
  placeholderHue?: number;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  brand: string;
  category: ProductCategory;
  collection: string;
  price: number;
  compareAtPrice?: number;
  currency: string;
  sizes: string[];
  condition: ProductCondition;
  availability: ProductAvailability;
  color: string;
  description: string;
  featured: boolean;
  newest: boolean;
  images: ProductImage[];
  tags: string[];
  createdAt: string;
}

export interface Collection {
  id: string;
  slug: string;
  name: string;
  description: string;
  productCount: number;
  image: ProductImage;
  featured: boolean;
}

export interface Review {
  id: string;
  name: string;
  rating: number;
  comment: string;
  productName?: string;
  location?: string;
  date: string;
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
}

export interface NavLink {
  href: string;
  label: string;
}

export type SortOption =
  | "newest"
  | "featured"
  | "price-asc"
  | "price-desc"
  | "name";

export interface ProductFilters {
  search?: string;
  brand?: string;
  size?: string;
  condition?: ProductCondition | "";
  minPrice?: number;
  maxPrice?: number;
  availableOnly?: boolean;
  featured?: boolean;
  collection?: string;
  category?: ProductCategory | "";
  sort?: SortOption;
}
