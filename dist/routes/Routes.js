const ADMIN = "/admin";
const API = "/api/v1";
const Routes = {
    HOME: "/",
    MATCHES: "/matchs",
    LOGIN: "/connexion",
    LOGOUT: "/deconnexion",
    API: {
        UPDATE_PLAYER: API + "/modif-joueur",
        RATING: API + "/classement/:email",
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
