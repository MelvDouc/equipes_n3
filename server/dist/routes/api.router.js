import webScraperService from "../services/web-scraper.service.js";
import Routes from "./Routes.js";
import { Router } from "express";
import db from "../database/db.js";
const router = Router();
router.get(Routes.GET_PLAYER, async (req, res) => {
    const { email } = req.params;
    const player = await db.players.findOne({ email });
    if (!player)
        return res.json(null);
    const rating = await webScraperService.fetchRating(player.fideId);
    return res.json({
        ffeId: player.ffeId,
        email: player.email,
        firstName: player.firstName,
        lastName: player.lastName,
        fideId: player.fideId,
        phoneNumber: player.phoneNumber,
        cat: player.cat,
        active: player.active,
        rating: rating,
    });
});
router.patch(Routes.UPDATE_PLAYER, async (req, res) => {
    if (!req.session?.player)
        return res.json({ success: false });
    const { round, list, checked } = req.body;
    const { ffeId } = req.session.player;
    if (list !== "players" && list !== "drivers")
        return res.json({ success: false });
    await db.matches.findOneAndUpdate({ round }, {
        [checked ? "$push" : "$pull"]: {
            [list]: ffeId
        }
    });
    return res.json({ success: true });
});
export default router;
