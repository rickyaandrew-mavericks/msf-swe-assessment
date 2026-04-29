import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
  CreatedAt,
  UpdatedAt,
} from "sequelize-typescript";
import { ApplicationModel } from "./application.model.js";
import { UserModel } from "./user.model.js";

@Table({ tableName: "comments", timestamps: true, underscored: true })
export class CommentModel extends Model {
  @Column({
    type: DataType.UUID,
    primaryKey: true,
    defaultValue: DataType.UUIDV4,
  })
  declare id: string;

  @ForeignKey(() => UserModel)
  @Column({ type: DataType.UUID, allowNull: false })
  declare officerId: string;

  @BelongsTo(() => UserModel)
  declare officer: UserModel | undefined;

  @ForeignKey(() => ApplicationModel)
  @Column({ type: DataType.UUID, allowNull: false })
  declare applicationId: string;

  @BelongsTo(() => ApplicationModel)
  declare application: ApplicationModel | undefined;

  @Column({ type: DataType.TEXT, allowNull: false })
  declare comment: string;

  @CreatedAt
  declare createdAt: Date;

  @UpdatedAt
  declare updatedAt: Date;
}
