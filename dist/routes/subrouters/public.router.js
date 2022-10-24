import { Router } from "express";
import matchModel from "../../models/match.model.js";
import playerModel from "../../models/player.model.js";
import Routes from "../Routes.js";
const router = Router();
export const pageNotFound = (req, res) => {
    return res.status(404).render("404", { title: "Page non trouvée" });
};
const redirectIfNotLoggedIn = (req, res, next) => {
    if (!req.session.player)
        return res.redirect(Routes.LOGIN);
    next();
};
const home = async (req, res) => {
    if (!req.session.player)
        return res.redirect(Routes.LOGIN);
    const player = req.session.player;
    res.render("home", {
        player,
        matches: await matchModel.getPlayerMatches(player.email)
    });
};
router.get(Routes.HOME, redirectIfNotLoggedIn, home);
router.get(Routes.MATCHES, redirectIfNotLoggedIn, home);
router.route(Routes.LOGIN)
    .get((req, res) => {
    if (req.session.player) {
        console.log(req.session);
        req.flash("success", "Vous êtes déjà connecté(e).");
        return res.redirect(Routes.MATCHES);
    }
    return res.render("login");
})
    .post(async (req, res) => {
    const { email, code: password } = req.body;
    const player = await playerModel.findOne({ email });
    if (!player || player.password !== password) {
        req.flash("errors", ["Identifiants incorrects."]);
        return res.redirect(Routes.LOGIN);
    }
    req.session.player = {
        email,
        role: player.role
    };
    req.flash("success", "Vous êtes à présent connecté(e).");
    res.redirect(Routes.HOME);
});
router.get(Routes.LOGOUT, (req, res) => {
    delete req.session.player;
    res.redirect(Routes.LOGIN);
});
export default router;
