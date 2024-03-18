import Button from "~/components/atoms/Button";
import HelperText from "~/components/atoms/HelperText";
import Link from "~/components/atoms/Link";

interface SignInFormActionsProps {
  backendError?: string;
  searchParams: URLSearchParams;
}
const SignInFormActions = ({
  backendError,
  searchParams,
}: SignInFormActionsProps) => (
  <nav className="flex flex-col gap-4">
    <small className="text-center text-sm">
      {"Don't have an account?\t"}
      <Link
        className="font-semibold text-primary-700 hover:text-primary-600 dark:text-primary-300 dark:hover:text-primary-400"
        size="sm"
        to={`/auth/sign-up?${searchParams}`}
      >
        Sign up here.
      </Link>
    </small>
    <Button type="submit">Sign In</Button>
    {backendError ? <HelperText isError>{backendError}</HelperText> : null}
  </nav>
);

export default SignInFormActions;
