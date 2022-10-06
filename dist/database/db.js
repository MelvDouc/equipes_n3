import { MongoClient } from "mongodb";
import MongoStore from "connect-mongo";
async function Db() {
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
    return {
        db, store
    };
}
const { db, store } = await Db();
export default {
    collection: db.collection.bind(db),
    store
};
