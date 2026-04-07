import { Hono } from 'hono'
import { logger } from 'hono/logger'
import { jwt } from 'hono/jwt'
import { cors } from 'hono/cors'

// Import Modul
import auth from './modules/auth'
import recruitment from './modules/recruitment'

type Bindings = {
  DB: D1Database
  JWT_SECRET: string
}

const app = new Hono<{ Bindings: Bindings }>()

// Middleware
app.use('*', logger())
app.use('*', cors())

// Public Route
app.get('/', (c) => c.text('HRGA Portal API v1.0 - Connection Established (Balikpapan Engine)'))

// Auth Module (Public)
app.route('/auth', auth)

// Protected API Routes
app.use('/api/*', (c, next) => {
  const authMiddleware = jwt({
    secret: c.env.JWT_SECRET,
    alg: 'HS256' // Fix Error: alg is required
  })
  return authMiddleware(c, next)
})

app.route('/api/recruitment', recruitment)

// Error Handling
app.onError((err, c) => {
  return c.json({
    success: false,
    message: 'Terjadi kesalahan pada server internal',
    error: err.message
  }, 500)
})

export default app
