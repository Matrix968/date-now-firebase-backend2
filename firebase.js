import admin from "firebase-admin";
import dotenv from "dotenv";

dotenv.config();

const initializeFirebase = () => {
  const serviceAccountRaw = process.env.FIREBASE_SERVICE_ACCOUNT;

  if (!serviceAccountRaw) {
    throw new Error("FIREBASE_SERVICE_ACCOUNT is missing from environment variables.");
  }

  try {
    // 1. Parse the JSON
    const serviceAccount = JSON.parse(serviceAccountRaw);

    /**
     * 2. Extract and sanitize the private key.
     * The SDK requires the key 'private_key' (snake_case).
     * We also fix common escaping issues found in CI/CD and .env files.
     */
    let pKey = serviceAccount.private_key || serviceAccount.privateKey;

    if (!pKey) {
      throw new Error("No private key found in the service account object.");
    }

    // Replace literal '\n' strings with actual newline characters
    serviceAccount.private_key = pKey.replace(/\\n/g, '\n');

    // 3. Initialize the app if not already initialized
    if (admin.apps.length === 0) {
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
      });
      console.log("✅ Firebase Admin initialized successfully.");
    }

    return admin;
  } catch (error) {
    console.error("❌ Firebase Initialization Error:", error.message);
    // Log the first few characters of the raw string to debug (DO NOT log the whole key)
    console.log("Raw String Start:", serviceAccountRaw.substring(0, 30));
    throw error;
  }
};

const firebaseAdmin = initializeFirebase();

export default firebaseAdmin;