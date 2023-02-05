const Contacto = require("../models/ContactModel");

exports.index = (req, res) => {
  res.render("contacto", {
    contact: {},
  });
};

exports.register = async (req, res) => {
  try {
    const contact = new Contacto(req.body);
    await contact.register();

    if (contact.errors.length > 0) {
      req.flash("errors", contact.errors);
      req.session.save(() => res.redirect("/contacto/index"));
      return;
    }

    req.flash("success", "Contacto registrado com sucesso!");
    req.session.save(() =>
      res.redirect(`/contacto/index/${contact.contact._id}`)
    );
    return;
  } catch (err) {
    console.log(err);
    return res.render("404");
  }
};

exports.editIndex = async (req, res) => {
  if (!req.params.id) return res.render("404");

  const contact = await Contacto.buscaPorId(req.params.id);
  if (!contact) return res.render("404");

  res.render("contacto", { contact });
};

exports.edit = async (req, res) => {
  try {
    if (!req.params.id) return res.render("404");
    const contact = new Contacto(req.body);
    await contact.edit(req.params.id);

    if (contact.errors.length > 0) {
      req.flash("errors", contact.errors);
      req.session.save(() => res.redirect("back"));
      return;
    }

    req.flash("success", "Contacto editado com sucesso!");
    req.session.save(() =>
      res.redirect(`/contacto/index/${contact.contact._id}`)
    );
    return;
  } catch (err) {
    res.render("404");
  }
};

exports.delete = async (req, res) => {
  if (!req.params.id) return res.render("404");

  const contact = await Contacto.delete(req.params.id);
  if (!contact) return res.render("404");

  req.flash("success", "Contacto apagado com sucesso!");
  req.session.save(() => res.redirect("back"));
  return;
};
