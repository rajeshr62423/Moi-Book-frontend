"use client";

import { useState } from "react";
import Link from "next/link";
import AuthLayout, { AuthCardLogo } from "@/components/auth/AuthLayout";
import { validEmail } from "@/lib/authValidation";
import { CheckIcon } from "@/components/icons";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [hasError, setHasError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!validEmail(email)) {
      setHasError(true);
      return;
    }
    setHasError(false);
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSent(true);
    }, 900);
  }

  return (
    <AuthLayout>
      <div className="auth-card auth-panel active">
        {!sent ? (
          <div id="forgotFormState">
            <AuthCardLogo />
            <h2>Forgot your password?</h2>
            <p className="auth-sub">Don&apos;t worry. We&apos;ll help you get back to your celebrations.</p>
            <form noValidate onSubmit={submit}>
              <div className={`auth-field${hasError ? " has-error" : ""}`}>
                <label htmlFor="forgotEmail">Email Address</label>
                <input
                  type="email"
                  id="forgotEmail"
                  autoComplete="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <div className="error">Please enter a valid email.</div>
              </div>
              <button type="submit" className={`auth-btn${loading ? " loading" : ""}`} disabled={loading}>
                <span className="spinner" />
                <span className="btn-label">{loading ? "Sending..." : "Send Reset Link"}</span>
              </button>
            </form>
            <div className="auth-footer">
              <Link href="/login">← Back to Sign In</Link>
            </div>
          </div>
        ) : (
          <div className="auth-success">
            <div className="auth-success-ico">
              <CheckIcon />
            </div>
            <h2>Check your inbox</h2>
            <p className="auth-sub">We&apos;ve sent password reset instructions to your email address.</p>
            <Link href="/login" className="auth-btn" style={{ textDecoration: "none" }}>
              <span className="btn-label">Back to Sign In</span>
            </Link>
          </div>
        )}
      </div>
    </AuthLayout>
  );
}
