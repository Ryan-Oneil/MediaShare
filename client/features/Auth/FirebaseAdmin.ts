import * as firebaseAdmin from "firebase-admin";
import { GetServerSidePropsContext } from "next";
import { LOGIN_URL } from "../../utils/urls";

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

export const getUserFromRequest = async (
  context: GetServerSidePropsContext
): Promise<string> => {
  try {
    const cookies = context.req.cookies;
    const token = await getFirebaseAdmin()
      .auth()
      .verifyIdToken(cookies.jwt || "");

    return token.uid;
  } catch (err) {
    context.res.writeHead(302, { Location: LOGIN_URL });
    context.res.end();
  }
  throw new Error("Something went wrong during authentication");
};
