"use client";
import React, { useState } from "react";
import type { JSX } from "react";
export default function RegisterForm(): JSX.Element {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
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
      const registerResponse = await fetch(`${baseUrl}/api/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
        credentials: "include", // Include cookies for session-based auth if needed
      });

      // Check if the response is not OK
      if (!registerResponse.ok) {
        try {
          // Attempt to parse a JSON error message
          const errorData = await registerResponse.json();
          setError(errorData.msg || "Registration failed. Please try again.");
        } catch (jsonError) {
          // If response is not JSON, try to get plain text error
          const textError = await registerResponse.text();
          console.error("Non-JSON error response:", textError);
          setError("Registration failed. Server returned an invalid response.");
        }
        return;
      }

      // Parse successful registration response
      const registerData = await registerResponse.json();
      const token = registerData.token;

      if (!token) {
        setError("Registration failed. No token received.");
        return;
      }

      // Store the token in local storage
      localStorage.setItem("authToken", token);

      // Redirect to the '/admin' page after a successful registration
      window.location.href = "/admin";
    } catch (error) {
      console.error("Network error during registration:", error);
      setError(
        "Could not connect to the server. Please check your connection and try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white shadow rounded-lg p-6 w-full max-w-md">
      <h2 className="text-xl font-semibold text-gray-800 mb-6 text-center">
        Register
      </h2>
      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-700 border border-red-200 rounded-md text-sm">
          {error}
        </div>
      )}
      <form onSubmit={handleRegister}>
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
            placeholder="user@example.com"
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
          className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          disabled={isLoading}
        >
          {isLoading ? "Registering..." : "Register"}
        </button>
      </form>
      <div className="mt-4 text-center">
        <p className="text-sm text-gray-600">
          Already registered?{" "}
          <button
            type="button"
            onClick={() => (window.location.href = "/login")}
            className="ml-2 text-blue-600 hover:text-blue-800 font-medium"
          >
            Login here.
          </button>
        </p>
      </div>
    </div>
  );
}
