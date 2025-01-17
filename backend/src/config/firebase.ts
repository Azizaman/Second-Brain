import admin from "firebase-admin";
import path from "path";
import { fileURLToPath } from "url";
import serviceAccountKey from "../../serviceAccountKey.json" assert { type: "json" };

// Define __dirname manually
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Type assertion for serviceAccountKey
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccountKey as admin.ServiceAccount), // Cast to ServiceAccount
  });
}

const auth = admin.auth(); // Firebase Auth reference
export { auth };
