import express from "express";
import session from "express-session";
import cookieParser from "cookie-parser";
import flash from "connect-flash";
import db from "./database/db.js";
import mainRouter from "./routes/main.router.js";
import Routes from "./routes/Routes.js";
const isProd = process.env.NODE_ENV === "production";
if (!isProd)
    (await import("dotenv")).config();
const port = process.env.PORT ?? 5050;
const app = express();
console.dir(app);
app.set("trust proxy", 1);
app.set("view engine", "pug");
app.locals.basedir = app.get("views");
app.locals.routes = Routes;
app.use(express.static("views/static"));
app.use(cookieParser());
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true,
    store: db.store,
    cookie: {
        secure: isProd,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}));
app.use(flash());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(mainRouter);
app.listen(port, () => console.log(`App running on http://localhost:${port} ...`));
