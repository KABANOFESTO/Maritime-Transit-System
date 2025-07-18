'use client';
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { useGetVesselsQuery } from '@/lib/redux/slices/VesselSlice';

interface VesselApiResponse {
  id: number;
  name: string;
  type: string;
  capacity: number;
  fuelLevel: number;
  status: 'ACTIVE' | 'STANDBY' | 'MAINTENANCE';
}

const FleetDashboard: React.FC = () => {
  const { data: vessels, isLoading, error } = useGetVesselsQuery({});

  // Calculate statistics from API data
  const calculateStats = () => {
    if (!vessels || vessels.length === 0) {
      return {
        activeVessels: 0,
        maintenanceVessels: 0,
        standbyVessels: 0,
        totalVessels: 0,
        averageUtilization: 0,
        averageFuelLevel: 0
      };
    }

    const activeVessels = vessels.filter((v: VesselApiResponse) => v.status === 'ACTIVE').length;
    const maintenanceVessels = vessels.filter((v: VesselApiResponse) => v.status === 'MAINTENANCE').length;
    const standbyVessels = vessels.filter((v: VesselApiResponse) => v.status === 'STANDBY').length;
    const totalVessels = vessels.length;

    const averageFuelLevel: number = vessels.reduce((sum: number, vessel: VesselApiResponse) => sum + vessel.fuelLevel, 0) / vessels.length;

    return {
      activeVessels,
      maintenanceVessels,
      standbyVessels,
      totalVessels,
      averageUtilization: Math.round(averageFuelLevel),
      averageFuelLevel: Math.round(averageFuelLevel * 10) / 10
    };
  };

  const stats = calculateStats();

  // Data for donut chart
  const pieData = [
    { name: 'Active', value: stats.activeVessels, color: '#22c55e' },
    { name: 'Maintenance', value: stats.maintenanceVessels, color: '#f87171' },
    { name: 'Standby', value: stats.standbyVessels, color: '#fb923c' },
  ].filter(item => item.value > 0);


  interface BarChartData {
    name: string;
    utilization: number;
  }

  const barData: BarChartData[] = vessels?.map((vessel: VesselApiResponse): BarChartData => ({
    name: vessel.name.length > 12 ? vessel.name.substring(0, 12) + '...' : vessel.name,
    utilization: vessel.fuelLevel
  })) || [];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE': return 'bg-green-500 text-white';
      case 'STANDBY': return 'bg-orange-500 text-white';
      case 'MAINTENANCE': return 'bg-red-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getStatusDisplayName = (status: string) => {
    switch (status) {
      case 'ACTIVE': return 'Active';
      case 'STANDBY': return 'Standby';
      case 'MAINTENANCE': return 'Maintenance';
      default: return status;
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="px-6 max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <span className="ml-3 text-gray-600">Loading fleet data...</span>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="px-6 max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="text-red-500 mb-2">
                <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <p className="text-gray-600">Error loading fleet data. Please try again.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // No data state
  if (!vessels || vessels.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="px-6 max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="text-gray-400 mb-2">
                <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <p className="text-gray-600">No vessels found in the fleet.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="px-6 max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Fleet Dashboard</h1>
          <p className="text-gray-600">Real-time overview of your vessel fleet</p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {/* Active Vessels Card */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-gray-900 mb-1">
                  {stats.activeVessels}
                </div>
                <div className="text-sm text-gray-600">Active Vessels</div>
              </div>
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Total Vessels Card */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-gray-900 mb-1">
                  {stats.totalVessels}
                </div>
                <div className="text-sm text-gray-600">Total Vessels</div>
              </div>
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
            </div>
          </div>

          {/* Average Fuel Level Card */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-gray-900 mb-1">
                  {stats.averageFuelLevel}%
                </div>
                <div className="text-sm text-gray-600">Avg Fuel Level</div>
              </div>
              <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Maintenance Vessels Card */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-gray-900 mb-1">
                  {stats.maintenanceVessels}
                </div>
                <div className="text-sm text-gray-600">In Maintenance</div>
              </div>
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Donut Chart */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Fleet Status Distribution</h3>
            </div>
            <div className="h-80 flex items-center justify-center">
              <div className="relative">
                <ResponsiveContainer width={300} height={300}>
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx={150}
                      cy={150}
                      innerRadius={80}
                      outerRadius={120}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>

                {/* Chart Labels */}
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
                  <div className="flex flex-wrap justify-center gap-4 text-sm">
                    {pieData.map((entry, index) => (
                      <div key={index} className="flex items-center">
                        <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: entry.color }}></div>
                        <span>{entry.name} ({entry.value})</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bar Chart */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Fuel Levels by Vessel</h3>
            </div>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                  <XAxis
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: '#6b7280' }}
                    angle={-45}
                    textAnchor="end"
                    height={80}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: '#6b7280' }}
                    domain={[0, 100]}
                    label={{ value: 'Fuel Level (%)', angle: -90, position: 'insideLeft' }}
                  />
                  <Bar
                    dataKey="utilization"
                    fill="#6366f1"
                    radius={[4, 4, 0, 0]}
                    maxBarSize={40}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Vessel Details Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="relative">
            <div className="absolute right-0 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-500 to-green-500"></div>

            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Vessel Details</h3>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Vessel</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Type</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Status</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Capacity</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Fuel Level</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {vessels.map((vessel: VesselApiResponse) => (
                      <tr key={vessel.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 text-sm font-medium text-gray-900">
                          {vessel.name}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {vessel.type}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(vessel.status)}`}>
                            {getStatusDisplayName(vessel.status)}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {vessel.capacity.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          <div className="flex items-center">
                            <div className="w-16 bg-gray-200 rounded-full h-2 mr-3">
                              <div
                                className="bg-blue-600 h-2 rounded-full"
                                style={{ width: `${vessel.fuelLevel}%` }}
                              ></div>
                            </div>
                            <span className="font-medium">{vessel.fuelLevel}%</span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FleetDashboard;