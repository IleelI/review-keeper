import type { AppUser } from "~/.server/data/user";
import { UserProfileActions } from "~/routes/user.$userId/components/UserProfileActions";
import { getFormattedDate } from "~/utils/date";

interface UserProfileProps {
  isLoggedUserAccountOwner: boolean;
  user: AppUser;
}
const UserProfile = ({ isLoggedUserAccountOwner, user }: UserProfileProps) => {
  const userJoinDate = new Date(user.createdAt);
  const formattedDate = getFormattedDate(userJoinDate);

  return (
    <div className="row-span-full flex flex-col gap-4 lg:col-start-1 lg:col-end-2">
      <article className="flex flex-col gap-4">
        <header>
          <h2 className="text-xl font-semibold text-neutral-700 dark:text-neutral-300">
            Account Information
          </h2>
        </header>
        <section className="flex flex-col gap-4 rounded-lg bg-white px-6 py-4 shadow dark:bg-neutral-800">
          <h2 className="text-2xl font-bold text-primary-700 dark:text-primary-300">
            {user.username}
          </h2>
          <p>
            Joined:{" "}
            <span className="font-medium text-neutral-800 dark:text-neutral-200">
              {formattedDate}
            </span>
          </p>
        </section>
      </article>

      {isLoggedUserAccountOwner ? <UserProfileActions user={user} /> : null}
    </div>
  );
};

export { UserProfile };
