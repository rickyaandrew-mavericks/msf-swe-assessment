"use strict";

/** @type {import("sequelize-cli").Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("application_documents", {
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
        defaultValue: Sequelize.literal("gen_random_uuid()"),
        allowNull: false,
      },
      application_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: "applications",
          key: "id",
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },
      original_name: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      stored_path: {
        type: Sequelize.STRING(500),
        allowNull: false,
      },
      mime_type: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      size_bytes: {
        type: Sequelize.INTEGER,
        allowNull: false,
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
      "ALTER TABLE application_documents ADD CONSTRAINT chk_documents_mime CHECK (mime_type = 'application/pdf')"
    );
    await queryInterface.sequelize.query(
      "ALTER TABLE application_documents ADD CONSTRAINT chk_documents_size CHECK (size_bytes > 0 AND size_bytes <= 10485760)"
    );

    // Index on FK for fast lookups
    await queryInterface.addIndex("application_documents", ["application_id"], {
      name: "idx_application_documents_application_id",
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable("application_documents");
  },
};
