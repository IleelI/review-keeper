import { Link } from "@remix-run/react";

import GlassCard from "~/components/atoms/GlassCard";

interface GlobalError {
  additionalMessage?: string;
  description?: string;
  possibleReasons?: string[];
  statusCode?: number;
}
const GlobalError = ({
  additionalMessage,
  description = "Unknown error.",
  possibleReasons,
  statusCode,
}: GlobalError) => (
  <GlassCard className="flex flex-col gap-8 px-20 py-16">
    <h1 className="text-5xl font-bold text-red-700 dark:text-red-300">
      Error! {statusCode ? `(${statusCode})` : null}
    </h1>

    <div className="flex flex-col gap-6">
      <section className="flex flex-col gap-4">
        <h2 className="text-xl font-medium text-neutral-900 dark:text-neutral-100">
          Description
        </h2>
        <p className="text-lg">{description}</p>
        {additionalMessage ? (
          <pre className="text-pretty">{additionalMessage}</pre>
        ) : null}
      </section>

      {possibleReasons?.length ? (
        <section className="flex flex-col gap-4">
          <h2 className="text-xl font-medium text-neutral-900 dark:text-neutral-100">
            Possible reasons
          </h2>

          <ul className="flex list-disc flex-col gap-2 pl-4 text-lg">
            {possibleReasons.map((possibleReason) => (
              <li key={possibleReason}>{possibleReason}</li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>

    <nav>
      <Link
        className="focus-visible::text-primary-600 text-xl font-semibold text-primary-700 underline underline-offset-4 transition hover:text-primary-600 dark:text-primary-300 dark:hover:text-primary-400 dark:focus-visible:text-primary-400"
        reloadDocument
        to="/"
      >
        Go to homepage
      </Link>
    </nav>
  </GlassCard>
);

export default GlobalError;
