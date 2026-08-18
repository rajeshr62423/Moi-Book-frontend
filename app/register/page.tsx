"use client";

import { useFormik } from "formik";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import AuthLayout, { AuthCardLogo } from "@/components/auth/AuthLayout";
import PasswordField from "@/components/auth/PasswordField";
import Checkbox from "@/components/ui/Checkbox";
import { validEmail, passwordRules, passwordRulesPass } from "@/lib/authValidation";
import { useAuth } from "@/lib/auth";

interface RegisterValues {
  name: string;
  email: string;
  phone: string;
  password: string;
  confirm: string;
  terms: boolean;
}

interface Errors {
  name?: boolean;
  email?: boolean;
  phone?: boolean;
  password?: boolean;
  confirm?: boolean;
  terms?: boolean;
}

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuth();

  const formik = useFormik<RegisterValues>({
    initialValues: { name: "", email: "", phone: "", password: "", confirm: "", terms: false },
    // Errors previously only appeared after a submit attempt, never while
    // typing — matched here by validating on submit only.
    validateOnChange: false,
    validateOnBlur: false,
    validate: (values) => {
      const next: Errors = {};
      if (!values.name.trim()) next.name = true;
      if (!validEmail(values.email)) next.email = true;
      if (!values.phone.trim()) next.phone = true;
      if (!passwordRulesPass(passwordRules(values.password))) next.password = true;
      if (values.password !== values.confirm) next.confirm = true;
      if (!values.terms) next.terms = true;
      return next;
    },
    onSubmit: async (values, { setSubmitting }) => {
      try {
        const result = await register({ name: values.name, email: values.email, phone: values.phone, password: values.password });
        toast.success(result.message);
        router.push("/dashboard");
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Registration failed");
      } finally {
        setSubmitting(false);
      }
    },
  });

  const rules = passwordRules(formik.values.password);

  return (
    <AuthLayout>
      <div className="auth-card auth-panel active">
        <AuthCardLogo />
        <h2>Create your DigiMoiBook</h2>
        <p className="auth-sub">Start beautifully organizing your celebrations.</p>
        <form noValidate onSubmit={formik.handleSubmit}>
          <div className={`auth-field${formik.errors.name ? " has-error" : ""}`}>
            <label htmlFor="regName">Full Name</label>
            <input
              id="regName"
              name="name"
              autoComplete="name"
              placeholder="Enter your full name"
              value={formik.values.name}
              onChange={formik.handleChange}
              required
            />
            <div className="error">Name is required.</div>
          </div>
          <div className={`auth-field${formik.errors.email ? " has-error" : ""}`}>
            <label htmlFor="regEmail">Email Address</label>
            <input
              type="email"
              id="regEmail"
              name="email"
              autoComplete="email"
              placeholder="Enter your email"
              value={formik.values.email}
              onChange={formik.handleChange}
              required
            />
            <div className="error">Please enter a valid email.</div>
          </div>
          <div className={`auth-field${formik.errors.phone ? " has-error" : ""}`}>
            <label htmlFor="regPhone">Phone Number</label>
            <input
              type="tel"
              id="regPhone"
              name="phone"
              autoComplete="tel"
              placeholder="Enter your phone number"
              value={formik.values.phone}
              onChange={formik.handleChange}
              required
            />
            <div className="error">Phone is required.</div>
          </div>
          <PasswordField
            label="Password"
            value={formik.values.password}
            onChange={(value) => formik.setFieldValue("password", value)}
            placeholder="Create a password"
            autoComplete="new-password"
            hasError={!!formik.errors.password}
            error="Password does not meet requirements."
          />
          <ul className="auth-hints">
            <li className={rules.len ? "ok" : ""}>At least 8 characters</li>
            <li className={rules.upper ? "ok" : ""}>One uppercase letter</li>
            <li className={rules.num ? "ok" : ""}>One number</li>
          </ul>
          <PasswordField
            label="Confirm Password"
            value={formik.values.confirm}
            onChange={(value) => formik.setFieldValue("confirm", value)}
            placeholder="Confirm your password"
            autoComplete="new-password"
            hasError={!!formik.errors.confirm}
            error="Passwords must match."
          />
          <div className={`auth-field auth-terms-field${formik.errors.terms ? " has-error" : ""}`}>
            <Checkbox
              id="regTerms"
              label="I agree to the Terms & Privacy Policy"
              checked={formik.values.terms}
              onChange={(checked) => formik.setFieldValue("terms", checked)}
              required
            />
            <div className="error">Please accept the terms.</div>
          </div>
          <button type="submit" className={`auth-btn${formik.isSubmitting ? " loading" : ""}`} disabled={formik.isSubmitting}>
            <span className="spinner" />
            <span className="btn-label">{formik.isSubmitting ? "Creating account..." : "Create Account"}</span>
          </button>
        </form>
        <div className="auth-footer">
          Already have an account? <Link href="/login">Sign In</Link>
        </div>
      </div>
    </AuthLayout>
  );
}
