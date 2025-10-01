import { neon } from "@neondatabase/serverless";

let sql: ReturnType<typeof neon> | undefined;
const dbUrl = process.env.DB_URL;
if (dbUrl) {
  sql = neon(dbUrl as string);
} else {
  console.warn("DB_URL not set. Database operations will fail until configured.");
}

export default sql;