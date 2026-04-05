import fs from "node:fs";
import path from "node:path";
import sqlite3 from "sqlite3";

const DB_NAME = "automotive_shop.db";
const TABLE_NAME = "product_sales_metrics";
const dbPath = path.join(process.cwd(), "server", "data", DB_NAME);

const seedRows = [
  { product_name: "Brake Pads", sales_revenue: 128500, product_count: 970 },
  { product_name: "Engine Oil 5W-30", sales_revenue: 121000, product_count: 1340 },
  { product_name: "Tire Set (All-Season)", sales_revenue: 116300, product_count: 380 },
  { product_name: "Spark Plugs", sales_revenue: 98200, product_count: 1400 },
  { product_name: "Battery 12V", sales_revenue: 94400, product_count: 510 },
  { product_name: "Air Filter", sales_revenue: 87500, product_count: 1620 },
  { product_name: "Shock Absorbers", sales_revenue: 86100, product_count: 460 },
  { product_name: "Alternator", sales_revenue: 77800, product_count: 225 },
  { product_name: "Radiator Coolant", sales_revenue: 73400, product_count: 880 },
  { product_name: "Headlight Assembly", sales_revenue: 69900, product_count: 310 }
];

function run(db, sql, params = []) {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function onRun(err) {
      if (err) {
        reject(err);
        return;
      }
      resolve(this);
    });
  });
}

function all(db, sql, params = []) {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(rows);
    });
  });
}

function get(db, sql, params = []) {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(row);
    });
  });
}

function openDatabase() {
  return new Promise((resolve, reject) => {
    const db = new sqlite3.Database(dbPath, (err) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(db);
    });
  });
}

async function seedIfEmpty(db) {
  const row = await get(db, `SELECT COUNT(*) AS total FROM ${TABLE_NAME}`);
  if (row.total > 0) {
    return;
  }

  for (const item of seedRows) {
    await run(
      db,
      `INSERT INTO ${TABLE_NAME} (product_name, sales_revenue, product_count) VALUES (?, ?, ?)`,
      [item.product_name, item.sales_revenue, item.product_count]
    );
  }
}

async function initializeDatabase(db) {
  fs.mkdirSync(path.dirname(dbPath), { recursive: true });

  await run(
    db,
    `CREATE TABLE IF NOT EXISTS ${TABLE_NAME} (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      product_name TEXT NOT NULL UNIQUE,
      sales_revenue REAL NOT NULL,
      product_count INTEGER NOT NULL
    )`
  );

  await seedIfEmpty(db);
}

let dbPromise;

export async function getDatabase() {
  if (!dbPromise) {
    dbPromise = openDatabase().then(async (db) => {
      await initializeDatabase(db);
      return db;
    });
  }
  return dbPromise;
}

export async function getDashboardData() {
  const db = await getDatabase();

  const revenueTop10 = await all(
    db,
    `SELECT product_name, sales_revenue, product_count
     FROM ${TABLE_NAME}
     ORDER BY sales_revenue DESC
     LIMIT 10`
  );

  const countTop10 = await all(
    db,
    `SELECT product_name, sales_revenue, product_count
     FROM ${TABLE_NAME}
     ORDER BY product_count DESC
     LIMIT 10`
  );

  const kpi = await get(
    db,
    `SELECT
      COALESCE(SUM(sales_revenue), 0) AS totalRevenue,
      COALESCE(SUM(product_count), 0) AS totalUnits,
      COALESCE(AVG(sales_revenue), 0) AS avgRevenue
     FROM ${TABLE_NAME}`
  );

  return {
    database: DB_NAME,
    table: TABLE_NAME,
    revenueTop10,
    countTop10,
    kpis: {
      totalRevenue: kpi.totalRevenue,
      totalUnits: kpi.totalUnits,
      avgRevenue: kpi.avgRevenue,
      topProduct: revenueTop10[0]?.product_name ?? "-"
    }
  };
}
