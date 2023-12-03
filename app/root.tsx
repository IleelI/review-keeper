import { cssBundleHref } from "@remix-run/css-bundle";
import { json, LoaderFunctionArgs, type LinksFunction } from "@remix-run/node";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";

import { handleRootLoader } from "./server/root.server";
import tailwind from "./tailwind.css";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: tailwind },
  ...(cssBundleHref ? [{ rel: "stylesheet", href: cssBundleHref }] : []),
];

// Load user in root so every other route doesn't have to load it
// and can consume it via useMatches.
export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { headers, user } = await handleRootLoader(request);
  return json({ user }, { headers });
};

export default function App() {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
