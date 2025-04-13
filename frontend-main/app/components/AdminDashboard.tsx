// components/AdminDashboard.tsx

"use client";
import type { JSX } from "react";
const API_BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

import { useState, useEffect } from "react";
import {
    CheckCircle,
    AlertTriangle,
    XCircle,
    Clock,
    Edit2,
    Trash2
} from "lucide-react";

/*interface Service {
    id: number;
    name: string;
    status: "operational" | "degraded" | "outage";
    uptime: string;
}*/
interface Service {
 
    id: number;  // Changed from id: number
    _id: string;
    name: string;
    status: "operational" | "degraded" | "outage";
    uptime: string;
    createdAt?: string;
    updatedAt?: string;
    __v?: number;
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

export default function AdminDashboard(): JSX.Element {
    const [incidents, setIncidents] = useState<Incident[]>([]);
    const [services, setServices] = useState<Service[]>([
        {_id:"1",  id: 1,  name: "API", status: "operational", uptime: "99.99%" },
        {_id:"2",  id: 2,  name: "Web App", status: "degraded", uptime: "98.72%" },
        {_id:"3",  id: 3,  name: "Database", status: "operational", uptime: "99.95%" },
        {_id:"4",  id: 4,  name: "Authentication", status: "operational", uptime: "99.98%" },
        { _id:"5",  id: 5, name: "Payment Processing", status: "outage", uptime: "95.43%" }
    ]);
   // Use Partial to make all properties optional
   const [newService, setNewService] = useState<Partial<Omit<Service, "uptime">>>({
    name: "",
    status: "operational"
  });
    const [editingService, setEditingService] = useState<Service | null>(null);
    const [newIncident, setNewIncident] = useState<Omit<Incident, "id" | "status" | "createdAt" | "updatedAt">>({
        title: "",
        description: "",
        affectedServices: [],
        severity: "minor"
    });
    useEffect(() => {
        const fetchServices = async () => {
            // Get the auth token
            const token = localStorage.getItem('authToken');

            if (!token) {
                // If no token, maybe just use default services or redirect to login
                console.warn("No authentication token found. Using default services.");
                return;
            }

            try {
                const response = await fetch("http://localhost:5001/api/services", {
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                });

                if (!response.ok) {
                    throw new Error(`Failed to fetch services: ${response.status}`);
                }

                const data = await response.json();
                setServices(data);
            } catch (err) {
                console.error("Failed to fetch services:", err);
                // Keep using the default services if API fails
            }
        };

        fetchServices();
    }, []);

    /*  useEffect(() => {
          fetch("http://localhost:5001/api/services")
              .then((res) => {
                  if (!res.ok) throw new Error('Failed to fetch services');
                  return res.json();
              })
              .then((data) => setServices(data))
              .catch((err) => {
                  console.error("Failed to fetch services:", err);
                  // Keep using the default services if API fails
              });
      }, []);*/


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
                description:
                    "We're experiencing slow response times in our web application.",
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


    const handleServiceSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        // Get the auth token from localStorage or your auth state management
        const token = localStorage.getItem('authToken'); // Adjust based on how you store tokens

        if (!token) {
            alert("You must be logged in to perform this action");
            return;
        }

        try {
            if (editingService) {
                const response = await fetch(`http://localhost:5001/api/services/${editingService.id}`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}` // Add the token
                    },
                    body: JSON.stringify(editingService),
                });

                if (!response.ok) {
                    const errorText = await response.text();
                    throw new Error(`Failed to update service: ${response.status} ${errorText}`);
                }

                const updatedService = await response.json();
                setServices(services.map(s => s.id === updatedService.id ? updatedService : s));
                setEditingService(null);
            } else {
                const response = await fetch(`http://localhost:5001/api/services`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}` // Add the token
                    },
                    body: JSON.stringify(newService),
                });

                if (!response.ok) {
                    const errorText = await response.text();
                    throw new Error(`Failed to create service: ${response.status} ${errorText}`);
                }

