"use client"
import React from 'react'

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  iconBg: string;
}

const StatCard = ({ title, value, icon, iconBg }: StatCardProps) => {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className={`p-2 rounded-lg ${iconBg}`}>
          {icon}
        </div>
        <span className="text-sm text-gray-600">{title}</span>
      </div>
      <div className="text-2xl font-bold text-gray-900">{value}</div>
    </div>
  )
}

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main Content - matches navbar spacing */}
      <div className="px-6 py-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Active Vessels"
            value="12/15"
            icon={
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3 18H21L19 12H17L15 8H9L7 12H5L3 18Z" stroke="#60A5FA" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M21 18V20C21 20.5523 20.5523 21 20 21H4C3.44772 21 3 20.5523 3 20V18" stroke="#60A5FA" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            }
            iconBg="bg-blue-100"
          />
          
          <StatCard
            title="Cargo in Transit"
            value="842"
            icon={
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M21 16V8C21 6.89543 20.1046 6 19 6H5C3.89543 6 3 6.89543 3 8V16C3 17.1046 3.89543 18 5 18H19C20.1046 18 21 17.1046 21 16Z" stroke="#F59E0B" strokeWidth="2"/>
                <path d="M7 10H17M7 14H13" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            }
            iconBg="bg-amber-100"
          />
          
          <StatCard
            title="Today's Passengers"
            value="1,247"
            icon={
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M17 21V19C17 16.7909 15.2091 15 13 15H5C2.79086 15 1 16.7909 1 19V21" stroke="#8B5CF6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <circle cx="9" cy="7" r="4" stroke="#8B5CF6" strokeWidth="2"/>
                <path d="M23 21V19C23 17.1362 21.7252 15.5701 20 15.126" stroke="#8B5CF6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M16 3.12598C17.7252 3.56992 19 5.13616 19 7C19 8.86384 17.7252 10.4301 16 10.874" stroke="#8B5CF6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            }
            iconBg="bg-purple-100"
          />
          
          <StatCard
            title="Fleet Efficiency"
            value="94%"
            icon={
              <div className="w-5 h-5 rounded-full border-2 border-red-500 flex items-center justify-center">
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
              </div>
            }
            iconBg="bg-red-100"
          />
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Cargo Shipment Trends */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Cargo Shipment Trends</h3>
            <div className="relative h-64">
              {/* Chart Area */}
              <div className="w-full h-full flex items-end justify-between px-4">
                {/* Simulated chart with SVG curve */}
                <svg className="w-full h-full" viewBox="0 0 400 200">
                  <path
                    d="M 20 150 Q 80 120 120 140 T 200 100 T 280 120 T 380 140"
                    stroke="#60A5FA"
                    strokeWidth="3"
                    fill="none"
                    strokeLinecap="round"
                  />
                  {/* Data points */}
                  <circle cx="20" cy="150" r="4" fill="#60A5FA" />
                  <circle cx="120" cy="140" r="4" fill="#60A5FA" />
                  <circle cx="200" cy="100" r="4" fill="#60A5FA" />
                  <circle cx="280" cy="120" r="4" fill="#60A5FA" />
                  <circle cx="380" cy="140" r="4" fill="#60A5FA" />
                </svg>
              </div>
              {/* X-axis labels */}
              <div className="flex justify-between text-xs text-gray-500 mt-4">
                <span>Jan</span>
                <span>Feb</span>
                <span>Mar</span>
                <span>Apr</span>
                <span>May</span>
                <span>Jun</span>
                <span>Jul</span>
              </div>
            </div>
            <div className="flex items-center gap-2 mt-4">
              <div className="w-3 h-0.5 bg-blue-400"></div>
              <span className="text-sm text-gray-600">weight</span>
            </div>
          </div>

          {/* Ticket Sales by Route */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Ticket Sales by Route</h3>
            <div className="h-64 flex items-end justify-center gap-8">
              {/* Port A-B */}
              <div className="flex flex-col items-center gap-2">
                <div className="flex flex-col items-center gap-1">
                  <div className="w-8 bg-purple-200 h-16 rounded-t"></div>
                  <div className="w-8 bg-amber-400 h-8 rounded-b"></div>
                </div>
                <span className="text-sm font-medium text-gray-700">Port A-B</span>
              </div>
              
              {/* Port C-D */}
              <div className="flex flex-col items-center gap-2">
                <div className="flex flex-col items-center gap-1">
                  <div className="w-8 bg-purple-200 h-32 rounded-t"></div>
                  <div className="w-8 bg-sky-400 h-24 rounded-b"></div>
                </div>
                <span className="text-sm font-medium text-gray-700">Port C-D</span>
              </div>
              
              {/* Port E-F */}
              <div className="flex flex-col items-center gap-2">
                <div className="flex flex-col items-center gap-1">
                  <div className="w-8 bg-purple-200 h-20 rounded-t"></div>
                  <div className="w-8 bg-amber-400 h-12 rounded"></div>
                  <div className="w-8 bg-sky-400 h-16 rounded-b"></div>
                </div>
                <span className="text-sm font-medium text-gray-700">Port E-F</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Fleet Availability */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Fleet Availability</h3>
            <div className="flex items-center justify-center h-48">
              {/* Donut Chart */}
              <div className="relative w-40 h-40">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  {/* Background circle */}
                  <circle
                    cx="50"
                    cy="50"
                    r="35"
                    fill="none"
                    stroke="#F3F4F6"
                    strokeWidth="10"
                  />
                  {/* Operational (blue) - 15 units */}
                  <circle
                    cx="50"
                    cy="50"
                    r="35"
                    fill="none"
                    stroke="#60A5FA"
                    strokeWidth="10"
                    strokeDasharray="164.93 219.91"
                    strokeDashoffset="0"
                  />
                  {/* Maintenance (yellow) - 2 units */}
                  <circle
                    cx="50"
                    cy="50"
                    r="35"
                    fill="none"
                    stroke="#F59E0B"
                    strokeWidth="10"
                    strokeDasharray="21.99 384.85"
                    strokeDashoffset="-164.93"
                  />
                  {/* Inactive (green) - 3 units */}
                  <circle
                    cx="50"
                    cy="50"
                    r="35"
                    fill="none"
                    stroke="#10B981"
                    strokeWidth="10"
                    strokeDasharray="32.99 384.85"
                    strokeDashoffset="-186.92"
                  />
                </svg>
                {/* Center content */}
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <div className="text-orange-500 text-xl">↕</div>
                </div>
                {/* Numbers around the chart */}
                <div className="absolute top-2 right-8 text-2xl font-bold text-gray-900">15</div>
                <div className="absolute bottom-2 left-4 text-2xl font-bold text-gray-900">2</div>
                <div className="absolute left-2 top-12 text-2xl font-bold text-gray-900">3</div>
              </div>
            </div>
            {/* Legend */}
            <div className="flex justify-center gap-6 mt-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-blue-400"></div>
                <span className="text-sm text-gray-600">operational</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-amber-400"></div>
                <span className="text-sm text-gray-600">Maintenance</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-green-400"></div>
                <span className="text-sm text-gray-600">Inactive</span>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Quick Actions</h3>
            <div className="space-y-3">
              <button className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-lg p-4 flex items-center justify-center gap-3 transition-colors">
                <div className="w-6 h-6 rounded-full border-2 border-white flex items-center justify-center">
                  <span className="text-white text-lg font-bold">+</span>
                </div>
                <span className="font-medium">Add New Vessel</span>
              </button>
              
              <button className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-lg p-4 flex items-center justify-center gap-3 transition-colors">
                <div className="w-6 h-6 flex items-center justify-center">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <span className="font-medium">Schedule Route</span>
              </button>
              
              <button className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-lg p-4 flex items-center justify-center gap-3 transition-colors">
                <div className="w-6 h-6 rounded-full border-2 border-white flex items-center justify-center">
                  <span className="text-white text-sm font-bold">!</span>
                </div>
                <span className="font-medium">Create Report</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard