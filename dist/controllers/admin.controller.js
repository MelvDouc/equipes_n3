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
import { notifyPlayer } from "../services/email.service.js";
class AdminController extends Controller {
    trim(input) {
        if (input === undefined)
            return "";
        return input.trim();
    }
    forbidden(res) {
        return res.status(403).send("<h1>403 Forbidden</h1>");
    }
    getPlayer(body) {
        return {
            email: this.trim(body.email),
            ffeId: this.trim(body.ffeId),
            fideId: this.trim(body.fideId),
            lastName: this.trim(body.lastName),
            firstName: this.trim(body.firstName),
            phoneNumber: this.trim(body.phoneNumber),
            cat: this.trim(body.cat),
            refereeTitle: this.trim(body.refereeTitle) || null,
            role: parseInt(body.role),
            active: body.active === "active"
        };
    }
    redirectWithError(req, res, player, errors) {
        req.flash("errors", errors);
        res.locals.temp_player = player;
        return res.redirect(req.headers.referer || "back");
    }
    allowOnlyAdmin(req, res, next) {
        const player = req.session.player;
        if (!player || !playerModel.isAdmin(player))
            return this.forbidden(res);
        res.locals.player = player;
        res.locals.title = "Admin | Équipe Thionville";
        next();
    }
    async rounds(req, res) {
        const round = parseInt(req.query.rd);
        if (isNaN(round))
            return res.render("admin/rounds", {
                rounds: await matchModel.getRounds()
            });
        const match = await matchModel.getMatchByRound(round);
        if (!match)
            return res.redirect(Routes.ADMIN.ROUNDS);
        return res.render("admin/round", { match });
    }
    addPlayer_GET(req, res) {
        const p = res.locals.temp_player ?? {};
        delete res.locals.temp_player;
        return res.render("admin/player-add", {
            p,
            roles: playerModel.getAllowedRoles(req.session.player.role)
        });
    }
    async addPlayer_POST(req, res) {
        const player = this.getPlayer(req.body);
        if (isNaN(player.role) || player.role < req.session.player.role)
            return this.redirectWithError(req, res, player, ["Vous ne pouvez pas ajouter un joueur avec un rôle supérieur au vôtre."]);
        if (await playerModel.findOne({ email: player.email }))
            return this.redirectWithError(req, res, player, ["Adresse email indisponible."]);
        const errors = [...playerModel.getErrors(player)];
        if (errors.length)
            return this.redirectWithError(req, res, player, errors);
        try {
            await playerModel.insert(player);
            req.flash("success", "Le joueur a bien été enregistré.");
        }
        catch (error) {
            console.log(error);
        }
        finally {
            return res.redirect(Routes.ADMIN.PLAYERS);
        }
    }
    async updatePlayer_GET(req, res) {
        const temp_player = res.locals.temp_player ?? (await playerModel.findOne({ ffeId: req.query.ffeId }));
        delete res.locals.temp_player;
        if (!temp_player) {
            req.flash("errors", ["Joueur non trouvé."]);
            return res.redirect(Routes.ADMIN.PLAYERS);
        }
        return res.render("admin/player-update", {
            p: temp_player,
            roles: playerModel.getAllowedRoles(req.session.player.role)
        });
    }
    async updatePlayer_POST(req, res) {
        const { ffeId } = req.query;
        const dbPlayer = await playerModel.findOne({ ffeId });
        if (!dbPlayer)
            return res.redirect(Routes.ADMIN.PLAYERS);
        const player = this.getPlayer(req.body);
        if (player.role < req.session.player.role)
            return this.redirectWithError(req, res, player, ["Vous n'êtes pas autorisé(e) à attribuer à un joueur un rôle supérieur au vôtre."]);
        if (player.email !== dbPlayer.email) {
            if (await playerModel.findOne({ email: player.email }))
                return this.redirectWithError(req, res, player, ["Adresse email indisponible."]);
        }
        const errors = [...playerModel.getErrors(player)];
        if (errors.length)
            return this.redirectWithError(req, res, player, errors);
        await playerModel.update(dbPlayer, player);
        req.flash("success", "Le joueur a bien été modifié.");
        return res.redirect(Routes.ADMIN.PLAYERS);
    }
    async deletePlayer(req, res) {
        try {
            const player = await playerModel.findOne({ ffeId: req.query.ffeId });
            if (!player || player.email === req.session.player.email || !(player.role > req.session.player.role))
                return res.json({ success: false });
            await playerModel.delete({ ffeId: req.query.ffeId });
            return res.json({ success: true });
        }
        catch (error) {
            return res.json({ success: false });
        }
    }
    async notifyPlayers(req, res) {
        if (req.session.player?.role !== 0)
            return this.forbidden(res);
        for await (const player of playerModel.collection.find())
            if (player.firstName === "Melvin")
                await notifyPlayer(player);
        req.flash("success", "Les joueurs ont bien été notifiés.");
        return res.redirect(Routes.ADMIN.PLAYERS);
    }
    async home(req, res) {
        res.render("admin/home", {
            players: await playerModel.findAll().toArray()
        });
    }
}
__decorate([
    Controller.Middleware
], AdminController.prototype, "allowOnlyAdmin", null);
__decorate([
    Controller.Get(Routes.ADMIN.ROUNDS)
], AdminController.prototype, "rounds", null);
__decorate([
    Controller.Get(Routes.ADMIN.ADD_PLAYER)
], AdminController.prototype, "addPlayer_GET", null);
__decorate([
    Controller.Post(Routes.ADMIN.ADD_PLAYER)
], AdminController.prototype, "addPlayer_POST", null);
__decorate([
    Controller.Get(Routes.ADMIN.UPDATE_PLAYER)
], AdminController.prototype, "updatePlayer_GET", null);
__decorate([
    Controller.Post(Routes.ADMIN.UPDATE_PLAYER)
], AdminController.prototype, "updatePlayer_POST", null);
__decorate([
    Controller.Delete(Routes.ADMIN.DELETE_PLAYER)
], AdminController.prototype, "deletePlayer", null);
__decorate([
    Controller.Post(Routes.ADMIN.NOTIFY_PLAYERS)
], AdminController.prototype, "notifyPlayers", null);
__decorate([
    Controller.Get(Routes.ADMIN.PLAYERS),
    Controller.Get(Routes.ADMIN.HOME)
], AdminController.prototype, "home", null);
export default new AdminController();
