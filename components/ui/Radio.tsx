"use client";

import { forwardRef, type ReactNode } from "react";

export interface RadioProps {
  checked: boolean;
  onChange: () => void;
  label?: ReactNode;
  id?: string;
  name?: string;
  value?: string;
  disabled?: boolean;
  className?: string;
}

/**
 * Themed replacement for the browser's native radio appearance, matching
 * Checkbox's structure: a real <input type="radio"> stays in the DOM
 * (native keyboard/form/group semantics), visually hidden behind a custom
 * ring + dot driven by the `:checked` sibling selector.
 */
const Radio = forwardRef<HTMLInputElement, RadioProps>(function Radio(
  { checked, onChange, label, id, name, value, disabled, className },
  ref
) {
  return (
    <label className={`rad${disabled ? " disabled" : ""}${className ? ` ${className}` : ""}`} htmlFor={id}>
      <span className="rad-box">
        <input
          ref={ref}
          type="radio"
          id={id}
          name={name}
          value={value}
          checked={checked}
          onChange={() => onChange()}
          disabled={disabled}
        />
        <span className="rad-dot" />
      </span>
      {label && <span className="rad-label">{label}</span>}
    </label>
  );
});

export default Radio;
