import MainLayout from "~/components/layouts/MainLayout";

import Review from "./components/Review";
import useReviewPage from "./hooks/useReviewPage";
import { action } from "./server/action";
import { loader } from "./server/loader";

export { action, loader };

const ReviewPage = () => {
  const { isAuthor, reactions, review } = useReviewPage();

  return (
    <MainLayout>
      <Review isAuthor={isAuthor} reactions={reactions} review={review} />
    </MainLayout>
  );
};

export default ReviewPage;
