/* eslint-disable @typescript-eslint/no-require-imports */
require("dotenv").config();

const required = (key) => {
  const value = process.env[key];
  if (!value) throw new Error(`Missing required environment variable: ${key}`);
  return value;
};

const base = {
  username: required("DB_USER"),
  password: required("DB_PASSWORD"),
  database: required("DB_NAME"),
  host: process.env["DB_HOST"] ?? "localhost",
  port: Number(process.env["DB_PORT"] ?? 5432),
  dialect: "postgres",
  pool: { max: 10, min: 2, acquire: 30000, idle: 10000 },
};

module.exports = {
  development: {
    ...base,
    logging: true,
  },
  test: {
    ...base,
    database: process.env["DB_NAME_TEST"] ?? `${required("DB_NAME")}_test`,
    logging: false,
  },
  production: {
    ...base,
    logging: false,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: true,
        ca: process.env["DB_SSL_CA"],
      },
    },
  },
};
