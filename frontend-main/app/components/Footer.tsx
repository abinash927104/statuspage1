// components/Footer.tsx
"use client";

import { Activity, Bell, Shield, Settings } from "lucide-react";
import type { JSX } from "react";

export default function Footer(): JSX.Element {
  return (
    <footer className="bg-white border-t border-gray-200 mt-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <Activity className="h-6 w-6 text-blue-600" />
            <span className="ml-2 text-lg font-medium text-gray-900">StatusPage</span>
          </div>
          <div className="flex space-x-6">
            <a href="#" className="text-gray-500 hover:text-gray-900">
              <Bell className="h-5 w-5" />
            </a>
            <a href="#" className="text-gray-500 hover:text-gray-900">
              <Shield className="h-5 w-5" />
            </a>
            <a href="#" className="text-gray-500 hover:text-gray-900">
              <Settings className="h-5 w-5" />
            </a>
          </div>
        </div>
        <div className="mt-4 text-center text-sm text-gray-500">
          &copy; 2025 StatusPage. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
