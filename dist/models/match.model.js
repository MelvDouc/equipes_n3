import db from "../database/db.js";
import Player from "./player.model.js";
const collection = db.collection("matches");
const dateFormatter = new Intl.DateTimeFormat("fr-Fr", {
    weekday: "long",
    day: "2-digit",
    month: "2-digit",
    year: "numeric"
});
const formatDate = (dateString) => {
    return dateFormatter.format(new Date(dateString));
};
const addPlayer = (round, list, email) => collection.findOneAndUpdate({ round }, {
    $push: {
        [list]: email
    }
});
const removePlayer = (round, list, email) => collection.findOneAndUpdate({ round }, {
    $pull: {
        [list]: email
    }
});
const getPlayerMatches = (email) => (collection
    .find()
    .map((match) => {
    const { _id, date, players, drivers, ...others } = match;
    return {
        isPlaying: players.includes(email),
        isDriving: drivers.includes(email),
        date: formatDate(date),
        ...others
    };
})
    .sort({ round: -1 })
    .toArray());
const getTeams = async () => {
    const playersRecord = (await Player.findAll().toArray()).reduce((acc, player) => {
        acc[player.email] = player;
        return acc;
    }, {});
    return collection.find().map((match) => {
        const { _id, date, players, drivers, ...props } = match;
        return {
            date: formatDate(date),
            players: players.map(p => playersRecord[p]),
            drivers: drivers.map(p => playersRecord[p]),
            ...props
        };
    }).toArray();
};
export default {
    addPlayer,
    removePlayer,
    getMatchByRound: (round) => collection.find({ round }).tryNext(),
    getRounds: () => collection.find().map((match) => match.round).sort({ round: 1 }).toArray(),
    getPlayerMatches,
    getTeams
};
