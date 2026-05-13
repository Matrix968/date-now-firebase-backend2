import admin from "firebase-admin";
import dotenv from "dotenv";

// Initialize dotenv
dotenv.config();

const initializeAdmin = () => {
  const serviceAccountVar = process.env.FIREBASE_SERVICE_ACCOUNT;

  if (!serviceAccountVar) {
    throw new Error(
      "FIREBASE_SERVICE_ACCOUNT is undefined. " +
      "If local: check your .env file. " +
      "If production: add the variable to your hosting dashboard."
    );
  }

  try {
    // If the string starts with '{', treat it as a JSON string
    const serviceAccount = serviceAccountVar.startsWith("{") 
      ? JSON.parse(serviceAccountVar) 
      : JSON.parse(Buffer.from(serviceAccountVar, 'base64').toString()); // Fallback for base64 encoded keys

    // Crucial: Fix the escaped newlines in the private key
    if (serviceAccount.private_key) {
      serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, "\n");
    }

    if (!admin.apps.length) {
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
      });
    }

    console.log("🚀 Firebase Admin connected successfully.");
    return admin;
  } catch (error) {
    console.error("❌ Failed to parse Service Account JSON:", error.message);
    throw error;
  }
};

const firebaseAdmin = initializeAdmin();
export default firebaseAdmin;