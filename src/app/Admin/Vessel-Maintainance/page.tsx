"use client"
import React, { useState } from 'react'

interface MaintenanceTask {
  id: string;
  vessel: string;
  description: string;
  status: 'Scheduled' | 'In Progress' | 'Completed';
  team: string;
  cost: number;
}

interface MaintenanceStats {
  totalTasks: number;
  scheduledTasks: number;
  ongoingTasks: number;
  totalCost: number;
  costChange: number;
  taskChange: number;
}

const MaintenanceDashboard = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 5;

  // Sample data
  const stats: MaintenanceStats = {
    totalTasks: 120,
    scheduledTasks: 30,
    ongoingTasks: 15,
    totalCost: 250000,
    costChange: -5,
    taskChange: 10
  };

  const tasks: MaintenanceTask[] = [
    {
      id: '001',
      vessel: 'Vessel A',
      description: 'Engine Inspection',
      status: 'Scheduled',
      team: 'Team Alpha',
      cost: 5000
    },
    {
      id: '001',
      vessel: 'Vessel A',
      description: 'Engine Inspection',
      status: 'Scheduled',
      team: 'Team Alpha',
      cost: 5000
    },
    {
      id: '001',
      vessel: 'Vessel A',
      description: 'Engine Inspection',
      status: 'Scheduled',
      team: 'Team Alpha',
      cost: 5000
    }
  ];

  const chartData = [
    { month: 'Feb', vesselA: 42000, vesselB: 35000, vesselC: 28000 },
    { month: 'March', vesselA: 45000, vesselB: 38000, vesselC: 32000 }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Scheduled':
        return 'text-blue-600 bg-blue-50';
      case 'In Progress':
        return 'text-yellow-600 bg-yellow-50';
      case 'Completed':
        return 'text-green-600 bg-green-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div className="w-full px-6 py-6 bg-gray-50 min-h-screen">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Total Maintenance Tasks */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-blue-50 rounded-lg">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M2 17L12 22L22 17" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M2 12L12 17L22 12" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <span className="text-sm font-medium text-gray-600">Total Maintenance Tasks</span>
          </div>
          <div className="space-y-1">
            <h3 className="text-3xl font-bold text-gray-900">{stats.totalTasks}</h3>
            <p className="text-sm text-green-600">+{stats.taskChange}% vs last month</p>
          </div>
        </div>

        {/* Scheduled Maintenance */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-gray-50 rounded-lg">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" stroke="#6B7280" strokeWidth="2"/>
                <line x1="16" y1="2" x2="16" y2="6" stroke="#6B7280" strokeWidth="2"/>
                <line x1="8" y1="2" x2="8" y2="6" stroke="#6B7280" strokeWidth="2"/>
                <line x1="3" y1="10" x2="21" y2="10" stroke="#6B7280" strokeWidth="2"/>
              </svg>
            </div>
            <span className="text-sm font-medium text-gray-600">Scheduled Maintenance</span>
          </div>
          <div className="space-y-1">
            <h3 className="text-3xl font-bold text-gray-900">{stats.scheduledTasks}</h3>
            <p className="text-sm text-gray-500">Upcoming</p>
          </div>
        </div>

        {/* Ongoing Maintenance */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-gray-50 rounded-lg">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" stroke="#6B7280" strokeWidth="2"/>
              </svg>
            </div>
            <span className="text-sm font-medium text-gray-600">Ongoing Maintenance</span>
          </div>
          <div className="space-y-1">
            <h3 className="text-3xl font-bold text-gray-900">{stats.ongoingTasks}</h3>
            <p className="text-sm text-gray-500">In Progress</p>
          </div>
        </div>

        {/* Total Maintenance Cost */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-gray-50 rounded-lg">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <line x1="12" y1="1" x2="12" y2="23" stroke="#6B7280" strokeWidth="2"/>
                <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" stroke="#6B7280" strokeWidth="2"/>
              </svg>
            </div>
            <span className="text-sm font-medium text-gray-600">Total Maintenance Cost</span>
          </div>
          <div className="space-y-1">
            <h3 className="text-3xl font-bold text-gray-900">${stats.totalCost.toLocaleString()}</h3>
            <p className="text-sm text-red-600">{stats.costChange}% vs last month</p>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Maintenance Table */}
        <div className="lg:col-span-2 bg-white rounded-lg border border-gray-200">
          {/* Table Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Maintenance</h2>
            <button className="flex items-center gap-2 px-4 py-2 bg-sky-400 text-white rounded-lg hover:bg-sky-500 transition-colors">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M8 3.33334V12.6667M3.33334 8H12.6667" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Add Task
            </button>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Task ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vessel</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Team</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cost ($)</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {tasks.map((task, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{task.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{task.vessel}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{task.description}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}>
                        {task.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{task.team}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{task.cost.toLocaleString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button className="px-3 py-1 text-sm bg-green-100 text-green-700 rounded-md hover:bg-green-200 transition-colors">
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200">
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="p-1 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M10 12L6 8L10 4" stroke="#6B7280" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
              <button 
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="p-1 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M6 4L10 8L6 12" stroke="#6B7280" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
            <span className="text-sm text-gray-500">{currentPage} of {totalPages}page</span>
          </div>
        </div>

        {/* Right Side Content */}
        <div className="space-y-6">
          {/* Chart */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Ticket Sales by Route</h3>
            <div className="space-y-4">
              {/* Simple Chart Representation */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Feb</span>
                  <span className="text-sm font-medium">60,000</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-purple-500 h-2 rounded-full" style={{width: '70%'}}></div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">March</span>
                  <span className="text-sm font-medium">45,000</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{width: '90%'}}></div>
                </div>
              </div>
            </div>
            {/* Legend */}
            <div className="flex items-center gap-4 mt-4 text-xs">
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-gray-600">Vessel A</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                <span className="text-gray-600">Vessel B</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <span className="text-gray-600">Vessel C</span>
              </div>
            </div>
          </div>

          {/* Maintenance Alerts */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Maintenance Alerts</h3>
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 mt-0.5">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" fill="#EF4444"/>
                  </svg>
                </div>
                <div>
                  <h4 className="font-medium text-red-800">Vessel C: Navigation System Fix</h4>
                  <p className="text-sm text-red-700 mt-1">Resolve Now</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MaintenanceDashboard;