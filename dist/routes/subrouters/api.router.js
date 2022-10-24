import matchModel from "../../models/match.model.js";
import playerModel from "../../models/player.model.js";
import webScraperService from "../../services/web-scraper.service.js";
import Routes from "../Routes.js";
import { Router } from "express";
const router = Router();
router.get(Routes.API.GET_PLAYER, async (req, res) => {
    const { email } = req.params;
    const player = await playerModel.collection.findOne({ email });
    if (!player)
        return res.json(null);
    const rating = await webScraperService.fetchRating(player.fideId);
    player.rating = rating;
    delete player._id;
    delete player.token;
    delete player.password;
    return res.json(player);
});
router.patch(Routes.API.UPDATE_PLAYER, async (req, res) => {
    if (!req.session?.player)
        return res.json({ success: false });
    const { round, list, checked } = req.body;
    const { email } = req.session.player;
    if (list !== "players" && list !== "drivers")
        return res.json({ success: false });
    (checked)
        ? await matchModel.addPlayer(round, list, email)
        : await matchModel.removePlayer(round, list, email);
    return res.json({ success: true });
});
export default router;
