import { useLoaderData } from "@remix-run/react";

import MainLayout from "~/components/layouts/MainLayout";

import { RecentReviews } from "./components/RecentReviews";
import { UserProfile } from "./components/UserProfile";
import { UserStats } from "./components/UserStatistics";
import { action } from "./server/action";
import { loader } from "./server/loader";

export { action, loader };

const UserProfilePage = () => {
  const { isLoggedUserAccountOwner, reviews, statistics, user } =
    useLoaderData<typeof loader>();

  return (
    <MainLayout>
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(min-content,400px)_1fr] lg:grid-rows-[auto_1fr]">
        <UserProfile
          isLoggedUserAccountOwner={isLoggedUserAccountOwner}
          user={user}
        />

        <UserStats {...statistics} />

        <RecentReviews reviews={reviews} user={user} />
      </div>
    </MainLayout>
  );
};

export default UserProfilePage;
