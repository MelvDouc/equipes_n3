import DeletePlayerForm from "./components/DeletePlayerForm.js";
import PresenceUpdater from "./components/PresenceUpdater.js";
import PlayerFetcher from "./components/PlayerFetcher.js";

customElements.define("presence-updater", PresenceUpdater, { extends: "input" });
customElements.define("delete-player-form", DeletePlayerForm, { extends: "form" });
customElements.define("player-fetcher", PlayerFetcher);