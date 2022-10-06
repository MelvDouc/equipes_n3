import DeletePlayerForm from "./components/DeletePlayerForm.js";
import PresenceUpdater from "./components/PresenceUpdater.js";

customElements.define("presence-updater", PresenceUpdater, { extends: "input" });
customElements.define("delete-player-form", DeletePlayerForm, { extends: "form" });

console.log("branch 2!");