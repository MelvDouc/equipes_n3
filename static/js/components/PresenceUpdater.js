export default class PresenceUpdater extends HTMLInputElement {
  connectedCallback() {
    const handleChange = this.#getChangeHandler(+this.dataset.round, this.dataset.list);
    delete this.dataset.round;
    delete this.dataset.list;
    this.addEventListener("change", handleChange);
  }

  #getChangeHandler(round, list) {
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
  }
}