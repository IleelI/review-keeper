import Link from "~/components/atoms/Link";

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
  <article className="mx-auto flex w-max max-w-full flex-col gap-12 md:max-w-2xl">
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
      <Link className="px-8 py-3 text-xl font-bold" to="/" variant="filled">
        Go to homepage
      </Link>
    </nav>
  </article>
);

export default GlobalError;
