import { zodResolver } from "@hookform/resolvers/zod";
import { ActionFunctionArgs, LoaderFunctionArgs, json } from "@remix-run/node";
import { useFetcher, useLoaderData, useNavigate } from "@remix-run/react";
import CharacterCountExtension from "@tiptap/extension-character-count";
import { useEditor } from "@tiptap/react";
import { useEffect } from "react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";

import { getReviewCategories } from "~/.server/data/review";
import { getRequiredUser, requireUser } from "~/.server/service/auth";
import { prisma } from "~/.server/service/db";
import MainLayout from "~/components/layouts/MainLayout";
import { extensions } from "~/components/molecules/RichTextEditor";

import FormActions from "./components/FormActions";
import FormFields from "./components/FormFields";
import { ReviewSchema, defaultValues, reviewSchema } from "./helpers/helpers";
import { reviewServerSchema } from "./helpers/helpers.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  await getRequiredUser(request);
  const categories = await getReviewCategories();
  return json({ categories });
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const user = await requireUser(request);

  const formData = Object.fromEntries(await request.formData());
  const validatedData = reviewServerSchema.safeParse(formData);
  if (!validatedData.success) {
    return json({ error: "Incorrect data sent, please try again." });
  }

  try {
    const newReview = await prisma.review.create({
      data: {
        authorId: user.id,
        ...validatedData.data,
      },
    });
    return json({
      success: true as const,
      message: "Review created successfully!",
      newReview,
    });
  } catch {
    return json({
      error: "Something went wrong, please try again.",
    });
  }
};

const CHARACTER_LIMIT = 2_000;

const NewReviewPage = () => {
  const { categories } = useLoaderData<typeof loader>();
  const fetcher = useFetcher<typeof action>({ key: "new-review" });
  const navigate = useNavigate();
  const form = useForm<ReviewSchema>({
    defaultValues,
    resolver: zodResolver(reviewSchema),
  });
  const editor = useEditor({
    content: "",
    extensions: [
      ...extensions,
      CharacterCountExtension.configure({
        limit: CHARACTER_LIMIT,
        mode: "textSize",
      }),
    ],
    onUpdate: ({ editor }) =>
      form.setValue("content", editor.isEmpty ? "" : editor.getHTML(), {
        shouldValidate: form.formState.submitCount > 0,
      }),
  });

  const handleFormReset = () => {
    form.reset();
    editor?.commands.clearContent();
  };

  const onSubmit: SubmitHandler<ReviewSchema> = (data) => {
    const transformedData = {
      content: data.content,
      title: data.title,
      ...(data.categoryId ? { categoryId: data.categoryId } : {}),
      ...(data.rating ? { rating: data.rating } : {}),
      ...(data.ratingScale ? { ratingScale: data.ratingScale } : {}),
    };
    fetcher.submit(transformedData, { method: "post", navigate: true });
  };

  useEffect(() => {
    const fetcherData = fetcher.data;
    if (!fetcherData) return;
    if ("error" in fetcherData) {
      toast.error(fetcherData.error, { position: "top-center" });
    } else {
      toast.success(fetcherData.message, { position: "top-center" });
      navigate(`/?review-id=${fetcherData.newReview.id}`);
    }
  }, [fetcher.data, navigate]);

  return (
    <MainLayout>
      <FormProvider {...form}>
        <form
          className="flex flex-col gap-8"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <FormFields
            categories={categories}
            characterLimit={CHARACTER_LIMIT}
            editor={editor}
          />
          <FormActions handleFormReset={handleFormReset} />
        </form>
      </FormProvider>
    </MainLayout>
  );
};

export default NewReviewPage;
