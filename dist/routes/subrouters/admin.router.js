import { Router } from "express";
import matchModel from "../../models/match.model.js";
import playerModel from "../../models/player.model.js";
import Routes from "../Routes.js";
// import webScraperService from "../services/web-scraper.service.js";
const router = Router();
const trim = (input) => {
    if (input === undefined)
        return "";
    return input.trim();
};
const forbidden = (res) => {
    return res.status(403).send("<h1>403 Forbidden</h1>");
};
const getPlayer = (body) => {
    return {
        email: trim(body.email),
        ffeId: trim(body.ffeId),
        fideId: trim(body.fideId),
        lastName: trim(body.lastName),
        firstName: trim(body.firstName),
        phoneNumber: trim(body.phoneNumber),
        cat: trim(body.cat),
        refereeTitle: trim(body.refereeTitle) || null,
        role: parseInt(body.role),
        active: body.active === "active"
    };
};
const redirectWithError = (req, res, player, errors) => {
    req.flash("errors", errors);
    res.locals.temp_player = player;
    return res.redirect(req.headers.referer || "back");
};
const home = async (req, res) => {
    res.render("admin/home", {
        players: await playerModel.findAll().toArray()
    });
};
router.use((req, res, next) => {
    const player = req.session.player;
    if (!player || !playerModel.isAdmin(player))
        return forbidden(res);
    res.locals.player = player;
    res.locals.title = "Admin | Équipe Thionville";
    next();
});
router.get(Routes.ADMIN.HOME, home);
router.get(Routes.ADMIN.PLAYERS, home);
router.get(Routes.ADMIN.ROUNDS, async (req, res) => {
    const round = parseInt(req.query.rd);
    if (isNaN(round))
        return res.render("admin/rounds", {
            rounds: await matchModel.getRounds()
        });
    const match = await matchModel.getMatchByRound(round);
    return (match)
        ? res.render("admin/round", { match })
        : res.redirect(Routes.ADMIN.ROUNDS);
});
router.route(Routes.ADMIN.ADD_PLAYER)
    .get((req, res) => {
    const p = res.locals.temp_player ?? {};
    delete res.locals.temp_player;
    return res.render("admin/player-add", {
        p,
        roles: playerModel.getAllowedRoles(req.session.player.role)
    });
})
    .post(async (req, res) => {
    const player = getPlayer(req.body);
    if (isNaN(player.role) || player.role < req.session.player.role)
        return redirectWithError(req, res, player, ["Vous ne pouvez pas ajouter un joueur avec un rôle supérieur au vôtre."]);
    if (await playerModel.findOne({ email: player.email }))
        return redirectWithError(req, res, player, ["Adresse email indisponible."]);
    const errors = [...playerModel.getErrors(player)];
    if (errors.length)
        return redirectWithError(req, res, player, errors);
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
});
router.route(Routes.ADMIN.UPDATE_PLAYER)
    .get(async (req, res) => {
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
})
    .post(async (req, res) => {
    const dbPlayer = await playerModel.findOne({ ffeId: req.query.ffeId });
    if (!dbPlayer)
        return res.redirect(Routes.ADMIN.PLAYERS);
    const player = getPlayer(req.body);
    if (player.role < req.session.player.role)
        return redirectWithError(req, res, player, ["Vous n'êtes pas autorisé(e) à attribuer à un joueur un rôle supérieur au vôtre."]);
    if (player.email !== dbPlayer.email) {
        if (await playerModel.findOne({ email: player.email }))
            return redirectWithError(req, res, player, ["Adresse email indisponible."]);
    }
    const errors = [...playerModel.getErrors(player)];
    if (errors.length)
        return redirectWithError(req, res, player, errors);
    await playerModel.update(dbPlayer, player);
    req.flash("success", "Le joueur a bien été modifié.");
    return res.redirect(Routes.ADMIN.PLAYERS);
});
router.delete(Routes.ADMIN.DELETE_PLAYER, async (req, res) => {
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
});
export default router;
