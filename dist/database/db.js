import { MongoClient } from "mongodb";
import MongoStore from "connect-mongo";
import { config } from "dotenv";
config();
const uri = process.env.DB_URI;
const client = new MongoClient(uri);
await client.connect();
console.log("Database connected.");
const store = MongoStore.create({
    mongoUrl: uri
});
const db = client.db(process.env.DB_NAME);
export default {
    collection: db.collection.bind(db),
    store
};
