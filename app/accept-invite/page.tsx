"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useFormik } from "formik";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import AuthLayout, { AuthCardLogo } from "@/components/auth/AuthLayout";
import PasswordField from "@/components/auth/PasswordField";
import { passwordRules, passwordRulesPass } from "@/lib/authValidation";
import { useAuth } from "@/lib/auth";
import { setStoredSession } from "@/lib/tokenStorage";
import { authLoginSuccess } from "@/redux/auth/action";
import type { AppDispatch } from "@/redux/store";
import { acceptExistingInviteApi, acceptNewInviteApi, getInvitePreviewApi, type InvitePreview } from "@/services/teamService";
import { extractApiErrorMessage } from "@/services/apiTypes";

interface FormValues {
  name: string;
  password: string;
  confirm: string;
}

function AcceptInviteForm() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useAuth();
  const token = useSearchParams().get("token") ?? "";

  const [preview, setPreview] = useState<InvitePreview | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [accepting, setAccepting] = useState(false);

  useEffect(() => {
    if (!token) return;
    getInvitePreviewApi(token)
      .then(setPreview)
      .catch((err) => setLoadError(extractApiErrorMessage(err, "This invite link is invalid or has expired")));
  }, [token]);

  const effectiveError = token ? loadError : "This invite link is missing its token.";

  const formik = useFormik<FormValues>({
    initialValues: { name: "", password: "", confirm: "" },
    validateOnChange: false,
    validateOnBlur: false,
    validate: (values) => {
      const errors: Partial<Record<keyof FormValues, boolean>> = {};
      if (!values.name.trim()) errors.name = true;
      if (!passwordRulesPass(passwordRules(values.password))) errors.password = true;
      if (values.confirm !== values.password) errors.confirm = true;
      return errors;
    },
    onSubmit: async (values, { setSubmitting }) => {
      try {
        const response = await acceptNewInviteApi(token, values.name, values.password);
        setStoredSession(response.data);
        dispatch(authLoginSuccess(response.data));
        toast.success(response.message);
        router.push("/dashboard");
      } catch (err) {
        toast.error(extractApiErrorMessage(err, "Couldn't accept the invite"));
      } finally {
        setSubmitting(false);
      }
    },
  });

  async function acceptAsLoggedInUser() {
    setAccepting(true);
    try {
      const response = await acceptExistingInviteApi(token);
      toast.success(response.message);
      router.push("/dashboard");
    } catch (err) {
      toast.error(extractApiErrorMessage(err, "Couldn't accept the invite"));
    } finally {
      setAccepting(false);
    }
  }

  const passwordRuleState = passwordRules(formik.values.password);

  return (
    <>
      <AuthCardLogo />

      {effectiveError ? (
          <>
            <h2>Invite not found</h2>
            <p className="auth-sub">{effectiveError}</p>
            <Link href="/login" className="auth-link" style={{ display: "inline-block", marginTop: 12 }}>
              Go to login
            </Link>
          </>
        ) : !preview ? (
          <p className="auth-sub">…</p>
        ) : preview.alreadyRegistered ? (
          <>
            <h2>You&apos;ve been invited</h2>
            <p className="auth-sub">
              <strong>{preview.ownerName}</strong> invited <strong>{preview.email}</strong> to join their DigiMoiBook
              team. An account with this email already exists.
            </p>
            {user?.email?.toLowerCase() === preview.email.toLowerCase() ? (
              <button type="button" className="auth-btn" disabled={accepting} onClick={acceptAsLoggedInUser}>
                {accepting ? "..." : "Accept Invite"}
              </button>
            ) : (
              <>
                <p className="auth-sub">Log in with that email, then come back to this link to accept.</p>
                <Link href="/login" className="auth-btn" style={{ display: "block", textAlign: "center", textDecoration: "none" }}>
                  Go to login
                </Link>
              </>
            )}
          </>
        ) : (
          <>
            <h2>You&apos;ve been invited</h2>
            <p className="auth-sub">
              <strong>{preview.ownerName}</strong> invited you to join their DigiMoiBook team. Set up your account to
              accept.
            </p>
            <form noValidate onSubmit={formik.handleSubmit}>
              <div className={`auth-field${formik.errors.name ? " has-error" : ""}`}>
                <label htmlFor="inviteName">Full Name</label>
                <input
                  id="inviteName"
                  name="name"
                  autoComplete="name"
                  placeholder="Enter your full name"
                  value={formik.values.name}
                  onChange={formik.handleChange}
                  required
                />
                <div className="error">Name is required.</div>
              </div>
              <div className="auth-field">
                <label>Email Address</label>
                <input value={preview.email} disabled />
              </div>
              <PasswordField
                label="Password"
                value={formik.values.password}
                onChange={(v) => formik.setFieldValue("password", v)}
                placeholder="Create a password"
                autoComplete="new-password"
                hasError={!!formik.errors.password}
                error="Password does not meet requirements."
              />
              <ul className="auth-hints">
                <li className={passwordRuleState.len ? "ok" : ""}>At least 8 characters</li>
                <li className={passwordRuleState.upper ? "ok" : ""}>One uppercase letter</li>
                <li className={passwordRuleState.num ? "ok" : ""}>One number</li>
              </ul>
              <PasswordField
                label="Confirm Password"
                value={formik.values.confirm}
                onChange={(v) => formik.setFieldValue("confirm", v)}
                placeholder="Confirm your password"
                autoComplete="new-password"
                hasError={!!formik.errors.confirm}
                error="Passwords must match."
              />
              <button type="submit" className="auth-btn" disabled={formik.isSubmitting} style={{ marginTop: 8 }}>
                {formik.isSubmitting ? "..." : "Accept Invite"}
              </button>
            </form>
        </>
      )}
    </>
  );
}

export default function AcceptInvitePage() {
  return (
    <AuthLayout>
      <div className="auth-card auth-panel active">
        <Suspense fallback={null}>
          <AcceptInviteForm />
        </Suspense>
      </div>
    </AuthLayout>
  );
}
