var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _PresenceUpdater_instances, _PresenceUpdater_getChangeHandler;
export default class PresenceUpdater extends HTMLInputElement {
    constructor() {
        super(...arguments);
        _PresenceUpdater_instances.add(this);
    }
    connectedCallback() {
        const handleChange = __classPrivateFieldGet(this, _PresenceUpdater_instances, "m", _PresenceUpdater_getChangeHandler).call(this, +this.dataset.round, this.dataset.list);
        delete this.dataset.round;
        delete this.dataset.list;
        this.addEventListener("change", handleChange);
    }
}
_PresenceUpdater_instances = new WeakSet(), _PresenceUpdater_getChangeHandler = function _PresenceUpdater_getChangeHandler(round, list) {
    const changerHandler = () => fetch(location.origin + "/api/v1/modif-joueur", {
        method: "PATCH",
        mode: "cors",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            round,
            list,
            checked: this.checked
        })
    });
    return changerHandler.bind(this);
};
