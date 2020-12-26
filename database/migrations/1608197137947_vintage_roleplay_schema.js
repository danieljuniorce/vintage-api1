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
      table.decimal("x", 65).nullable().defaultTo(691.5693359375);
      table.decimal("y", 65).nullable().defaultTo(-1275.7188720703);
      table.decimal("z", 65).nullable().defaultTo(13.560731887817);
      table.decimal("heart", 65).nullable().defaultTo(100);
      table.decimal("armor", 65).nullable().defaultTo(0);
      table.decimal("hunger", 65).nullable().defaultTo(100);
      table.decimal("thirst", 65).nullable().defaultTo(100);
      table.decimal("sleep", 65).nullable().defaultTo(100);
      table.bigInteger("money", 65).nullable().defaultTo(100);
      table.bigInteger("pv", 65).nullable().defaultTo(1000);
      table.bigInteger("moneybank", 65).nullable().defaultTo(5000);
      table.boolean("death").nullable().defaultTo(false);
      table.boolean("banned").nullable().defaultTo(false);
      table.boolean("login").nullable().defaultTo(false);
      table.boolean("modeadmin").nullable().defaultTo(false);
      table.integer("leveladmin").nullable().defaultTo(0);
      table.timestamps();
    });
  }

  down() {
    this.drop("vintage_roleplays");
  }
}

module.exports = VintageRoleplaySchema;
