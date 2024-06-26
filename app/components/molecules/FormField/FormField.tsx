import { Slot } from "@radix-ui/react-slot";
import {
  ComponentPropsWithoutRef,
  ElementRef,
  createContext,
  forwardRef,
  useContext,
  useId,
} from "react";
import {
  Controller,
  ControllerProps,
  FieldPath,
  FieldValues,
  useFormContext,
} from "react-hook-form";
import { twMerge } from "tailwind-merge";

import HelperText, { HelperTextProps } from "~/components/atoms/HelperText";
import Label, { LabelProps } from "~/components/atoms/Label";

interface FormFieldContextValue<
  TFieldValues extends FieldValues = FieldValues,
  TFieldName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> {
  name: TFieldName;
}
const FormFieldContext = createContext<FormFieldContextValue | undefined>(
  undefined,
);
const useFormFieldContext = () => {
  const context = useContext(FormFieldContext);
  if (context === undefined) {
    throw new Error("useFormFieldContext must be used within <FormField/>");
  }
  return context;
};
const FormField = <
  TFieldValues extends FieldValues = FieldValues,
  TFieldName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>(
  props: ControllerProps<TFieldValues, TFieldName>,
) => (
  <FormFieldContext.Provider value={{ name: props.name }}>
    <Controller {...props} />
  </FormFieldContext.Provider>
);

interface FormItemContextValue {
  id: string;
}
const FormItemContext = createContext<FormItemContextValue | undefined>(
  undefined,
);
const useFormItemContext = () => {
  const context = useContext(FormItemContext);
  if (context === undefined) {
    throw new Error("useFormItemContext must be used within <FormField.Item/>");
  }
  return context;
};
const FormItem = forwardRef<HTMLDivElement, ComponentPropsWithoutRef<"div">>(
  ({ children, className, ...props }, ref) => {
    const id = useId();

    return (
      <FormItemContext.Provider value={{ id }}>
        <div
          className={twMerge(["flex flex-col gap-2", className])}
          ref={ref}
          {...props}
        >
          {children}
        </div>
      </FormItemContext.Provider>
    );
  },
);
FormItem.displayName = "FormItem";

const useFormField = () => {
  const { name } = useFormFieldContext();
  const { id } = useFormItemContext();
  const { formState, getFieldState } = useFormContext();
  const fieldState = getFieldState(name, formState);

  return {
    formFieldControlId: `${id}-form-field-control`,
    formFieldDescriptionId: `${id}-form-field-description`,
    formFieldMessageId: `${id}-form-field-message`,
    formFieldLabelId: `${id}-form-field-label`,
    id,
    name,
    ...fieldState,
  };
};

const FormFieldLabel = forwardRef<ElementRef<typeof Label>, LabelProps>(
  ({ className, ...props }, ref) => {
    const { formFieldControlId, formFieldLabelId } = useFormField();

    return (
      <Label
        {...props}
        className={twMerge("w-max", className)}
        htmlFor={formFieldControlId}
        id={formFieldLabelId}
        ref={ref}
      />
    );
  },
);
FormFieldLabel.displayName = "FormFieldLabel";

const FormFieldControl = forwardRef<
  ElementRef<typeof Slot>,
  ComponentPropsWithoutRef<typeof Slot>
>(({ ...props }, ref) => {
  const {
    error,
    formFieldControlId,
    formFieldDescriptionId,
    formFieldMessageId,
    formFieldLabelId,
  } = useFormField();

  return (
    <Slot
      aria-describedby={
        error
          ? `${formFieldMessageId} ${formFieldDescriptionId}`
          : formFieldDescriptionId
      }
      aria-invalid={!!error}
      aria-labelledby={formFieldLabelId}
      id={formFieldControlId}
      ref={ref}
      {...props}
    />
  );
});
FormFieldControl.displayName = "FormFieldControl";

const FormFieldDescription = forwardRef<
  ElementRef<typeof HelperText>,
  HelperTextProps
>(({ children, ...props }, ref) => {
  const { formFieldDescriptionId } = useFormField();

  return (
    <HelperText id={formFieldDescriptionId} ref={ref} {...props}>
      {children}
    </HelperText>
  );
});
FormFieldDescription.displayName = "FormFieldDescription";

const FormFieldMessage = forwardRef<
  ElementRef<typeof HelperText>,
  HelperTextProps
>(({ children, ...props }, ref) => {
  const { error, formFieldMessageId } = useFormField();
  const helperText = error ? String(error.message) : children;

  if (!helperText) return null;

  return (
    <HelperText id={formFieldMessageId} isError={!!error} ref={ref} {...props}>
      {helperText}
    </HelperText>
  );
});
FormFieldMessage.displayName = "FormFieldMessage";

FormField.Item = FormItem;
FormField.Label = FormFieldLabel;
FormField.Control = FormFieldControl;
FormField.Description = FormFieldDescription;
FormField.Message = FormFieldMessage;

export { FormField };
