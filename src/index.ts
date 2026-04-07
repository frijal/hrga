import { Hono } from 'hono'
import { logger } from 'hono/logger'
import { jwt } from 'hono/jwt'
import { cors } from 'hono/cors'

// Import Modul-modul kita
import auth from './modules/auth'
import recruitment from './modules/recruitment'

// Definisi Type untuk Bindings (Environment Variables)
type Bindings = {
  DB: D1Database
  JWT_SECRET: string
}

const app = new Hono<{ Bindings: Bindings }>()

// --- 1. MIDDLEWARES ---
// Logger untuk memantau trafik di terminal
app.use('*', logger())
// CORS supaya portal (frontend) bisa akses API ini tanpa masalah
app.use('*', cors())

// --- 2. PUBLIC ROUTES ---
app.get('/', (c) => {
  return c.text('HRGA Portal API v1.0 - Connection Established (Balikpapan Engine)')
})

// Modul Auth (Login tidak diproteksi JWT karena ini pintu masuknya)
app.route('/auth', auth)

// --- 3. PROTECTED ROUTES (API LAYER) ---
// Middleware JWT: Semua rute yang diawali /api/* wajib membawa Token Valid di Header
app.use('/api/*', async (c, next) => {
  const authMiddleware = jwt({
    secret: c.env.JWT_SECRET,
  })
  return authMiddleware(c, next)
})

/**
 * Registrasi Modul-Modul API
 * Setiap modul akan memiliki prefix /api di depannya
 */

// Modul Recruitment (FTS5 Search & ATS)
// Endpoint: GET /api/recruitment/search
app.route('/api/recruitment', recruitment)

/**
 * Rencana Modul Selanjutnya (Placeholder)
 * Kamu tinggal uncomment jika file-nya sudah siap
 */
// import personnel from './modules/personnel'
// app.route('/api/personnel', personnel)

// --- 4. ERROR HANDLING ---
app.onError((err, c) => {
  console.error(`${err}`)
  return c.json({
    success: false,
    message: 'Terjadi kesalahan pada server internal',
    error: err.message
  }, 500)
})

app.notFound((c) => {
  return c.json({
    success: false,
    message: 'Endpoint tidak ditemukan. Cek lagi alamatnya, bos!'
  }, 404)
})

export default app
