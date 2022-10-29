import { Router } from "express";
import db from "../database/db.js";
import { Roles, getAllowedRoles } from "../services/player.service.js";
import Routes from "./Routes.js";
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
        players: await db.players.find().toArray()
    });
};
router.use((req, res, next) => {
    const player = req.session.player;
    if (!player || player.role > Roles.ADMIN)
        return forbidden(res);
    res.locals.player = player;
    res.locals.title = "Admin | Équipe Thionville";
    next();
});
router
    .get(Routes.HOME, home)
    .get(Routes.PLAYERS, home)
    .get(Routes.ROUNDS, async (req, res) => {
    const round = parseInt(req.query.round);
    if (isNaN(round))
        return res.render("admin/rounds", {
            rounds: await db.matches.find().sort({ round: 1 }).toArray()
        });
});
router.route(Routes.ADD_PLAYER)
    .get((req, res) => {
    const p = res.locals.temp_player ?? {};
    delete res.locals.temp_player;
    return res.render("admin/player-add", {
        p,
        roles: getAllowedRoles(req.session.player.role)
    });
})
    .post(async (req, res) => {
    const player = getPlayer(req.body);
    if (isNaN(player.role) || player.role < req.session.player.role)
        return redirectWithError(req, res, player, ["Vous ne pouvez pas ajouter un joueur avec un rôle supérieur au vôtre."]);
    if (await db.players.findOne({ email: player.email }))
        return redirectWithError(req, res, player, ["Adresse email indisponible."]);
    // const errors = [...playerModel.getErrors(player)];
    // if (errors.length)
    //   return redirectWithError(req, res, player, errors);
    try {
        await db.players.insertOne(player);
        req.flash("success", "Le joueur a bien été enregistré.");
    }
    catch (error) {
        console.log(error);
    }
    finally {
        return res.redirect(`/admin${Routes.PLAYERS}`);
    }
});
router
    .route(Routes.UPDATE_PLAYER)
    .get(async (req, res) => {
    const temp_player = res.locals.temp_player ?? (await db.players.findOne({ ffeId: req.query.ffeId }));
    delete res.locals.temp_player;
    if (!temp_player) {
        req.flash("errors", ["Joueur non trouvé."]);
        return res.redirect(`/admin${Routes.PLAYERS}`);
    }
    return res.render("admin/player-update", {
        p: temp_player,
        roles: getAllowedRoles(req.session.player.role)
    });
})
    .post(async (req, res) => {
    const dbPlayer = await db.players.findOne({ ffeId: req.query.ffeId });
    if (!dbPlayer)
        return res.redirect(`/admin${Routes.PLAYERS}`);
    const player = getPlayer(req.body);
    if (player.role < req.session.player.role)
        return redirectWithError(req, res, player, ["Vous n'êtes pas autorisé(e) à attribuer à un joueur un rôle supérieur au vôtre."]);
    if (player.email !== dbPlayer.email) {
        if (await db.players.findOne({ email: player.email }))
            return redirectWithError(req, res, player, ["Adresse email indisponible."]);
    }
    // const errors = [...playerModel.getErrors(player)];
    // if (errors.length)
    //   return redirectWithError(req, res, player, errors);
    await db.players.updateOne({ ffeId: dbPlayer.ffeId }, { $set: { ...player } });
    req.flash("success", "Le joueur a bien été modifié.");
    return res.redirect(`/admin${Routes.PLAYERS}`);
});
router.delete(Routes.DELETE_PLAYER, async (req, res) => {
    try {
        const player = await db.players.findOne({ ffeId: req.query.ffeId });
        if (!player || player.email === req.session.player.email || !(player.role > req.session.player.role))
            return res.json({ success: false });
        await db.players.deleteOne({ ffeId: req.query.ffeId });
        return res.json({ success: true });
    }
    catch (error) {
        return res.json({ success: false });
    }
});
export default router;
