"use client";

import React from "react";
import type { JSX } from "react";

import NavBar from "../components/NavBar";
import AdminDashboard from "../components/AdminDashboard";
import Footer from "../components/Footer";

export default function AdminPage(): JSX.Element {
  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar isLoggedIn={true} view="admin" />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AdminDashboard />
      </main>
      <Footer />
    </div>
  );
}
