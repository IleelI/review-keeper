import { Link } from "@remix-run/react";
import { ElementType, PropsWithChildren } from "react";

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
  <div className="grid lg:place-content-center">
    <article className="relative flex flex-col gap-6 pt-8 lg:w-[480px] lg:gap-12 lg:pt-0">
      <h1 className="flex flex-col gap-1 text-3xl font-bold text-red-700 lg:text-4xl dark:text-red-300">
        Error! {statusCode ? `(${statusCode})` : null}
      </h1>

      <div className="flex flex-col gap-8">
        <section className="flex flex-col gap-3">
          <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100">
            Description
          </h2>
          <InfoCard>{description}</InfoCard>
        </section>

        {additionalMessage ? (
          <section className="flex flex-col gap-3">
            <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100">
              Additional Information
            </h2>
            <InfoCard tag="pre">{additionalMessage}</InfoCard>
          </section>
        ) : null}

        {possibleReasons?.length ? (
          <section className="flex flex-col gap-3">
            <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100">
              Possible reasons
            </h2>
            <ul className="flex flex-col gap-2">
              {possibleReasons.map((possibleReason) => (
                <InfoCard key={possibleReason} tag="li">
                  {possibleReason}
                </InfoCard>
              ))}
            </ul>
          </section>
        ) : null}
      </div>

      <nav className="mt-auto">
        <Link
          className="flex w-full items-center justify-center rounded-lg bg-primary-700 px-6 py-1.5 text-lg font-medium text-neutral-100 outline-offset-4 transition duration-300 hover:bg-primary-800 focus-visible:bg-primary-800 dark:bg-primary-300 dark:text-neutral-900 dark:hover:bg-primary-400 dark:focus-visible:bg-primary-400"
          reloadDocument
          to="/"
        >
          Homepage
        </Link>
      </nav>
    </article>
  </div>
);

type InfoCardProps = PropsWithChildren<{
  tag?: ElementType<{ className: string }>;
}>;
const InfoCard = ({ children, tag: Tag = "p" }: InfoCardProps) => (
  <Tag className="rounded-lg border border-neutral-200 bg-white px-4 py-2.5 transition hover:border-primary-700 dark:border-neutral-700 dark:bg-neutral-800 dark:hover:border-primary-300">
    {children}
  </Tag>
);
export default GlobalError;
