import "core-js/stable";
import "regenerator-runtime";

import Login from "./modules/Login";

const login = new Login(".form-login");
const cadastro = new Login(".form-cadastro");
login.init();
cadastro.init();

console.log("Heeee Loooo");
