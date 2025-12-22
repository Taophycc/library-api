"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("books", "count", {
      type: Sequelize.INTEGER,
      defaultValue: 1,
      allowNull: false,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("books", "count");
  },
};
