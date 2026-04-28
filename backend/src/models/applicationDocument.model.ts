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

@Table({ tableName: "application_documents", timestamps: true, underscored: true })
export class ApplicationDocument extends Model {
  @Column({ type: DataType.UUID, primaryKey: true })
  declare id: string;

  @ForeignKey(() => ApplicationModel)
  @Column({ type: DataType.UUID, allowNull: false })
  declare applicationId: string;

  // undefined when association is not eagerly loaded via `include`
  @BelongsTo(() => ApplicationModel)
  declare application: ApplicationModel | undefined;

  @Column({ type: DataType.STRING(255), allowNull: false })
  declare originalName: string;

  @Column({ type: DataType.STRING(500), allowNull: false })
  declare storedPath: string;

  @Column({ type: DataType.STRING(100), allowNull: false })
  declare mimeType: string;

  @Column({ type: DataType.INTEGER, allowNull: false })
  declare sizeBytes: number;

  @CreatedAt
  declare createdAt: Date;

  @UpdatedAt
  declare updatedAt: Date;
}
