import type { MetaFunction } from "@vercel/remix";

import MainLayout from "~/components/layouts/MainLayout";

import Review from "./components/Review";
import useReviewPage from "./hooks/useReviewPage";
import { action } from "./server/action";
import { loader } from "./server/loader";

export { action, loader };

export const meta: MetaFunction = () => [
  { title: "Review Page | Review Keeper" },
];

const ReviewPage = () => {
  const reviewPageData = useReviewPage();

  return (
    <MainLayout>
      <Review {...reviewPageData} />
    </MainLayout>
  );
};

export default ReviewPage;
