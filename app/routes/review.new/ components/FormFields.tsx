import { Editor } from "@tiptap/react";
import { useFormContext } from "react-hook-form";

import Input from "~/components/atoms/Input";
import { FormField } from "~/components/molecules/FormField";
import RichTextEditor from "~/components/molecules/RichTextEditor";
import Select from "~/components/molecules/Select";
import { ReviewCategory } from "~/server/review.server";

import { NewReviewSchema } from "../helpers";

interface FormFieldsProps {
  categories: ReviewCategory[];
  editor: Editor | null;
}
const FormFields = ({ categories, editor }: FormFieldsProps) => {
  const { control } = useFormContext<NewReviewSchema>();

  return (
    <fieldset className="grid grid-cols-2 gap-4">
      <FormField
        control={control}
        name="title"
        render={({ field }) => (
          <FormField.Item className="col-span-2">
            <FormField.Label isRequired>Title</FormField.Label>
            <FormField.Message />
            <FormField.Control>
              <Input {...field} />
            </FormField.Control>
          </FormField.Item>
        )}
      />

      <FormField
        control={control}
        name="categoryId"
        render={({ field, fieldState: { error } }) => (
          <FormField.Item className="col-span-2">
            <FormField.Label>Category</FormField.Label>
            <FormField.Message />
            <Select
              onValueChange={field.onChange}
              value={field.value ? String(field.value) : ""}
            >
              <FormField.Control>
                <Select.Trigger hasError={!!error} ref={field.ref}>
                  <Select.Value placeholder="Select a category..." />
                </Select.Trigger>
              </FormField.Control>
              <Select.Content>
                {categories.length ? (
                  categories.map(({ id, name }) => (
                    <Select.Item key={id} value={String(id)}>
                      {name}
                    </Select.Item>
                  ))
                ) : (
                  <Select.EmptyList
                    message="Please try again in a while."
                    title="No categories found."
                  />
                )}
              </Select.Content>
            </Select>
          </FormField.Item>
        )}
      />

      <FormField
        control={control}
        name="rating"
        render={({ field }) => (
          <FormField.Item className="col-span-1 justify-between">
            <FormField.Label>Rating</FormField.Label>
            <FormField.Message />
            <FormField.Control>
              <Input inputMode="numeric" {...field} />
            </FormField.Control>
          </FormField.Item>
        )}
      />

      <FormField
        control={control}
        name="ratingScale"
        render={({ field }) => (
          <FormField.Item className="col-span-1 justify-between">
            <FormField.Label>Rating Scale</FormField.Label>
            <FormField.Message />
            <FormField.Control>
              <Input inputMode="numeric" {...field} />
            </FormField.Control>
          </FormField.Item>
        )}
      />

      <FormField
        control={control}
        name="content"
        render={({ field, fieldState: { error } }) => (
          <FormField.Item className="col-span-2">
            <FormField.Label isRequired>Review</FormField.Label>
            <FormField.Message />
            <RichTextEditor editor={editor} hasError={!!error} />
            <FormField.Control>
              <input type="hidden" {...field} />
            </FormField.Control>
          </FormField.Item>
        )}
      />
    </fieldset>
  );
};

export default FormFields;
