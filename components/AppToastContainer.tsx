"use client";

import { ToastContainer } from "react-toastify";
import { useTheme } from "@/lib/theme";

/** react-toastify's own container, used for auth (login/register/...) success + error messages. */
export default function AppToastContainer() {
  const { mode } = useTheme();
  return <ToastContainer position="top-center" autoClose={4000} theme={mode} newestOnTop />;
}
