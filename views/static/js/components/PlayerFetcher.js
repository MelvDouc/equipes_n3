export default class PlayerFetcher extends HTMLElement {
    async connectedCallback() {
        const response = await fetch(location.origin + `/api/v1/voir-joueur/${this.dataset.email}`);
        const player = await response.json();
        if (!player)
            return;
        this.innerHTML = `
      <span>${player.firstName} ${player.lastName}</span>
      <span>${player.rating}</span>
    `;
        this.dataset.rating = String(player.rating);
        const fetchers = [...this.closest(".players").querySelectorAll("[data-rating]")];
        for (let i = 0; i < fetchers.length; i++) {
            for (let j = i + 1; j < fetchers.length; j++) {
                const player1 = fetchers[i], player2 = fetchers[j];
                if (+player1.dataset.rating < +player2.dataset.rating)
                    player2.after(player1);
            }
        }
    }
}
