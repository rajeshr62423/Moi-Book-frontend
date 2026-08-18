"use client";

import { Suspense } from "react";
import { useFormik } from "formik";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { toast } from "react-toastify";
import AuthLayout, { AuthCardLogo } from "@/components/auth/AuthLayout";
import PasswordField from "@/components/auth/PasswordField";
import { passwordRules, passwordRulesPass, passwordStrength } from "@/lib/authValidation";
import { resetPasswordApi } from "@/services/authService";
import { extractApiErrorMessage } from "@/services/apiTypes";
import { CheckIcon } from "@/components/icons";

interface ResetPasswordValues {
  password: string;
  confirm: string;
}

function ResetPasswordForm() {
  const token = useSearchParams().get("token");

  const formik = useFormik<ResetPasswordValues>({
    initialValues: { password: "", confirm: "" },
    validateOnChange: false,
    validateOnBlur: false,
    validate: (values) => {
      const errors: { password?: boolean; confirm?: boolean } = {};
      if (!passwordRulesPass(passwordRules(values.password))) errors.password = true;
      if (values.password !== values.confirm) errors.confirm = true;
      return errors;
    },
    onSubmit: async (values, { setSubmitting, setStatus }) => {
      if (!token) {
        toast.error("This reset link is missing its token — request a new one.");
        return;
      }
      try {
        const response = await resetPasswordApi(token, values.password);
        toast.success(response.message);
        setStatus("done");
      } catch (err) {
        toast.error(extractApiErrorMessage(err, "Couldn't reset your password"));
      } finally {
        setSubmitting(false);
      }
    },
  });

  const done = formik.status === "done";
  const rules = passwordRules(formik.values.password);
  const strength = passwordStrength(rules);
  const strengthLabel = strength === "weak" ? "Weak" : strength === "fair" ? "Fair" : "Strong";

  if (!token && !done) {
    return (
      <div className="auth-success">
        <h2>Invalid reset link</h2>
        <p className="auth-sub">This password reset link is missing or malformed. Request a new one from the forgot password page.</p>
        <Link href="/forgot-password" className="auth-btn" style={{ textDecoration: "none" }}>
          <span className="btn-label">Request a new link</span>
        </Link>
      </div>
    );
  }

  return !done ? (
    <div id="resetFormState">
      <AuthCardLogo />
      <h2>Create a new password</h2>
      <p className="auth-sub">Choose a new password to keep your DigiMoiBook account secure.</p>
      <form noValidate onSubmit={formik.handleSubmit}>
        <PasswordField
          label="New Password"
          value={formik.values.password}
          onChange={(value) => formik.setFieldValue("password", value)}
          placeholder="Enter new password"
          autoComplete="new-password"
          hasError={!!formik.errors.password}
        />
        {formik.values.password && (
          <>
            <div className={`auth-strength ${strength}`}>
              <span />
            </div>
            <div className="auth-strength-label">Password strength: {strengthLabel}</div>
          </>
        )}
        {formik.errors.password && (
          <div className="error" style={{ marginTop: -6, marginBottom: 8 }}>
            Password does not meet requirements.
          </div>
        )}
        <ul className="auth-hints">
          <li className={rules.len ? "ok" : ""}>At least 8 characters</li>
          <li className={rules.upper ? "ok" : ""}>One uppercase letter</li>
          <li className={rules.num ? "ok" : ""}>One number</li>
        </ul>
        <PasswordField
          label="Confirm Password"
          value={formik.values.confirm}
          onChange={(value) => formik.setFieldValue("confirm", value)}
          placeholder="Confirm new password"
          autoComplete="new-password"
          hasError={!!formik.errors.confirm}
          error="Passwords must match."
        />
        <button type="submit" className={`auth-btn${formik.isSubmitting ? " loading" : ""}`} disabled={formik.isSubmitting}>
          <span className="spinner" />
          <span className="btn-label">{formik.isSubmitting ? "Updating..." : "Reset Password"}</span>
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
  );
}

export default function ResetPasswordPage() {
  return (
    <AuthLayout>
      <div className="auth-card auth-panel active">
        <Suspense fallback={null}>
          <ResetPasswordForm />
        </Suspense>
      </div>
    </AuthLayout>
  );
}
