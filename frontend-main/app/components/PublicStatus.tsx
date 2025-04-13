// components/PublicStatus.tsx
"use client";

import { useState, useEffect } from "react";
import { CheckCircle, AlertTriangle, XCircle, Clock } from "lucide-react";
import type { JSX } from "react";

interface Service {
  id: number;
  name: string;
  status: "operational" | "degraded" | "outage";
  uptime: string;
}

interface Incident {
  id: number;
  title: string;
  description: string;
  status: string;
  severity: "minor" | "major" | "critical";
  createdAt: string;
  updatedAt: string;
  affectedServices: number[];
}

export default function PublicStatus(): JSX.Element {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [services, setServices] = useState<Service[]>([
    { id: 1, name: "API", status: "operational", uptime: "99.99%" },
    { id: 2, name: "Web App", status: "degraded", uptime: "98.72%" },
    { id: 3, name: "Database", status: "operational", uptime: "99.95%" },
    { id: 4, name: "Authentication", status: "operational", uptime: "99.98%" },
    { id: 5, name: "Payment Processing", status: "outage", uptime: "95.43%" }
  ]);

  // Load demo incidents on mount
  useEffect(() => {
    setIncidents([
      {
        id: 1,
        title: "Payment Processing Outage",
        description:
          "Our payment processor is experiencing issues that are affecting payment processing.",
        status: "investigating",
        severity: "critical",
        createdAt: "2025-04-11T08:23:00Z",
        updatedAt: "2025-04-11T08:45:00Z",
        affectedServices: [5]
      },
      {
        id: 2,
        title: "Web App Performance Degradation",
        description: "We're experiencing slow response times in our web application.",
        status: "identified",
        severity: "major",
        createdAt: "2025-04-11T07:15:00Z",
        updatedAt: "2025-04-11T08:30:00Z",
        affectedServices: [2]
      }
    ]);
  }, []);

  const getStatusIcon = (status: string): JSX.Element => {
    switch (status) {
      case "operational":
        return <CheckCircle className="text-green-500" />;
      case "degraded":
        return <AlertTriangle className="text-yellow-500" />;
      case "outage":
        return <XCircle className="text-red-500" />;
      default:
        return <Clock className="text-gray-500" />;
    }
  };

  return (
    <div className="space-y-8">
      {/* System Status */}
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">System Status</h2>
        <div className="flex items-center mb-6">
          <div
            className={`h-4 w-4 rounded-full mr-2 ${
              services.some((s) => s.status === "outage")
                ? "bg-red-500"
                : services.some((s) => s.status === "degraded")
                ? "bg-yellow-500"
                : "bg-green-500"
            }`}
          ></div>
          <span className="font-medium">
            {services.some((s) => s.status === "outage")
              ? "Major System Outage"
              : services.some((s) => s.status === "degraded")
              ? "Partial System Outage"
              : "All Systems Operational"}
          </span>
        </div>
        <div className="border-t border-gray-200 pt-4">
          <h3 className="text-lg font-medium text-gray-800 mb-3">Services</h3>
          <div className="space-y-3">
            {services.map((service) => (
              <div
                key={service.id}
                className="flex items-center justify-between py-2 border-b border-gray-100"
              >
                <div className="flex items-center">
                  {getStatusIcon(service.status)}
                  <span className="ml-2 text-gray-700">{service.name}</span>
                </div>
                <div className="flex items-center">
                  <span
                    className={`px-2 py-1 text-xs rounded-full ${
                      service.status === "operational"
                        ? "bg-green-100 text-green-800"
                        : service.status === "degraded"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {service.status === "operational"
                      ? "Operational"
                      : service.status === "degraded"
                      ? "Degraded Performance"
                      : "Service Outage"}
                  </span>
                  <span className="ml-4 text-sm text-gray-500">
                    {service.uptime} uptime
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Active Incidents */}
      {incidents.length > 0 && (
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Active Incidents
          </h2>
          <div className="space-y-6">
            {incidents.map((incident) => {
              const affectedServiceNames = services
                .filter((s) => incident.affectedServices.includes(s.id))
                .map((s) => s.name)
                .join(", ");

              return (
                <div
                  key={incident.id}
                  className="border-l-4 border-red-500 pl-4 py-2"
                >
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium text-gray-900">
                      {incident.title}
                    </h3>
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${
                        incident.severity === "critical"
                          ? "bg-red-100 text-red-800"
                          : incident.severity === "major"
                          ? "bg-orange-100 text-orange-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {incident.severity.charAt(0).toUpperCase() +
                        incident.severity.slice(1)}
                    </span>
                  </div>
                  <p className="text-gray-600 mt-1 text-sm">
                    {incident.description}
                  </p>
                  <div className="mt-2 text-sm text-gray-500">
                    <p>Affected services: {affectedServiceNames}</p>
                    <p className="mt-1">
                      Last updated:{" "}
                      {new Date(incident.updatedAt).toLocaleString()}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
