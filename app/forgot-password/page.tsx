"use client";

import { useFormik } from "formik";
import Link from "next/link";
import { toast } from "react-toastify";
import AuthLayout, { AuthCardLogo } from "@/components/auth/AuthLayout";
import { validEmail } from "@/lib/authValidation";
import { forgotPasswordApi } from "@/services/authService";
import { extractApiErrorMessage } from "@/services/apiTypes";
import { CheckIcon } from "@/components/icons";

interface ForgotPasswordValues {
  email: string;
}

export default function ForgotPasswordPage() {
  const formik = useFormik<ForgotPasswordValues>({
    initialValues: { email: "" },
    validateOnChange: false,
    validateOnBlur: false,
    validate: (values) => {
      const errors: { email?: boolean } = {};
      if (!validEmail(values.email)) errors.email = true;
      return errors;
    },
    onSubmit: async (values, { setSubmitting, setStatus }) => {
      try {
        const response = await forgotPasswordApi(values.email);
        toast.success(response.message);
        setStatus("sent");
      } catch (err) {
        toast.error(extractApiErrorMessage(err, "Couldn't send the reset email"));
      } finally {
        setSubmitting(false);
      }
    },
  });

  const sent = formik.status === "sent";

  return (
    <AuthLayout>
      <div className="auth-card auth-panel active">
        {!sent ? (
          <div id="forgotFormState">
            <AuthCardLogo />
            <h2>Forgot your password?</h2>
            <p className="auth-sub">Don&apos;t worry. We&apos;ll help you get back to your celebrations.</p>
            <form noValidate onSubmit={formik.handleSubmit}>
              <div className={`auth-field${formik.errors.email ? " has-error" : ""}`}>
                <label htmlFor="forgotEmail">Email Address</label>
                <input
                  type="email"
                  id="forgotEmail"
                  name="email"
                  autoComplete="email"
                  placeholder="Enter your email"
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  required
                />
                <div className="error">Please enter a valid email.</div>
              </div>
              <button type="submit" className={`auth-btn${formik.isSubmitting ? " loading" : ""}`} disabled={formik.isSubmitting}>
                <span className="spinner" />
                <span className="btn-label">{formik.isSubmitting ? "Sending..." : "Send Reset Link"}</span>
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
