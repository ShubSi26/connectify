import mongoose from "mongoose";
import { config } from "dotenv";

config();

const database: string = process.env.DATABASE || "";

mongoose.connect(database)
.then(() => console.log("MongoDB connected successfully"))
.catch((error) => console.error("MongoDB connection error:", error));

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
});

const User = mongoose.model("User", userSchema);

export default User;
