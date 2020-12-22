"use strict";

const VintageRoleplay = use("App/Models/VintageRoleplay");
const User = use("App/Models/User");
const Send = use("Mail");
const Database = use("Database");
const { SHA1 } = require("crypto-js");

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

class VintageRoleplayController {
  /**
   * Show a list of all vintagerolepays.
   * GET vintagerolepays
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async index() {
    const vintageRoleplayAccount = await VintageRoleplay.all();
    return vintageRoleplayAccount;
  }

  /**
   * Create/save a new vintagerolepay.
   * POST vintagerolepays
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store({ request }) {
    const { name, surname, password, serial, discordid, sex } = request.all();
    const username = request.header("username");

    const user = await User.findBy("username", username);

    if (!user) {
      return {
        error: "03",
        msg: "user don't exist",
      };
    }

    const vintageRoleplayVerify = await VintageRoleplay.findBy(
      "user_id",
      user.id
    );

    if (vintageRoleplayVerify) {
      return { error: "13", msg: "person exist" };
    }

    const vintageRoleplayAccount = await VintageRoleplay.create({
      user_id: user.id,
      name,
      surname,
      password: SHA1(password).toString(),
      serial,
      discordid,
      sex,
    });

    await Send.raw(
      `<h3>Olá ${vintageRoleplayAccount.name} ${
        vintageRoleplayAccount.surname
      }, sejá bem-vindo ao Vintage Roleplay</h3>
        <p>Discord ID: ${vintageRoleplayAccount.discordid}</p>
        <p>Sexo: ${vintageRoleplayAccount.sex ? "Homem" : "Mulher"}</p>
        <p>Vida: 100</p>
        <p>Dinheiro na Carteira: 100</p>
        <p>Dinheiro no Banco: 5000</p>
        <p>Ponto de Vantagem: 1000</p>
        <br/>
        <a href="mtasa://192.168.1.10:25565">IP do nosso servidor mtasa://192.168.1.10:25565</a>
        `,
      (message) => {
        message.from("no-reply@vintagestudioo.com");
        message.to(user.email);
        message.subject(`Novo personagem no Vintage Roleplay.`);
      }
    );

    return {
      msg: "account create success",
    };
  }

  /**
   * Display a single vintagerolepay.
   * GET vintagerolepays/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async show({ request }) {
    const username = request.header("username");

    const user = await User.findBy("username", username);

    if (!user) {
      return {
        error: "03",
        msg: "user don't exist",
      };
    }

    const vintageRoleplayAccount = await VintageRoleplay.findBy(
      "user_id",
      user.id
    );

    if (!vintageRoleplayAccount) {
      return {
        error: "14",
        msg: "person don't exist",
      };
    }

    if (user.id === vintageRoleplayAccount.user_id) {
      return vintageRoleplayAccount;
    }

    return {
      error: "15",
      msg: "person don't exact id",
    };
  }

  /**
   * Update vintagerolepay details.
   * PUT or PATCH vintagerolepays/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update({ params, request }) {
    const { id } = params;
    const username = request.header("username");
    const data = request.all();

    const user = await User.findBy("username", username);
    const vintageRoleplayAccount = await VintageRoleplay.findBy("id", id);

    if (!user) {
      return {
        error: "03",
        msg: "user don't exist",
      };
    } else if (!vintageRoleplayAccount) {
      return {
        error: "14",
        msg: "person don't exist",
      };
    }

    if (vintageRoleplayAccount.user_id === user.id) {
      vintageRoleplayAccount.merge(data);
      await vintageRoleplayAccount.save();

      return {
        msg: "update info",
      };
    }

    return {
      error: "15",
      msg: "person don't exact id",
    };
  }

  /**
   * Delete a vintagerolepay with id.
   * DELETE vintagerolepays/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy({ params, request }) {
    const { id } = params;
    const username = request.header("username");

    const user = await User.findBy("username", username);
    const vintageRoleplayAccount = await VintageRoleplay.findBy("id", id);

    if (!user) {
      return {
        error: "03",
        msg: "user don't exist",
      };
    } else if (!vintageRoleplayAccount) {
      return {
        error: "14",
        msg: "person don't exist",
      };
    }

    if (user.id === vintageRoleplayAccount.user_id) {
      await Send.raw(
        `<h3>Olá ${vintageRoleplayAccount.name} ${vintageRoleplayAccount.surname} foi deletada com sucesso!</h3>
          <p>Discord ID: ${vintageRoleplayAccount.discordid}</p>
          <p>Dinheiro na Carteira: 100</p>
          <p>Dinheiro no Banco: 5000</p>
          <p>Ponto de Vantagem: 1000</p>
          <br/>
          `,
        (message) => {
          message.from("no-reply@vintagestudioo.com");
          message.to(user.email);
          message.subject(`O seu personagem foi deletado do Vintage Roleplay.`);
        }
      );

      await vintageRoleplayAccount.delete();

      return {
        msg: "user delete",
      };
    }

    return {
      error: "15",
      msg: "person don't exact id",
    };
  }

  /**
   * Delete a vintagerolepay with id.
   * DELETE vintagerolepays/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */

  async changePassword({ params, request }) {
    const { id } = params;
    const { passwordActual, password } = request.all();
    const username = request.header("username");

    const user = await User.findBy("username", username);
    const vintageRoleplayAccount = await VintageRoleplay.findBy("id", id);

    if (!user) {
      return {
        error: "03",
        msg: "user don't exist",
      };
    } else if (!vintageRoleplayAccount) {
      return {
        error: "14",
        msg: "person don't exist",
      };
    }

    const updatePassword = await Database.from("vintage_roleplays")
      .where({ id: parseInt(id), password: SHA1(passwordActual).toString() })
      .update({ password: SHA1(password).toString() });

    if (updatePassword) {
      return true;
    }

    return false;
  }
}

module.exports = VintageRoleplayController;
