// Contoh logic pencarian di Recruitment Module
export const searchCandidates = async (db: D1Database, query: string) => {
  // Query ini akan mencari di semua kolom virtual table recruitment_fts
  const sql = `
    SELECT * FROM recruitment_fts 
    WHERE recruitment_fts MATCH ? 
    ORDER BY rank
  `;
  
  const { results } = await db.prepare(sql).bind(query).all();
  return results;
};
