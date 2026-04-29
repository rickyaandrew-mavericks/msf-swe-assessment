import {
  Table,
  Column,
  Model,
  DataType,
  HasMany,
  CreatedAt,
  UpdatedAt,
} from "sequelize-typescript";
import { CommentModel } from "./comment.model.js";

export type UserRole = "operator" | "officer" | "admin";

@Table({ tableName: "users", timestamps: true, underscored: true })
export class UserModel extends Model {
  @Column({
    type: DataType.UUID,
    primaryKey: true,
    defaultValue: DataType.UUIDV4,
  })
  declare id: string;

  @Column({ type: DataType.STRING(50), allowNull: false, unique: true })
  declare username: string;

  @Column({ type: DataType.STRING(100), allowNull: false })
  declare name: string;

  @Column({ type: DataType.STRING(255), allowNull: false, unique: true })
  declare email: string;

  @Column({ type: DataType.STRING(255), allowNull: false })
  declare hashPassword: string;

  @Column({ type: DataType.STRING(30), allowNull: false })
  declare role: UserRole;

  @CreatedAt
  declare createdAt: Date;

  @UpdatedAt
  declare updatedAt: Date;

  @HasMany(() => CommentModel)
  declare comments: CommentModel[] | undefined;
}
