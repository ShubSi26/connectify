import mongoose from "mongoose";
import { config } from "dotenv";

config();

const database: string = process.env.DATABASE || "";

mongoose.connect(database)
  .then(() => console.log("MongoDB connected successfully"))
  .catch((error) => console.error("MongoDB connection error:", error));

// Create a schema for the contact
const contactSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    name: { type: String, required: true },
    email: { type: String, required: true },
});

// Create models
const Contact = mongoose.model("Contact", contactSchema);

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    contacts: [contactSchema],  // Use the contact schema here
});

const User = mongoose.model("User", userSchema);

export default User;
