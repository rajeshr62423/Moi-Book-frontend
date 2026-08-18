"use client";

import { useBodyScrollLock } from "@/lib/useBodyScrollLock";
import { useOutsideClose } from "@/lib/useOutsideClose";

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  body: string;
  cancelLabel: string;
  confirmLabel: string;
  onCancel: () => void;
  onConfirm: () => void;
}

export default function ConfirmDialog({
  open,
  title,
  body,
  cancelLabel,
  confirmLabel,
  onCancel,
  onConfirm,
}: ConfirmDialogProps) {
  useBodyScrollLock(open);
  useOutsideClose([], onCancel, { active: open });

  return (
    <div
      className={`modal-overlay${open ? " open" : ""}`}
      onClick={(e) => {
        if (e.target === e.currentTarget) onCancel();
      }}
    >
      <div className="modal" style={{ maxWidth: 380 }}>
        <div className="modal-body" style={{ textAlign: "center", padding: "30px 24px 10px" }}>
          <h3 style={{ margin: "0 0 8px", fontFamily: "'Playfair Display',serif", color: "var(--brown)" }}>
            {title}
          </h3>
          <p style={{ color: "var(--muted)", fontSize: 13, margin: 0 }}>{body}</p>
        </div>
        <div className="modal-foot" style={{ justifyContent: "center" }}>
          <button type="button" className="btn ghost" onClick={onCancel}>
            {cancelLabel}
          </button>
          <button type="button" className="btn danger" onClick={onConfirm}>
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
