import pg from 'pg';
import dotenv from 'dotenv';
dotenv.config();

const { Pool } = pg;

const pool = new Pool({
    user: process.env.DBUSER || 'postgres',
    host: process.env.DBHOST || 'localhost',
    database: process.env.DB || 'WebService',
    password: process.env.DBPWD || '0123456zaza',
    port: process.env.DBPORT ? Number(process.env.DBPORT) : 5432,
    connectionTimeoutMillis: 5000,
});

pool.on('error', (err) => {
    console.error('Unexpected error on idle client', err);
});

export default pool;
