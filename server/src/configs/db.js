import { neon } from "@neondatabase/serverless";
if (!process.env.DB_URL) {
    throw new Error("DB_URL environment variable is not defined");
}
const sql = neon(process.env.DB_URL);
export default sql;
//# sourceMappingURL=db.js.map