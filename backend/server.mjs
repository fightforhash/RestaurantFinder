import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Import restaurant routes
import record from "./routes/record.js";
app.use("/api/restaurants", record);

// MongoDB connection with improved error handling
const mongoURI = process.env.MONGO_URI;
console.log("MONGO_URI:", process.env.MONGO_URI);
if (!mongoURI) {
    console.error("❌ MONGO_URI is not defined in .env file");
    process.exit(1); // Exit the process if no connection string is found
}

mongoose.connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log("✅ MongoDB Connected");
}).catch((err) => {
    console.error("❌ MongoDB connection error:", err.message);
    process.exit(1); // Exit process on connection failure
});

const PORT = process.env.PORT || 5050;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));