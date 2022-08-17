import * as firebaseAdmin from "firebase-admin";
import { GetServerSideProps, GetServerSidePropsContext } from "next";
import { LOGIN_URL } from "../../utils/urls";
import { ParsedUrlQuery } from "querystring";

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

export const withAuthentication =
  <P, Q extends ParsedUrlQuery = ParsedUrlQuery>(
    getServerSidePropsFn: GetServerSideProps<P, Q>
  ): GetServerSideProps<P, Q> =>
  async (ctx) => {
    const id = await getUserFromRequest(ctx);

    if (!id) {
      return {
        redirect: {
          permanent: false,
          destination: LOGIN_URL,
        },
      };
    }
    return getServerSidePropsFn(ctx);
  };

export const getUserFromRequest = async (
  context: GetServerSidePropsContext
) => {
  const cookies = context.req.cookies;

  console.log(cookies.jwt);
  if (!cookies.jwt) {
    return "";
  }

  try {
    const token = await getFirebaseAdmin().auth().verifyIdToken(cookies.jwt);

    console.log("The token is " + token);

    return token.uid;
  } catch (err) {
    console.log("Error verifying token: " + err);
    return "";
  }
};