                const addedService = await response.json();
                setServices([...services, { ...addedService, uptime: "100.00%" }]);
                setNewService({ name: "", status: "operational" });
            }
        } catch (err) {
            console.error("Failed to submit service:", err);
            const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
            alert(errorMessage);
        }
    };

    const handleIncidentSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const id = incidents.length > 0 ? Math.max(...incidents.map(i => i.id)) + 1 : 1;
        const now = new Date().toISOString();

        setIncidents([
            ...incidents,
            { ...newIncident, id, status: "investigating", createdAt: now, updatedAt: now }
        ]);

        // Update services status based on incident severity
        setServices(services.map(service =>
            newIncident.affectedServices.includes(service.id)
                ? { ...service, status: newIncident.severity === "critical" ? "outage" : "degraded" }
                : service
        ));

        setNewIncident({ title: "", description: "", affectedServices: [], severity: "minor" });
    };
    const handleDeleteService = async (id: string) => {
        // Get the auth token
        const token = localStorage.getItem('authToken');
        
        if (!token) {
            alert("You must be logged in to perform this action");
            return;
        }
        
        // More thorough ID validation
        if (!id) {
            console.error("Cannot delete service: Invalid ID", id);
            alert("Invalid service ID");
            return;
        }
        
        try {
            console.log(`Attempting to delete service with ID: ${id}`);
            const response = await fetch(`http://localhost:5001/api/services/${id}`, {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });
            
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Failed to delete service: ${response.status} ${errorText}`);
            }
            
            // Note: Here we filter using _id, not id
            setServices(services.filter(s => s._id !== id));
        } catch (err) {
            console.error("Failed to delete service:", err);
            const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
            alert(errorMessage);
        }
    };



    const handleEditService = (service: Service) => {
        setEditingService(service);
    };

    const handleIncidentServiceToggle = (serviceId: number) => {
        if (newIncident.affectedServices.includes(serviceId)) {
            setNewIncident({
                ...newIncident,
                affectedServices: newIncident.affectedServices.filter(id => id !== serviceId)
            });
        } else {
            setNewIncident({
                ...newIncident,
                affectedServices: [...newIncident.affectedServices, serviceId]
            });
        }
    };

    return (
        <div className="space-y-8">
            <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>

            {/* Manage Services Section */}
            <div className="bg-white shadow rounded-lg p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">
                    {editingService ? "Edit Service" : "Add New Service"}
                </h2>
                <form onSubmit={handleServiceSubmit} className="mb-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Service Name
                            </label>
                            <input
                                type="text"
                                value={editingService ? editingService.name : newService.name}
                                onChange={(e) =>
                                    editingService
                                        ? setEditingService({ ...editingService, name: e.target.value })
                                        : setNewService({ ...newService, name: e.target.value })
                                }
                                required
                                placeholder="e.g. API, Web App, Database"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Status
                            </label>
                            <select
                                value={editingService ? editingService.status : newService.status}
                                onChange={(e) =>
                                    editingService
                                        ? setEditingService({ ...editingService, status: e.target.value as Service["status"] })
                                        : setNewService({ ...newService, status: e.target.value as Service["status"] })
                                }
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            >
                                <option value="operational">Operational</option>
                                <option value="degraded">Degraded</option>
                                <option value="outage">Outage</option>
                            </select>
                        </div>
                    </div>
                    <div className="mt-4 flex justify-end">
                        {editingService && (
                            <button
                                type="button"
                                onClick={() => setEditingService(null)}
                                className="mr-2 px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                        )}
                        <button
                            type="submit"
                            className="px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                            {editingService ? "Update Service" : "Add Service"}
                        </button>
                    </div>
                </form>

                <h3 className="text-lg font-medium text-gray-800 mb-3">Current Services</h3>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Service
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Status
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Uptime
                                </th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {services.map((service) => (
                                <tr key={service.name}>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            {getStatusIcon(service.status)}
                                            <span className="ml-2 text-sm font-medium text-gray-900">
                                                {service.name}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span
                                            className={`px-2 py-1 text-xs rounded-full ${service.status === "operational"
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
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {service.uptime}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <button
                                            onClick={() => handleEditService(service)}
                                            className="text-blue-600 hover:text-blue-900 mr-4"
                                        >
                                            <Edit2 className="h-4 w-4" />
                                        </button>
                                        <button
                                            onClick={() => handleDeleteService(service._id)}
                                            className="text-red-600 hover:text-red-800"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Create Incident Section */}
            <div className="bg-white shadow rounded-lg p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Create Incident</h2>
                <form onSubmit={handleIncidentSubmit}>
                    <div className="grid grid-cols-1 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Incident Title
                            </label>
                            <input
                                type="text"
                                value={newIncident.title}
                                onChange={(e) =>
                                    setNewIncident({ ...newIncident, title: e.target.value })
                                }
                                required
                                placeholder="e.g. API Performance Degradation"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Description
                            </label>
                            <textarea
                                value={newIncident.description}
                                onChange={(e) =>
                                    setNewIncident({ ...newIncident, description: e.target.value })
                                }
                                rows={3}
                                required
                                placeholder="Describe the incident and its impact"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            ></textarea>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Severity
                            </label>
                            <select
                                value={newIncident.severity}
                                onChange={(e) =>
                                    setNewIncident({
                                        ...newIncident,
                                        severity: e.target.value as "minor" | "major" | "critical"
                                    })
                                }
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            >
                                <option value="minor">Minor</option>
                                <option value="major">Major</option>
                                <option value="critical">Critical</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Affected Services
                            </label>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                                {services.map((service) => (
                                    <label key={service.name} className="flex items-center space-x-2">
                                        <input
                                            type="checkbox"
                                            checked={newIncident.affectedServices.includes(service.id)}
                                            onChange={() => handleIncidentServiceToggle(service.id)}
                                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                        />
                                        <span className="text-sm text-gray-700">{service.name}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    </div>
                    <div className="mt-4 flex justify-end">
                        <button
                            type="submit"
                            className="px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                            Create Incident
                        </button>
                    </div>
                </form>
            </div>

            {/* Active Incidents Section */}
            <div className="bg-white shadow rounded-lg p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Active Incidents</h2>
                {incidents.length > 0 ? (
                    <div className="space-y-4">
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
                                            className={`px-2 py-1 text-xs rounded-full ${incident.severity === "critical"
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
                                        <div className="flex justify-between items-center mt-1">
                                            <p>Created: {new Date(incident.createdAt).toLocaleString()}</p>
                                            <div className="flex space-x-2">
                                                <button className="text-sm text-blue-600 hover:text-blue-800">
                                                    Update
                                                </button>
                                                <button className="text-sm text-green-600 hover:text-green-800">
                                                    Resolve
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <p className="text-gray-500">No active incidents.</p>
                )}
            </div>
        </div>
    );
}