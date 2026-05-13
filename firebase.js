import admin from "firebase-admin";
import dotenv from "dotenv";
dotenv.config();

// 1. Parse the string from .env into a JSON object
const serviceAccountRaw = process.env.FIREBASE_SERVICE_ACCOUNT;

if (!serviceAccountRaw) {
  throw new Error("FIREBASE_SERVICE_ACCOUNT is missing in .env");
}

const serviceAccount = JSON.parse(serviceAccountRaw);

// 2. Fix the newline formatting in the private key
serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, "\n");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

console.log("Firebase connected successfully!..");

export default admin;