import express from "express";
import session from "express-session";
import cookieParser from "cookie-parser";
import flash from "connect-flash";
import { config } from "dotenv";
import db from "./database/db.js";
import router from "./routes/router.js";
import Routes from "./routes/Routes.js";
import Controller from "./core/Controller.js";
const c = new Controller();
config();
const isProd = process.env.NODE_ENV === "production";
const port = process.env.PORT ?? 5050;
const app = express();
app.set("trust proxt", 1);
app.set("view engine", "pug");
app.locals.basedir = app.get("views");
app.locals.routes = Routes;
app.use(express.static("static"));
app.use(cookieParser());
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true,
    store: db.store,
    cookie: {
        secure: isProd,
        maxAge: 31536000000
    }
}));
app.use(flash());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(router);
app.listen(port, () => console.log(`App running on http://localhost:${port} ...`));
