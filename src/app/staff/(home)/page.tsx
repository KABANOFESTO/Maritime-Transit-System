'use client';
import React, { useState, useMemo } from 'react';
import { Ship, Package, Ticket, DollarSign, Bell, AlertCircle, Clock, CheckCircle, Truck, TrendingUp, BarChart3 } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { useGetVesselsQuery } from '@/lib/redux/slices/VesselSlice';
import { useGetTicketsQuery } from '@/lib/redux/slices/TicketSlice';
import { useGetCargoesQuery } from '@/lib/redux/slices/CargoSlice';
import { useGetAnalyticsQuery } from '@/lib/redux/slices/AnalyticSlice';
import { useGetComplaintsQuery } from '@/lib/redux/slices/ComplaintSlice';

interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ReactNode;
  trend?: string;
  trendPositive?: boolean;
  isLoading?: boolean;
}

const StatsCard: React.FC<StatsCardProps> = ({ 
  title, 
  value, 
  subtitle, 
  icon, 
  trend, 
  trendPositive,
  isLoading 
}) => (
  <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
    <div className="flex items-center justify-between mb-4">
      <h3 className="text-sm font-medium text-gray-600">{title}</h3>
      <div className="text-gray-400">{icon}</div>
    </div>
    <div className="space-y-2">
      {isLoading ? (
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-24 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-32"></div>
        </div>
      ) : (
        <>
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
        </>
      )}
    </div>
  </div>
);

