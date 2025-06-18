"use client"
import React from 'react'

interface StatCardProps {
  title: string;
  value: string;
  bgColor?: string;
}

interface VesselReport {
  vessel: string;
  route: string;
  revenue: number;
  passengers: number;
  cargo: number;
  fuel: number;
}

const StatCard = ({ title, value, bgColor = "bg-white" }: StatCardProps) => {
  return (
    <div className={`${bgColor} rounded-lg border border-gray-200 p-6 text-center`}>
      <h3 className="text-sm font-medium text-gray-500 mb-3">{title}</h3>
      <div className="text-2xl font-bold text-gray-900">{value}</div>
    </div>
  )
}

const RevenueAnalyticsDashboard = () => {
  const vesselReports: VesselReport[] = [
    {
      vessel: "Vessel A",
      route: "Port A - Port B",
      revenue: 200000,
      passengers: 5000,
      cargo: 10000,
      fuel: 5000
    },
    {
      vessel: "Vessel B",
      route: "Port A - Port B",
      revenue: 200000,
      passengers: 5000,
      cargo: 10000,
      fuel: 5000
    }
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US').format(num);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main Content - matches navbar spacing */}
      <div className="px-6 py-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatCard
            title="Total Revenue"
            value="$1,245,000"
          />
          
          <StatCard
            title="Total Passengers"
            value="45,000"
          />
          
          <StatCard
            title="Total Cargo Shipped"
            value="120,000 kg"
          />
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Revenue Trends */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Revenue Trends</h3>
            <div className="relative h-64">
              {/* Chart Area */}
              <div className="w-full h-full flex items-end justify-between px-4">
                <svg className="w-full h-full" viewBox="0 0 400 200">
                  {/* Ticket line (purple) */}
                  <path
                    d="M 20 120 Q 60 100 80 110 T 140 105 T 200 115 T 260 100 T 320 110 T 380 105"
                    stroke="#8B5CF6"
                    strokeWidth="3"
                    fill="none"
                    strokeLinecap="round"
                  />
                  {/* Cargo line (green) */}
                  <path
                    d="M 20 140 Q 60 130 80 120 T 140 80 T 200 85 T 260 90 T 320 85 T 380 90"
                    stroke="#10B981"
                    strokeWidth="3"
                    fill="none"
                    strokeLinecap="round"
                  />
                  
                  {/* Data points for Ticket */}
                  <circle cx="20" cy="120" r="4" fill="#8B5CF6" />
                  <circle cx="80" cy="110" r="4" fill="#8B5CF6" />
                  <circle cx="140" cy="105" r="4" fill="#8B5CF6" />
                  <circle cx="200" cy="115" r="4" fill="#8B5CF6" />
                  <circle cx="260" cy="100" r="4" fill="#8B5CF6" />
                  <circle cx="320" cy="110" r="4" fill="#8B5CF6" />
                  <circle cx="380" cy="105" r="4" fill="#8B5CF6" />
                  
                  {/* Data points for Cargo */}
                  <circle cx="20" cy="140" r="4" fill="#10B981" />
                  <circle cx="80" cy="120" r="4" fill="#10B981" />
                  <circle cx="140" cy="80" r="4" fill="#10B981" />
                  <circle cx="200" cy="85" r="4" fill="#10B981" />
                  <circle cx="260" cy="90" r="4" fill="#10B981" />
                  <circle cx="320" cy="85" r="4" fill="#10B981" />
                  <circle cx="380" cy="90" r="4" fill="#10B981" />
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
            <div className="flex items-center gap-6 mt-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-0.5 bg-purple-500"></div>
                <span className="text-sm text-gray-600">Ticket</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-0.5 bg-green-500"></div>
                <span className="text-sm text-gray-600">cargo</span>
              </div>
            </div>
          </div>

          {/* Passenger and Cargo Trends */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Passenger and Cargo Trends</h3>
            <div className="h-64 flex items-end justify-center gap-12">
              {/* Port A-B */}
              <div className="flex flex-col items-center gap-2">
                <div className="flex flex-col items-center gap-1 relative">
                  {/* Gray dots background */}
                  <div className="absolute inset-0 flex flex-col justify-between items-center py-2">
                    {Array.from({length: 8}).map((_, i) => (
                      <div key={i} className="w-1 h-1 bg-gray-300 rounded-full"></div>
                    ))}
                  </div>
                  {/* Blue bar (Ticket) */}
                  <div className="w-8 bg-blue-500 h-24 rounded-t relative z-10"></div>
                  {/* Green bar (Cargo) */}
                  <div className="w-8 bg-green-500 h-32 rounded-b relative z-10"></div>
                </div>
                <span className="text-sm font-medium text-gray-700">Port A-B</span>
              </div>
              
              {/* Port C-D */}
              <div className="flex flex-col items-center gap-2">
                <div className="flex flex-col items-center gap-1 relative">
                  {/* Gray dots background */}
                  <div className="absolute inset-0 flex flex-col justify-between items-center py-2">
                    {Array.from({length: 8}).map((_, i) => (
                      <div key={i} className="w-1 h-1 bg-gray-300 rounded-full"></div>
                    ))}
                  </div>
                  {/* Blue bar (Ticket) */}
                  <div className="w-8 bg-blue-500 h-16 rounded-t relative z-10"></div>
                  {/* Green bar (Cargo) */}
                  <div className="w-8 bg-green-500 h-20 rounded-b relative z-10"></div>
                </div>
                <span className="text-sm font-medium text-gray-700">Port C-D</span>
              </div>
              
              {/* Port E-F */}
              <div className="flex flex-col items-center gap-2">
                <div className="flex flex-col items-center gap-1 relative">
                  {/* Gray dots background */}
                  <div className="absolute inset-0 flex flex-col justify-between items-center py-2">
                    {Array.from({length: 8}).map((_, i) => (
                      <div key={i} className="w-1 h-1 bg-gray-300 rounded-full"></div>
                    ))}
                  </div>
                  {/* Blue bar (Ticket) */}
                  <div className="w-8 bg-blue-500 h-12 rounded-t relative z-10"></div>
                  {/* Green bar (Cargo) */}
                  <div className="w-8 bg-green-500 h-28 rounded-b relative z-10"></div>
                </div>
                <span className="text-sm font-medium text-gray-700">Port E-F</span>
              </div>
            </div>
            <div className="flex items-center gap-6 mt-6 justify-center">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-500 rounded"></div>
                <span className="text-sm text-gray-600">Ticket</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded"></div>
                <span className="text-sm text-gray-600">cargo</span>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Reports Table */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Detailed Reports</h3>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="text-left py-4 px-6 text-sm font-medium text-gray-700">Vessel</th>
                  <th className="text-left py-4 px-6 text-sm font-medium text-gray-700">Route</th>
                  <th className="text-left py-4 px-6 text-sm font-medium text-gray-700">Revenue ($)</th>
                  <th className="text-left py-4 px-6 text-sm font-medium text-gray-700">Passengers</th>
                  <th className="text-left py-4 px-6 text-sm font-medium text-gray-700">Cargo (kg)</th>
                  <th className="text-left py-4 px-6 text-sm font-medium text-gray-700">Fuel (L)</th>
                </tr>
              </thead>
              <tbody>
                {vesselReports.map((report, index) => (
                  <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-4 px-6 text-sm text-gray-900 font-medium">{report.vessel}</td>
                    <td className="py-4 px-6 text-sm text-gray-900">{report.route}</td>
                    <td className="py-4 px-6 text-sm text-gray-900">{formatNumber(report.revenue)}</td>
                    <td className="py-4 px-6 text-sm text-gray-900">{formatNumber(report.passengers)}</td>
                    <td className="py-4 px-6 text-sm text-gray-900">{formatNumber(report.cargo)}</td>
                    <td className="py-4 px-6 text-sm text-gray-900">{formatNumber(report.fuel)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RevenueAnalyticsDashboard;