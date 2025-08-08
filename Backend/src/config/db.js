import dotenv from 'dotenv';
import postgres from 'postgres';

dotenv.config();

const Q = postgres(process.env.DATABASE_URI, {
  ssl: {
    rejectUnauthorized: false,
  },
});

export default Q;
