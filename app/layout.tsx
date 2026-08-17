import type { Metadata, Viewport } from "next";
import Script from "next/script";
import Providers from "@/components/Providers";
import "./globals.css";
import StoreProvider from "./StoreProvider";

export const metadata: Metadata = {
  title: "DigiMoiBook — Every Celebration, Beautifully Kept",
  description:
    "Organize events, guests, gifts and memories in one peaceful place.",
};

export const viewport: Viewport = {
  themeColor: "#D99A18",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    // suppressHydrationWarning: the beforeInteractive script below sets
    // data-theme/data-appearance on <html> ahead of hydration to avoid a
    // flash of the wrong theme; React would otherwise warn about attributes
    // it didn't render itself (the same pattern next-themes uses).
    <html lang="en" data-accent="original" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        {/* next/font isn't used here because the design system's CSS references
            the literal families ('Playfair Display', 'Manrope') by name in
            dozens of rules; loading them as regular web fonts keeps every
            declaration working without a global find-replace. */}
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@500;600;700&family=Manrope:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
        {/* Next.js requires beforeInteractive scripts to be declared directly
            in the root layout (it hoists them into <head> regardless of
            where they're placed, but its own lint rule only recognizes this
            exact spot). The actual logic lives in public/theme-init.js —
            see that file for why it has to run before hydration. */}
        <Script src="/theme-init.js" strategy="beforeInteractive" />
      </head>

      <body suppressHydrationWarning>
        <StoreProvider>
          <Providers>{children}</Providers>
        </StoreProvider>
      </body>
    </html>
  );
}
