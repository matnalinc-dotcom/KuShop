import pg from 'pg';
const { Pool } = pg;

const pool = new Pool({
    user: 'postgres',       // หรือ user dev ที่ใช้
    host: 'localhost',
    database: 'WebService', // 👈 เปลี่ยนชื่อตรงนี้ครับ
    password: '1234',
    port: 5432,
});

export default pool;