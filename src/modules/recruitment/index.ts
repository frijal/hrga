import { Hono } from 'hono'

type Bindings = {
  DB: D1Database
}

const recruitment = new Hono<{ Bindings: Bindings }>()

// Endpoint untuk mencari kandidat pakai FTS5
recruitment.get('/search', async (c) => {
  const query = c.req.query('q')
  
  if (!query) {
    return c.json({ 
      success: false, 
      message: 'Masukkan kata kunci pencarian (misal: ?q=Budi)' 
    }, 400)
  }

  try {
    /**
     * PERBAIKAN QUERY:
     * 1. Kita JOIN antara tabel FTS (F) dan tabel Master (T).
     * 2. FTS5 secara default menggunakan 'rowid' sebagai pointer ke data asli.
     * 3. MATCH ? dijalankan pada tabel virtual untuk kecepatan maksimal.
     */
    const { results } = await c.env.DB.prepare(`
      SELECT 
        T.id,
        T.full_name,
        T.position_applied,
        T.status,
        T.created_at
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
    // Menangkap error spesifik jika tabel atau kolom belum ada
    return c.json({ 
      success: false, 
      message: 'Gagal melakukan pencarian pada database',
      error: e.message 
    }, 500)
  }
})

export default recruitment
