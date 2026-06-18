export interface SanityImage {
  _type: 'image';
  asset: {
    _ref: string;
    _type: 'reference';
  };
}

export interface SiteSettings {
  _id: string;
  title: string;
  description?: string;
  logo?: SanityImage;
  address?: string;
  email?: string;
  phones?: string[];
  officeHours?: string;
  socialLinks?: {
    facebook?: string;
    linkedin?: string;
    youtube?: string;
    twitter?: string;
  };
}

export interface HeroBanner {
  _id: string;
  title: string;
  subtitle?: string;
  image?: SanityImage;
  link?: string;
}

export interface Service {
  _id: string;
  title: string;
  description?: string;
  icon?: SanityImage;
}

export interface ProductCategory {
  _id: string;
  name: string;
  slug: { current: string };
  image?: SanityImage;
  description?: string;
}

export interface ProductSubcategory {
  _id: string;
  name: string;
  slug: { current: string };
  category: ProductCategory;
  image?: SanityImage;
}

export interface Product {
  _id: string;
  name: string;
  slug: { current: string };
  category: ProductCategory;
  subcategory?: ProductSubcategory;
  image?: SanityImage;
  gallery?: SanityImage[];
  price?: string;
  size?: string;
  description?: any;
}

export interface TeamMember {
  _id: string;
  name: string;
  role: string;
  image?: SanityImage;
  bio?: string;
}

export interface Client {
  _id: string;
  name: string;
  logo?: SanityImage;
}

export interface Testimonial {
  _id: string;
  name: string;
  role?: string;
  image?: SanityImage;
  quote: string;
}

export interface Post {
  _id: string;
  title: string;
  slug: { current: string };
  excerpt?: string;
  publishedAt: string;
  tags?: string[];
}
