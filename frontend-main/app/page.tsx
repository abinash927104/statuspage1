// app/page.tsx
"use client";
import type { JSX } from "react";

import NavBar from "./components/NavBar";
import PublicStatus from "./components/PublicStatus";
import Footer from "./components/Footer";

export default function PublicPage(): JSX.Element {
  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar isLoggedIn={false} view="public" />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <PublicStatus />
      </main>
      <Footer />
    </div>
  );
}
