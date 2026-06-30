import axios from 'axios'
import { Product, Category, ProductVariation } from '@/types/product'
import { OrderPayload } from '@/types/order'

function getClient() {
  const client = axios.create({
    baseURL: process.env.WC_API_URL,
    auth: { username: process.env.WC_CONSUMER_KEY!, password: process.env.WC_CONSUMER_SECRET! },
    timeout: 15000,
  })

  // Retry up to 3 times on network errors or 5xx responses with exponential backoff
  client.interceptors.response.use(undefined, async (error) => {
    const config = error.config as typeof error.config & { __retryCount?: number }
    if (!config) return Promise.reject(error)
    config.__retryCount = (config.__retryCount ?? 0)
    const isRetryable = !error.response || error.response.status >= 500
    if (!isRetryable || config.__retryCount >= 3) return Promise.reject(error)
    config.__retryCount += 1
    await new Promise(res => setTimeout(res, 1000 * Math.pow(2, config.__retryCount! - 1)))
    return client(config)
  })

  return client
}
export async function getProducts(params?: Record<string, string | number>): Promise<Product[]> {
  const { data } = await getClient().get('/products', { params: { per_page: 24, status: 'publish', ...params } })
  return data
}
export async function getAllProducts(): Promise<Product[]> {
  const { data } = await getClient().get('/products', { params: { per_page: 100, status: 'publish' } })
  return data
}
export async function getProductBySlug(slug: string): Promise<Product | null> {
  const { data } = await getClient().get('/products', { params: { slug, status: 'publish' } })
  return data[0] ?? null
}
export async function getFeaturedProducts(): Promise<Product[]> {
  const { data } = await getClient().get('/products', { params: { featured: true, per_page: 8, status: 'publish' } })
  return data
}
export async function getProductsByCategory(categoryId: number, perPage = 24): Promise<Product[]> {
  const { data } = await getClient().get('/products', { params: { category: categoryId, per_page: perPage, status: 'publish' } })
  return data
}
export async function getRelatedProducts(productId: number, categoryId: number): Promise<Product[]> {
  const { data } = await getClient().get('/products', { params: { category: categoryId, per_page: 4, status: 'publish', exclude: productId } })
  return data
}
export async function getProductVariations(productId: number): Promise<ProductVariation[]> {
  const { data } = await getClient().get(`/products/${productId}/variations`, { params: { per_page: 100 } })
  return data
}
export async function getCategories(): Promise<Category[]> {
  const { data } = await getClient().get('/products/categories', { params: { per_page: 50, hide_empty: true, orderby: 'count', order: 'desc' } })
  return data.filter((c: Category) => c.slug !== 'uncategorized')
}
export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  const { data } = await getClient().get('/products/categories', { params: { slug } })
  return data[0] ?? null
}
export async function createOrder(payload: OrderPayload) {
  const { data } = await getClient().post('/orders', payload)
  return data
}
export async function updateOrderPayment(orderId: number, razorpayPaymentId: string, razorpayOrderId: string) {
  const { data } = await getClient().put(`/orders/${orderId}`, {
    status: 'processing', set_paid: true, transaction_id: razorpayPaymentId,
    meta_data: [{ key: 'razorpay_payment_id', value: razorpayPaymentId }, { key: 'razorpay_order_id', value: razorpayOrderId }],
  })
  return data
}
