import { MongoClient } from "mongodb";
import * as dotenv from 'dotenv' 
dotenv.config()

const connectionString = process.env.MONGO_URI;

if (!connectionString) {
  console.error("MONGO_URI environment variable is not set.");
  process.exit(1); // Exit with an error code
}

const client = new MongoClient(connectionString);

let conn;
try {
  conn = await client.connect();
  console.log("Connected to MongoDB");
} catch (e) {
  console.error("Error connecting to MongoDB:", e);
}

let db;
if (conn) {
  db = conn.db("test");
} else {
  console.error("Connection Failed, db variable is not set");
}

export default db;