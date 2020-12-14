"use strict";

const Schema = use("Schema");

class UserSchema extends Schema {
  up() {
    this.create("users", (table) => {
      table.increments();
      table.string("username", 80).notNullable().unique();
      table.string("name", 80).notNullable();
      table.string("email", 254).notNullable().unique();
      table.string("password", 60).notNullable();
      table
        .string("photo", 255)
        .nullable()
        .defaultTo(
          "https://www.flaticon.com/svg/static/icons/svg/599/599305.svg"
        );
      table.timestamps();
    });
  }

  down() {
    this.drop("users");
  }
}

module.exports = UserSchema;
