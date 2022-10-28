import { validate } from "email-validator";
import db from "../database/db.js";
import crypto from "crypto";
var Roles;
(function (Roles) {
    Roles[Roles["SUPER_ADMIN"] = 0] = "SUPER_ADMIN";
    Roles[Roles["ADMIN"] = 1] = "ADMIN";
    Roles[Roles["JOUEUR"] = 2] = "JOUEUR";
})(Roles || (Roles = {}));
const collection = db.collection("players");
const createPassword = () => {
    let password = "";
    while (password.length < 5)
        password += String.fromCharCode(~~(Math.random() * (90 - 65 + 1)) + 65);
    return password;
};
const getAllowedRoles = (playerRole) => {
    return Object.keys(Roles).reduce((acc, role) => {
        if (isNaN(+role) && playerRole <= +Roles[role])
            acc.push([+Roles[role], role]);
        return acc;
    }, []);
};
const isAdmin = (player) => player.role <= Roles.ADMIN;
function* getErrors(player) {
    if (!validate(player.email))
        yield "Adresse email non valide.";
    if (!/^[A-Z]\d{1,5}$/.test(player.ffeId))
        yield "N° FFE non valide.";
    if (!player.lastName)
        yield "Nom de famille requis.";
    if (!player.firstName)
        yield "Prénom requis.";
}
export default {
    getAllowedRoles,
    collection,
    createPassword,
    findOne: collection.findOne.bind(collection),
    findAll: collection.find.bind(collection),
    insert: async (player) => collection.insertOne({ ...player, password: crypto.randomBytes(8).toString() }),
    getErrors,
    update: (dbPlayer, updates) => {
        const $set = {};
        let key;
        for (key in updates)
            if (updates[key] !== dbPlayer[key])
                $set[key] = updates[key];
        console.log(dbPlayer, $set);
        return collection.updateOne({ _id: dbPlayer._id }, { $set });
    },
    delete: collection.findOneAndDelete.bind(collection),
    isAdmin
};
