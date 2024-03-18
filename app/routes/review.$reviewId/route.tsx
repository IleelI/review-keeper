import MainLayout from "~/components/layouts/MainLayout";

import Review from "./components/Review";
import useReviewPage from "./hooks/useReviewPage";
import { action } from "./server/action";
import { loader } from "./server/loader";

export { action, loader };

const ReviewPage = () => {
  const { isAuthor, review } = useReviewPage();

  return (
    <MainLayout>
      <Review isAuthor={isAuthor} review={review} />
    </MainLayout>
  );
};

export default ReviewPage;
