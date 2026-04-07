import { Hono } from 'hono'
import { sign } from 'hono/jwt'

type Bindings = {
  DB: D1Database
  JWT_SECRET: string
}

const auth = new Hono<{ Bindings: Bindings }>()

auth.post('/login', async (c) => {
  const { nip, password } = await c.req.json()

  // 1. Cari user di database berdasarkan NIP
  const user = await c.env.DB.prepare(
    "SELECT id, full_name, role, password_hash FROM employees WHERE nip = ? AND status = 'Active'"
  ).bind(nip).first()

  if (!user) {
    return c.json({ message: 'User tidak ditemukan atau tidak aktif' }, 401)
  }

  // 2. Verifikasi Password 
  // Untuk tahap awal, kita asumsikan password sama dengan password_hash 
  // (Nanti kamu bisa pakai bun.password.verify)
  if (password !== user.password_hash) {
    return c.json({ message: 'Password salah' }, 401)
  }

  // 3. Generate JWT
  const payload = {
    sub: user.id,
    name: user.full_name,
    role: user.role,
    exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24) // Expired dalam 24 jam
  }

  const token = await sign(payload, c.env.JWT_SECRET)

  return c.json({
    message: 'Login Berhasil',
    token
  })
})

export default auth
