import admin from "firebase-admin";
import dotenv from "dotenv";

dotenv.config();

const serviceAccountRaw = process.env.FIREBASE_SERVICE_ACCOUNT;

if (!serviceAccountRaw) {
  throw new Error("FIREBASE_SERVICE_ACCOUNT is missing in environment variables.");
}

// 1. Parse the string into an object
const serviceAccount = JSON.parse(serviceAccountRaw);

// 2. Fix the newline formatting
// We use optional chaining and a fallback to ensure we don't call .replace on undefined
if (serviceAccount && serviceAccount.private_key) {
  serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, "\n");
} else {
  throw new Error("The service account object is missing the 'private_key' property.");
}

// 3. Initialize the app
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

console.log("Firebase connected successfully!");

export default admin;