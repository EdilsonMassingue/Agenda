const express = require("express");
const router = express.Router();
const homeController = require("./src/controllers/homeController");
const loginController = require("./src/controllers/loginController");
const contactController = require("./src/controllers/contactController");

const { loginRequired } = require("./src/middlewares/middleware");

// Routes of home page
router.get("/", homeController.index);

// Routes of login page
router.get("/login/index", loginController.index);
router.post("/login/register", loginController.register);
router.post("/login/login", loginController.login);
router.get("/login/logout", loginController.logout);

// Routes of contact page
router.get("/contacto/index", loginRequired, contactController.index);
router.post("/contacto/register", loginRequired, contactController.register);
router.get("/contacto/index/:id", loginRequired, contactController.editIndex);
router.post("/contacto/index/:id", loginRequired, contactController.edit);
router.get("/contacto/delete/:id", loginRequired, contactController.delete);

module.exports = router;
