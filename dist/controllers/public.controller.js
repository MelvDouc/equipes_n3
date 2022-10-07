var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import Controller from "../core/Controller.js";
import matchModel from "../models/match.model.js";
import playerModel from "../models/player.model.js";
import Routes from "../routes/Routes.js";
class PublicController extends Controller {
    redirectIfNotLoggedIn(req, res, next) {
        if (!req.session.player)
            return res.redirect(Routes.LOGIN);
        next();
    }
    async home(req, res) {
        if (!req.session.player)
            return res.redirect(Routes.LOGIN);
        const player = req.session.player;
        res.render("home", {
            player,
            matches: await matchModel.getPlayerMatches(player.email)
        });
    }
    login_GET(req, res) {
        if (req.session.player) {
            console.log(req.session);
            req.flash("success", "Vous êtes déjà connecté(e).");
            return res.redirect(Routes.MATCHES);
        }
        return res.render("login");
    }
    async login_POST(req, res) {
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
    }
    logout(req, res) {
        delete req.session.player;
        res.redirect(Routes.LOGIN);
    }
    pageNotFound(req, res) {
        return res.status(404).render("404", { title: "Page non trouvée" });
    }
}
__decorate([
    Controller.Get(Routes.HOME),
    Controller.Get(Routes.MATCHES)
], PublicController.prototype, "home", null);
__decorate([
    Controller.Get(Routes.LOGIN)
], PublicController.prototype, "login_GET", null);
__decorate([
    Controller.Post(Routes.LOGIN)
], PublicController.prototype, "login_POST", null);
__decorate([
    Controller.Get(Routes.LOGOUT)
], PublicController.prototype, "logout", null);
export default new PublicController();
