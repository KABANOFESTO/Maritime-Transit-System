"use client"
import React from 'react'

interface AlertCardProps {
    title: string;
    count: number;
    bgColor: string;
    textColor: string;
}

interface AlertRowProps {
    alertId: string;
    category: string;
    priority: 'Critical' | 'High' | 'Medium' | 'Low';
    maintenanceStatus: string;
}

const AlertCard = ({ title, count, bgColor, textColor }: AlertCardProps) => (
    <div className="bg-white rounded-lg border border-gray-200 p-6 flex flex-col items-center">
        <h3 className="text-sm font-medium text-gray-600 mb-4">{title}</h3>
        <div className={`${bgColor} ${textColor} text-2xl font-bold px-4 py-2 rounded-md mb-4`}>
            {count}
        </div>
        <button className="text-sm font-medium text-gray-900 hover:text-gray-700">
            View Details
        </button>
    </div>
);

const PriorityBadge = ({ priority }: { priority: string }) => {
    const getColorClasses = (priority: string) => {
        switch (priority.toLowerCase()) {
            case 'critical':
                return 'bg-red-100 text-red-800';
            case 'high':
                return 'bg-orange-100 text-orange-800';
            case 'medium':
                return 'bg-yellow-100 text-yellow-800';
            case 'low':
                return 'bg-green-100 text-green-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getColorClasses(priority)}`}>
            {priority}
        </span>
    );
};

const AlertRow = ({ alertId, category, priority, maintenanceStatus }: AlertRowProps) => (
    <tr className="border-b border-gray-100 hover:bg-gray-50">
        <td className="py-4 px-4 text-sm font-medium text-gray-900">{alertId}</td>
        <td className="py-4 px-4 text-sm text-gray-600">{category}</td>
        <td className="py-4 px-4">
            <PriorityBadge priority={priority} />
        </td>
        <td className="py-4 px-4 text-sm text-gray-600">{maintenanceStatus}</td>
        <td className="py-4 px-4">
            <div className="flex items-center gap-2">
                <button className="p-2 hover:bg-gray-100 rounded-md">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M8 3C4.5 3 1.73 5.61 1.73 8.75C1.73 11.89 4.5 14.5 8 14.5C11.5 14.5 14.27 11.89 14.27 8.75C14.27 5.61 11.5 3 8 3ZM8 12.5C7.17 12.5 6.5 11.83 6.5 11C6.5 10.17 7.17 9.5 8 9.5C8.83 9.5 9.5 10.17 9.5 11C9.5 11.83 8.83 12.5 8 12.5ZM8 5.5C8.83 5.5 9.5 6.17 9.5 7C9.5 7.83 8.83 8.5 8 8.5C7.17 8.5 6.5 7.83 6.5 7C6.5 6.17 7.17 5.5 8 5.5Z" fill="#6B7280"/>
                    </svg>
                </button>
                <button className="p-2 hover:bg-gray-100 rounded-md">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M8 2.5C4.41 2.5 1.5 5.41 1.5 9S4.41 15.5 8 15.5 14.5 12.59 14.5 9 11.59 2.5 8 2.5ZM8 13.5C7.17 13.5 6.5 12.83 6.5 12S7.17 10.5 8 10.5 9.5 11.17 9.5 12 8.83 13.5 8 13.5ZM8.75 8.5H7.25V4.5H8.75V8.5Z" fill="#6B7280"/>
                    </svg>
                </button>
            </div>
        </td>
    </tr>
);

const Alert = () => {
    const alertsData = [
        { title: "Critical Alerts", count: 5, bgColor: "bg-orange-500", textColor: "text-white" },
        { title: "High Alerts", count: 8, bgColor: "bg-red-600", textColor: "text-white" },
        { title: "Medium Alerts", count: 15, bgColor: "bg-yellow-400", textColor: "text-white" },
        { title: "Low Alerts", count: 20, bgColor: "bg-green-600", textColor: "text-white" }
    ];

    const activeAlerts = [
        { alertId: "A001", category: "Vessel", priority: "Critical" as const, maintenanceStatus: "Pending" }
    ];

    return (
        <div className="w-full bg-gray-50 min-h-screen">
            {/* Main Content - matching navbar padding */}
            <div className="px-6 py-6">
                {/* Alert Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {alertsData.map((alert, index) => (
                        <AlertCard
                            key={index}
                            title={alert.title}
                            count={alert.count}
                            bgColor={alert.bgColor}
                            textColor={alert.textColor}
                        />
                    ))}
                </div>

                {/* Analytics Section */}
                <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8">
                    <h2 className="text-lg font-semibold text-gray-900 mb-6">Analytics</h2>
                    <div className="flex flex-col lg:flex-row items-center justify-center gap-8">
                        {/* Pie Chart Container */}
                        <div className="relative">
                            <div className="w-64 h-64 relative">
                                {/* Pie Chart SVG */}
                                <svg width="256" height="256" viewBox="0 0 256 256" className="transform -rotate-90">
                                    {/* Green segment (Vessel - 15) */}
                                    <path
                                        d="M 128 128 L 128 16 A 112 112 0 0 1 239.4 128 Z"
                                        fill="#22C55E"
                                    />
                                    {/* Yellow segment (Cargo - 12) */}
                                    <path
                                        d="M 128 128 L 239.4 128 A 112 112 0 0 1 128 240 Z"
                                        fill="#EAB308"
                                    />
                                    {/* Red segment (Compliance - 8) */}
                                    <path
                                        d="M 128 128 L 128 240 A 112 112 0 0 1 16.6 128 Z"
                                        fill="#EF4444"
                                    />
                                </svg>
                                
                                {/* Labels */}
                                <div className="absolute top-8 right-16 text-sm font-medium text-gray-700">12</div>
                                <div className="absolute bottom-16 right-8 text-sm font-medium text-gray-700">15</div>
                                <div className="absolute bottom-16 left-16 text-sm font-medium text-gray-700">8</div>
                            </div>
                        </div>

                        {/* Legend */}
                        <div className="flex flex-col gap-4">
                            <div className="flex items-center gap-3">
                                <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                                <span className="text-sm font-medium text-gray-700">Vessel</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-4 h-4 bg-yellow-500 rounded-full"></div>
                                <span className="text-sm font-medium text-gray-700">Cargo</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-4 h-4 bg-red-500 rounded-full"></div>
                                <span className="text-sm font-medium text-gray-700">Compliance</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Active Alerts Table */}
                <div className="bg-white rounded-lg border border-gray-200">
                    <div className="p-6 border-b border-gray-200">
                        <h2 className="text-lg font-semibold text-gray-900">Active Alerts</h2>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="text-left py-4 px-4 text-sm font-medium text-gray-900">Alert ID</th>
                                    <th className="text-left py-4 px-4 text-sm font-medium text-gray-900">Category</th>
                                    <th className="text-left py-4 px-4 text-sm font-medium text-gray-900">Priority</th>
                                    <th className="text-left py-4 px-4 text-sm font-medium text-gray-900">Maintenance Alerts</th>
                                    <th className="text-left py-4 px-4 text-sm font-medium text-gray-900">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {activeAlerts.map((alert, index) => (
                                    <AlertRow
                                        key={index}
                                        alertId={alert.alertId}
                                        category={alert.category}
                                        priority={alert.priority}
                                        maintenanceStatus={alert.maintenanceStatus}
                                    />
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Alert;