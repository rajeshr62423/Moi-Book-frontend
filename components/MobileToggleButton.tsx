"use client";

import { useSidebar } from "@/lib/ui";
import { MenuIcon } from "@/components/icons";

export default function MobileToggleButton() {
  const { toggle } = useSidebar();
  return (
    <button className="mobile-toggle" onClick={toggle} aria-label="Toggle menu">
      <MenuIcon />
    </button>
  );
}
