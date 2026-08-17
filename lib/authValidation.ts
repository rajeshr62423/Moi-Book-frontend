export function validEmail(v: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
}

export interface PasswordRules {
  len: boolean;
  upper: boolean;
  num: boolean;
}

export function passwordRules(v: string): PasswordRules {
  return { len: v.length >= 8, upper: /[A-Z]/.test(v), num: /[0-9]/.test(v) };
}

export function passwordRulesPass(rules: PasswordRules) {
  return rules.len && rules.upper && rules.num;
}

export function passwordStrength(rules: PasswordRules): "weak" | "fair" | "strong" {
  const score = (rules.len ? 1 : 0) + (rules.upper ? 1 : 0) + (rules.num ? 1 : 0);
  if (score <= 1) return "weak";
  if (score === 2) return "fair";
  return "strong";
}
