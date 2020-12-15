"use strict";
const User = use("App/Models/User");

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
}

module.exports = SessionController;
