import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { useId } from "react";
import { cn } from "@/lib/cn";

/**
 * Universal field anatomy — §12.1. Label always visible above the control,
 * helper text below, 52px height. No floating or placeholder labels.
 */
export function Field({
  label,
  optional,
  helper,
  error,
  children,
  htmlFor,
  className,
}: {
  label: string;
  optional?: boolean;
  helper?: ReactNode;
  error?: string;
  children: ReactNode;
  htmlFor?: string;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <label htmlFor={htmlFor} className="type-label text-ink-600">
        {label}
        {optional && <span className="ml-1 font-normal normal-case text-ink-400">(optional)</span>}
      </label>
      {children}
      {error ? (
        <p className="type-body-sm text-stop-600">{error}</p>
      ) : helper ? (
        <p className="type-body-sm text-ink-400">{helper}</p>
      ) : null}
    </div>
  );
}

const inputBase =
  "h-13 w-full rounded-control border bg-paper px-4 type-body text-ink-700 " +
  "placeholder:text-ink-200 transition-colors duration-120 " +
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-600 " +
  "disabled:cursor-not-allowed disabled:bg-haze-050 disabled:text-ink-200";

export function Input({
  invalid,
  className,
  ...props
}: ComponentPropsWithoutRef<"input"> & { invalid?: boolean }) {
  return (
    <input
      className={cn(
        inputBase,
        invalid ? "border-stop-600" : "border-line-300 hover:border-ink-400 focus-visible:border-cyan-600",
        className,
      )}
      {...props}
    />
  );
}

/** A labelled input in one call, generating a stable id. */
export function TextField({
  label,
  optional,
  helper,
  error,
  className,
  ...props
}: ComponentPropsWithoutRef<"input"> & {
  label: string;
  optional?: boolean;
  helper?: ReactNode;
  error?: string;
}) {
  const id = useId();
  return (
    <Field label={label} optional={optional} helper={helper} error={error} htmlFor={id} className={className}>
      <Input id={id} invalid={!!error} {...props} />
    </Field>
  );
}
