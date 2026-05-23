export interface ProductImage { id: number; src: string; alt: string }
export interface ProductCategory { id: number; name: string; slug: string }
export interface ProductVariation {
  id: number; price: string; regular_price: string; sale_price: string
  stock_status: 'instock' | 'outofstock' | 'onbackorder'
  stock_quantity: number | null
  attributes: { name: string; option: string }[]
}
export interface Product {
  id: number; name: string; slug: string; description: string; short_description: string
  price: string; regular_price: string; sale_price: string
  stock_status: 'instock' | 'outofstock' | 'onbackorder'
  stock_quantity: number | null
  images: ProductImage[]; categories: ProductCategory[]
  attributes: { id: number; name: string; options: string[] }[]
  variations: number[]; type: 'simple' | 'variable'
  sku: string; weight: string
  tags: { id: number; name: string; slug: string }[]
  average_rating: string; rating_count: number; on_sale: boolean; featured: boolean
}
export interface Category {
  id: number; name: string; slug: string; description: string
  count: number; image: { src: string; alt: string } | null; parent: number
}
