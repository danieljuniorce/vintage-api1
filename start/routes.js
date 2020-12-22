"use strict";

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| Http routes are entry points to your web application. You can create
| routes for different URLs and bind Controller actions to them.
|
| A complete guide on routing is available here.
| http://adonisjs.com/docs/4.1/routing
|
*/

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use("Route");

Route.get("/", () => {
  return { greeting: "Hello world in JSON" };
});

Route.post("/login", "SessionController.login");

Route.post("/user", "UserController.store");
Route.get("/user", "UserController.index").middleware("auth");
Route.get("/user/:id", "UserController.show").middleware("auth");
Route.put("/user/:id", "UserController.update").middleware("auth");
Route.delete("/user/:id", "UserController.destroy").middleware("auth");

Route.post("/confirm/:token", "UserController.confirmEmail");
Route.post("/sendchangepassword", "UserController.sendChangePassword");
Route.post("/changepassword", "UserController.changePassword");
Route.post("/sendactive/:username", "UserController.sendActiveAgain");

Route.resource("/vintageroleplay", "VintageRoleplayController").middleware(
  "auth"
);
Route.post(
  "/vintageroleplay/changepassword/:id",
  "VintageRoleplayController.changePassword"
).middleware("auth");
