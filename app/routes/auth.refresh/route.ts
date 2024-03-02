import { LoaderFunctionArgs, redirect } from "@remix-run/node";

import {
  accessTokenCookie,
  createAccessToken,
  parseStringifiedToken,
  refreshTokenCookie,
  signOut,
} from "~/.server/service/auth";
import { prisma } from "~/.server/service/db";
import { getSafeRedirect } from "~/utils/routing/routing";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { searchParams } = new URL(request.url);
  const redirectTo = getSafeRedirect(searchParams.get("redirectTo"));

  const cookies = request.headers.get("Cookie");
  const stringifiedRefreshToken = await refreshTokenCookie.parse(cookies);
  const refreshToken = await parseStringifiedToken(stringifiedRefreshToken);

  if (!refreshToken) throw await signOut();

  const userExists = await prisma.user.findFirst({
    where: { id: refreshToken.id, refreshToken: stringifiedRefreshToken },
  });
  if (!userExists) throw await signOut();

  const headers = new Headers();
  const accessToken = await createAccessToken(refreshToken);
  headers.set("Set-Cookie", await accessTokenCookie.serialize(accessToken));
  return redirect(redirectTo, { headers });
};
