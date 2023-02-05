const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const bcryptjs = require("bcryptjs");

const LoginSchema = new mongoose.Schema({
  email: { type: String, required: true },
  password: { type: String, required: true },
});

const LoginModel = mongoose.model("Login", LoginSchema);

class Login {
  constructor(body) {
    this.body = body;
    this.errors = [];
    this.user = null;
  }

  async login() {
    this.valida();
    if (this.errors.length > 0) return;

    this.user = await LoginModel.findOne({ email: this.body.email });

    if (!this.user) {
      this.errors.push({ msg: "Usuário não encontrado!" });
      return;
    }

    if (!bcrypt.compareSync(this.body.password, this.user.password)) {
      this.errors.push({ msg: "Senha incorreta!" });
      this.user = null;

      return;
    }
  }

  async register() {
    this.valida();
    if (this.errors.length > 0) return;

    await this.userExists();
    if (this.errors.length > 0) return;

    const salt = bcryptjs.genSaltSync();
    this.body.password = await bcrypt.hash(this.body.password, salt);

    this.user = await LoginModel.create(this.body);
  }

  async userExists() {
    this.user = await LoginModel.findOne({ email: this.body.email });

    if (this.user) {
      this.errors.push("Usuario já cadastrado");
    }
  }

  valida() {
    this.cleanUp();

    // Validate
    // the email field needs to be validated
    if (!validator.isEmail(this.body.email)) {
      this.errors.push("Email inválido");

      //The password field needs to be validated
      if (this.body.password.length < 3 || this.body.password.length > 50) {
        this.errors.push("Invalido password");
      }
    }
  }

  cleanUp() {
    for (const key in this.body) {
      if (typeof this.body[key] !== "string") {
        this.body[key] = "";
      }
    }

    this.body = {
      email: this.body.email,
      password: this.body.password,
    };
  }
}

module.exports = Login;
