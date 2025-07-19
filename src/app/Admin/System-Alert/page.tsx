"use client"
import React, { useMemo } from 'react'
import { useGetSchedulesQuery } from '@/lib/redux/slices/ScheduleSlice'
import { useGetComplaintsQuery } from '@/lib/redux/slices/ComplaintSlice'

// Types
interface Schedule {
    id: number;
    vessel: {
        id: number;
        name: string;
        type: string;
        capacity: number;
        fuelLevel: number;
        status: string;
    };
    route: {
        id: number;
        departurePort: string;
        destinationPort: string;
        distance: number;
    };
    departureTime: string;
    arrivalTime: string;
    totalSeats: number;
    totalCargoCapacity: number;
    seatPrice: number;
    cargoPricePerKg: number;
    tickets: any[];
    cargo: any[];
    availableSeatsCount: number;
    bookedSeatsCount: number;
    availableCargoCapacity: number;
    bookedCargoWeight: number;
}

interface Complaint {
    id: number;
    user: {
        id: number;
        email: string;
        username: string;
        role: string;
    };
    subject: string;
    message: string;
    status: string;
    submittedAt: string;
}

interface AlertCardProps {
    title: string;
    count: number;
    bgColor: string;
    textColor: string;
    trend?: {
        value: number;
        isPositive: boolean;
    };
}

interface AlertRowProps {
    alertId: string;
    category: string;
    priority: 'Critical' | 'High' | 'Medium' | 'Low';
    description: string;
    timestamp: string;
    source: string;
}

type AlertPriority = 'Critical' | 'High' | 'Medium' | 'Low';

interface Alert {
    id: string;
    category: string;
    priority: AlertPriority;
    description: string;
    timestamp: string;
    source: string;
}

const AlertCard: React.FC<AlertCardProps> = ({ title, count, bgColor, textColor, trend }) => (
    <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex items-start justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-600">{title}</h3>
            {trend && (
                <div className={`flex items-center text-xs ${trend.isPositive ? 'text-red-600' : 'text-green-600'}`}>
                    <span className="mr-1">{trend.isPositive ? '↗' : '↘'}</span>
                    {Math.abs(trend.value)}%
                </div>
            )}
        </div>
        <div className={`${bgColor} ${textColor} text-3xl font-bold px-4 py-3 rounded-lg mb-4 text-center`}>
            {count}
        </div>
        <button className="w-full text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors">
            View Details
        </button>
    </div>
);

