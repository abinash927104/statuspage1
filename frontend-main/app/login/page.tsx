// app/login/page.tsx
"use client";
import type { JSX } from "react";

import NavBar from "../components/NavBar";
import LoginForm from "../components/LoginForm";
import Footer from "../components/Footer";

export default function LoginPage(): JSX.Element {
  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar isLoggedIn={false} view="login" />
      <main className="flex justify-center py-8">
        <LoginForm />
      </main>
      <Footer />
    </div>
  );
}
