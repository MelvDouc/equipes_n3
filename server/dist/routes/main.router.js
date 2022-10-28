import { Router } from "express";
import db from "../database/db.js";
import { formatDate } from "../services/match.service.js";
import adminRouter from "./admin.router.js";
import apiRouter from "./api.router.js";
import Routes from "./Routes.js";
const mainRouter = Router();
const redirectIfNotLoggedIn = (req, res, next) => {
    if (!req.session.player)
        return res.redirect(Routes.LOGIN);
    next();
};
const home = async (req, res) => {
    if (!req.session.player)
        return res.redirect(Routes.LOGIN);
    const player = req.session.player;
    const matches = await db.matches.find().map((match) => {
        const { players, drivers, date, ...others } = match;
        return {
            ...others,
            date: formatDate(date),
            isPlaying: players.includes(player.ffeId),
            isDriving: drivers.includes(player.ffeId),
        };
    }).toArray();
    res.render("home", {
        player,
        matches
    });
};
mainRouter.use("/admin", adminRouter);
mainRouter.use("/api/v1", apiRouter);
mainRouter
    .get(Routes.HOME, redirectIfNotLoggedIn, home)
    .get(Routes.MATCHES, redirectIfNotLoggedIn, home);
mainRouter
    .route(Routes.LOGIN)
    .get((req, res) => {
    if (req.session.player) {
        req.flash("success", "Vous êtes déjà connecté(e).");
        return res.redirect(Routes.MATCHES);
    }
    return res.render("login");
})
    .post(async (req, res) => {
    const { email, code: password } = req.body;
    const player = await db.players.findOne({ email });
    if (!player || player.password !== password) {
        req.flash("errors", ["Identifiants incorrects."]);
        return res.redirect(Routes.LOGIN);
    }
    req.session.player = {
        email,
        ffeId: player.ffeId,
        role: player.role
    };
    req.flash("success", "Vous êtes à présent connecté(e).");
    res.redirect(Routes.HOME);
});
mainRouter
    .get(Routes.LOGOUT, (req, res) => {
    delete req.session.player;
    res.redirect(Routes.LOGIN);
})
    .get("*", (req, res) => {
    return res.status(404).render("404", { title: "Page non trouvée" });
});
export default mainRouter;
