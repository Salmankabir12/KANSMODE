export type FieldType = 'text' | 'textarea' | 'number' | 'select' | 'image' | 'images' | 'datetime' | 'slug' | 'richText' | 'tags';

export interface FieldDef {
  name: string
  label: string
  type: FieldType
  required?: boolean
  options?: { value: string; label: string }[]
  reference?: string
  description?: string
}

export interface TypeDef {
  name: string
  title: string
  singleton?: boolean
  fields: FieldDef[]
  slugFrom?: string
}

export const contentTypes: TypeDef[] = [
  {
    name: 'heroBanner',
    title: 'Hero Banners',
    fields: [
      { name: 'title', label: 'Title', type: 'text', required: true },
      { name: 'subtitle', label: 'Subtitle', type: 'text' },
      { name: 'image', label: 'Background Image', type: 'image' },
      { name: 'link', label: 'Button Link', type: 'text' },
      { name: 'order', label: 'Order', type: 'number' },
    ],
    slugFrom: 'title',
  },
  {
    name: 'service',
    title: 'Services',
    fields: [
      { name: 'title', label: 'Title', type: 'text', required: true },
      { name: 'description', label: 'Description', type: 'textarea' },
      { name: 'icon', label: 'Icon Image', type: 'image' },
      { name: 'order', label: 'Order', type: 'number' },
    ],
  },
  {
    name: 'productCategory',
    title: 'Product Categories',
    fields: [
      { name: 'name', label: 'Name', type: 'text', required: true },
      { name: 'slug', label: 'Slug', type: 'slug' },
      { name: 'image', label: 'Category Image', type: 'image' },
      { name: 'description', label: 'Description', type: 'textarea' },
    ],
    slugFrom: 'name',
  },
  {
    name: 'productSubcategory',
    title: 'Product Subcategories',
    fields: [
      { name: 'name', label: 'Name', type: 'text', required: true },
      { name: 'slug', label: 'Slug', type: 'slug' },
      { name: 'image', label: 'Subcategory Image', type: 'image' },
      { name: 'description', label: 'Description', type: 'textarea' },
      { name: 'category', label: 'Parent Category', type: 'select', required: true, reference: 'productCategory' },
    ],
    slugFrom: 'name',
  },
  {
    name: 'product',
    title: 'Products',
    fields: [
      { name: 'name', label: 'Name', type: 'text', required: true },
      { name: 'slug', label: 'Slug', type: 'slug' },
      { name: 'image', label: 'Main Image', type: 'image' },
      { name: 'gallery', label: 'Gallery Images', type: 'images' },
      { name: 'price', label: 'Price Range', type: 'text' },
      { name: 'size', label: 'Size Range', type: 'text' },
      { name: 'category', label: 'Category', type: 'select', required: true, reference: 'productCategory' },
      { name: 'subcategory', label: 'Subcategory', type: 'select', reference: 'productSubcategory' },
      { name: 'description', label: 'Description', type: 'richText', description: 'Edit in Sanity Studio for rich text formatting' },
    ],
    slugFrom: 'name',
  },
  {
    name: 'teamMember',
    title: 'Team Members',
    fields: [
      { name: 'name', label: 'Name', type: 'text', required: true },
      { name: 'role', label: 'Role', type: 'text', required: true },
      { name: 'image', label: 'Photo', type: 'image' },
      { name: 'bio', label: 'Bio', type: 'textarea' },
      { name: 'order', label: 'Order', type: 'number' },
    ],
  },
  {
    name: 'client',
    title: 'Clients',
    fields: [
      { name: 'name', label: 'Client Name', type: 'text', required: true },
      { name: 'logo', label: 'Client Logo', type: 'image' },
    ],
  },
  {
    name: 'testimonial',
    title: 'Testimonials',
    fields: [
      { name: 'name', label: 'Name', type: 'text', required: true },
      { name: 'role', label: 'Role / Company', type: 'text' },
      { name: 'image', label: 'Photo', type: 'image' },
      { name: 'quote', label: 'Quote', type: 'textarea', required: true },
    ],
  },
  {
    name: 'post',
    title: 'Blog Posts',
    fields: [
      { name: 'title', label: 'Title', type: 'text', required: true },
      { name: 'slug', label: 'Slug', type: 'slug' },
      { name: 'image', label: 'Featured Image', type: 'image' },
      { name: 'excerpt', label: 'Excerpt', type: 'textarea' },
      { name: 'tags', label: 'Tags', type: 'tags', description: 'Comma-separated tags' },
      { name: 'publishedAt', label: 'Published Date', type: 'datetime' },
      { name: 'body', label: 'Body Content', type: 'richText', description: 'Edit in Sanity Studio for rich text formatting' },
    ],
    slugFrom: 'title',
  },
  {
    name: 'siteSettings',
    title: 'Site Settings',
    singleton: true,
    fields: [
      { name: 'title', label: 'Site Title', type: 'text', required: true },
      { name: 'description', label: 'Description', type: 'textarea' },
      { name: 'logo', label: 'Logo Image', type: 'image' },
      { name: 'address', label: 'Address', type: 'text' },
      { name: 'email', label: 'Email', type: 'text' },
      { name: 'phones', label: 'Phone Numbers', type: 'text', description: 'Comma-separated' },
      { name: 'officeHours', label: 'Office Hours', type: 'text' },
      { name: 'socialLinks.facebook', label: 'Facebook URL', type: 'text' },
      { name: 'socialLinks.linkedin', label: 'LinkedIn URL', type: 'text' },
      { name: 'socialLinks.youtube', label: 'YouTube URL', type: 'text' },
      { name: 'socialLinks.twitter', label: 'Twitter URL', type: 'text' },
    ],
  },
]

export function getTypeDef(typeName: string): TypeDef | undefined {
  return contentTypes.find((t) => t.name === typeName)
}
