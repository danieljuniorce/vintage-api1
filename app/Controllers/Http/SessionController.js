"use strict";
const User = use("App/Models/User");
const Mail = use("App/Models/Mail");

class SessionController {
  async login({ request, auth }) {
    const { username, password } = request.all();

    const verify = await User.findBy("username", username);

    if (!verify) {
      return {
        error: "03",
        msg: "user don't exist",
      };
    }

    const mail = await Mail.findBy("user_id", verify.id);

    if (mail.active === 1 || mail.active === true) {
      try {
        const user = await auth.attempt(username, password);
        return {
          token: user.token,
          email: verify.email,
          photo: verify.photo,
          name: verify.name,
        };
      } catch (e) {
        return {
          error: "07",
          msg: "don't authentication",
        };
      }
    }

    return {
      error: "08",
      msg: "don't active account",
    };
  }
}

module.exports = SessionController;
