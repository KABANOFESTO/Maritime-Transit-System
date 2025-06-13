'use client';
import React, { useState } from 'react';
import { Calendar, List, Plus, Ship, MapPin, Users, Package, ChevronDown } from 'lucide-react';

// Types
interface Schedule {
  id: string;
  title: string;
  date: string;
  type: 'maintenance' | 'monitoring' | 'meeting' | 'review' | 'cleaning' | 'confirming';
}

interface Vessel {
  id: string;
  name: string;
  departure: string;
  arrival: string;
  status: 'On Time' | 'Delayed' | 'Cancelled';
}

// Sample data
const schedules: Schedule[] = [
  { id: '1', title: 'Vessel Maintainance', date: '29', type: 'maintenance' },
  { id: '2', title: 'Ticket Confirming', date: '1', type: 'confirming' },
  { id: '3', title: 'Checking Scheduling', date: '2', type: 'monitoring' },
  { id: '4', title: 'Vessel Monitoring', date: '3', type: 'monitoring' },
  { id: '5', title: 'Meeting With Admin', date: '5', type: 'meeting' },
  { id: '6', title: 'Review', date: '7', type: 'review' },
  { id: '7', title: 'Vessel Mantainance', date: '8', type: 'maintenance' },
  { id: '8', title: 'Cleaning Up', date: '9', type: 'cleaning' },
];

const vessels: Vessel[] = [
  {
    id: '1',
    name: 'Ocean Explorer',
    departure: 'Port A - P2/15/2024, 8:00:00 AMort B',
    arrival: '2/15/2024, 2:30:00 PM',
    status: 'On Time'
  }
];

