import { Hono } from 'hono'

// Definisikan tipe untuk Bindings agar TypeScript tidak protes
type Bindings = {
  DB: D1Database
}

const app = new Hono<{ Bindings: Bindings }>()

app.get('/', (c) => {
  return c.text('Portal HRGA API is Online!')
})

// Endpoint Testing untuk melihat daftar departemen
app.get('/depts', async (c) => {
  try {
    const { results } = await c.env.DB.prepare("SELECT * FROM departments").all();
    return c.json(results);
  } catch (e) {
    return c.json({ error: e.message }, 500);
  }
})

export default app
