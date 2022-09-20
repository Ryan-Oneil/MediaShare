import * as firebaseAdmin from "firebase-admin";

export const getFirebaseAdmin = () => {
  if (!firebaseAdmin.apps.length) {
    firebaseAdmin.initializeApp({
      credential: firebaseAdmin.credential.cert({
        privateKey: JSON.parse(process.env.firebase_private_key as string),
        clientEmail: process.env.firebase_client_email,
        projectId: process.env.firebase_project_id,
      }),
    });
  }
  return firebaseAdmin;
};
