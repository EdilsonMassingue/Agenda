const mongoose = require("mongoose");
const { async } = require("regenerator-runtime");
const validator = require("validator");

const ContactSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  sobrenome: { type: String, required: false, default: "" },
  email: { type: String, required: false, default: "" },
  telefone: { type: String, required: true },
  criadoEm: { type: Date, default: Date.now },
});

const ContactModel = mongoose.model("Contacto", ContactSchema);

function Contacto(body) {
  this.body = body;
  this.errors = [];
  this.contact = null;
}

Contacto.prototype.register = async function () {
  this.valida();
  if (this.errors.length > 0) return;
  this.contact = await ContactModel.create(this.body);
};

Contacto.prototype.valida = function () {
  this.cleanUp();

  // Validate
  // the email field needs to be validated
  if (this.body.email && !validator.isEmail(this.body.email)) {
    this.errors.push("Email inválido");
    if (!this.body.nome) this.errors.push("Nome é obrigatório");
    if (!this.body.telefone && !this.body.email)
      this.errors.push("Telefone e Email é obrigatório");
  }
};

Contacto.prototype.cleanUp = function () {
  for (const key in this.body) {
    if (typeof this.body[key] !== "string") {
      this.body[key] = "";
    }
  }

  this.body = {
    nome: this.body.nome,
    sobrenome: this.body.sobrenome,
    email: this.body.email,
    telefone: this.body.telefone,
  };
};

Contacto.prototype.edit = async function (id) {
  if (typeof id !== "string") return;
  this.valida();
  if (this.errors.length > 0) return;
  this.contact = await ContactModel.findByIdAndUpdate(id, this.body, {
    new: true,
  });
};

// Metodos estáticos
Contacto.buscaPorId = async function (id) {
  if (typeof id !== "string") return;
  const contact = await ContactModel.findById(id);
  return contact;
};

Contacto.buscaContactos = async function () {
  const contact = await ContactModel.find().sort({ criadoEm: -1 });
  return contact;
};

Contacto.delete = async function (id) {
  if (typeof id !== "string") return;
  const contact = await ContactModel.findOneAndDelete({ _id: id });
  return contact;
};

module.exports = Contacto;
