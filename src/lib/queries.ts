export const siteSettingsQuery = `*[_type == "siteSettings"][0]`;

export const heroBannersQuery = `*[_type == "heroBanner"] | order(order asc){
  _id,
  title,
  subtitle,
  image,
  link
}`;

export const servicesQuery = `*[_type == "service"] | order(order asc){
  _id,
  title,
  description,
  icon
}`;

export const productCategoriesQuery = `*[_type == "productCategory"] | order(name asc){
  _id,
  name,
  slug,
  image,
  description
}`;

export const productSubcategoriesQuery = `*[_type == "productSubcategory"] | order(name asc){
  _id,
  name,
  slug,
  category->{
    _id,
    name,
    slug
  },
  image
}`;

export const productsQuery = `*[_type == "product"] | order(name asc){
  _id,
  name,
  slug,
  image,
  price,
  size,
  category->{
    _id,
    name,
    slug
  },
  subcategory->{
    _id,
    name,
    slug
  }
}`;

export const productBySlugQuery = `*[_type == "product" && slug.current == $slug][0]{
  _id,
  name,
  slug,
  image,
  gallery,
  price,
  size,
  description,
  category->{
    _id,
    name,
    slug
  },
  subcategory->{
    _id,
    name,
    slug
  }
}`;

export const teamMembersQuery = `*[_type == "teamMember"] | order(order asc){
  _id,
  name,
  role,
  image,
  bio
}`;

export const clientsQuery = `*[_type == "client"] | order(name asc){
  _id,
  name,
  logo
}`;

export const testimonialsQuery = `*[_type == "testimonial"] | order(_createdAt desc){
  _id,
  name,
  role,
  image,
  quote
}`;

export const postsQuery = `*[_type == "post"] | order(publishedAt desc){
  _id,
  title,
  slug,
  excerpt,
  publishedAt,
  tags
}`;
