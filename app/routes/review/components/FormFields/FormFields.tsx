import { Editor } from "@tiptap/react";
import { useFormContext } from "react-hook-form";

import { ReviewCategory } from "~/.server/data/review";
import Input from "~/components/atoms/Input";
import { FormField } from "~/components/molecules/FormField";
import RichTextEditor, {
  RichTextEditorSkeleton,
} from "~/components/molecules/RichTextEditor";
import Select from "~/components/molecules/Select";
import type { ReviewSchema } from "~/routes/review/helpers/helpers";

interface FormFieldsProps {
  categories: ReviewCategory[];
  characterLimit: number;
  editor: Editor | null;
}
const FormFields = ({
  categories,
  characterLimit,
  editor,
}: FormFieldsProps) => {
  const {
    control,
    trigger,
    formState: { errors },
  } = useFormContext<ReviewSchema>();
  const characterCount = editor?.storage.characterCount.characters();

  return (
    <fieldset className="grid grid-cols-2 gap-x-8 gap-y-6">
      <FormField
        control={control}
        name="title"
        render={({ field }) => (
          <FormField.Item className="col-span-2">
            <FormField.Label isRequired>Title</FormField.Label>
            <FormField.Message />
            <FormField.Control>
              <Input
                placeholder="ex. Review Keeper is a great app!"
                {...field}
              />
            </FormField.Control>
          </FormField.Item>
        )}
      />

      <FormField
        control={control}
        name="categoryId"
        render={({
          field: { name, onChange, ref, value, disabled },
          fieldState: { error },
        }) => (
          <FormField.Item className="col-span-2">
            <FormField.Label>Category</FormField.Label>
            <FormField.Message />
            <Select
              disabled={disabled}
              name={name}
              onValueChange={onChange}
              value={value || ""}
            >
              <FormField.Control>
                <Select.Trigger hasError={!!error} ref={ref}>
                  <Select.Value placeholder="Select a category..." />
                </Select.Trigger>
              </FormField.Control>
              <Select.Content>
                {categories.length ? (
                  categories.map(({ id, name }) => (
                    <Select.Item key={id} value={id}>
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
            <FormField.Message>
              Select &quot;Uncategorised&quot; or leave this field empty if you
              want the review to be uncategorised.
            </FormField.Message>
          </FormField.Item>
        )}
      />

      <FormField
        control={control}
        name="rating"
        render={({ field }) => (
          <FormField.Item className="col-span-2 justify-between sm:col-span-1">
            <FormField.Label>Rating</FormField.Label>
            <FormField.Message />
            <FormField.Control>
              <Input
                {...field}
                inputMode="numeric"
                onChange={(e) => {
                  field.onChange(e);
                  if (errors.ratingScale) {
                    trigger(["rating", "ratingScale"]);
                  }
                }}
                placeholder="ex. 4"
              />
            </FormField.Control>
          </FormField.Item>
        )}
      />

      <FormField
        control={control}
        name="ratingScale"
        render={({ field }) => (
          <FormField.Item className="col-span-2 justify-between sm:col-span-1">
            <FormField.Label>Rating Scale</FormField.Label>
            <FormField.Message />
            <FormField.Control>
              <Input
                {...field}
                inputMode="numeric"
                onChange={(e) => {
                  field.onChange(e);
                  if (errors.rating) {
                    trigger(["rating", "ratingScale"]);
                  }
                }}
                placeholder="ex. 5"
              />
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
            {editor ? (
              <RichTextEditor editor={editor} hasError={!!error} />
            ) : (
              <RichTextEditorSkeleton />
            )}
            <FormField.Control>
              <input type="hidden" {...field} />
            </FormField.Control>
            <FormField.Description>
              Character count: {characterCount} / {characterLimit}
            </FormField.Description>
          </FormField.Item>
        )}
      />
    </fieldset>
  );
};

export default FormFields;
