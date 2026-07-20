const { Pool } = require('pg');
const pool = new Pool({
  connectionString: "postgresql://neondb_owner:npg_9ArmSjiGL2Cc@ep-little-snow-aw862nxs-pooler.c-12.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require"
});
pool.query('SELECT id, username, created_at FROM "User"', (err, res) => {
  if (err) {
    console.error("DB connection/query failed:", err);
  } else {
    console.log("Registered Users count:", res.rows.length);
    console.log("Users:", res.rows);
  }
  pool.end();
});
