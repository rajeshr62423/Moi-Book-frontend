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
        {title}
      </div>
      {actions && <div className="top-actions">{actions}</div>}
    </div>
  );
}
