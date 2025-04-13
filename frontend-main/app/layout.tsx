// app/layout.tsx
import "./globals.css";
import { ReactNode } from "react";
import type { JSX } from "react";

export const metadata = {
  title: "StatusPage",
  description: "Your real‑time system status dashboard",
};

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps): JSX.Element {
  return (
    <html lang="en">
      <head>
        {/* Additional head tags if needed */}
      </head>
      <body>{children}</body>
    </html>
  );
}
