interface InputErrorProps {
  error: string | string[];
}
export default function InputError({ error }: InputErrorProps) {
  if (typeof error === "string") {
    return (
      <small className="text-sm text-error-700 dark:text-error-300">
        {error}
      </small>
    );
  } else {
    return (
      <ul className="flex flex-col gap-0.5 text-sm text-error-700 dark:text-error-300">
        {error.map((error) => (
          <li key={error}>{error}</li>
        ))}
      </ul>
    );
  }
}
