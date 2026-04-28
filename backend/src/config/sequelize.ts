import { Sequelize } from "sequelize-typescript";
import { sequelizeOptions } from "./database.js";
import { models } from "../models/index.js";

export const sequelize = new Sequelize({
  ...sequelizeOptions,
  models,
});
