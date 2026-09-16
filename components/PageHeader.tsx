import MobileToggleButton from "@/components/MobileToggleButton";

export default function PageHeader({
  title,
  actions,
  backButton,
}: {
  title: string;
  actions?: React.ReactNode;
  backButton?: React.ReactNode;
}) {
  return (
    <div className="topbar">
      <MobileToggleButton />
      {backButton}
      <div className="page-title" style={backButton ? { flex: 1 } : undefined}>
        <span className="page-title-text">{title}</span>
        <svg className="page-title-divider" viewBox="0 0 180 10" fill="none" stroke="currentColor" strokeWidth="1">
          <path d="M0 5h70M110 5h70" />
          <circle cx="90" cy="5" r="3" />
          <path d="M84 5l3-3 3 3-3 3Z" />
        </svg>
      </div>
      {actions && <div className="top-actions">{actions}</div>}
    </div>
  );
}
