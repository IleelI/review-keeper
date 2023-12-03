import {
  accessTokenCookie,
  accessTokenCookieName,
  getInitialUserWithAccessToken,
  refreshTokenCookie,
} from "./auth.server";
import { createEmptyCookie, getAuthCookieHeaders } from "./cookie.server";

export const handleRootLoader = async (request: Request) => {
  const userWithAccessToken = await getInitialUserWithAccessToken(request);
  console.log({ userWithAccessToken });

  const serializedAccessToken = await createEmptyCookie(accessTokenCookie);
  const serializedRefreshToken = await createEmptyCookie(refreshTokenCookie);
  const authCookieHeaders = getAuthCookieHeaders(
    serializedAccessToken,
    serializedRefreshToken,
  );

  const accessTokenHeaders: HeadersInit = userWithAccessToken?.accessToken
    ? {
        "Set-Cookie": await accessTokenCookie.serialize({
          [accessTokenCookieName]: userWithAccessToken.accessToken,
        }),
      }
    : authCookieHeaders;

  return {
    headers: accessTokenHeaders,
    user: userWithAccessToken?.user,
  };
};
