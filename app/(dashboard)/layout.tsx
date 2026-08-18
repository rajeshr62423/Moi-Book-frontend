"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";
import Sidebar from "@/components/Sidebar";
import CreateEventModal from "@/components/modals/CreateEventModal";
import ViewEventModal from "@/components/modals/ViewEventModal";
import AddGuestModal from "@/components/modals/AddGuestModal";
import AddVendorModal from "@/components/modals/AddVendorModal";
import CreateMoiModal from "@/components/modals/CreateMoiModal";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, isReady } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isReady && !user) router.replace("/login");
  }, [isReady, user, router]);

  if (!isReady || !user) return null;

  return (
    <div className="app">
      <Sidebar />
      <main className="main">{children}</main>
      <CreateEventModal />
      <ViewEventModal />
      <AddGuestModal />
      <AddVendorModal />
      <CreateMoiModal />
    </div>
  );
}
