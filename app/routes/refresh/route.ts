import { LoaderFunctionArgs, redirect } from "@remix-run/node";

import {
  accessTokenCookie,
  createAccessToken,
  getUserToken,
  logout,
  refreshTokenCookie,
  returnPathSearchParam,
} from "~/server/auth.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const searchParams = new URL(request.url).searchParams;
  const returnPath = searchParams.get(returnPathSearchParam) ?? "/";
  const cookies = request.headers.get("Cookie");
  const refreshToken = await refreshTokenCookie.parse(cookies);

  if (!refreshToken) throw await logout();

  const userToken = await getUserToken(refreshToken);
  if (!userToken) throw await logout();

  const accessToken = await createAccessToken(userToken);

  const headers = new Headers();
  headers.set("Set-Cookie", await accessTokenCookie.serialize(accessToken));

  return redirect(returnPath, { headers });
};
