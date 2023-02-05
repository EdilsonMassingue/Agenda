const Contacto = require("../models/ContactModel");

exports.index = async (req, res, next) => {
  const contact = await Contacto.buscaContactos();
  res.render("index", { contact });
};
