import { Hono } from 'hono'
import { sign } from 'hono/jwt'

const auth = new Hono<{ Bindings: { DB: D1Database, JWT_SECRET: string } }>()

auth.post('/login', async (c) => {
  const { nip, password } = await c.req.json()

  const user = await c.env.DB.prepare(
    "SELECT id, full_name, role, password_hash FROM employees WHERE nip = ? AND status = 'Active'"
  ).bind(nip).first()

  if (!user || password !== user.password_hash) {
    return c.json({ message: 'Kredensial tidak valid' }, 401)
  }

  const payload = {
    sub: user.id,
    name: user.full_name,
    role: user.role,
    exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24)
  }

  // Tambahkan 'HS256' sebagai argumen ketiga
  const token = await sign(payload, c.env.JWT_SECRET, 'HS256')

  return c.json({ token })
})

export default auth
