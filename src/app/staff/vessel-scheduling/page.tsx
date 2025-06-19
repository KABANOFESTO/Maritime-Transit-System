'use client';
import React, { useState, useMemo } from 'react';
import { Calendar, List, Plus, Ship, MapPin, Users, Package, ChevronDown, Clock, AlertCircle, CheckCircle, Loader2 } from 'lucide-react';
import { useGetSchedulesQuery } from '@/lib/redux/slices/ScheduleSlice';
import { useGetVesselsQuery } from '@/lib/redux/slices/VesselSlice';
import { useGetRoutesQuery } from '@/lib/redux/slices/RouteSlice';

// Types
interface Schedule {
  id: number;
  vesselId: number;
  routeId: number;
  departureTime: string;
  arrivalTime: string;
  vessel?: {
    id: number;
    name: string;
    type: string;
    capacity: number;
    status: string;
  };
  route?: {
    id: number;
    departurePort: string;
    destinationPort: string;
    distance: number;
  };
}

interface Vessel {
  id: number;
  name: string;
  type: string;
  capacity: number;
  fuelLevel: number;
  status: string;
}

interface Route {
  id: number;
  departurePort: string;
  destinationPort: string;
  distance: number;
}

interface CreateScheduleForm {
  vesselId: string;
  routeId: string;
  departureTime: string;
  arrivalTime: string;
}

