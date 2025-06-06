const { Pool } = require("pg");

const ENV = process.env.NODE_ENV || 'development';

require('dotenv').config({path: `${__dirname}/../.env.${ENV}`});

const config = ENV === "production"
  ? {
      connectionString: process.env.DATABASE_URL,
      max: 2,
      // optionally ssl: { rejectUnauthorized: false } if needed for some hosts
    }
  : {};

if (ENV !== "production" && !process.env.PGDATABASE) {
  throw new Error("No PGDATABASE configured");
} else if (ENV === "production" && !process.env.DATABASE_URL) {
  throw new Error("No DATABASE_URL configured for production");
}

module.exports = new Pool(config);