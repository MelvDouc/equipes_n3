export default class DeletePlayerForm extends HTMLFormElement {
  connectedCallback() {
    this.addEventListener("submit", async (e) => {
      e.preventDefault();
      if (!confirm("Cette action est irréversible. Êtes-vous sûr de vouloir continuer ?"))
        return;
      const response = await fetch(this.action, {
        method: "DELETE",
        mode: "cors"
      });
      const deletion = await response.json();
      if (!deletion.success)
        return alert("Vous ne pouvez pas supprimer ce joueur.");
      window.location.reload();
    });
  }
}