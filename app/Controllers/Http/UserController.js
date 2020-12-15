"use strict";
const User = use("App/Models/User");
const Token = use("App/Models/Token");
const Mail = use("App/Models/Mail");
const Send = use("Mail");
const Encryption = use("Encryption");

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
        const date = new Date();

        const token = Encryption.encrypt(
          `${date.getFullYear()} - ${date.getMilliseconds()} - ${date.getHours()} - ${date.getSeconds()} - ${username}`
        );

        const user = await User.create({ email, username, password, name });
        await Mail.create({ user_id: user.id, token: token.replace("/") });

        await Send.raw(
          `<h1> E-mail de confirmações </h1>
          <a href="http://localhost:3000/confirmar/${token.replace(
            "/"
          )}">Clique aqui para confirmar seu E-mail</a>
          `,
          (message) => {
            message.from("no-reply@vintagestudio.com");
            message.to(email);
            message.subject(`${user.name} confirmar seu cadastro.`);
          }
        );
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

  async confirmEmail({ params, request }) {
    const { token } = params;
    const { username } = request.all();

    const user = await User.findBy("username", username);
    const mail = await Mail.findBy("user_id", user.id);

    if (!user) {
      return {
        error: "03",
        msg: "user don't exist",
      };
    }

    if (token === mail.token) {
      mail.merge({ active: true });

      return await mail.save();
    }

    return {
      error: "09",
      msg: "token invalid",
    };
  }

  async sendChangePassword({ params, request }) {
    const { id } = params;
    const { email } = request.all();

    const user = await User.findBy("email", email);

    if (!user) {
      return {
        error: "03",
        msg: "user don't exist",
      };
    }

    const mail = await Mail.findBy("user_id", id);

    if (mail.change === 1 || mail.change === true) {
      return await Send.raw(
        `<h1> E-mail de confirmações </h1>
        <a href="http://localhost:3000/changepassword/${mail.token}/${id}">Clique aqui para alterar sua senha</a>
        `,
        (message) => {
          message.from("no-reply@vintagestudio.com");
          message.to(email);
          message.subject(`${user.name} Modificar senha.`);
        }
      );
    }

    const date = new Date();

    const token = Encryption.encrypt(
      `${date.getFullYear()} - ${date.getMilliseconds()} - ${date.getHours()} - ${date.getSeconds()} - ${email}`
    );

    mail.merge({ change: true, token: token.replace("/") });
    await mail.save();

    await Send.raw(
      `<h1> E-mail de confirmações </h1>
      <a href="http://localhost:3000/changepassword/${token.replace(
        "/"
      )}/${id}">Clique aqui para alterar sua senha</a>
      `,
      (message) => {
        message.from("no-reply@vintagestudio.com");
        message.to(email);
        message.subject(`${user.name} Modificar senha.`);
      }
    );

    return {
      send: "send email",
    };
  }

  async changePassword({ request }) {
    const { password, confirmPassword, token, id } = request.all();

    if (password === confirmPassword) {
      const mail = await Mail.findBy("user_id", id);

      if (mail.active === 1 || mail.active === true) {
        if (mail.change === 1 || mail.change === true) {
          if (mail.token === token) {
            const date = new Date();
            const token = Encryption.encrypt(
              `${date.getFullYear()} - ${date.getMilliseconds()} - ${date.getHours()} - ${date.getSeconds()} - ${
                mail.token
              }`
            );
            const user = await User.findBy("id", id);
            mail.merge({ change: false, token: token.replace("/") });
            await mail.save();

            user.merge({ password });
            await user.save();

            return {
              msg: "password modified",
            };
          }

          return {
            error: "09",
            msg: "token invalid",
          };
        }

        return {
          error: "10",
          msg: "don't authorization for change password",
        };
      }

      return {
        error: "08",
        msg: "don't active account",
      };
    }

    return {
      error: "02",
      msg: "password diferent",
    };
  }

  async sendActiveAgain({ params }) {
    const { id } = params;

    const user = await User.findBy("id", id);
    const mail = await Mail.findBy("user_id", id);

    await Send.raw(
      `<h1> E-mail de confirmações </h1>
      <a href="http://localhost:3000/confirmar/${mail.token}">Clique aqui para confirmar seu E-mail</a>
      `,
      (message) => {
        message.from("danieljuniorce@hotmail.com");
        message.to(user.email);
        message.subject(`${user.name} confirmar seu cadastro.`);
      }
    );

    return {
      msg: "send email the for active account again",
    };
  }
}

module.exports = UserController;
