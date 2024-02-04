import { CaretDown, CaretUp, CaretUpDown, Check } from "@phosphor-icons/react";
import * as RadixSelect from "@radix-ui/react-select";
import { ReactElement } from "react";
import { twJoin } from "tailwind-merge";

export interface SelectOption {
  disabled?: boolean;
  name: string;
  value: string;
}

interface ControlledSelect {
  value: string;
  onValueChange: (value: string) => void;
}

interface UncontrolledSelect {
  value?: never;
  onValueChange?: never;
}

type SelectProps = {
  customContent?: (option: SelectOption) => ReactElement;
  hasError?: boolean;
  options: SelectOption[];
} & (ControlledSelect | UncontrolledSelect);

const Select = ({
  customContent,
  hasError,
  options,
  onValueChange,
  value,
}: SelectProps) => (
  <RadixSelect.Root value={value} onValueChange={onValueChange}>
    <RadixSelect.Trigger
      aria-invalid={hasError}
      className={twJoin([
        "flex items-center justify-between gap-4 rounded-lg border px-3 py-1.5 shadow outline-none transition",
        "border-neutral-200 bg-neutral-50 text-neutral-700 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300",
        "enabled:hover:border-neutral-600 enabled:focus-visible:border-neutral-600 dark:enabled:hover:border-neutral-400 dark:enabled:focus-visible:border-neutral-400",
        "data-[placeholder]:text-neutral-400 dark:data-[placeholder]:text-neutral-500",
        "data-[disabled]:cursor-not-allowed data-[disabled]:opacity-40",
        "aria-[invalid=true]:border-red-700 dark:aria-[invalid=true]:border-red-300",
      ])}
    >
      <RadixSelect.Value placeholder="Placeholder..." />
      <RadixSelect.Icon className="text-neutral-700 dark:text-neutral-300">
        <CaretUpDown />
      </RadixSelect.Icon>
    </RadixSelect.Trigger>

    <RadixSelect.Portal>
      <RadixSelect.Content
        className="max-h-[var(--radix-select-content-available-height)] w-[var(--radix-select-trigger-width)] max-w-full overflow-hidden rounded-lg border border-neutral-200 bg-neutral-50 p-1 text-neutral-700 shadow dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200"
        collisionPadding={16}
        position="popper"
        sideOffset={8}
      >
        <RadixSelect.ScrollUpButton className="flex items-center justify-center px-2 py-1">
          <CaretUp />
        </RadixSelect.ScrollUpButton>

        <RadixSelect.Viewport>
          {options.map(({ disabled, name, value }) => (
            <RadixSelect.Item
              className={twJoin([
                "grid cursor-pointer grid-cols-[1fr_max-content] items-center gap-3 rounded px-2 py-1.5 outline-none",
                "data-[highlighted]:bg-neutral-200 data-[highlighted]:text-neutral-700 dark:data-[highlighted]:bg-neutral-700 dark:data-[highlighted]:text-neutral-300",
                "data-[disabled]:cursor-not-allowed data-[disabled]:opacity-40",
              ])}
              disabled={disabled}
              key={`${name}-${value}`}
              value={value}
            >
              <RadixSelect.ItemText>
                {customContent
                  ? customContent({ disabled, name, value })
                  : name}
              </RadixSelect.ItemText>
              <RadixSelect.ItemIndicator>
                <Check />
              </RadixSelect.ItemIndicator>
            </RadixSelect.Item>
          ))}
        </RadixSelect.Viewport>

        <RadixSelect.ScrollDownButton className="flex items-center justify-center px-2 py-1">
          <CaretDown />
        </RadixSelect.ScrollDownButton>
      </RadixSelect.Content>
    </RadixSelect.Portal>
  </RadixSelect.Root>
);

export default Select;
