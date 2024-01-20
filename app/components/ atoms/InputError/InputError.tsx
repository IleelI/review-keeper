interface InputErrorProps {
  error: string | string[];
}
export default function InputError({ error }: InputErrorProps) {
  if (typeof error === "string") {
    return <small className="text-red-700 dark:red-300 text-sm">{error}</small>;
  } else {
    return (
      <ul className="text-red-700 dark:red-300 flex flex-col gap-0.5 text-sm">
        {error.map((error) => (
          <li key={error}>{error}</li>
        ))}
      </ul>
    );
  }
}
