"use strict";

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use("Schema");

class VintageRoleplaySchema extends Schema {
  up() {
    this.create("vintage_roleplays", (table) => {
      table.increments();
      table.integer("user_id").unsigned().references("id").inTable("users");
      table.string("name", 35).notNullable();
      table.string("surname", 35).notNullable();
      table.string("password", 60).notNullable();
      table.string("serial", 62).notNullable();
      table.string("discordid").notNullable();
      table.boolean("sex").notNullable();
      table.string("pos", 255).nullable().defaultTo("{123, 123, 123}");
      table.decimal("heart").nullable().defaultTo(100);
      table.decimal("armor").nullable().defaultTo(0);
      table.decimal("hunger").nullable().defaultTo(100);
      table.decimal("thirst").nullable().defaultTo(100);
      table.decimal("sleep").nullable().defaultTo(100);
      table.decimal("money").nullable().defaultTo(100);
      table.decimal("pv").nullable().defaultTo(1000);
      table.decimal("moneybank").nullable().defaultTo(5000);
      table.boolean("death").nullable().defaultTo(false);
      table.boolean("banned").nullable().defaultTo(false);
      table.boolean("login").nullable().defaultTo(false);
      table.boolean("modeadmin").nullable().defaultTo(false);
      table.decimal("leveladmin").nullable().defaultTo(0);
      table.timestamps();
    });
  }

  down() {
    this.drop("vintage_roleplays");
  }
}

module.exports = VintageRoleplaySchema;
