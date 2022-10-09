const ADMIN = "/admin";
const API = "/api/v1";
const Routes = {
    HOME: "/",
    MATCHES: "/matchs",
    LOGIN: "/connexion",
    LOGOUT: "/deconnexion",
    API: {
        GET_PLAYER: API + "/voir-joueur/:email",
        UPDATE_PLAYER: API + "/modif-joueur",
    },
    ADMIN: {
        HOME: ADMIN,
        ADD_PLAYER: ADMIN + "/joueurs/ajouter",
        UPDATE_PLAYER: ADMIN + "/joueurs/modifier",
        DELETE_PLAYER: ADMIN + "/joueurs/supprimer",
        NOTIFY_PLAYERS: ADMIN + "/joueurs/notifier",
        PLAYERS: ADMIN + "/joueurs",
        ROUNDS: ADMIN + "/rondes",
    }
};
export default Routes;
