import { Hono } from 'hono'
import { logger } from 'hono/logger'
import { jwt } from 'hono/jwt'
import { cors } from 'hono/cors'

// Import Modul
import auth from './modules/auth'
import recruitment from './modules/recruitment'

// Pastikan tipe Bindings sesuai dengan wrangler.toml
type Bindings = {
  DB: D1Database
  JWT_SECRET: string
}

const app = new Hono<{ Bindings: Bindings }>()

/**
 * 1. GLOBAL MIDDLEWARE
 */
app.use('*', logger())
app.use('*', cors())

/**
 * 2. PUBLIC ROUTES
 */
// Root Endpoint
app.get('/', (c) => {
  return c.text('HRGA Portal API v1.0 - Connection Established (Balikpapan Engine)')
})

// Auth Module (Login, dll - Tidak terkunci JWT)
app.route('/auth', auth)

/**
 * 3. PROTECTED API ROUTES
 * Semua yang diawali /api/* wajib membawa Token JWT yang valid.
 */
app.use('/api/*', async (c, next) => {
  // Kita inisialisasi middleware di sini agar bisa membaca c.env.JWT_SECRET dengan dinamis
  const jwtMiddleware = jwt({
    secret: c.env.JWT_SECRET,
    alg: 'HS256', // WAJIB: Menentukan algoritma enkripsi
  })
  return jwtMiddleware(c, next)
})

// Daftarkan modul yang diproteksi di sini
app.route('/api/recruitment', recruitment)

/**
 * 4. GLOBAL ERROR HANDLER
 */
app.onError((err, c) => {
  console.error(`${err.message}`)
  
  return c.json({
    success: false,
    message: 'Terjadi kesalahan pada server internal',
    error: err.message
  }, 500)
})

/**
 * 5. 404 NOT FOUND HANDLER
 */
app.notFound((c) => {
  return c.json({
    success: false,
    message: 'Endpoint tidak ditemukan'
  }, 404)
})

export default app
