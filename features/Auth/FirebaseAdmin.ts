import * as firebaseAdmin from "firebase-admin";

if (!firebaseAdmin.apps.length) {
  firebaseAdmin.initializeApp({
    credential: firebaseAdmin.credential.cert({
      privateKey: JSON.parse(process.env.firebase_private_key || ""),
      clientEmail: process.env.firebase_client_email,
      projectId: process.env.firebase_project_id,
    }),
  });
}
export { firebaseAdmin };
