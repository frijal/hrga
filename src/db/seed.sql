-- Isi Departemen
INSERT INTO departments (name, description) VALUES 
('HRGA', 'Human Resources & General Affairs'),
('IT', 'Information Technology & Development'),
('Operations', 'Warehouse & Sales Operations');

-- Isi Admin Pertama (Gunakan NIP kamu/contoh)
INSERT INTO employees (nip, full_name, email, role, dept_id, position, status, join_date) VALUES 
('1001', 'Fakhrul Rijal', 'admin@dalam.web.id', 'Admin', 2, 'IT Supervisor', 'Active', '2026-01-01');

-- Isi Data Pelamar untuk Test FTS5
-- Catatan: Kita masukkan ke table employees dulu, lalu FTS akan mengambil datanya
INSERT INTO employees (nip, full_name, email, role, dept_id, position, status, join_date) VALUES 
('9001', 'Budi Santoso', 'budi@example.com', 'User', 3, 'Driver', 'Active', '2026-04-01');

-- Daftarkan ke FTS5 (Manual Insert untuk Virtual Table)
INSERT INTO recruitment_fts (candidate_id, full_name, skills, experience_summary, expected_position) VALUES 
(1, 'Budi Santoso', 'Driving, Maintenance, Balikpapan Route', '5 years experience in logistics', 'Driver');
