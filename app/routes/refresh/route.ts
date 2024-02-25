import { LoaderFunctionArgs, redirect } from "@remix-run/node";

import {
  accessTokenCookie,
  createAccessToken,
  getUserToken,
  signOut,
  refreshTokenCookie,
} from "~/.server/auth";
import { getSafeRedirect } from "~/utils/routing/routing";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { searchParams } = new URL(request.url);
  const redirectTo = getSafeRedirect(searchParams.get("redirectTo"));

  const cookies = request.headers.get("Cookie");
  const refreshToken = await refreshTokenCookie.parse(cookies);

  if (!refreshToken) throw await signOut();

  const userToken = await getUserToken(refreshToken);
  if (!userToken) throw await signOut();

  const headers = new Headers();
  const accessToken = await createAccessToken(userToken);
  headers.set("Set-Cookie", await accessTokenCookie.serialize(accessToken));
  return redirect(redirectTo, { headers });
};
