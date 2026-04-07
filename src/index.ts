import { Hono } from 'hono'
import { logger } from 'hono/logger'
import recruitment from './modules/recruitment'

const app = new Hono<{ Bindings: { DB: D1Database } }>()

// Middleware biar kita bisa lihat log request di terminal
app.use('*', logger())

app.get('/', (c) => c.text('HRGA Portal API v1.0 - Ready to go!'))

// Pasang modul-modul di sini (Grouping)
app.route('/api/recruitment', recruitment)

export default app
