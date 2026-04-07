import { Hono } from 'hono'

type Bindings = {
  DB: D1Database
}

const recruitment = new Hono<{ Bindings: Bindings }>()

// Endpoint untuk mencari kandidat pakai FTS5
recruitment.get('/search', async (c) => {
  const query = c.req.query('q')
  
  if (!query) return c.json({ message: 'Masukkan kata kunci pencarian' }, 400)

  try {
    const { results } = await c.env.DB.prepare(`
      SELECT * FROM recruitment_fts 
      WHERE recruitment_fts MATCH ? 
      ORDER BY rank
    `).bind(query).all()

    return c.json({
      keyword: query,
      total: results.length,
      data: results
    })
  } catch (e) {
    return c.json({ error: e.message }, 500)
  }
})

export default recruitment
