"use client";

import { useToast } from "@/lib/ui";
import { CheckIcon } from "@/components/icons";

export default function ToastStack() {
  const { toasts } = useToast();
  return (
    <div className="toast-stack">
      {toasts.map((toast) => (
        <div className={`toast${toast.leaving ? " leaving" : ""}`} key={toast.id}>
          <CheckIcon />
          <span>{toast.message}</span>
        </div>
      ))}
    </div>
  );
}
