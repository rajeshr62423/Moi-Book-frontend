"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import AuthLayout, { AuthCardLogo } from "@/components/auth/AuthLayout";
import PasswordField from "@/components/auth/PasswordField";
import Checkbox from "@/components/ui/Checkbox";
import { validEmail } from "@/lib/authValidation";
import { useAuth } from "@/lib/auth";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [errors, setErrors] = useState<{ email?: boolean; password?: boolean }>({});
  const [loading, setLoading] = useState(false);

  function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const nextErrors: typeof errors = {};
    if (!validEmail(email)) nextErrors.email = true;
    if (!password) nextErrors.password = true;
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      login(email);
      router.push("/dashboard");
    }, 900);
  }

  function loginWithGoogle() {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      login("arun.kumar@email.com");
      router.push("/dashboard");
    }, 700);
  }

  return (
    <AuthLayout>
      <div className="auth-card auth-panel active">
        <AuthCardLogo />
        <h2>Welcome back</h2>
        <p className="auth-sub">Continue organizing the moments that matter.</p>
        <form noValidate onSubmit={submit}>
          <div className={`auth-field${errors.email ? " has-error" : ""}`}>
            <label htmlFor="loginEmail">Email address</label>
            <input
              type="email"
              id="loginEmail"
              autoComplete="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <div className="error">Please enter a valid email.</div>
          </div>
          <PasswordField
            label="Password"
            value={password}
            onChange={setPassword}
            placeholder="Enter your password"
            autoComplete="current-password"
            hasError={errors.password}
            error="Password is required."
          />
          <div className="auth-row">
            <Checkbox id="rememberMe" label="Remember me" checked={remember} onChange={setRemember} />
            <Link href="/forgot-password" className="auth-link">
              Forgot password?
            </Link>
          </div>
          <button type="submit" className={`auth-btn${loading ? " loading" : ""}`} disabled={loading}>
            <span className="spinner" />
            <span className="btn-label">{loading ? "Signing in..." : "Sign In"}</span>
          </button>
        </form>
        <div className="auth-divider">or</div>
        <button type="button" className="auth-google" onClick={loginWithGoogle}>
          <svg viewBox="0 0 24 24">
            <path fill="#EA4335" d="M12 10.2v3.6h5.1c-.2 1.2-.9 2.3-1.9 3l3.1 2.4c1.8-1.7 2.9-4.1 2.9-7 0-.7-.1-1.3-.2-1.9H12z" />
            <path fill="#34A853" d="M5.3 14.3l-.8.6-2.5 1.9C3.6 20 7.5 22.5 12 22.5c2.7 0 5-.9 6.7-2.4l-3.1-2.4c-.9.6-2 .9-3.6.9-2.8 0-5.1-1.9-6-4.4z" />
            <path fill="#4A90E2" d="M5.3 9.7C4.9 10.7 4.7 11.8 4.7 13s.2 2.3.6 3.3c0 .1 3.2-2.5 3.2-2.5-.2-.5-.3-1.1-.3-1.7s.1-1.2.3-1.7L5.3 9.7z" />
            <path fill="#FBBC05" d="M12 5.5c1.5 0 2.8.5 3.8 1.5l2.8-2.8C16.9 2.5 14.7 1.5 12 1.5 7.5 1.5 3.6 4 1.9 8.2l3.4 2.6C6.9 7.4 9.2 5.5 12 5.5z" />
          </svg>
          Continue with Google
        </button>
        <div className="auth-footer">
          Don&apos;t have an account? <Link href="/register">Create your account</Link>
        </div>
      </div>
    </AuthLayout>
  );
}
