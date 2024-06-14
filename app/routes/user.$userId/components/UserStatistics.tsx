import { twJoin } from "tailwind-merge";

import type { UserStatistics } from "~/.server/data/user";

type UserStatsProps = UserStatistics;
const UserStats = ({
  ratingAverage,
  reactionsAverage,
  reviewTotalCount,
}: UserStatsProps) => {
  return (
    <article className="flex flex-col gap-4 lg:col-start-2 lg:col-end-3">
      <header>
        <h2 className="text-xl font-semibold text-neutral-600 dark:text-neutral-400">
          Statistics
        </h2>
      </header>
      <ul className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="group flex flex-col gap-2 rounded-lg bg-white px-6 py-4 shadow">
          <p
            className={twJoin(
              "text-xl font-bold transition ease-in-out",
              getRatingStyles(ratingAverage),
            )}
          >
            {ratingAverage}%
          </p>
          <h2 className="text-sm">Average Rating</h2>
        </div>
        <div className="flex flex-col gap-2 rounded-lg bg-white px-6 py-4 shadow">
          <p className="text-xl font-bold">{reactionsAverage}</p>
          <h2 className="text-sm">Average Reactions</h2>
        </div>
        <div className="flex flex-col gap-2 rounded-lg bg-white px-6 py-4 shadow">
          <p className="text-xl font-bold">{reviewTotalCount}</p>
          <h2 className="text-sm">Review Count</h2>
        </div>
      </ul>
    </article>
  );
};

export { UserStats };

const getRatingStyles = (ratingPercentage: number) => {
  switch (true) {
    case ratingPercentage < 40:
      return "group-hover:text-red-600 dark:group-hover:text-red-400";
    case ratingPercentage < 80:
      return "group-hover:text-orange-600 dark:group-hover:text-orange-400";
    case ratingPercentage <= 100:
      return "group-hover:text-green-600 dark:group-hover:text-green-400";
    default:
      return "group-hover:text-neutral-600 dark:group-hover:text-neutral-400";
  }
};
