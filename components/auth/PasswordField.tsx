"use client";

import { useId, useState } from "react";
import { EyeIcon } from "@/components/icons";

interface PasswordFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  autoComplete?: string;
  error?: string;
  hasError?: boolean;
}

export default function PasswordField({ label, value, onChange, placeholder, autoComplete, error, hasError }: PasswordFieldProps) {
  const [show, setShow] = useState(false);
  const id = useId();

  return (
    <div className={`auth-field${hasError ? " has-error" : ""}`}>
      <label htmlFor={id}>{label}</label>
      <div className="auth-pw-wrap">
        <input
          id={id}
          type={show ? "text" : "password"}
          autoComplete={autoComplete}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          required
        />
        <button type="button" className="auth-pw-toggle" aria-label="Show password" onClick={() => setShow((v) => !v)}>
          <EyeIcon />
        </button>
      </div>
      {error && <div className="error">{error}</div>}
    </div>
  );
}
