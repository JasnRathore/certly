import { createClient } from "@libsql/client";
import * as fs from "fs";

const db = createClient({ url: "file:./dev.db" });
const schema = fs.readFileSync("schema.sql", "utf-8");

async function migrate() {
  const statements = schema.split(";").filter(s => s.trim());
  for (const stmt of statements) {
    await db.execute(stmt);
  }
  console.log("Migrations applied.");
}

migrate();
