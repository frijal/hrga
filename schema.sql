-- ==========================================
-- 1. CORE & PERSONNEL MODULE
-- ==========================================
CREATE TABLE departments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE,
    description TEXT
);

CREATE TABLE employees (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nip TEXT UNIQUE NOT NULL, -- Nomor Induk Pegawai
    full_name TEXT NOT NULL,
    email TEXT UNIQUE,
    password_hash TEXT, -- Untuk Auth
    role TEXT CHECK(role IN ('Admin', 'HR', 'Manager', 'User')) DEFAULT 'User',
    dept_id INTEGER,
    position TEXT,
    status TEXT CHECK(status IN ('Active', 'Resigned', 'Contract_End')) DEFAULT 'Active',
    join_date DATE,
    phone TEXT,
    FOREIGN KEY (dept_id) REFERENCES departments(id)
);

-- ==========================================
-- 2. RECRUITMENT MODULE (FTS5)
-- ==========================================
CREATE VIRTUAL TABLE recruitment_fts USING fts5(
    candidate_id UNINDEXED,
    full_name,
    skills,
    experience_summary,
    expected_position,
    content='employees', -- Optional: bisa link ke table asli
    tokenize='porter' -- Biar pencarian lebih "pintar" (root words)
);

-- ==========================================
-- 3. ATTENDANCE & LEAVE MODULE
-- ==========================================
CREATE TABLE attendance (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    employee_id INTEGER,
    check_in DATETIME DEFAULT CURRENT_TIMESTAMP,
    check_out DATETIME,
    lat_long TEXT, -- Koordinat absen
    status TEXT DEFAULT 'Present', -- Present, Late, Sick
    FOREIGN KEY (employee_id) REFERENCES employees(id)
);

CREATE TABLE leave_requests (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    employee_id INTEGER,
    leave_type TEXT, -- Annual, Sick, Special
    start_date DATE,
    end_date DATE,
    reason TEXT,
    status TEXT DEFAULT 'Pending', -- Pending, Approved, Rejected
    approved_by INTEGER,
    FOREIGN KEY (employee_id) REFERENCES employees(id),
    FOREIGN KEY (approved_by) REFERENCES employees(id)
);

-- ==========================================
-- 4. PAYROLL MODULE
-- ==========================================
CREATE TABLE payroll_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    employee_id INTEGER,
    period_month INTEGER, -- 1-12
    period_year INTEGER,
    basic_salary REAL,
    allowances REAL DEFAULT 0, -- Tunjangan
    deductions REAL DEFAULT 0, -- Potongan (BPJS/Pajak)
    net_salary REAL,
    processed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (employee_id) REFERENCES employees(id)
);