const SchedulePage = () => {
  const [activeView, setActiveView] = useState<'calendar' | 'list'>('calendar');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showUserDropdown, setShowUserDropdown] = useState(false);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const getTypeColor = (type: Schedule['type']) => {
    const colors = {
      maintenance: 'bg-blue-100 text-blue-800',
      monitoring: 'bg-green-100 text-green-800',
      meeting: 'bg-green-100 text-green-800',
      review: 'bg-red-100 text-red-800',
      cleaning: 'bg-yellow-100 text-yellow-800',
      confirming: 'bg-blue-100 text-blue-800'
    };
    return colors[type] || 'bg-gray-100 text-gray-800';
  };

  const calendarDays = [
    { day: 'MON', date: '29', schedules: schedules.filter(s => s.date === '29') },
    { day: 'TUE', date: '30', schedules: schedules.filter(s => s.date === '30') },
    { day: 'WED', date: '31', schedules: schedules.filter(s => s.date === '31') },
    { day: 'THUR', date: '1', schedules: schedules.filter(s => s.date === '1') },
    { day: 'FRI', date: '2', schedules: schedules.filter(s => s.date === '2') },
    { day: 'SAT', date: '3', schedules: schedules.filter(s => s.date === '3') },
    { day: 'SUN', date: '4', schedules: schedules.filter(s => s.date === '4') },
    { day: 'MON', date: '5', schedules: schedules.filter(s => s.date === '5') },
    { day: 'TUE', date: '6', schedules: schedules.filter(s => s.date === '6') },
    { day: 'WED', date: '7', schedules: schedules.filter(s => s.date === '7') },
    { day: 'THUR', date: '8', schedules: schedules.filter(s => s.date === '8') },
    { day: 'FRI', date: '9', schedules: schedules.filter(s => s.date === '9') },
  ];

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Main Content */}
      <div className="px-6 py-6">
        {/* Header Controls */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setActiveView('calendar')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                activeView === 'calendar'
                  ? 'bg-sky-400 text-white'
                  : 'bg-white text-gray-700 border border-gray-200'
              }`}
            >
              <Calendar size={16} />
              Calendar
            </button>
            <button
              onClick={() => setActiveView('list')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                activeView === 'list'
                  ? 'bg-sky-400 text-white'
                  : 'bg-white text-gray-700 border border-gray-200'
              }`}
            >
              <List size={16} />
              List
            </button>
          </div>
          <button
            onClick={() => setShowCreateForm(true)}
            className="flex items-center gap-2 px-4 py-2 bg-sky-400 text-white rounded-lg hover:bg-sky-500 transition-colors"
          >
            <Plus size={16} />
            Create New Schedule
          </button>
        </div>

        {/* Calendar View */}
        {activeView === 'calendar' && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="grid grid-cols-4 gap-0">
              {calendarDays.slice(0, 12).map((day, index) => (
                <div key={index} className="border-b border-r border-gray-200 p-4 min-h-[120px]">
                  <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">
                    {day.day}
                  </div>
                  <div className="text-lg font-semibold text-gray-900 mb-2">
                    {day.date}
                  </div>
                  <div className="space-y-1">
                    {day.schedules.map((schedule) => (
                      <div
                        key={schedule.id}
                        className={`text-xs px-2 py-1 rounded-md ${getTypeColor(schedule.type)}`}
                      >
                        {schedule.title}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* List View */}
        {activeView === 'list' && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-4 border-b border-gray-200">
              <div className="grid grid-cols-4 gap-4 text-sm font-medium text-gray-700">
                <div>Vessel Name</div>
                <div>Departure</div>
                <div>Arrival</div>
                <div>Status</div>
              </div>
            </div>
            <div className="divide-y divide-gray-200">
              {vessels.map((vessel) => (
                <div key={vessel.id} className="p-4">
                  <div className="grid grid-cols-4 gap-4 text-sm">
                    <div className="font-medium text-gray-900">{vessel.name}</div>
                    <div className="text-gray-600">{vessel.departure}</div>
                    <div className="text-gray-600">{vessel.arrival}</div>
                    <div>
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                        vessel.status === 'On Time' ? 'bg-green-100 text-green-800' :
                        vessel.status === 'Delayed' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {vessel.status}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Create Schedule Form Modal */}
        {showCreateForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-2xl mx-4">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Create New Schedule</h2>
              
              <div className="space-y-4">
                {/* Vessel Selection */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                    <Ship size={16} className="text-sky-500" />
                    Vessel
                  </label>
                  <div className="relative">
                    <select className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 appearance-none">
                      <option>select vessel</option>
                      <option>Ocean Explorer</option>
                      <option>Sea Navigator</option>
                    </select>
                    <ChevronDown size={16} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  </div>
                </div>

                {/* Ports */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                      <MapPin size={16} className="text-sky-500" />
                      Departure Port
                    </label>
                    <div className="relative">
                      <select className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 appearance-none">
                        <option>Select Departure Port</option>
                        <option>Port A</option>
                        <option>Port B</option>
                      </select>
                      <ChevronDown size={16} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    </div>
                  </div>
                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                      <MapPin size={16} className="text-sky-500" />
                      Arrival Port
                    </label>
                    <div className="relative">
                      <select className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 appearance-none">
                        <option>Select Arrival Port</option>
                        <option>Port A</option>
                        <option>Port B</option>
                      </select>
                      <ChevronDown size={16} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    </div>
                  </div>
                </div>

                {/* Dates */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">
                      Departure Date & Time
                    </label>
                    <input
                      type="datetime-local"
                      className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50"
                      placeholder="mm/dd/yyyy"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">
                      Arrival Date & Time
                    </label>
                    <input
                      type="datetime-local"
                      className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50"
                      placeholder="mm/dd/yyyy"
                    />
                  </div>
                </div>

                {/* Capacities */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                      <Package size={16} className="text-sky-500" />
                      Cargo Capacity
                    </label>
                    <input
                      type="number"
                      className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50"
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                      <Users size={16} className="text-sky-500" />
                      Passenger Capacity
                    </label>
                    <input
                      type="number"
                      className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50"
                      placeholder="0"
                    />
                  </div>
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => setShowCreateForm(false)}
                  className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => setShowCreateForm(false)}
                  className="px-6 py-3 bg-sky-400 text-white rounded-lg hover:bg-sky-500 transition-colors"
                >
                  Create Schedule
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SchedulePage;