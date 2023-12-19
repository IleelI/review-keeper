import { LoaderFunctionArgs, redirect } from "@remix-run/node";

import {
  accessTokenCookie,
  createAccessToken,
  getUserToken,
  signOut,
  refreshTokenCookie,
  returnPathSearchParam,
} from "~/server/auth.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const searchParams = new URL(request.url).searchParams;
  const returnPath = searchParams.get(returnPathSearchParam) ?? "/";
  const cookies = request.headers.get("Cookie");
  const refreshToken = await refreshTokenCookie.parse(cookies);

  if (!refreshToken) throw await signOut();

  console.log({ refreshToken });
  const userToken = await getUserToken(refreshToken);
  console.log({ userToken });
  if (!userToken) throw await signOut();

  const accessToken = await createAccessToken(userToken);

  const headers = new Headers();
  headers.set("Set-Cookie", await accessTokenCookie.serialize(accessToken));

  return redirect(returnPath, { headers });
};
