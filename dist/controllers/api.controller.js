var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import Controller from "../core/Controller.js";
import matchModel from "../models/match.model.js";
import Routes from "../routes/Routes.js";
class ApiController extends Controller {
    async updatePlayer(req, res) {
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
    }
}
__decorate([
    Controller.Patch(Routes.API.UPDATE_PLAYER)
], ApiController.prototype, "updatePlayer", null);
export default new ApiController();
