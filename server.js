import admin from "./firebase.js";
import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());

// --- SIGNUP ---
app.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!email || !name || !password) {
      return res
        .status(400)
        .json({ Error: "email name and password required" });
    }

    const userRecord = await admin.auth().createUser({
      displayName: name,
      email,
      password,
    });

    res.status(200).json({
      message: "user created successfully",
      uid: userRecord.uid,
      email: userRecord.email,
    });
  } catch (err) {
    console.error(err);
    res.status(400).json({ err: err.message });
  }
});

// --- LIST USERS ---
app.get("/users", async (req, res) => {
  try {
    const listUsers = await admin.auth().listUsers(1000);
    const users = listUsers.users.map((user) => ({
      uid: user.uid,
      email: user.email,
      name: user.displayName,
      createdAt: user.metadata.creationTime,
    }));
    res.status(200).json({
      success: true,
      totalUsers: users.length,
      users,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// --- DELETE USER ---
app.delete("/users/:uid", async (req, res) => {
  try {
    await admin.auth().deleteUser(req.params.uid);
    res.json({ message: "user deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- UPDATE USER ---
app.patch("/update-user/:uid", async (req, res) => {
  try {
    const { uid } = req.params; // Get UID from URL params
    const { email, password, displayName } = req.body;

    const updatedUser = await admin.auth().updateUser(uid, {
      email,
      password,
      displayName,
    });

    res.json({
      message: "User updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
