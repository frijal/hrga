import { Hono } from 'hono'

type Bindings = {
  DB: D1Database
}

const recruitment = new Hono<{ Bindings: Bindings }>()

// Endpoint pencarian kandidat (FTS5)
recruitment.get('/search', async (c) => {
  const query = c.req.query('q')
  
  if (!query) {
    return c.json({ 
      success: false, 
      message: 'Silakan masukkan kata kunci (contoh: ?q=Budi)' 
    }, 400)
  }

  try {
    /**
     * PERBAIKAN QUERY:
     * 1. Tabel Master: 'recruitment' (Alias T) -> Kolom kuncinya adalah 'id'
     * 2. Tabel Virtual: 'recruitment_fts' (Alias F) -> Menggunakan 'rowid' untuk mapping
     * 3. Kita JOIN F.rowid dengan T.id
     */
    const { results } = await c.env.DB.prepare(`
      SELECT 
        T.id, 
        T.full_name, 
        T.position_applied, 
        T.status
      FROM recruitment_fts F
      JOIN recruitment T ON F.rowid = T.id
      WHERE recruitment_fts MATCH ?
      ORDER BY rank
    `).bind(query).all()

    return c.json({
      success: true,
      keyword: query,
      total: results.length,
      data: results
    })

  } catch (e: any) {
    return c.json({ 
      success: false, 
      message: 'Gagal memproses pencarian database',
      error: e.message 
    }, 500)
  }
})

export default recruitment
