import Button from "~/components/atoms/Button";
import HelperText from "~/components/atoms/HelperText";
import Link from "~/components/atoms/Link";

interface SignUpFormActionsProps {
  backendError?: string;
  searchParams: URLSearchParams;
}
const SignUpFormActions = ({
  backendError,
  searchParams,
}: SignUpFormActionsProps) => (
  <nav className="flex flex-col gap-4">
    <small className="text-center text-sm">
      {"Already have an account? \t"}
      <Link
        className="font-semibold text-primary-700 hover:text-primary-600 dark:text-primary-300 dark:hover:text-primary-400"
        size="sm"
        to={`/auth/sign-in?${searchParams}`}
      >
        Sign in here.
      </Link>
    </small>
    <Button type="submit">Sign Up</Button>
    {backendError ? <HelperText isError>{backendError}</HelperText> : null}
  </nav>
);

export default SignUpFormActions;
