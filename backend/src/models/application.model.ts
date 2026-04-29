import {
  Table,
  Column,
  Model,
  DataType,
  HasMany,
  CreatedAt,
  UpdatedAt,
} from "sequelize-typescript";
import type { ApplicationStatus, LicenceType, Gender } from "../types/application.js";
import { ApplicationDocument } from "./applicationDocument.model.js";

// Named ApplicationModel (not Application) to avoid shadowing the plain domain
// type Application exported from src/types/application.ts.
@Table({ tableName: "applications", timestamps: true, underscored: true })
export class ApplicationModel extends Model {
  @Column({ type: DataType.UUID, primaryKey: true })
  declare id: string;

  @Column({ type: DataType.STRING(100), allowNull: false })
  declare fullName: string;

  @Column({ type: DataType.STRING(20), allowNull: false })
  declare nricOrPassport: string;

  @Column({ type: DataType.DATEONLY, allowNull: false })
  declare dateOfBirth: string;

  @Column({ type: DataType.STRING(20), allowNull: false })
  declare gender: Gender;

  @Column({ type: DataType.STRING(60), allowNull: false })
  declare nationality: string;

  @Column({ type: DataType.STRING(20), allowNull: false })
  declare contactNumber: string;

  @Column({ type: DataType.STRING(255), allowNull: false })
  declare email: string;

  @Column({ type: DataType.TEXT, allowNull: false })
  declare homeAddress: string;

  @Column({ type: DataType.STRING(200), allowNull: false })
  declare businessName: string;

  @Column({ type: DataType.TEXT, allowNull: false })
  declare businessAddress: string;

  @Column({ type: DataType.SMALLINT, allowNull: false })
  declare yearsInOperation: number;

  @Column({ type: DataType.STRING(50), allowNull: false })
  declare licenceType: LicenceType;

  @Column({ type: DataType.BOOLEAN, allowNull: false })
  declare declarationAccuracy: boolean;

  @Column({ type: DataType.BOOLEAN, allowNull: false })
  declare declarationConsent: boolean;

  @Column({ type: DataType.STRING(30), allowNull: false, defaultValue: "pending_pre_site_resubmission" })
  declare status: ApplicationStatus;

  @CreatedAt
  declare createdAt: Date;

  @UpdatedAt
  declare updatedAt: Date;

  // undefined when association is not eagerly loaded via `include`
  @HasMany(() => ApplicationDocument)
  declare documents: ApplicationDocument[] | undefined;
}
