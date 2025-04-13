"use client";
import type { JSX } from "react";

import NavBar from "../components/NavBar";
import RegisterForm from "../components/RegisterForm";
import Footer from "../components/Footer";

export default function RegisterPage(): JSX.Element {
  return (
    <div className="min-h-screen bg-gray-50">
      <main className="flex justify-center py-8">
        <RegisterForm />
      </main>
      <Footer />
    </div>
  );
}
