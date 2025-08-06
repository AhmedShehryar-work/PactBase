// lib/db.js
import postgres from 'postgres';

const Q = postgres(process.env.DATABASE_URI, {
  ssl: 'require' // required for Supabase
});

export default Q;
