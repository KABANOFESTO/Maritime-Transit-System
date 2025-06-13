'use client';
import React from 'react';
import { Ship, Package, Ticket, DollarSign, Bell } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ReactNode;
  trend?: string;
  trendPositive?: boolean;
}

const StatsCard: React.FC<StatsCardProps> = ({ 
  title, 
  value, 
  subtitle, 
  icon, 
  trend, 
  trendPositive 
}) => (
  <div className="bg-white rounded-lg border border-gray-200 p-6">
    <div className="flex items-center justify-between mb-4">
      <h3 className="text-sm font-medium text-gray-600">{title}</h3>
      <div className="text-gray-400">{icon}</div>
    </div>
    <div className="space-y-2">
      <p className="text-2xl font-bold text-gray-900">{value}</p>
      {subtitle && (
        <p className="text-sm text-gray-500">{subtitle}</p>
      )}
      {trend && (
        <p className={`text-sm font-medium ${
          trendPositive ? 'text-green-600' : 'text-red-600'
        }`}>
          {trend}
        </p>
      )}
    </div>
  </div>
);

const VesselStatusDetails: React.FC = () => (
  <div className="bg-white rounded-lg border border-gray-200 p-6">
    <div className="flex items-center justify-between mb-4">
      <h3 className="text-sm font-medium text-gray-600">Vessels in Operation</h3>
      <Ship className="text-gray-400" size={20} />
    </div>
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <span className="text-sm text-gray-600">Active:</span>
        <span className="text-sm font-semibold text-green-600">15</span>
      </div>
      <div className="flex justify-between items-center">
        <span className="text-sm text-gray-600">Delayed:</span>
        <span className="text-sm font-semibold text-yellow-600">2</span>
      </div>
      <div className="flex justify-between items-center">
        <span className="text-sm text-gray-600">Maintenance:</span>
        <span className="text-sm font-semibold text-blue-600">2</span>
      </div>
    </div>
  </div>
);

const CargoStatusDetails: React.FC = () => (
  <div className="bg-white rounded-lg border border-gray-200 p-6">
    <div className="flex items-center justify-between mb-4">
      <h3 className="text-sm font-medium text-gray-600">Cargo in Transit</h3>
      <Package className="text-gray-400" size={20} />
    </div>
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <span className="text-sm text-gray-600">Total:</span>
        <span className="text-sm font-semibold text-gray-900">124</span>
      </div>
      <div className="flex justify-between items-center">
        <span className="text-sm text-gray-600">In Transit:</span>
        <span className="text-sm font-semibold text-blue-600">85</span>
      </div>
      <div className="flex justify-between items-center">
        <span className="text-sm text-gray-600">At Port:</span>
        <span className="text-sm font-semibold text-green-600">29</span>
      </div>
      <div className="flex justify-between items-center">
        <span className="text-sm text-gray-600">Delayed:</span>
        <span className="text-sm font-semibold text-red-600">10</span>
      </div>
    </div>
  </div>
);

const VesselStatusMap: React.FC = () => (
  <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
    <div className="p-4 border-b border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900">Vessel Status Map</h3>
    </div>
    <div className="h-64 bg-gray-100 relative">
      {/* Placeholder for map - you can integrate your preferred map library here */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
            <Ship className="text-blue-600" size={32} />
          </div>
          <p className="text-gray-600 text-sm">Interactive Map Component</p>
          <p className="text-gray-500 text-xs">Integrate with your map provider</p>
        </div>
      </div>
      {/* Legend */}
      <div className="absolute bottom-4 left-4 bg-white rounded-lg p-3 shadow-sm border border-gray-200">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          <span className="text-xs text-gray-600">Vessel</span>
        </div>
      </div>
    </div>
  </div>
);

const TicketSalesTrends: React.FC = () => (
  <div className="bg-white rounded-lg border border-gray-200 p-6">
    <div className="flex items-center justify-between mb-4">
      <h3 className="text-lg font-semibold text-gray-900">Ticket Sales Trends</h3>
      <select className="text-sm border border-gray-200 rounded px-3 py-1">
        <option>This week</option>
        <option>This month</option>
        <option>This year</option>
      </select>
    </div>
    <div className="h-48 flex items-end justify-center space-x-2">
      {/* Simple bar chart placeholder */}
      {[70, 95, 60, 85, 90, 30].map((height, index) => (
        <div key={index} className="flex flex-col items-center">
          <div
            className="bg-gradient-to-t from-blue-500 to-blue-300 rounded-t w-8 mb-2"
            style={{ height: `${height}%` }}
          ></div>
          <span className="text-xs text-gray-500">
            {['M', 'T', 'W', 'Th', 'F', 'S'][index]}
          </span>
        </div>
      ))}
    </div>
  </div>
);

const AlertsNotifications: React.FC = () => (
  <div className="bg-white rounded-lg border border-gray-200 p-6">
    <div className="flex items-center gap-2 mb-4">
      <Bell className="text-red-500" size={20} />
      <h3 className="text-lg font-semibold text-gray-900">Alerts & Notifications</h3>
    </div>
    <div className="space-y-3">
      {[
        { message: "Ocean Voyager delayed by 2 hours", color: "bg-yellow-100 border-yellow-200" },
        { message: "Ocean Voyager delayed by 2 hours", color: "bg-blue-100 border-blue-200" },
        { message: "Ocean Voyager delayed by 2 hours", color: "bg-purple-100 border-purple-200" },
        { message: "Ocean Voyager delayed by 2 hours", color: "bg-red-100 border-red-200" },
      ].map((alert, index) => (
        <div key={index} className={`p-3 rounded-lg border ${alert.color}`}>
          <p className="text-sm text-gray-800">{alert.message}</p>
        </div>
      ))}
    </div>
  </div>
);

const DashboardMain: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main Content - matches navbar spacing */}
      <div className="px-6 py-6">
        {/* Stats Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <VesselStatusDetails />
          <CargoStatusDetails />
          <StatsCard 
            title="Tickets Sold"
            value="342"
            icon={<Ticket size={20} />}
            trend="+10% vs last week"
            trendPositive={true}
          />
          <StatsCard 
            title="Revenue Generated"
            value="$145,670"
            subtitle="Today"
            icon={<DollarSign size={20} />}
          />
        </div>

        {/* Map Section */}
        <div className="mb-6">
          <VesselStatusMap />
        </div>

        {/* Charts and Alerts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <TicketSalesTrends />
          <AlertsNotifications />
        </div>
      </div>
    </div>
  );
};

export default DashboardMain;