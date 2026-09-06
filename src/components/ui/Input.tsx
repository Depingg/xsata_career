"use client";

import { useState } from "react";
import type {
  InputHTMLAttributes,
  SelectHTMLAttributes,
  TextareaHTMLAttributes,
  ReactNode,
} from "react";
import { Eye, EyeOff } from "lucide-react";

const inputBase =
  "w-full rounded-xl border border-border-light bg-white px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted transition-all duration-200 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20";

interface FieldProps {
  label?: string;
  hint?: string;
  error?: string;
  id: string;
  children: ReactNode;
}

export function Field({ label, hint, error, id, children }: FieldProps) {
  return (
    <div className="space-y-1.5">
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-slate-700">
          {label}
        </label>
      )}
      {children}
      {hint && !error && <p className="text-xs text-muted">{hint}</p>}
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
}

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  icon?: ReactNode;
  trailing?: ReactNode;
}

export function Input({
  label,
  id = "",
  icon,
  trailing,
  type = "text",
  className = "",
  ...rest
}: InputProps) {
  const [show, setShow] = useState(false);
  const isPassword = type === "password";

  return (
    <Field label={label} id={id}>
      <div className="relative">
        {icon && (
          <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
            {icon}
          </span>
        )}
        <input
          id={id}
          type={isPassword && show ? "text" : type}
          className={`${inputBase} ${icon ? "pl-10" : ""} ${
            trailing || isPassword ? "pr-11" : ""
          } ${className}`}
          {...rest}
        />
        {(trailing || isPassword) && (
          <span className="absolute right-3.5 top-1/2 -translate-y-1/2">
            {trailing ? (
              trailing
            ) : (
              <button
                type="button"
                onClick={() => setShow((v) => !v)}
                className="text-slate-400 hover:text-slate-600"
                aria-label={show ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"}
              >
                {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            )}
          </span>
        )}
      </div>
    </Field>
  );
}

interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
}

export function TextArea({ label, id = "", className = "", ...rest }: TextAreaProps) {
  return (
    <Field label={label} id={id}>
      <textarea
        id={id}
        className={`${inputBase} min-h-[100px] resize-y ${className}`}
        {...rest}
      />
    </Field>
  );
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
}

export function Select({ label, id = "", className = "", children, ...rest }: SelectProps) {
  return (
    <Field label={label} id={id}>
      <select id={id} className={`${inputBase} ${className}`} {...rest}>
        {children}
      </select>
    </Field>
  );
}
