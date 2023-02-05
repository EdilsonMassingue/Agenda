require("dotenv").config();

const express = require("express");
const app = express();
const mongoose = require("mongoose");

mongoose.set("strictQuery", false);

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    app.emit("connected");
  })
  .catch((err) => {
    console.log(err);
  });

const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");

const routes = require("./routes");
const path = require("path");
const helmet = require("helmet");
const csrf = require("csurf");

const {
  middlewareGlobal,
  checkCsrf,
  csrfMiddleware,
} = require("./src/middlewares/middleware");

app.use(helmet());

app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.resolve(__dirname, "public")));

const sessionOptions = session({
  secret: process.env.SESSION_SECRET,
  store: MongoStore.create({ mongoUrl: process.env.MONGO_URI }),

  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 * 7, // 1 dia minutes
    httpOnly: true,
  },
});

app.use(sessionOptions);
app.use(flash());

app.set("views", path.resolve(__dirname, "src", "views"));
app.set("view engine", "ejs");

app.use(csrf());
// nossos middlewares
app.use(middlewareGlobal);
app.use(checkCsrf);
app.use(csrfMiddleware);
app.use(routes);

app.on("connected", () =>
  app.listen(3000, () => console.log(`Server runing on port 127.0.0.1:3000`))
);
