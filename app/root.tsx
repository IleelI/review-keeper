import { LoaderFunctionArgs, type LinksFunction, json } from "@remix-run/node";
import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  isRouteErrorResponse,
  useRouteError,
} from "@remix-run/react";
import { PropsWithChildren } from "react";
import { Toaster } from "sonner";

import { getUser } from "./.server/auth";
import "./styles.css";
import Link from "./components/atoms/Link";

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
        {children}
        <ScrollRestoration />
        <Scripts />
        <Toaster richColors theme="system" />
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
          <div className=" grid min-h-screen content-center">
            <main className="mx-auto flex w-max max-w-full flex-col gap-6 rounded-lg border border-neutral-300 bg-neutral-50 px-6 py-4 md:max-w-2xl dark:border-neutral-700 dark:bg-neutral-800">
              <h1 className="text-3xl font-bold text-red-700 dark:text-red-300">
                Error!
              </h1>

              <div className="flex flex-col gap-4">
                <section className="flex flex-col gap-2">
                  <h2 className="text-lg font-medium text-neutral-900 dark:text-neutral-100">
                    Description
                  </h2>
                  <p>
                    You attempted to access a resource that requires
                    authentication, but you are not logged in or your session
                    has expired.
                  </p>
                </section>

                <section className="flex flex-col gap-2">
                  <h2 className="text-lg font-medium text-neutral-900 dark:text-neutral-100">
                    Possible reasons
                  </h2>
                  <ul className="flex list-disc flex-col gap-1 pl-4">
                    <li>You have not logged in to the application.</li>
                    <li>Your session has expired due to inactivity.</li>
                  </ul>
                </section>
              </div>

              <nav className="mt-4 grid grid-cols-2 gap-8">
                <Link to="/sign-up" variant="outlined">
                  Sign up
                </Link>
                <Link to="/sign-in" variant="filled">
                  Sign in
                </Link>
              </nav>
            </main>
          </div>
        );
      }
      case 403: {
        return (
          <div className=" grid min-h-screen content-center">
            <main className="mx-auto flex w-max max-w-full flex-col gap-6 rounded-lg border border-neutral-300 bg-neutral-50 px-6 py-4 md:max-w-2xl dark:border-neutral-700 dark:bg-neutral-800">
              <h1 className="text-3xl font-bold text-red-700 dark:text-red-300">
                Error!
              </h1>

              <div className="flex flex-col gap-4">
                <section className="flex flex-col gap-2">
                  <h2 className="text-lg font-medium text-neutral-900 dark:text-neutral-100">
                    Description
                  </h2>
                  <p>
                    You attempted to access a resource that you do not have
                    permission to view.
                  </p>
                </section>

                <section className="flex flex-col gap-2">
                  <h2 className="text-lg font-medium text-neutral-900 dark:text-neutral-100">
                    Possible reasons
                  </h2>
                  <ul className="flex list-disc flex-col gap-1 pl-4">
                    <li>
                      Your account does not have the necessary permissions to
                      access this resource.
                    </li>
                    <li>
                      The requested resource is restricted to certain users or
                      roles.
                    </li>
                  </ul>
                </section>
              </div>

              <nav className="mt-4 grid grid-cols-1 gap-8">
                <Link to="/" variant="filled">
                  Go Home
                </Link>
              </nav>
            </main>
          </div>
        );
      }
      case 404: {
        return (
          <div className=" grid min-h-screen content-center">
            <main className="mx-auto flex w-max max-w-full flex-col gap-6 rounded-lg border border-neutral-300 bg-neutral-50 px-6 py-4 md:max-w-2xl dark:border-neutral-700 dark:bg-neutral-800">
              <h1 className="text-3xl font-bold text-red-700 dark:text-red-300">
                Error!
              </h1>

              <div className="flex flex-col gap-4">
                <section className="flex flex-col gap-2">
                  <h2 className="text-lg font-medium text-neutral-900 dark:text-neutral-100">
                    Description
                  </h2>
                  <p>
                    The requested resource could not be found on the server.
                  </p>
                </section>

                <section className="flex flex-col gap-2">
                  <h2 className="text-lg font-medium text-neutral-900 dark:text-neutral-100">
                    Possible reasons
                  </h2>
                  <ul className="flex list-disc flex-col gap-1 pl-4">
                    <li>The URL entered is incorrect.</li>
                    <li>The resource has been moved or deleted.</li>
                  </ul>
                </section>
              </div>

              <nav className="mt-4 grid grid-cols-1 gap-8">
                <Link to="/" variant="filled">
                  Go Home
                </Link>
              </nav>
            </main>
          </div>
        );
      }
      default: {
        return (
          <div className=" grid min-h-screen content-center">
            <main className="mx-auto flex w-max max-w-full flex-col gap-6 rounded-lg border border-neutral-300 bg-neutral-50 px-6 py-4 md:max-w-2xl dark:border-neutral-700 dark:bg-neutral-800">
              <h1 className="text-3xl font-bold text-red-700 dark:text-red-300">
                {error.status} {error.statusText}
              </h1>

              <section className="flex flex-col gap-2">
                <h2 className="text-lg font-medium text-neutral-900 dark:text-neutral-100">
                  Description
                </h2>
                <p>
                  <p>{error.data}</p>
                </p>
              </section>

              <nav className="mt-4 grid grid-cols-1 gap-8">
                <Link to="/" variant="filled">
                  Go Home
                </Link>
              </nav>
            </main>
          </div>
        );
      }
    }
  } else if (error instanceof Error) {
    return (
      <div className=" grid min-h-screen content-center">
        <main className="mx-auto flex w-max max-w-full flex-col gap-6 rounded-lg border border-neutral-300 bg-neutral-50 px-6 py-4 md:max-w-2xl dark:border-neutral-700 dark:bg-neutral-800">
          <h1 className="text-3xl font-bold text-red-700 dark:text-red-300">
            Error!
          </h1>

          <section className="flex flex-col gap-2">
            <h2 className="text-lg font-medium text-neutral-900 dark:text-neutral-100">
              Description
            </h2>
            <p>
              <p>{error.message}</p>
            </p>
            <p>The stack trace is:</p>
            <pre className="text-pretty">{error.stack}</pre>
          </section>

          <nav className="mt-4 grid grid-cols-1 gap-8">
            <Link to="/" variant="filled">
              Go Home
            </Link>
          </nav>
        </main>
      </div>
    );
  } else {
    return (
      <div className=" grid min-h-screen content-center">
        <main className="mx-auto flex w-max max-w-full flex-col gap-6 rounded-lg border border-neutral-300 bg-neutral-50 px-6 py-4 md:max-w-2xl dark:border-neutral-700 dark:bg-neutral-800">
          <h1 className="text-3xl font-bold text-red-700 dark:text-red-300">
            Error!
          </h1>

          <section className="flex flex-col gap-2">
            <h2 className="text-lg font-medium text-neutral-900 dark:text-neutral-100">
              Description
            </h2>
            <p>
              <p>Unknown Error</p>
            </p>
          </section>

          <nav className="mt-4 grid grid-cols-1 gap-8">
            <Link to="/" variant="filled">
              Go Home
            </Link>
          </nav>
        </main>
      </div>
    );
  }
}
