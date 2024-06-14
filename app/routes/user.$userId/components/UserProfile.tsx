import { zodResolver } from "@hookform/resolvers/zod";
import { useFetcher, useNavigate } from "@remix-run/react";
import { useEffect } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import type { AppUser } from "~/.server/data/user";
import Button from "~/components/atoms/Button";
import Input from "~/components/atoms/Input";
import Dialog from "~/components/molecules/Dialog";
import { FormField } from "~/components/molecules/FormField";

import type { action } from "../route";

type UserProfileSchema = z.infer<typeof userProfileSchema>;
export const userProfileSchema = z.object({
  email: z
    .string()
    .email("Invalid email format.")
    .trim()
    .min(0, "Email is required."),
  username: z.string().trim().min(1, "Username is required."),
});

interface UserProfileProps {
  user: AppUser;
}
const UserProfile = ({ user }: UserProfileProps) => {
  const fetcher = useFetcher<typeof action>();
  const form = useForm<UserProfileSchema>({
    defaultValues: {
      email: user.email,
      username: user.username,
    },
    mode: "onBlur",
    resolver: zodResolver(userProfileSchema),
    values: {
      email:
        (fetcher.data?.status === "success" && fetcher.data.data.email) ||
        user.email,
      username:
        (fetcher.data?.status === "success" && fetcher.data.data.username) ||
        user.username,
    },
  });
  const navigate = useNavigate();
  const {
    formState: { isDirty, isValid },
  } = form;

  const handleProfileUpdate = () => {
    const newProfile = form.getValues();
    fetcher.submit(newProfile, { method: "POST", navigate: false });
  };

  const handleProfileDelete = () => {
    fetcher.submit({}, { method: "DELETE", navigate: false });
  };

  const isSaveChangesButtonDisabled =
    !isValid || !isDirty || fetcher.state === "submitting";

  useEffect(() => {
    if (!fetcher.data || fetcher.state !== "idle") return;
    if (fetcher.data.status === "error") {
      toast.error(fetcher.data.message);
    } else {
      toast.success(fetcher.data.message);
      fetcher.data.data.redirect && navigate("/");
    }
  }, [fetcher.data, fetcher.state, form, navigate, user.email, user.username]);

  return (
    <article className="row-span-full flex flex-col gap-4 lg:col-start-1 lg:col-end-2">
      <header>
        <h2 className="text-xl font-semibold text-neutral-700 dark:text-neutral-300">
          Account Information
        </h2>
      </header>

      <section className="min-h-[320px] rounded-lg bg-white px-6 py-4 shadow dark:bg-neutral-800">
        <header className="mb-8 flex flex-col items-center gap-1">
          <p className="text-xs text-neutral-500">Welcome!</p>
          <h2 className="text-xl font-bold text-primary-700 dark:text-primary-300">
            {user.username}
          </h2>
        </header>

        <FormProvider {...form}>
          <form className="flex flex-col gap-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormField.Item>
                  <FormField.Label>Email</FormField.Label>
                  <FormField.Control>
                    <Input autoComplete="email" type="email" {...field} />
                  </FormField.Control>
                  <FormField.Message />
                </FormField.Item>
              )}
            />
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormField.Item>
                  <FormField.Label>Username</FormField.Label>
                  <FormField.Control>
                    <Input autoComplete="username" {...field} />
                  </FormField.Control>
                  <FormField.Message />
                </FormField.Item>
              )}
            />
          </form>
        </FormProvider>

        <footer className="mt-6 flex flex-col gap-2">
          <Button
            disabled={isSaveChangesButtonDisabled}
            onClick={handleProfileUpdate}
          >
            Save Changes
          </Button>
          <Dialog>
            <Dialog.Trigger asChild>
              <Button intent="destructive">Delete Account</Button>
            </Dialog.Trigger>
            <Dialog.Content>
              <Dialog.Header>Delete Account</Dialog.Header>
              <Dialog.Description>
                Are you sure you want to delete this account? This action is
                nonreversible.
              </Dialog.Description>
              <Dialog.Footer>
                <Dialog.Close asChild>
                  <Button intent="secondary" size="sm">
                    Cancel
                  </Button>
                </Dialog.Close>
                <Button
                  intent="destructive"
                  onClick={handleProfileDelete}
                  size="sm"
                >
                  Delete
                </Button>
              </Dialog.Footer>
            </Dialog.Content>
          </Dialog>
        </footer>
      </section>
    </article>
  );
};

export { UserProfile };
