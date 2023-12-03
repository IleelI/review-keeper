import { Cookie } from "@remix-run/node";

export const getCookieData = async (request: Request, cookie: Cookie) => {
  const cookieHeader = request.headers.get("Cookie");
  const parsedCookie = await cookie.parse(cookieHeader);
  return parsedCookie;
};

export const createEmptyCookie = async (cookie: Cookie) => {
  return await cookie.serialize("", {
    maxAge: 0,
  });
};

export const getAuthCookieHeaders = (
  accessToken: string,
  refreshToken: string,
) => {
  const authCookieHeaders = new Headers();
  authCookieHeaders.append("Set-Cookie", accessToken);
  authCookieHeaders.append("Set-Cookie", refreshToken);

  return authCookieHeaders;
};
