import { ParsedUrlQuery } from "querystring";
import {
  GetServerSideProps,
  GetServerSidePropsContext,
  NextApiRequest,
  NextApiResponse,
} from "next";
import { LOGIN_URL } from "../../utils/urls";
import { getFirebaseAdmin } from "./FirebaseAdmin";

export const withAuthentication =
  <P, Q extends ParsedUrlQuery = ParsedUrlQuery>(
    getServerSidePropsFn: GetServerSideProps<P, Q>
  ): GetServerSideProps<P, Q> =>
  async (ctx) => {
    const id = await getUserIdFromJWT(ctx.req.cookies.jwt);

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

export const withRequestAuth = (handler: any) => {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    const user = await getUserIdFromJWT(req.cookies.jwt);

    if (!user) {
      return res.redirect(LOGIN_URL);
    }
    return handler(req, res);
  };
};

export const getUserIdFromJWT = async (jwt: string | undefined) => {
  if (!jwt) {
    return "";
  }

  try {
    const token = await getFirebaseAdmin().auth().verifyIdToken(jwt);

    return token.uid;
  } catch (err) {
    console.log("Error verifying token: " + err);
    return "";
  }
};
