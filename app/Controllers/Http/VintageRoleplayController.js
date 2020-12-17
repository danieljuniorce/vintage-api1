"use strict";

const VintageRoleplay = use("App/Models/VintageRoleplay");
const User = use("App/Models/User");
const Send = use("Mail");
const { SHA384 } = require("crypto-js");

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

/**
 * Resourceful controller for interacting with vintagerolepays
 */
class VintageRoleplayController {
  /**
   * Show a list of all vintagerolepays.
   * GET vintagerolepays
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async index({ request, response, view }) {}

  /**
   * Render a form to be used for creating a new vintagerolepay.
   * GET vintagerolepays/create
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async create({ request, response, view }) {}

  /**
   * Create/save a new vintagerolepay.
   * POST vintagerolepays
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store({ request }) {
    const {
      name,
      surname,
      password,
      serial,
      discordid,
      sex,
      username,
    } = request.all();

    const user = await User.findBy("username", username);
    const vintageRoleplayVerify = await VintageRoleplay.findBy(
      "user_id",
      user.id
    );

    if (!user) {
      return {
        error: "03",
        msg: "user don't exist",
      };
    } else if (vintageRoleplayVerify) {
      return { error: "13", msg: "person exist" };
    }

    const vintageRoleplayAccount = await VintageRoleplay.create({
      user_id: user.id,
      name,
      surname,
      password: SHA384(password).toString(),
      serial,
      discordid,
      sex,
    });

    await Send.raw(
      `<h3>Olá ${vintageRoleplayAccount.name} ${
        vintageRoleplayAccount.surname
      }, sejá bem-vindo ao Vintage Roleplay</h3>
        <p>Discord ID: ${vintageRoleplayAccount.discordid}</p>
        <p>Sexo: ${vintageRoleplayAccount.sex ? "Mulher" : "Homem"}</p>
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
  async show({ params, request, response, view }) {}

  /**
   * Render a form to update an existing vintagerolepay.
   * GET vintagerolepays/:id/edit
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async edit({ params, request, response, view }) {}

  /**
   * Update vintagerolepay details.
   * PUT or PATCH vintagerolepays/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update({ params, request, response }) {}

  /**
   * Delete a vintagerolepay with id.
   * DELETE vintagerolepays/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy({ params, request, response }) {}
}

module.exports = VintageRoleplayController;
