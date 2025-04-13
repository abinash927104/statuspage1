"use client";
import type { JSX } from "react";
import React, { useState } from "react";

export default function LoginForm(): JSX.Element {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    // Get form values
    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    // Get the base URL from the environment variables, with a fallback to localhost
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:5001";

    try {
      console.log("Attempting login to:", `${baseUrl}/api/auth/login`);

      const loginResponse = await fetch(`${baseUrl}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
        credentials: "include", // Include cookies for session-based auth
      });

      console.log("Response status:", loginResponse.status);
      console.log("Response headers:", loginResponse.headers.get("content-type"));

      // Check if response is not OK
      if (!loginResponse.ok) {
        try {
          // Try to parse as JSON first
          const errorData = await loginResponse.json();
          setError(errorData.msg || "Login failed. Please try again.");
        } catch (jsonError) {
          // If not JSON, get as text
          const textError = await loginResponse.text();
          console.error("Non-JSON error response:", textError);
          setError("Login failed. Server returned an invalid response.");
        }
        return;
      }

      try {
        const loginData = await loginResponse.json();
        const token = loginData.token;

        if (!token) {
          setError("Authentication failed. No token received.");
          return;
        }

        // Store the token
        localStorage.setItem("authToken", token);

        // Redirect to the '/admin' page after a successful login
        window.location.href = "/admin";
      } catch (jsonError) {
        console.error("Error parsing JSON response:", jsonError);
        setError("Error processing the server response. Please try again.");
      }
    } catch (error) {
      console.error("Network error during login:", error);
      setError("Could not connect to the server. Please check your connection and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white shadow rounded-lg p-6 w-full max-w-md">
      <h2 className="text-xl font-semibold text-gray-800 mb-6 text-center">
        Admin Login
      </h2>
      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-700 border border-red-200 rounded-md text-sm">
          {error}
        </div>
      )}
      <form onSubmit={handleLogin}>
        <div className="mb-4">
          <label
            htmlFor="email"
            className="block text-gray-700 text-sm font-medium mb-2"
          >
            Email
          </label>
          <input
            name="email"
            id="email"
            type="email"
            placeholder="admin@example.com"
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>
        <div className="mb-6">
          <label
            htmlFor="password"
            className="block text-gray-700 text-sm font-medium mb-2"
          >
            Password
          </label>
          <input
            name="password"
            id="password"
            type="password"
            placeholder="••••••••"
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          disabled={isLoading}
        >
          {isLoading ? "Signing In..." : "Sign In"}
        </button>
        <div className="mt-4 text-center">
        
          <p className="text-blue-600 mt-2 text-sm">
            Not registered?{" "}
            <button
              type="button"
              onClick={() => (window.location.href = "/register")}
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              Register here.
            </button>
          </p>
        </div>
      </form>
    </div>
  );
}
