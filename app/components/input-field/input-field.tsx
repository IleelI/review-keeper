import { ComponentPropsWithoutRef } from "react";

type NativeInputProps = ComponentPropsWithoutRef<"input">;

interface InputFieldProps {
  name: string;
  className?: string;
  type?: NativeInputProps["type"];
  onChange?: NativeInputProps["onChange"];
}
export default function InputField({
  className,
  name,
  type = "text",
  ...props
}: InputFieldProps) {
  return (
    <input
      className={`${className} rounded-md border border-neutral-300 bg-neutral-100 p-2 dark:border-neutral-700 dark:bg-neutral-900`}
      id={name}
      name={name}
      type={type}
      {...props}
    />
  );
}
