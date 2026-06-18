import type { HeroBanner, Service, ProductCategory, Product, TeamMember, Client, Testimonial, Post } from '@/types';

export const placeholderHeroBanners: HeroBanner[] = [
  {
    _id: 'banner-1',
    title: 'Quality Garments for Global Markets',
    subtitle: 'Your trusted partner in readymade garment sourcing from Bangladesh',
  },
  {
    _id: 'banner-2',
    title: 'Excellence in Every Stitch',
    subtitle: 'Woven, knit, and sweater garments for men, women, and children',
  },
];

export const placeholderServices: Service[] = [
  { _id: 'svc-1', title: 'Sourcing', description: 'Supplier identification, financial vetting, and capacity assessment.' },
  { _id: 'svc-2', title: 'Order Control', description: 'End-to-end order monitoring from sampling to shipment.' },
  { _id: 'svc-3', title: 'Quality Management', description: 'Multi-stage inspections and corrective action tracking.' },
  { _id: 'svc-4', title: 'Sampling', description: 'Daily sample development and direct buyer courier service.' },
  { _id: 'svc-5', title: 'Status Reporting', description: 'Transparent production progress and inspection reports.' },
  { _id: 'svc-6', title: 'Supply Chain Management', description: 'Order receiving, material, process, and final shipment coordination.' },
];

export const placeholderCategories: ProductCategory[] = [
  { _id: 'cat-1', name: 'Woven Garments', slug: { current: 'woven-garments' } },
  { _id: 'cat-2', name: 'Knit Garments', slug: { current: 'knit-garments' } },
  { _id: 'cat-3', name: 'Sweater', slug: { current: 'sweater' } },
];

export const placeholderProducts: Product[] = [
  {
    _id: 'prod-1',
    name: "Men's Denim Pant",
    slug: { current: 'mens-denim-pant' },
    category: placeholderCategories[0],
    price: '$8.00',
    size: '28-38',
  },
  {
    _id: 'prod-2',
    name: 'Cotton Single Jersey T-Shirt',
    slug: { current: 'cotton-single-jersey-tshirt' },
    category: placeholderCategories[1],
    price: '$4.50',
    size: 'S-XXL',
  },
  {
    _id: 'prod-3',
    name: 'Acrylic Sweater',
    slug: { current: 'acrylic-sweater' },
    category: placeholderCategories[2],
    price: '$12.00',
    size: 'S-XL',
  },
];

export const placeholderTeam: TeamMember[] = [
  { _id: 'team-1', name: 'Harry Abraham', role: 'Founder' },
  { _id: 'team-2', name: 'Thomas Novak', role: 'Senior Advisor' },
];

export const placeholderClients: Client[] = [
  { _id: 'client-1', name: 'RL FASHION DEAL', image: '/assets/images/clients/harry_abraham.jpg' },
  { _id: 'client-2', name: 'Color Media BD Ltd', image: '/assets/images/clients/company_logo_2.jpg' },
  { _id: 'client-3', name: 'Color Media BD', image: '/assets/images/clients/color_media_b_d.jpg' },
];

export const placeholderTestimonials: Testimonial[] = [
  {
    _id: 'test-1',
    name: 'Wiliams Shakespear',
    role: 'customer',
    quote: 'Kans Mode has consistently delivered quality products and timely communication throughout our partnership. Their dedication to excellence and timely delivery makes them a trusted partner in the garment industry.',
    image: '/assets/images/testimonial/customer_image_20240109111349.jpg',
  },
  {
    _id: 'test-2',
    name: 'Customer Name',
    role: 'customer',
    quote: 'Professional service and high-quality garments. We look forward to a long-term partnership with Kans Mode.',
    image: '/assets/images/testimonial/customer_image_2.jpg',
  },
];

export const placeholderPosts: Post[] = [
  {
    _id: 'post-1',
    title: 'Tips For Achieving Success In Our Business',
    slug: { current: 'tips-for-success' },
    excerpt: 'Strategies for growth and sustainability in the garment export industry.',
    publishedAt: '2024-01-15T00:00:00.000Z',
    tags: ['Business'],
  },
];
