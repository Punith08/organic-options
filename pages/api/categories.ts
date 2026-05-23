import type { NextApiRequest, NextApiResponse } from 'next'
import { getCategories } from '@/lib/woocommerce'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' })
  try {
    const categories = await getCategories()
    res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate')
    res.status(200).json(categories)
  } catch {
    res.status(500).json({ error: 'Failed to fetch categories' })
  }
}
