interface InputErrorProps {
  error: string | string[];
}
export default function InputError({ error }: InputErrorProps) {
  return (
    <small className="text-sm text-error-700 dark:text-error-300">
      {error}
    </small>
  );
}