const VesselStatusDetails: React.FC = () => {
  const { data: vessels, isLoading, error } = useGetVesselsQuery({});
  
  const activeVessels = vessels?.filter((vessel: any) => vessel.status === 'ACTIVE').length || 0;
  const totalVessels = vessels?.length || 0;
  
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-gray-600">Fleet Overview</h3>
        <Ship className="text-blue-500" size={20} />
      </div>
      
      {isLoading ? (
        <div className="animate-pulse space-y-3">
          <div className="h-4 bg-gray-200 rounded"></div>
          <div className="h-4 bg-gray-200 rounded"></div>
          <div className="h-4 bg-gray-200 rounded"></div>
        </div>
      ) : error ? (
        <div className="text-red-500 text-sm">Error loading vessels</div>
      ) : (
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Total Vessels:</span>
            <span className="text-sm font-semibold text-gray-900">{totalVessels}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Active:</span>
            <span className="text-sm font-semibold text-green-600">{activeVessels}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Inactive:</span>
            <span className="text-sm font-semibold text-red-600">{totalVessels - activeVessels}</span>
          </div>
          <div className="mt-4 pt-3 border-t border-gray-100">
            <div className="flex items-center gap-2">
              <div className="flex-1 bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-green-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${totalVessels > 0 ? (activeVessels / totalVessels) * 100 : 0}%` }}
                ></div>
              </div>
              <span className="text-xs text-gray-500">
                {totalVessels > 0 ? Math.round((activeVessels / totalVessels) * 100) : 0}% Active
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const CargoStatusDetails: React.FC = () => {
  const { data: cargoes, isLoading, error } = useGetCargoesQuery({});
  
  const totalCargo = cargoes?.length || 0;
  const pendingCargo = cargoes?.filter((cargo: any) => cargo.currentStatus === 'PENDING').length || 0;
  const totalWeight = cargoes?.reduce((sum: number, cargo: any) => sum + cargo.weight, 0) || 0;
  
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-gray-600">Cargo Overview</h3>
        <Package className="text-green-500" size={20} />
      </div>
      
      {isLoading ? (
        <div className="animate-pulse space-y-3">
          <div className="h-4 bg-gray-200 rounded"></div>
          <div className="h-4 bg-gray-200 rounded"></div>
          <div className="h-4 bg-gray-200 rounded"></div>
        </div>
      ) : error ? (
        <div className="text-red-500 text-sm">Error loading cargo</div>
      ) : (
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Total Shipments:</span>
            <span className="text-sm font-semibold text-gray-900">{totalCargo}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Pending:</span>
            <span className="text-sm font-semibold text-blue-600">{pendingCargo}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Total Weight:</span>
            <span className="text-sm font-semibold text-gray-900">{totalWeight.toFixed(1)} kg</span>
          </div>
          <div className="mt-4 pt-3 border-t border-gray-100">
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <Truck size={14} />
              <span>Avg: {totalCargo > 0 ? (totalWeight / totalCargo).toFixed(1) : 0} kg per shipment</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const TicketSalesCard: React.FC = () => {
  const { data: tickets, isLoading, error } = useGetTicketsQuery({});
  
  const totalTickets = tickets?.length || 0;
  const paidTickets = tickets?.filter((ticket: any) => ticket.paid).length || 0;
  const totalRevenue = tickets?.reduce((sum: number, ticket: any) => sum + ticket.price, 0) || 0;
  
  return (
    <StatsCard 
      title="Ticket Sales"
      value={totalTickets}
      subtitle={`${paidTickets} paid tickets`}
      icon={<Ticket className="text-purple-500" size={20} />}
      trend={`$${totalRevenue.toLocaleString()} total revenue`}
      trendPositive={true}
      isLoading={isLoading}
    />
  );
};

const RevenueCard: React.FC = () => {
  const { data: analytics, isLoading, error } = useGetAnalyticsQuery({});
  
  const todayRevenue = analytics?.[0]?.revenue || 0;
  const ticketsSold = analytics?.[0]?.ticketsSold || 0;
  
  return (
    <StatsCard 
      title="Today's Revenue"
      value={`$${todayRevenue.toLocaleString()}`}
      subtitle={`${ticketsSold} tickets sold`}
      icon={<DollarSign className="text-green-500" size={20} />}
      trend="Daily performance"
      trendPositive={true}
      isLoading={isLoading}
    />
  );
};

const VesselStatusMap: React.FC = () => {
  const { data: vessels, isLoading } = useGetVesselsQuery({});
  
  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Fleet Status Overview</h3>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Clock size={16} />
            <span>Real-time updates</span>
          </div>
        </div>
      </div>
      <div className="p-6">
        {isLoading ? (
          <div className="animate-pulse space-y-4">
            <div className="h-6 bg-gray-200 rounded w-48"></div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {vessels?.slice(0, 4).map((vessel: any) => (
              <div key={vessel.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${vessel.status === 'ACTIVE' ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                  <div>
                    <p className="font-medium text-gray-900">{vessel.name}</p>
                    <p className="text-sm text-gray-500">{vessel.type}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">{vessel.fuelLevel}%</p>
                    <p className="text-xs text-gray-500">Fuel Level</p>
                  </div>
                  <div className={`px-2 py-1 rounded text-xs font-medium ${
                    vessel.status === 'ACTIVE' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {vessel.status}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const AnalyticsTrends: React.FC = () => {
  const { data: analytics, isLoading } = useGetAnalyticsQuery({});
  const { data: tickets } = useGetTicketsQuery({});
  const { data: cargoes } = useGetCargoesQuery({});
  const { data: vessels } = useGetVesselsQuery({});
  
  const [selectedPeriod, setSelectedPeriod] = useState('today');
  const [chartType, setChartType] = useState('line');

  // Process analytics data for charts
  const chartData = useMemo(() => {
    if (!analytics || analytics.length === 0) {
      // Generate sample data structure when no backend data is available
      const sampleData = [];
      const today = new Date();
      for (let i = 6; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        sampleData.push({
          date: date.toISOString().split('T')[0],
          day: date.toLocaleDateString('en-US', { weekday: 'short' }),
          revenue: Math.floor(Math.random() * 5000) + 2000,
          tickets: Math.floor(Math.random() * 50) + 20,
          cargo: Math.floor(Math.random() * 1000) + 500,
          fuel: Math.floor(Math.random() * 200) + 100
        });
      }
      return sampleData;
    }

    // Process real backend data
    return analytics.map((item: any, index: number) => ({
      date: item.date || new Date().toISOString().split('T')[0],
      day: new Date(item.date || new Date()).toLocaleDateString('en-US', { weekday: 'short' }),
      revenue: item.revenue || 0,
      tickets: item.ticketsSold || 0,
      cargo: item.cargoWeight || 0,
      fuel: item.fuelConsumed || 0
    }));
  }, [analytics]);

  // Pie chart data for vessel status
  const vesselStatusData = useMemo(() => {
    if (!vessels) return [];
    
    const statusCounts = vessels.reduce((acc: any, vessel: any) => {
      acc[vessel.status] = (acc[vessel.status] || 0) + 1;
      return acc;
    }, {});

    return Object.entries(statusCounts).map(([status, count]) => ({
      name: status,
      value: count as number,
      color: status === 'ACTIVE' ? '#10B981' : status === 'MAINTENANCE' ? '#F59E0B' : '#6B7280'
    }));
  }, [vessels]);

  const todayData = analytics?.[0] || chartData[chartData.length - 1];

  const COLORS = ['#10B981', '#3B82F6', '#8B5CF6', '#F59E0B'];

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <TrendingUp className="text-blue-500" size={20} />
          <h3 className="text-lg font-semibold text-gray-900">Daily Analytics</h3>
        </div>
        <div className="flex items-center gap-2">
          <select 
            value={chartType}
            onChange={(e) => setChartType(e.target.value)}
            className="text-sm border border-gray-200 rounded px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="line">Line Chart</option>
            <option value="bar">Bar Chart</option>
            <option value="pie">Fleet Status</option>
          </select>
          <select 
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="text-sm border border-gray-200 rounded px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="today">Last 7 Days</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
          </select>
        </div>
      </div>
      
      {isLoading ? (
        <div className="animate-pulse space-y-4">
          <div className="h-64 bg-gray-200 rounded"></div>
          <div className="grid grid-cols-2 gap-4">
            <div className="h-16 bg-gray-200 rounded"></div>
            <div className="h-16 bg-gray-200 rounded"></div>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Chart Section */}
          <div className="h-64">
            {chartType === 'line' && (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis 
                    dataKey="day" 
                    stroke="#6b7280" 
                    fontSize={12}
                  />
                  <YAxis stroke="#6b7280" fontSize={12} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#fff', 
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="revenue" 
                    stroke="#3B82F6" 
                    strokeWidth={2}
                    dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
                    name="Revenue ($)"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="tickets" 
                    stroke="#10B981" 
                    strokeWidth={2}
                    dot={{ fill: '#10B981', strokeWidth: 2, r: 4 }}
                    name="Tickets Sold"
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
            
            {chartType === 'bar' && (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis 
                    dataKey="day" 
                    stroke="#6b7280" 
                    fontSize={12}
                  />
                  <YAxis stroke="#6b7280" fontSize={12} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#fff', 
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                    }}
                  />
                  <Bar dataKey="cargo" fill="#8B5CF6" name="Cargo Weight (kg)" />
                  <Bar dataKey="fuel" fill="#F59E0B" name="Fuel Consumed (L)" />
                </BarChart>
              </ResponsiveContainer>
            )}

            {chartType === 'pie' && vesselStatusData.length > 0 && (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={vesselStatusData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {vesselStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-100">
              <p className="text-2xl font-bold text-blue-600">{todayData?.tickets || 0}</p>
              <p className="text-sm text-gray-600">Tickets Sold</p>
              <div className="flex items-center justify-center mt-1">
                <TrendingUp size={12} className="text-blue-500 mr-1" />
                <span className="text-xs text-blue-500">+12%</span>
              </div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg border border-green-100">
              <p className="text-2xl font-bold text-green-600">{todayData?.cargo || 0} kg</p>
              <p className="text-sm text-gray-600">Cargo Weight</p>
              <div className="flex items-center justify-center mt-1">
                <TrendingUp size={12} className="text-green-500 mr-1" />
                <span className="text-xs text-green-500">+8%</span>
              </div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg border border-purple-100">
              <p className="text-2xl font-bold text-purple-600">${todayData?.revenue || 0}</p>
              <p className="text-sm text-gray-600">Revenue</p>
              <div className="flex items-center justify-center mt-1">
                <TrendingUp size={12} className="text-purple-500 mr-1" />
                <span className="text-xs text-purple-500">+15%</span>
              </div>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-lg border border-orange-100">
              <p className="text-2xl font-bold text-orange-600">{todayData?.fuel || 0} L</p>
              <p className="text-sm text-gray-600">Fuel Consumed</p>
              <div className="flex items-center justify-center mt-1">
                <BarChart3 size={12} className="text-orange-500 mr-1" />
                <span className="text-xs text-orange-500">Avg</span>
              </div>
            </div>
          </div>

          {/* Performance Summary */}
          <div className="pt-4 border-t border-gray-100">
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-600">Performance Metrics:</span>
              <div className="flex items-center gap-4">
                <span className="text-green-600 font-medium">Revenue +15%</span>
                <span className="text-blue-600 font-medium">Efficiency +8%</span>
                <span className="text-purple-600 font-medium">Growth +12%</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const AlertsNotifications: React.FC = () => {
  const { data: complaints, isLoading, error } = useGetComplaintsQuery({});
  
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center gap-2 mb-4">
        <Bell className="text-red-500" size={20} />
        <h3 className="text-lg font-semibold text-gray-900">Alerts & Notifications</h3>
        {complaints && complaints.length > 0 && (
          <span className="bg-red-100 text-red-800 text-xs font-medium px-2 py-1 rounded-full">
            {complaints.length}
          </span>
        )}
      </div>
      
      {isLoading ? (
        <div className="animate-pulse space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-16 bg-gray-200 rounded-lg"></div>
          ))}
        </div>
      ) : error ? (
        <div className="text-red-500 text-sm flex items-center gap-2">
          <AlertCircle size={16} />
          <span>Error loading notifications</span>
        </div>
      ) : complaints && complaints.length > 0 ? (
        <div className="space-y-3 max-h-64 overflow-y-auto">
          {complaints.map((complaint: any) => (
            <div key={complaint.id} className={`p-3 rounded-lg border ${
              complaint.status === 'Pending' 
                ? 'bg-yellow-50 border-yellow-200' 
                : 'bg-green-50 border-green-200'
            }`}>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{complaint.subject}</p>
                  <p className="text-sm text-gray-600 mt-1">{complaint.message}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-xs text-gray-500">
                      By: {complaint.user?.username}
                    </span>
                    <span className="text-xs text-gray-400">•</span>
                    <span className="text-xs text-gray-500">
                      {new Date(complaint.submittedAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <div className={`px-2 py-1 rounded text-xs font-medium ${
                  complaint.status === 'Pending'
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-green-100 text-green-800'
                }`}>
                  {complaint.status}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">
          <CheckCircle className="mx-auto mb-2 text-green-500" size={24} />
          <p className="text-sm">No active alerts</p>
          <p className="text-xs text-gray-400">All systems running smoothly</p>
        </div>
      )}
    </div>
  );
};

const DashboardMain: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="px-6 py-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
          <p className="text-gray-600 mt-1">Real-time monitoring of your maritime operations</p>
        </div>

        {/* Stats Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <VesselStatusDetails />
          <CargoStatusDetails />
          <TicketSalesCard />
          <RevenueCard />
        </div>

        {/* Fleet Status Section */}
        <div className="mb-6">
          <VesselStatusMap />
        </div>

        {/* Analytics and Alerts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <AnalyticsTrends />
          <AlertsNotifications />
        </div>
      </div>
    </div>
  );
};

export default DashboardMain;