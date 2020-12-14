"use strict";
const User = use("App/Models/User");
const Token = use("App/Models/Token");
const Database = use("Database");

class UserController {
  async index() {
    const user = await User.all();

    return user;
  }

  async show({ params }) {
    const { id } = params;

    try {
      const user = await User.findBy("id", parseInt(id));

      if (!user) {
        return {
          error: "03",
          msg: "user don't exist",
        };
      }

      return user;
    } catch (e) {
      return {
        error: "999",
        msg: "error in execut function",
        e,
      };
    }
  }

  async store({ request }) {
    const {
      email,
      emailConfirm,
      username,
      password,
      passwordConfirm,
      name,
    } = request.all();

    try {
      const verifyEmail = await User.findBy("email", email);
      const verifyUsername = await User.findBy("username", username);

      if (!verifyEmail || !verifyUsername) {
      } else {
        return { error: "05", msg: "username or email exist" };
      }
    } catch (e) {
      return { error: "error in verification email and username" };
    }

    if (email === emailConfirm) {
      if (password === passwordConfirm) {
        const user = await User.create({ email, username, password, name });

        return user;
      }

      return {
        error: "02",
        msg: "password diferent",
      };
    }

    return {
      error: "01",
      msg: "email diferent",
    };
  }

  async update({ request, params }) {
    const data = request.all();
    const { id } = params;

    const user = await User.findBy("id", id);

    if (!user) {
      return {
        error: "03",
        msg: "user don't exist",
      };
    }

    user.merge(data);
    await user.save();

    return user;
  }

  async destroy({ params }) {
    const { id } = params;

    const token = await Token.findBy("id", id);
    await token.delete();

    const user = await User.findBy("id", id);

    if (!user) {
      return {
        error: "03",
        msg: "user don't exist",
      };
    }

    await user.delete();

    return {
      msg: "user delete",
    };
  }
}

module.exports = UserController;
