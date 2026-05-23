import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const { email, password } = req.body
  if (!email || !password) return res.status(400).json({ error: 'Email and password are required' })

  // Attempt WP JWT auth if configured
  const wpUrl = process.env.WP_URL
  if (wpUrl) {
    try {
      const wpRes = await fetch(`${wpUrl}/wp-json/jwt-auth/v1/token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: email, password }),
      })
      if (wpRes.ok) {
        const data = await wpRes.json()
        return res.status(200).json({
          success: true,
          user: { email: data.user_email, name: data.user_display_name },
          token: data.token,
        })
      }
    } catch {
      // Fall through to mock
    }
  }

  // Mock auth fallback — accept any well-formed credentials for demo
  if (email.includes('@') && password.length >= 6) {
    return res.status(200).json({
      success: true,
      user: { email, name: email.split('@')[0] },
      token: `mock_${Buffer.from(email).toString('base64')}`,
    })
  }

  return res.status(401).json({ error: 'Invalid email or password' })
}
