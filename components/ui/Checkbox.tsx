"use client";

import { forwardRef, type ReactNode } from "react";
import { CheckIcon } from "@/components/icons";

export interface CheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: ReactNode;
  id?: string;
  name?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
}

/**
 * Themed replacement for the browser's native checkbox appearance. A real
 * <input type="checkbox"> stays in the DOM (native keyboard/form/required
 * behavior, screen-reader semantics), just visually hidden behind a custom
 * box + check icon driven by the `:checked` sibling selector — so no manual
 * click wiring is needed and the surrounding <label> gives "click label or
 * box toggles it" for free.
 */
const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(function Checkbox(
  { checked, onChange, label, id, name, required, disabled, className },
  ref
) {
  return (
    <label className={`chk${disabled ? " disabled" : ""}${className ? ` ${className}` : ""}`} htmlFor={id}>
      <span className="chk-box">
        <input
          ref={ref}
          type="checkbox"
          id={id}
          name={name}
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          required={required}
          disabled={disabled}
        />
        <CheckIcon className="chk-icon" />
      </span>
      {label && <span className="chk-label">{label}</span>}
    </label>
  );
});

export default Checkbox;
