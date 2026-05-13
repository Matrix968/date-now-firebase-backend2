import admin from "firebase-admin";

/**
 * Vercel Environment Firebase Initializer
 */
const getFirebaseAdmin = () => {
  const serviceAccountVar = process.env.FIREBASE_SERVICE_ACCOUNT;

  if (!serviceAccountVar) {
    throw new Error(
      "FIREBASE_SERVICE_ACCOUNT is missing. " + 
      "Ensure you have redeployed after adding the variable to the Vercel Dashboard."
    );
  }

  try {
    // 1. Parse the JSON string from the environment variable
    const serviceAccount = JSON.parse(serviceAccountVar);

    // 2. Fix the private_key formatting (common Vercel/Newline issue)
    if (serviceAccount.private_key) {
      serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, "\n");
    }

    // 3. Prevent multiple initializations in Vercel's hot-reloading
    if (!admin.apps.length) {
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
      });
      console.log("✅ Firebase Admin successfully initialized.");
    }

    return admin;
  } catch (error) {
    console.error("❌ Firebase Initialization Error:", error.message);
    // Log helpful diagnostic info (without exposing secrets)
    console.log("String starts with:", serviceAccountVar.trim().substring(0, 10));
    throw error;
  }
};

const firebaseAdmin = getFirebaseAdmin();
export default firebaseAdmin;