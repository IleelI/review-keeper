import type { Review } from "~/.server/data/review";
import Link from "~/components/atoms/Link";

type ReviewAuthorProps = Pick<Review, "author">;
const ReviewAuthor = ({ author: { id, username } }: ReviewAuthorProps) => {
  return (
    <p className="text-sm">
      By{" "}
      <Link size="sm" to={`/user/${id}`}>
        {username}
      </Link>
    </p>
  );
};

export default ReviewAuthor;
