'use client';
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

interface VesselData {
  name: string;
  status: 'Active' | 'Standby' | 'Maintenance';
  utilization: string;
  maintenanceDays: number;
  crew: number;
}

interface FleetDashboardProps {
  vessels?: VesselData[];
}

const FleetDashboard: React.FC<FleetDashboardProps> = ({
  vessels = [
    { name: 'Vessel A', status: 'Active', utilization: '85%', maintenanceDays: 2, crew: 12 },
    { name: 'Vessel B', status: 'Standby', utilization: '85%', maintenanceDays: 2, crew: 12 },
    { name: 'Vessel C', status: 'Active', utilization: '85%', maintenanceDays: 2, crew: 12 },
    { name: 'Vessel D', status: 'Maintenance', utilization: '85%', maintenanceDays: 2, crew: 12 },
  ]
}) => {
  const activeVessels = vessels.filter(v => v.status === 'Active').length;
  const maintenanceVessels = vessels.filter(v => v.status === 'Maintenance').length;
  const totalVessels = vessels.length;
  const averageUtilization = 68;

  // Data for donut chart
  const pieData = [
    { name: 'Active', value: vessels.filter(v => v.status === 'Active').length, color: '#22c55e' },
    { name: 'Maintenance', value: vessels.filter(v => v.status === 'Maintenance').length, color: '#f87171' },
    { name: 'Standby', value: vessels.filter(v => v.status === 'Standby').length, color: '#fb923c' },
  ];

  // Data for bar chart
  const barData = [
    { name: 'Vessel A', utilization: 70 },
    { name: 'Vessel B', utilization: 95 },
    { name: 'Vessel C', utilization: 65 },
    { name: 'Vessel D', utilization: 80 },
    { name: 'Vessel E', utilization: 85 },
    { name: 'Vessel F', utilization: 45 },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'bg-green-500 text-white';
      case 'Standby': return 'bg-orange-500 text-white';
      case 'Maintenance': return 'bg-red-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="px-6 max-w-7xl mx-auto">
        
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Active Vessels Card */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-center mb-4">
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-900 mb-2">
                {activeVessels}/{totalVessels}
              </div>
              <div className="text-gray-600 font-medium">Active Vessels</div>
            </div>
          </div>

          {/* Fleet Utilization Card */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-center mb-4">
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-900 mb-2">
                {averageUtilization}%
              </div>
              <div className="text-gray-600 font-medium">Average Fleet Utilization</div>
            </div>
          </div>

          {/* Maintenance Card */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-center mb-4">
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-900 mb-2">
                {maintenanceVessels}
              </div>
              <div className="text-gray-600 font-medium">Vessels Requiring Maintenance</div>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          
          {/* Donut Chart */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
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
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                      <span>Active</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-red-400 rounded-full mr-2"></div>
                      <span>Maintenance</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-orange-500 rounded-full mr-2"></div>
                      <span>Standby</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bar Chart */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-gray-900 text-center">Fleet Utilization</h3>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <XAxis 
                    dataKey="name" 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: '#6b7280' }}
                  />
                  <YAxis 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: '#6b7280' }}
                    domain={[0, 100]}
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
            {/* Green priority indicator */}
            <div className="absolute right-0 top-0 bottom-0 w-2 bg-green-500"></div>
            
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Vessel Details</h3>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Vessel</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Status</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Utilization</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Maintenance Days</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Crew</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {vessels.map((vessel, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-6 py-4 text-sm font-medium text-gray-900">
                          {vessel.name}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(vessel.status)}`}>
                            {vessel.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900 font-medium">
                          {vessel.utilization}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900 text-center">
                          {vessel.maintenanceDays}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900 text-center">
                          {vessel.crew}
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