"use client";

import { useBodyScrollLock } from "@/lib/useBodyScrollLock";
import { useOutsideClose } from "@/lib/useOutsideClose";
import { useModal, type ModalName } from "@/lib/ui";
import { CloseIcon } from "@/components/icons";

interface ModalShellProps {
  name: ModalName;
  title: string;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  children: React.ReactNode;
  footer: React.ReactNode;
  wide?: boolean;
}

export default function ModalShell({ name, title, onSubmit, children, footer, wide = true }: ModalShellProps) {
  const { activeModal, closeModal } = useModal();
  const isOpen = activeModal === name;

  useBodyScrollLock(isOpen);
  // No container ref: the overlay's own onClick already handles
  // backdrop-click-to-close, so this only needs to listen for Escape.
  useOutsideClose([], closeModal, { active: isOpen });

  return (
    <div
      className={`modal-overlay${isOpen ? " open" : ""}`}
      onClick={(e) => {
        if (e.target === e.currentTarget) closeModal();
      }}
    >
      <div className={`modal${wide ? " modal-wide" : ""}`}>
        <div className="modal-head">
          <h3>{title}</h3>
          <button type="button" className="modal-close" onClick={closeModal}>
            <CloseIcon />
          </button>
        </div>
        <form onSubmit={onSubmit}>
          <div className="modal-body">{children}</div>
          <div className="modal-foot">{footer}</div>
        </form>
      </div>
    </div>
  );
}
