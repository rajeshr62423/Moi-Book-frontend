"use client";

import { useState } from "react";
import Link from "next/link";
import AuthLayout, { AuthCardLogo } from "@/components/auth/AuthLayout";
import PasswordField from "@/components/auth/PasswordField";
import { passwordRules, passwordRulesPass, passwordStrength } from "@/lib/authValidation";
import { CheckIcon } from "@/components/icons";

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [errors, setErrors] = useState<{ password?: boolean; confirm?: boolean }>({});
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const rules = passwordRules(password);
  const strength = passwordStrength(rules);
  const strengthLabel = strength === "weak" ? "Weak" : strength === "fair" ? "Fair" : "Strong";

  function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const next: typeof errors = {};
    if (!passwordRulesPass(rules)) next.password = true;
    if (password !== confirm) next.confirm = true;
    setErrors(next);
    if (Object.keys(next).length) return;

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setDone(true);
    }, 900);
  }

  return (
    <AuthLayout>
      <div className="auth-card auth-panel active">
        {!done ? (
          <div id="resetFormState">
            <AuthCardLogo />
            <h2>Create a new password</h2>
            <p className="auth-sub">Choose a new password to keep your I Moi Book account secure.</p>
            <form noValidate onSubmit={submit}>
              <PasswordField
                label="New Password"
                value={password}
                onChange={setPassword}
                placeholder="Enter new password"
                autoComplete="new-password"
                hasError={errors.password}
              />
              {password && (
                <>
                  <div className={`auth-strength ${strength}`}>
                    <span />
                  </div>
                  <div className="auth-strength-label">Password strength: {strengthLabel}</div>
                </>
              )}
              {errors.password && <div className="error" style={{ marginTop: -6, marginBottom: 8 }}>Password does not meet requirements.</div>}
              <ul className="auth-hints">
                <li className={rules.len ? "ok" : ""}>At least 8 characters</li>
                <li className={rules.upper ? "ok" : ""}>One uppercase letter</li>
                <li className={rules.num ? "ok" : ""}>One number</li>
              </ul>
              <PasswordField
                label="Confirm Password"
                value={confirm}
                onChange={setConfirm}
                placeholder="Confirm new password"
                autoComplete="new-password"
                hasError={errors.confirm}
                error="Passwords must match."
              />
              <button type="submit" className={`auth-btn${loading ? " loading" : ""}`} disabled={loading}>
                <span className="spinner" />
                <span className="btn-label">{loading ? "Updating..." : "Reset Password"}</span>
              </button>
            </form>
          </div>
        ) : (
          <div className="auth-success">
            <div className="auth-success-ico">
              <CheckIcon />
            </div>
            <h2>Password updated</h2>
            <p className="auth-sub">Your password has been successfully changed.</p>
            <Link href="/login" className="auth-btn" style={{ textDecoration: "none" }}>
              <span className="btn-label">Continue to Sign In</span>
            </Link>
          </div>
        )}
      </div>
    </AuthLayout>
  );
}
