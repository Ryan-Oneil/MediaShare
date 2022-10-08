import { ParsedUrlQuery } from "querystring";
import { GetServerSideProps, NextApiRequest, NextApiResponse } from "next";
import { DASHBOARD_URL, LOGIN_URL } from "@/utils/urls";
import { getFirebaseAdmin } from "./FirebaseAdmin";

const getRedirectUrl = (currentPath: string) => {
  return `${LOGIN_URL}?redirect=${currentPath}`;
};

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
          destination: getRedirectUrl(ctx.resolvedUrl),
        },
      };
    }
    return getServerSidePropsFn(ctx);
  };

export const withRequestAuth = (handler: any) => {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    const jwt = req.cookies.jwt || req.headers.authorization;

    const user = await getUserIdFromJWT(jwt);

    if (!user) {
      return res.redirect(getRedirectUrl(req.url || DASHBOARD_URL));
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
