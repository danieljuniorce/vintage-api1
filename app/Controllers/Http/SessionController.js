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

    const user = await auth.attempt(username, password);

    return user;
  }
}

module.exports = SessionController;
