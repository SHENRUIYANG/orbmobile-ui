import type { Metadata, Viewport } from "next";
import "./globals.css";

import { Providers } from "./providers";

export const metadata: Metadata = {
  title: "ORBCAFE-UI",
  description: "ORBCAFE UI Examples",
  icons: {
    icon: "/orbcafe.png",
    shortcut: "/orbcafe.png",
    apple: "/orbcafe.png",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning className="antialiased">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
