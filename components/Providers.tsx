"use client";

import { I18nProvider } from "@/lib/i18n";
import { ThemeProvider } from "@/lib/theme";
import { UIProvider } from "@/lib/ui";
import { AuthProvider } from "@/lib/auth";
import ToastStack from "@/components/ToastStack";
import AppLoaderOverlay from "@/components/AppLoaderOverlay";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <I18nProvider>
      <ThemeProvider>
        <AuthProvider>
          <UIProvider>
            {children}
            <ToastStack />
            <AppLoaderOverlay />
          </UIProvider>
        </AuthProvider>
      </ThemeProvider>
    </I18nProvider>
  );
}
