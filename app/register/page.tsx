"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import AuthLayout, { AuthCardLogo } from "@/components/auth/AuthLayout";
import PasswordField from "@/components/auth/PasswordField";
import { validEmail, passwordRules, passwordRulesPass } from "@/lib/authValidation";
import { useAuth } from "@/lib/auth";

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
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [terms, setTerms] = useState(false);
  const [errors, setErrors] = useState<Errors>({});
  const [loading, setLoading] = useState(false);

  const rules = passwordRules(password);

  function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const next: Errors = {};
    if (!name.trim()) next.name = true;
    if (!validEmail(email)) next.email = true;
    if (!phone.trim()) next.phone = true;
    if (!passwordRulesPass(rules)) next.password = true;
    if (password !== confirm) next.confirm = true;
    if (!terms) next.terms = true;
    setErrors(next);
    if (Object.keys(next).length) return;

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      register(name, email);
      router.push("/dashboard");
    }, 1000);
  }

  return (
    <AuthLayout>
      <div className="auth-card auth-panel active">
        <AuthCardLogo />
        <h2>Create your I Moi Book</h2>
        <p className="auth-sub">Start beautifully organizing your celebrations.</p>
        <form noValidate onSubmit={submit}>
          <div className={`auth-field${errors.name ? " has-error" : ""}`}>
            <label htmlFor="regName">Full Name</label>
            <input id="regName" autoComplete="name" placeholder="Enter your full name" value={name} onChange={(e) => setName(e.target.value)} required />
            <div className="error">Name is required.</div>
          </div>
          <div className={`auth-field${errors.email ? " has-error" : ""}`}>
            <label htmlFor="regEmail">Email Address</label>
            <input
              type="email"
              id="regEmail"
              autoComplete="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <div className="error">Please enter a valid email.</div>
          </div>
          <div className={`auth-field${errors.phone ? " has-error" : ""}`}>
            <label htmlFor="regPhone">Phone Number</label>
            <input
              type="tel"
              id="regPhone"
              autoComplete="tel"
              placeholder="Enter your phone number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
            <div className="error">Phone is required.</div>
          </div>
          <PasswordField
            label="Password"
            value={password}
            onChange={setPassword}
            placeholder="Create a password"
            autoComplete="new-password"
            hasError={errors.password}
            error="Password does not meet requirements."
          />
          <ul className="auth-hints">
            <li className={rules.len ? "ok" : ""}>At least 8 characters</li>
            <li className={rules.upper ? "ok" : ""}>One uppercase letter</li>
            <li className={rules.num ? "ok" : ""}>One number</li>
          </ul>
          <PasswordField
            label="Confirm Password"
            value={confirm}
            onChange={setConfirm}
            placeholder="Confirm your password"
            autoComplete="new-password"
            hasError={errors.confirm}
            error="Passwords must match."
          />
          <div className={`auth-field auth-terms-field${errors.terms ? " has-error" : ""}`}>
            <label className="auth-check" htmlFor="regTerms">
              <input type="checkbox" id="regTerms" checked={terms} onChange={(e) => setTerms(e.target.checked)} required />
              <span>I agree to the Terms &amp; Privacy Policy</span>
            </label>
            <div className="error">Please accept the terms.</div>
          </div>
          <button type="submit" className={`auth-btn${loading ? " loading" : ""}`} disabled={loading}>
            <span className="spinner" />
            <span className="btn-label">{loading ? "Creating account..." : "Create Account"}</span>
          </button>
        </form>
        <div className="auth-footer">
          Already have an account? <Link href="/login">Sign In</Link>
        </div>
      </div>
    </AuthLayout>
  );
}
