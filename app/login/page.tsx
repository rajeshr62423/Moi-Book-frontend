"use client";

import { useFormik } from "formik";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import AuthLayout, { AuthCardLogo } from "@/components/auth/AuthLayout";
import PasswordField from "@/components/auth/PasswordField";
import Checkbox from "@/components/ui/Checkbox";
import { validEmail } from "@/lib/authValidation";
import { useAuth } from "@/lib/auth";

interface LoginValues {
  email: string;
  password: string;
  remember: boolean;
}

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();

  const formik = useFormik<LoginValues>({
    initialValues: { email: "", password: "", remember: false },
    // Errors previously only appeared after a submit attempt, never while
    // typing — matched here by validating on submit only.
    validateOnChange: false,
    validateOnBlur: false,
    validate: (values) => {
      const errors: { email?: boolean; password?: boolean } = {};
      if (!validEmail(values.email)) errors.email = true;
      if (!values.password) errors.password = true;
      return errors;
    },
    onSubmit: async (values, { setSubmitting }) => {
      try {
        const result = await login({ email: values.email, password: values.password });
        toast.success(result.message);
        router.push("/dashboard");
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Login failed");
      } finally {
        setSubmitting(false);
      }
    },
  });

  function loginWithGoogle() {
    toast.info("Google sign-in isn't set up yet — use email and password.");
  }

  return (
    <AuthLayout>
      <div className="auth-card auth-panel active">
        <AuthCardLogo />
        <h2>Welcome back</h2>
        <p className="auth-sub">Continue organizing the moments that matter.</p>
        <form noValidate onSubmit={formik.handleSubmit}>
          <div className={`auth-field${formik.errors.email ? " has-error" : ""}`}>
            <label htmlFor="loginEmail">Email address</label>
            <input
              type="email"
              id="loginEmail"
              name="email"
              autoComplete="email"
              placeholder="Enter your email"
              value={formik.values.email}
              onChange={formik.handleChange}
              required
            />
            <div className="error">Please enter a valid email.</div>
          </div>
          <PasswordField
            label="Password"
            value={formik.values.password}
            onChange={(value) => formik.setFieldValue("password", value)}
            placeholder="Enter your password"
            autoComplete="current-password"
            hasError={!!formik.errors.password}
            error="Password is required."
          />
          <div className="auth-row">
            <Checkbox
              id="rememberMe"
              label="Remember me"
              checked={formik.values.remember}
              onChange={(checked) => formik.setFieldValue("remember", checked)}
            />
            <Link href="/forgot-password" className="auth-link">
              Forgot password?
            </Link>
          </div>
          <button type="submit" className={`auth-btn${formik.isSubmitting ? " loading" : ""}`} disabled={formik.isSubmitting}>
            <span className="spinner" />
            <span className="btn-label">{formik.isSubmitting ? "Signing in..." : "Sign In"}</span>
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
