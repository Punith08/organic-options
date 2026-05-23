import type { NextApiRequest, NextApiResponse } from 'next'
import { getProducts } from '@/lib/woocommerce'
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' })
  try {
    const { category, search, per_page } = req.query
    const params: Record<string, string | number> = {}
    if (category) params.category = category as string
    if (search) params.search = search as string
    if (per_page) params.per_page = parseInt(per_page as string)
    const products = await getProducts(params)
    res.status(200).json(products)
  } catch { res.status(500).json({ error: 'Failed to fetch products' }) }
}
