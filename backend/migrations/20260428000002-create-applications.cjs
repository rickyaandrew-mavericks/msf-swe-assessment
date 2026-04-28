"use strict";

const APPLICATION_STATUSES = [
  "draft",
  "submitted",
  "under_review",
  "pending_information",
  "information_submitted",
  "site_assessment_scheduled",
  "site_assessment_completed",
  "pending_approval",
  "approved",
  "rejected",
  "withdrawn",
];

const LICENCE_TYPES = [
  "Child Care Centre Licence",
  "Centre-Based Student Care Licence",
  "Residential Child Care Service Licence",
  "Foster Care Service Licence",
  "Family Group Home Licence",
  "Social Service Agency Licence",
];

const GENDERS = ["Male", "Female", "Prefer not to say"];

/** @type {import("sequelize-cli").Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("applications", {
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
        defaultValue: Sequelize.literal("gen_random_uuid()"),
        allowNull: false,
      },
      full_name: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      nric_or_passport: {
        type: Sequelize.STRING(20),
        allowNull: false,
      },
      date_of_birth: {
        type: Sequelize.DATEONLY,
        allowNull: false,
      },
      gender: {
        type: Sequelize.STRING(20),
        allowNull: false,
      },
      nationality: {
        type: Sequelize.STRING(60),
        allowNull: false,
      },
      contact_number: {
        type: Sequelize.STRING(20),
        allowNull: false,
      },
      email: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      home_address: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      business_name: {
        type: Sequelize.STRING(200),
        allowNull: false,
      },
      business_address: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      years_in_operation: {
        type: Sequelize.SMALLINT,
        allowNull: false,
      },
      licence_type: {
        type: Sequelize.STRING(50),
        allowNull: false,
      },
      declaration_accuracy: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
      },
      declaration_consent: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
      },
      status: {
        type: Sequelize.STRING(30),
        allowNull: false,
        defaultValue: "submitted",
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("NOW()"),
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("NOW()"),
      },
    });

    // CHECK constraints
    await queryInterface.sequelize.query(
      `ALTER TABLE applications ADD CONSTRAINT chk_applications_gender CHECK (gender IN (${GENDERS.map((g) => `'${g}'`).join(", ")}))`
    );
    await queryInterface.sequelize.query(
      `ALTER TABLE applications ADD CONSTRAINT chk_applications_licence_type CHECK (licence_type IN (${LICENCE_TYPES.map((l) => `'${l}'`).join(", ")}))`
    );
    await queryInterface.sequelize.query(
      `ALTER TABLE applications ADD CONSTRAINT chk_applications_status CHECK (status IN (${APPLICATION_STATUSES.map((s) => `'${s}'`).join(", ")}))`
    );
    await queryInterface.sequelize.query(
      "ALTER TABLE applications ADD CONSTRAINT chk_applications_years CHECK (years_in_operation BETWEEN 0 AND 100)"
    );
    await queryInterface.sequelize.query(
      "ALTER TABLE applications ADD CONSTRAINT chk_applications_declarations CHECK (declaration_accuracy = TRUE AND declaration_consent = TRUE)"
    );

    // Indexes
    await queryInterface.addIndex("applications", ["status"], {
      name: "idx_applications_status",
    });
    await queryInterface.addIndex("applications", ["email"], {
      name: "idx_applications_email",
    });
    await queryInterface.addIndex("applications", ["created_at"], {
      name: "idx_applications_created_at",
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable("applications");
  },
};
