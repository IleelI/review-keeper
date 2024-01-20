interface InputLabelProps {
  label: string;
  name: string;
}
export default function InputLabel({ label, name }: InputLabelProps) {
  return (
    <label className="text-neutral-900 dark:text-neutral-100" htmlFor={name}>
      {label}
    </label>
  );
}
