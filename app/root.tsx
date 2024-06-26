import { json, type LinksFunction, LoaderFunctionArgs } from "@remix-run/node";
import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useRouteError,
} from "@remix-run/react";
import { PropsWithChildren } from "react";
import { Toaster } from "sonner";

import { TooltipProvider } from "~/components/molecules/Tooltip";

import "./styles.css";

import { getUser } from "./.server/service/auth";
import GlobalError from "./components/organisms/GlobalError";

export const links: LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@100..800&family=Manrope:wght@200..800&family=Playfair+Display:ital,wght@0,400..900;1,400..900&display=swap",
  },
];

export const loader = async ({ request }: LoaderFunctionArgs) =>
  json({ user: await getUser(request) });

export function Layout({ children }: PropsWithChildren) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <TooltipProvider>
          <div className="grid min-h-[100dvh] w-full p-6 pb-16 lg:p-8 lg:pb-20">
            {children}
          </div>
          <Toaster position="bottom-right" theme="system" />
        </TooltipProvider>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}

export function ErrorBoundary() {
  const error = useRouteError();

  if (isRouteErrorResponse(error)) {
    switch (error.status) {
      case 401: {
        return (
          <GlobalError
            description="You attempted to access a resource that requires authentication, but you are not logged in or your session has expired."
            possibleReasons={[
              "You have not logged in to the application.",
              "Your session has expired due to inactivity.",
            ]}
            statusCode={401}
          />
        );
      }
      case 403: {
        return (
          <GlobalError
            description="You attempted to access a resource that you do not have permission to view."
            possibleReasons={[
              "Your account does not have the necessary permissions to access this resource.",
              "The requested resource is restricted to certain users or roles.",
            ]}
            statusCode={403}
          />
        );
      }
      case 404: {
        return (
          <GlobalError
            description="The requested resource could not be found on the server."
            possibleReasons={[
              "The URL entered is incorrect.",
              "The resource has been moved or deleted.",
            ]}
            statusCode={404}
          />
        );
      }
      default: {
        return (
          <GlobalError description={error.data} statusCode={error.status} />
        );
      }
    }
  } else if (error instanceof Error) {
    return (
      <GlobalError
        additionalMessage={error.stack}
        description={error.message}
      />
    );
  } else {
    return <GlobalError />;
  }
}
