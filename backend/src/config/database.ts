import { env } from "./env.js";
import type { SequelizeOptions } from "sequelize-typescript";

export const sequelizeOptions: Omit<SequelizeOptions, "models"> = {
  dialect: "postgres",
  host: env.DB_HOST,
  port: env.DB_PORT,
  database: env.DB_NAME,
  username: env.DB_USER,
  password: env.DB_PASSWORD,
  logging: env.NODE_ENV === "development" ? console.log : false,
  pool: { max: 10, min: 2, acquire: 30000, idle: 10000 },
  define: {
    underscored: true,
    timestamps: true,
  },
};
