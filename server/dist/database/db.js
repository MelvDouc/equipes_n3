import { MongoClient } from "mongodb";
import MongoStore from "connect-mongo";
if (process.env.NODE_ENV !== "production")
    (await import("dotenv")).config();
const uri = process.env.DB_URI;
const client = new MongoClient(uri);
await client.connect();
console.log("Database connected.");
const store = MongoStore.create({
    mongoUrl: uri
});
const db = client.db(process.env.DB_NAME);
export default {
    players: db.collection("players"),
    matches: db.collection("matches"),
    store
};
