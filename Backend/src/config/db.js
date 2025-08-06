
import postgres from 'postgres';

const Q = postgres(process.env.DATABASE_URI, {
  ssl: {
    rejectUnauthorized: false,
  },
});

export default Q;