const PriorityBadge: React.FC<{ priority: string }> = ({ priority }) => {
    const getColorClasses = (priority: string) => {
        switch (priority.toLowerCase()) {
            case 'critical':
                return 'bg-red-100 text-red-800 border border-red-200';
            case 'high':
                return 'bg-orange-100 text-orange-800 border border-orange-200';
            case 'medium':
                return 'bg-yellow-100 text-yellow-800 border border-yellow-200';
            case 'low':
                return 'bg-green-100 text-green-800 border border-green-200';
            default:
                return 'bg-gray-100 text-gray-800 border border-gray-200';
        }
    };

    return (
        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getColorClasses(priority)}`}>
            {priority}
        </span>
    );
};

const AlertRow: React.FC<AlertRowProps> = ({ alertId, category, priority, description, timestamp, source }) => (
    <tr className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
        <td className="py-4 px-4 text-sm font-medium text-gray-900">{alertId}</td>
        <td className="py-4 px-4 text-sm text-gray-600">{category}</td>
        <td className="py-4 px-4">
            <PriorityBadge priority={priority} />
        </td>
        <td className="py-4 px-4 text-sm text-gray-600 max-w-xs truncate">{description}</td>
        <td className="py-4 px-4 text-sm text-gray-500">{new Date(timestamp).toLocaleDateString()}</td>
        <td className="py-4 px-4 text-sm text-gray-600">{source}</td>
        <td className="py-4 px-4">
            <div className="flex items-center gap-2">
                <button className="p-2 hover:bg-gray-100 rounded-md transition-colors" title="View Details">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M8 3C4.5 3 1.73 5.61 1.73 8.75C1.73 11.89 4.5 14.5 8 14.5C11.5 14.5 14.27 11.89 14.27 8.75C14.27 5.61 11.5 3 8 3ZM8 12.5C7.17 12.5 6.5 11.83 6.5 11C6.5 10.17 7.17 9.5 8 9.5C8.83 9.5 9.5 10.17 9.5 11C9.5 11.83 8.83 12.5 8 12.5ZM8 5.5C8.83 5.5 9.5 6.17 9.5 7C9.5 7.83 8.83 8.5 8 8.5C7.17 8.5 6.5 7.83 6.5 7C6.5 6.17 7.17 5.5 8 5.5Z" fill="#6B7280" />
                    </svg>
                </button>
                <button className="p-2 hover:bg-gray-100 rounded-md transition-colors" title="Take Action">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M8 2.5C4.41 2.5 1.5 5.41 1.5 9S4.41 15.5 8 15.5 14.5 12.59 14.5 9 11.59 2.5 8 2.5ZM8 13.5C7.17 13.5 6.5 12.83 6.5 12S7.17 10.5 8 10.5 9.5 11.17 9.5 12 8.83 13.5 8 13.5ZM8.75 8.5H7.25V4.5H8.75V8.5Z" fill="#6B7280" />
                    </svg>
                </button>
            </div>
        </td>
    </tr>
);

const LoadingSpinner: React.FC = () => (
    <div className="flex items-center justify-center min-h-[200px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
    </div>
);

const Alert: React.FC = () => {
    const { data: schedules = [], isLoading: schedulesLoading, error: schedulesError } = useGetSchedulesQuery({});
    const { data: complaints = [], isLoading: complaintsLoading, error: complaintsError } = useGetComplaintsQuery({});

    const alertsAnalysis = useMemo(() => {
        const alerts: Alert[] = [];
        let criticalCount = 0;
        let highCount = 0;
        let mediumCount = 0;
        let lowCount = 0;

        if (schedules && schedules.length > 0) {
            schedules.forEach((schedule: Schedule) => {
                const now = new Date();
                const departureTime = new Date(schedule.departureTime);
                const arrivalTime = new Date(schedule.arrivalTime);

                // Critical: Low fuel level - include schedule ID to make unique
                if (schedule.vessel.fuelLevel < 20) {
                    alerts.push({
                        id: `FUEL-${schedule.vessel.id}-${schedule.id}`,
                        category: 'Vessel Fuel',
                        priority: 'Critical',
                        description: `${schedule.vessel.name} has critically low fuel (${schedule.vessel.fuelLevel}%)`,
                        timestamp: new Date().toISOString(),
                        source: schedule.vessel.name
                    });
                    criticalCount++;
                }
                // High: Low fuel warning - include schedule ID to make unique
                else if (schedule.vessel.fuelLevel < 50) {
                    alerts.push({
                        id: `FUEL-WARN-${schedule.vessel.id}-${schedule.id}`,
                        category: 'Vessel Fuel',
                        priority: 'High',
                        description: `${schedule.vessel.name} fuel level is low (${schedule.vessel.fuelLevel}%)`,
                        timestamp: new Date().toISOString(),
                        source: schedule.vessel.name
                    });
                    highCount++;
                }

                // Medium: High capacity utilization
                const seatUtilization = (schedule.bookedSeatsCount / schedule.totalSeats) * 100;
                if (seatUtilization > 90) {
                    alerts.push({
                        id: `CAPACITY-${schedule.id}`,
                        category: 'Capacity',
                        priority: 'Medium',
                        description: `${schedule.vessel.name} seat capacity is ${seatUtilization.toFixed(1)}% utilized`,
                        timestamp: schedule.departureTime,
                        source: schedule.vessel.name
                    });
                    mediumCount++;
                }

                // High: Overdue maintenance (vessel on standby) - include schedule ID to make unique
                if (schedule.vessel.status === 'STANDBY') {
                    alerts.push({
                        id: `MAINT-${schedule.vessel.id}-${schedule.id}`,
                        category: 'Maintenance',
                        priority: 'High',
                        description: `${schedule.vessel.name} is on standby - potential maintenance required`,
                        timestamp: new Date().toISOString(),
                        source: schedule.vessel.name
                    });
                    highCount++;
                }

                // Medium: Cargo weight concern
                if (schedule.totalCargoCapacity > 0) {
                    const cargoUtilization = (schedule.bookedCargoWeight / schedule.totalCargoCapacity) * 100;
                    if (cargoUtilization > 85) {
                        alerts.push({
                            id: `CARGO-${schedule.id}`,
                            category: 'Cargo',
                            priority: 'Medium',
                            description: `${schedule.vessel.name} cargo capacity is ${cargoUtilization.toFixed(1)}% utilized`,
                            timestamp: schedule.departureTime,
                            source: schedule.vessel.name
                        });
                        mediumCount++;
                    }
                }

                // Low: Upcoming departure
                const hoursUntilDeparture = (departureTime.getTime() - now.getTime()) / (1000 * 60 * 60);
                if (hoursUntilDeparture > 0 && hoursUntilDeparture < 24) {
                    alerts.push({
                        id: `DEPART-${schedule.id}`,
                        category: 'Operations',
                        priority: 'Low',
                        description: `${schedule.vessel.name} departing in ${Math.round(hoursUntilDeparture)} hours`,
                        timestamp: schedule.departureTime,
                        source: schedule.vessel.name
                    });
                    lowCount++;
                }
            });
        }

        if (complaints && complaints.length > 0) {
            complaints.forEach((complaint: Complaint) => {
                if (complaint.status === 'Pending') {
                    const daysSinceSubmitted = (new Date().getTime() - new Date(complaint.submittedAt).getTime()) / (1000 * 60 * 60 * 24);

                    let priority: AlertPriority = 'Medium';
                    if (daysSinceSubmitted > 7) priority = 'High';
                    if (daysSinceSubmitted > 14) priority = 'Critical';

                    alerts.push({
                        id: `COMP-${complaint.id}`,
                        category: 'Customer Complaint',
                        priority,
                        description: `Unresolved complaint: "${complaint.subject}" (${Math.round(daysSinceSubmitted)} days old)`,
                        timestamp: complaint.submittedAt,
                        source: complaint.user.username
                    });

                    if (priority === 'Critical') criticalCount++;
                    else if (priority === 'High') highCount++;
                    else if (priority === 'Medium') mediumCount++;
                    else lowCount++;
                }
            });
        }

        return {
            alerts: alerts.sort((a, b) => {
                const priorityOrder = { 'Critical': 4, 'High': 3, 'Medium': 2, 'Low': 1 };
                return priorityOrder[b.priority] - priorityOrder[a.priority];
            }).slice(0, 10), // Show top 10 alerts
            counts: {
                critical: criticalCount,
                high: highCount,
                medium: mediumCount,
                low: lowCount
            }
        };
    }, [schedules, complaints]);

    const chartData = useMemo(() => {
        const { counts } = alertsAnalysis;
        const total = counts.critical + counts.high + counts.medium + counts.low;

        if (total === 0) return { segments: [], legend: [] };

        return {
            segments: [
                { value: counts.critical, percentage: (counts.critical / total) * 100, color: '#EF4444', label: 'Critical' },
                { value: counts.high, percentage: (counts.high / total) * 100, color: '#F97316', label: 'High' },
                { value: counts.medium, percentage: (counts.medium / total) * 100, color: '#EAB308', label: 'Medium' },
                { value: counts.low, percentage: (counts.low / total) * 100, color: '#22C55E', label: 'Low' }
            ].filter(segment => segment.value > 0),
            legend: [
                { color: '#EF4444', label: 'Critical', count: counts.critical },
                { color: '#F97316', label: 'High', count: counts.high },
                { color: '#EAB308', label: 'Medium', count: counts.medium },
                { color: '#22C55E', label: 'Low', count: counts.low }
            ]
        };
    }, [alertsAnalysis]);

    if (schedulesLoading || complaintsLoading) {
        return <LoadingSpinner />;
    }

    if (schedulesError || complaintsError) {
        return (
            <div className="w-full bg-gray-50 min-h-screen">
                <div className="px-6 py-6">
                    <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                        <h3 className="text-red-800 font-medium">Error Loading Data</h3>
                        <p className="text-red-600 text-sm mt-2">
                            Unable to load alerts data. Please check your connection and try again.
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    const alertsData = [
        {
            title: "Critical Alerts",
            count: alertsAnalysis.counts.critical,
            bgColor: "bg-red-500",
            textColor: "text-white",
            trend: { value: 12, isPositive: true }
        },
        {
            title: "High Priority",
            count: alertsAnalysis.counts.high,
            bgColor: "bg-orange-500",
            textColor: "text-white",
            trend: { value: 8, isPositive: true }
        },
        {
            title: "Medium Priority",
            count: alertsAnalysis.counts.medium,
            bgColor: "bg-yellow-500",
            textColor: "text-white",
            trend: { value: 3, isPositive: false }
        },
        {
            title: "Low Priority",
            count: alertsAnalysis.counts.low,
            bgColor: "bg-green-500",
            textColor: "text-white",
            trend: { value: 15, isPositive: false }
        }
    ];

    return (
        <div className="w-full bg-gray-50 min-h-screen">
            <div className="px-6 py-6">
                {/* Header */}
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-gray-900">Risk Alert Dashboard</h1>
                    <p className="text-gray-600 text-sm mt-1">
                        Real-time monitoring and analysis of operational risks
                    </p>
                </div>

                {/* Alert Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {alertsData.map((alert, index) => (
                        <AlertCard
                            key={index}
                            title={alert.title}
                            count={alert.count}
                            bgColor={alert.bgColor}
                            textColor={alert.textColor}
                            trend={alert.trend}
                        />
                    ))}
                </div>

                {/* Analytics Section */}
                <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8 shadow-sm">
                    <h2 className="text-lg font-semibold text-gray-900 mb-6">Alert Distribution Analytics</h2>

                    {chartData.segments.length > 0 ? (
                        <div className="flex flex-col lg:flex-row items-center justify-center gap-8">
                            {/* Pie Chart Container */}
                            <div className="relative">
                                <div className="w-64 h-64 relative">
                                    <svg width="256" height="256" viewBox="0 0 256 256" className="transform -rotate-90">
                                        {chartData.segments.map((segment, index) => {
                                            const radius = 112;
                                            const circumference = 2 * Math.PI * radius;
                                            const strokeDasharray = (segment.percentage / 100) * circumference;
                                            const strokeDashoffset = -chartData.segments
                                                .slice(0, index)
                                                .reduce((acc, seg) => acc + (seg.percentage / 100) * circumference, 0);

                                            return (
                                                <circle
                                                    key={index}
                                                    cx="128"
                                                    cy="128"
                                                    r={radius}
                                                    fill="transparent"
                                                    stroke={segment.color}
                                                    strokeWidth="48"
                                                    strokeDasharray={`${strokeDasharray} ${circumference}`}
                                                    strokeDashoffset={strokeDashoffset}
                                                    className="transition-all duration-300"
                                                />
                                            );
                                        })}
                                    </svg>

                                    {/* Center Text */}
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="text-center">
                                            <div className="text-2xl font-bold text-gray-900">
                                                {chartData.legend.reduce((acc, item) => acc + item.count, 0)}
                                            </div>
                                            <div className="text-sm text-gray-600">Total Alerts</div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Legend */}
                            <div className="flex flex-col gap-4">
                                {chartData.legend.map((item, index) => (
                                    <div key={index} className="flex items-center gap-3">
                                        <div
                                            className="w-4 h-4 rounded-full"
                                            style={{ backgroundColor: item.color }}
                                        ></div>
                                        <span className="text-sm font-medium text-gray-700 min-w-[80px]">
                                            {item.label}
                                        </span>
                                        <span className="text-sm font-bold text-gray-900">
                                            {item.count}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <div className="text-gray-400 text-lg mb-2">No Active Alerts</div>
                            <div className="text-gray-500 text-sm">All systems operating normally</div>
                        </div>
                    )}
                </div>

                {/* Active Alerts Table */}
                <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
                    <div className="p-6 border-b border-gray-200">
                        <h2 className="text-lg font-semibold text-gray-900">Active Alerts</h2>
                        <p className="text-sm text-gray-600 mt-1">
                            {alertsAnalysis.alerts.length} active alerts requiring attention
                        </p>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="text-left py-4 px-4 text-sm font-medium text-gray-900">Alert ID</th>
                                    <th className="text-left py-4 px-4 text-sm font-medium text-gray-900">Category</th>
                                    <th className="text-left py-4 px-4 text-sm font-medium text-gray-900">Priority</th>
                                    <th className="text-left py-4 px-4 text-sm font-medium text-gray-900">Description</th>
                                    <th className="text-left py-4 px-4 text-sm font-medium text-gray-900">Date</th>
                                    <th className="text-left py-4 px-4 text-sm font-medium text-gray-900">Source</th>
                                    <th className="text-left py-4 px-4 text-sm font-medium text-gray-900">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {alertsAnalysis.alerts.length > 0 ? (
                                    alertsAnalysis.alerts.map((alert) => (
                                        <AlertRow
                                            key={alert.id}
                                            alertId={alert.id}
                                            category={alert.category}
                                            priority={alert.priority}
                                            description={alert.description}
                                            timestamp={alert.timestamp}
                                            source={alert.source}
                                        />
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={7} className="py-12 text-center">
                                            <div className="text-gray-400">
                                                <div className="text-lg mb-2">🎉 No Active Alerts</div>
                                                <div className="text-sm">All systems are operating normally</div>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Alert;