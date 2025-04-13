"use client";

import Link from "next/link";
import { Activity, LogOut, User } from "lucide-react";
import type { JSX } from "react";

interface NavBarProps {
  isLoggedIn: boolean;
  view: "public" | "login" | "admin";
}

export default function NavBar({ isLoggedIn, view }: NavBarProps): JSX.Element {
  return (
    <nav className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Activity className="h-8 w-8 text-blue-600" />
            <span className="ml-2 text-xl font-bold text-gray-900">StatusPage</span>
          </div>
          <div className="flex items-center">
            {isLoggedIn ? (
              <div className="flex items-center space-x-4">
                <Link
                  href="/admin"
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    view === "admin" ? "bg-blue-100 text-blue-800" : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  Dashboard
                </Link>
                <Link
                  href="/"
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    view === "public" ? "bg-blue-100 text-blue-800" : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  Public View
                </Link>
                <button
                  onClick={() => (window.location.href = "/")}
                  className="flex items-center text-gray-600 hover:text-gray-900"
                >
                  <LogOut className="h-5 w-5 mr-1" />
                  Logout
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="flex items-center text-gray-600 hover:text-gray-900"
              >
                <User className="h-5 w-5 mr-1" />
                Admin Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
