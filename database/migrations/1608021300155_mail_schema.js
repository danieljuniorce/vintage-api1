"use strict";

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use("Schema");

class MailSchema extends Schema {
  up() {
    this.create("mail", (table) => {
      table.increments();
      table.integer("user_id").unsigned().references("id").inTable("users");
      table.string("token", 255).notNullable();
      table.boolean("active").nullable().defaultTo(false);
      table.boolean("change").nullable().defaultTo(false);
      table.timestamps();
    });
  }

  down() {
    this.drop("mail");
  }
}

module.exports = MailSchema;