const SchedulePage = () => {
  const [activeView, setActiveView] = useState<'calendar' | 'list'>('calendar');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [formData, setFormData] = useState<CreateScheduleForm>({
    vesselId: '',
    routeId: '',
    departureTime: '',
    arrivalTime: ''
  });

  // Redux hooks
  const { 
    data: schedules = [], 
    isLoading: schedulesLoading, 
    error: schedulesError 
  } = useGetSchedulesQuery({});
  
  const { 
    data: vessels = [], 
    isLoading: vesselsLoading, 
    error: vesselsError 
  } = useGetVesselsQuery({});
  
  const { 
    data: routes = [], 
    isLoading: routesLoading, 
    error: routesError 
  } = useGetRoutesQuery({});

  // Create lookup maps for better performance
  const vesselMap = useMemo(() => {
    return vessels.reduce((acc: Record<number, Vessel>, vessel: Vessel) => {
      acc[vessel.id] = vessel;
      return acc;
    }, {});
  }, [vessels]);

  const routeMap = useMemo(() => {
    return routes.reduce((acc: Record<number, Route>, route: Route) => {
      acc[route.id] = route;
      return acc;
    }, {});
  }, [routes]);

  // Enhanced schedules with vessel and route details
  const enhancedSchedules = useMemo(() => {
    return schedules.map((schedule: any) => ({
      ...schedule,
      vessel: vesselMap[schedule.vesselId],
      route: routeMap[schedule.routeId]
    }));
  }, [schedules, vesselMap, routeMap]);

  const handleFormChange = (field: keyof CreateScheduleForm, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleCreateSchedule = async () => {
    try {
      // Validate form
      if (!formData.vesselId || !formData.routeId || !formData.departureTime || !formData.arrivalTime) {
        alert('Please fill in all required fields');
        return;
      }

      const scheduleData = {
        vesselId: parseInt(formData.vesselId),
        routeId: parseInt(formData.routeId),
        departureTime: formData.departureTime,
        arrivalTime: formData.arrivalTime
      };

      // Here you would typically dispatch a create action
      console.log('Creating schedule:', scheduleData);
      
      // Reset form and close modal
      setFormData({
        vesselId: '',
        routeId: '',
        departureTime: '',
        arrivalTime: ''
      });
      setShowCreateForm(false);
    } catch (error) {
      console.error('Error creating schedule:', error);
    }
  };

  const formatDateTime = (dateTimeString: string) => {
    return new Date(dateTimeString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'maintenance':
        return 'bg-yellow-100 text-yellow-800';
      case 'inactive':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Loading states
  if (schedulesLoading || vesselsLoading || routesLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex items-center gap-3 text-gray-600">
          <Loader2 className="animate-spin" size={24} />
          <span className="text-lg">Loading schedule data...</span>
        </div>
      </div>
    );
  }

  // Error states
  if (schedulesError || vesselsError || routesError) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md mx-4">
          <div className="flex items-center gap-3 text-red-600 mb-4">
            <AlertCircle size={24} />
            <h2 className="text-xl font-semibold">Error Loading Data</h2>
          </div>
          <p className="text-gray-600 mb-4">
            There was an error loading the schedule data. Please try refreshing the page.
          </p>
          <button 
            onClick={() => window.location.reload()}
            className="w-full bg-sky-500 text-white py-2 px-4 rounded-lg hover:bg-sky-600 transition-colors"
          >
            Refresh Page
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main Content */}
      <div className="px-6 py-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Schedule Management</h1>
          <p className="text-gray-600">Manage vessel schedules and monitor operations</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Ship size={20} className="text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Vessels</p>
                <p className="text-2xl font-bold text-gray-900">{vessels.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Calendar size={20} className="text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Active Schedules</p>
                <p className="text-2xl font-bold text-gray-900">{enhancedSchedules.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <MapPin size={20} className="text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Routes</p>
                <p className="text-2xl font-bold text-gray-900">{routes.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <CheckCircle size={20} className="text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Active Vessels</p>
                <p className="text-2xl font-bold text-gray-900">
                  {vessels.filter((v: Vessel) => v.status === 'ACTIVE').length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Header Controls */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setActiveView('calendar')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                activeView === 'calendar'
                  ? 'bg-sky-500 text-white shadow-md'
                  : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
              }`}
            >
              <Calendar size={16} />
              Calendar View
            </button>
            <button
              onClick={() => setActiveView('list')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                activeView === 'list'
                  ? 'bg-sky-500 text-white shadow-md'
                  : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
              }`}
            >
              <List size={16} />
              Schedule List
            </button>
          </div>
          <button
            onClick={() => setShowCreateForm(true)}
            className="flex items-center gap-2 px-6 py-3 bg-sky-500 text-white rounded-lg hover:bg-sky-600 transition-colors shadow-md"
          >
            <Plus size={16} />
            Create New Schedule
          </button>
        </div>

        {/* Calendar View */}
        {activeView === 'calendar' && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Schedule Overview</h3>
              <p className="text-sm text-gray-600 mt-1">View all scheduled departures and arrivals</p>
            </div>
            <div className="p-6">
              <div className="grid gap-4">
                {enhancedSchedules.length === 0 ? (
                  <div className="text-center py-12">
                    <Calendar size={48} className="mx-auto text-gray-300 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No Schedules Found</h3>
                    <p className="text-gray-600 mb-4">Get started by creating your first schedule</p>
                    <button
                      onClick={() => setShowCreateForm(true)}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-sky-500 text-white rounded-lg hover:bg-sky-600 transition-colors"
                    >
                      <Plus size={16} />
                      Create Schedule
                    </button>
                  </div>
                ) : (
                  enhancedSchedules.map((schedule: any) => (
                    <div key={schedule.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="p-2 bg-sky-100 rounded-lg">
                            <Ship size={20} className="text-sky-600" />
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900">
                              {schedule.vessel?.name || `Vessel ${schedule.vesselId}`}
                            </h4>
                            <p className="text-sm text-gray-600">
                              {schedule.vessel?.type} • Capacity: {schedule.vessel?.capacity}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(schedule.vessel?.status)}`}>
                            {schedule.vessel?.status || 'Unknown'}
                          </span>
                        </div>
                      </div>
                      <div className="mt-4 grid grid-cols-2 gap-4">
                        <div className="flex items-center gap-2">
                          <MapPin size={16} className="text-gray-400" />
                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              {schedule.route?.departurePort || 'Unknown Port'}
                            </p>
                            <p className="text-xs text-gray-500">
                              Departure: {formatDateTime(schedule.departureTime)}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin size={16} className="text-gray-400" />
                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              {schedule.route?.destinationPort || 'Unknown Port'}
                            </p>
                            <p className="text-xs text-gray-500">
                              Arrival: {formatDateTime(schedule.arrivalTime)}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {/* List View */}
        {activeView === 'list' && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Schedule Details</h3>
              <p className="text-sm text-gray-600 mt-1">Comprehensive view of all vessel schedules</p>
            </div>
            {enhancedSchedules.length === 0 ? (
              <div className="text-center py-12">
                <List size={48} className="mx-auto text-gray-300 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Schedules Available</h3>
                <p className="text-gray-600">Create your first schedule to get started</p>
              </div>
            ) : (
              <>
                <div className="p-4 bg-gray-50 border-b border-gray-200">
                  <div className="grid grid-cols-6 gap-4 text-sm font-medium text-gray-700">
                    <div>Vessel</div>
                    <div>Route</div>
                    <div>Departure</div>
                    <div>Arrival</div>
                    <div>Status</div>
                    <div>Capacity</div>
                  </div>
                </div>
                <div className="divide-y divide-gray-200">
                  {enhancedSchedules.map((schedule: any) => (
                    <div key={schedule.id} className="p-4 hover:bg-gray-50 transition-colors">
                      <div className="grid grid-cols-6 gap-4 items-center text-sm">
                        <div>
                          <div className="font-medium text-gray-900">
                            {schedule.vessel?.name || `Vessel ${schedule.vesselId}`}
                          </div>
                          <div className="text-xs text-gray-500">
                            {schedule.vessel?.type}
                          </div>
                        </div>
                        <div>
                          <div className="text-gray-900">
                            {schedule.route?.departurePort || 'Unknown'} → {schedule.route?.destinationPort || 'Unknown'}
                          </div>
                          <div className="text-xs text-gray-500">
                            {schedule.route?.distance ? `${schedule.route.distance} km` : 'Distance unknown'}
                          </div>
                        </div>
                        <div className="text-gray-600">
                          {formatDateTime(schedule.departureTime)}
                        </div>
                        <div className="text-gray-600">
                          {formatDateTime(schedule.arrivalTime)}
                        </div>
                        <div>
                          <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(schedule.vessel?.status)}`}>
                            {schedule.vessel?.status || 'Unknown'}
                          </span>
                        </div>
                        <div className="text-gray-600">
                          {schedule.vessel?.capacity || 'N/A'}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        )}

        {/* Create Schedule Form Modal */}
        {showCreateForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Create New Schedule</h2>
                <button
                  onClick={() => setShowCreateForm(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              </div>
              
              <div className="space-y-6">
                {/* Vessel Selection */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                    <Ship size={16} className="text-sky-500" />
                    Select Vessel *
                  </label>
                  <div className="relative">
                    <select 
                      className="w-full p-3 border border-gray-300 rounded-lg bg-white appearance-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                      value={formData.vesselId}
                      onChange={(e) => handleFormChange('vesselId', e.target.value)}
                    >
                      <option value="">Choose a vessel...</option>
                      {vessels.map((vessel: Vessel) => (
                        <option key={vessel.id} value={vessel.id}>
                          {vessel.name} - {vessel.type} (Capacity: {vessel.capacity})
                        </option>
                      ))}
                    </select>
                    <ChevronDown size={16} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  </div>
                </div>

                {/* Route Selection */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                    <MapPin size={16} className="text-sky-500" />
                    Select Route *
                  </label>
                  <div className="relative">
                    <select 
                      className="w-full p-3 border border-gray-300 rounded-lg bg-white appearance-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                      value={formData.routeId}
                      onChange={(e) => handleFormChange('routeId', e.target.value)}
                    >
                      <option value="">Choose a route...</option>
                      {routes.map((route: Route) => (
                        <option key={route.id} value={route.id}>
                          {route.departurePort} → {route.destinationPort} ({route.distance} km)
                        </option>
                      ))}
                    </select>
                    <ChevronDown size={16} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  </div>
                </div>

                {/* Date and Time */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                      <Clock size={16} className="text-sky-500" />
                      Departure Date & Time *
                    </label>
                    <input
                      type="datetime-local"
                      className="w-full p-3 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                      value={formData.departureTime}
                      onChange={(e) => handleFormChange('departureTime', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                      <Clock size={16} className="text-sky-500" />
                      Arrival Date & Time *
                    </label>
                    <input
                      type="datetime-local"
                      className="w-full p-3 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                      value={formData.arrivalTime}
                      onChange={(e) => handleFormChange('arrivalTime', e.target.value)}
                    />
                  </div>
                </div>

                {/* Selected Details Preview */}
                {formData.vesselId && formData.routeId && (
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 mb-2">Schedule Preview</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Vessel:</span>
                        <span className="font-medium">
                          {vesselMap[parseInt(formData.vesselId)]?.name}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Route:</span>
                        <span className="font-medium">
                          {routeMap[parseInt(formData.routeId)]?.departurePort} → {routeMap[parseInt(formData.routeId)]?.destinationPort}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Vessel Capacity:</span>
                        <span className="font-medium">
                          {vesselMap[parseInt(formData.vesselId)]?.capacity} passengers
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Form Actions */}
              <div className="flex justify-end gap-3 mt-8">
                <button
                  onClick={() => setShowCreateForm(false)}
                  className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateSchedule}
                  className="px-6 py-3 bg-sky-500 text-white rounded-lg hover:bg-sky-600 transition-colors"
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