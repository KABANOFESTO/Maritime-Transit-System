'use client';
import React, { useState, useMemo } from 'react';
import { Calendar, List, Plus, Ship, MapPin, Users, Package, ChevronDown, Clock, AlertCircle, CheckCircle, Loader2, Edit, Trash2, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { useCreateScheduleMutation, useUpdateScheduleMutation, useDeleteScheduleMutation, useGetSchedulesQuery } from '@/lib/redux/slices/ScheduleSlice';
import { useCreateVesselMutation, useGetVesselsQuery, useUpdateVesselMutation, useDeleteVesselMutation } from '@/lib/redux/slices/VesselSlice';
import {
  useCreateRouteMutation,
  useUpdateRouteMutation,
  useDeleteRouteMutation,
  useGetRoutesQuery
} from '@/lib/redux/slices/RouteSlice';
import { toast } from 'react-toastify';

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

interface Schedule {
  id: number;
  vessel: Vessel;
  route: Route;
  departureTime: string;
  arrivalTime: string;
  totalSeats: number;
  totalCargoCapacity: number;
  seatPrice: number;
  cargoPricePerKg: number;
  availableSeatsCount: number;
  bookedSeatsCount: number;
  availableCargoCapacity: number;
  bookedCargoWeight: number;
  tickets: any[];
  cargo: any[];
}

interface ScheduleForm {
  id?: number;
  vesselId: string;
  routeId: string;
  departureTime: string;
  arrivalTime: string;
  totalSeats: string;
  totalCargoCapacity: string;
  seatPrice: string;
  cargoPricePerKg: string;
}

interface VesselForm {
  id?: number;
  name: string;
  type: string;
  capacity: string;
  fuelLevel: string;
  status: string;
}

interface RouteForm {
  id?: number;
  departurePort: string;
  destinationPort: string;
  distance: string;
}

const SchedulePage = () => {
  const [activeView, setActiveView] = useState<'calendar' | 'list'>('list');
  const [showScheduleForm, setShowScheduleForm] = useState(false);
  const [showVesselForm, setShowVesselForm] = useState(false);
  const [showRouteForm, setShowRouteForm] = useState(false);
  const [showVesselList, setShowVesselList] = useState(false);
  const [showRouteList, setShowRouteList] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(4); // Changed to 4 per page as requested
  const [scheduleFormData, setScheduleFormData] = useState<ScheduleForm>({
    vesselId: '',
    routeId: '',
    departureTime: '',
    arrivalTime: '',
    totalSeats: '',
    totalCargoCapacity: '',
    seatPrice: '',
    cargoPricePerKg: ''
  });
  const [vesselFormData, setVesselFormData] = useState<VesselForm>({
    name: '',
    type: '',
    capacity: '',
    fuelLevel: '',
    status: 'ACTIVE'
  });
  const [routeFormData, setRouteFormData] = useState<RouteForm>({
    departurePort: '',
    destinationPort: '',
    distance: ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const [isEditingVessel, setIsEditingVessel] = useState(false);
  const [isEditingRoute, setIsEditingRoute] = useState(false);

  // Redux hooks
  const {
    data: schedules = [],
    isLoading: schedulesLoading,
    error: schedulesError,
    refetch: refetchSchedules
  } = useGetSchedulesQuery({});

  const {
    data: vessels = [],
    isLoading: vesselsLoading,
    error: vesselsError,
    refetch: refetchVessels
  } = useGetVesselsQuery({});

  const {
    data: routes = [],
    isLoading: routesLoading,
    error: routesError,
    refetch: refetchRoutes
  } = useGetRoutesQuery({});

  const [createSchedule] = useCreateScheduleMutation();
  const [updateSchedule] = useUpdateScheduleMutation();
  const [deleteSchedule] = useDeleteScheduleMutation();

  const [createVessel] = useCreateVesselMutation();
  const [updateVessel] = useUpdateVesselMutation();
  const [deleteVessel] = useDeleteVesselMutation();

  const [createRoute] = useCreateRouteMutation();
  const [updateRoute] = useUpdateRouteMutation();
  const [deleteRoute] = useDeleteRouteMutation();

  // Enhanced schedules with vessel and route details
  const enhancedSchedules = useMemo(() => {
    return schedules.map((schedule: any) => ({
      ...schedule,
      vessel: schedule.vessel,
      route: schedule.route,
      vesselId: schedule.vessel?.id,
      routeId: schedule.route?.id,
      departureTime: schedule.departureTime,
      arrivalTime: schedule.arrivalTime,
      totalSeats: schedule.totalSeats || 0,
      totalCargoCapacity: schedule.totalCargoCapacity || 0,
      seatPrice: schedule.seatPrice || 0,
      cargoPricePerKg: schedule.cargoPricePerKg || 0,
      availableSeatsCount: schedule.availableSeatsCount || schedule.totalSeats || 0,
      bookedSeatsCount: schedule.bookedSeatsCount || 0,
      availableCargoCapacity: schedule.availableCargoCapacity || schedule.totalCargoCapacity || 0,
      bookedCargoWeight: schedule.bookedCargoWeight || 0
    }));
  }, [schedules]);

  // Pagination logic
  const totalPages = Math.ceil(enhancedSchedules.length / itemsPerPage);
  const paginatedSchedules = enhancedSchedules.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Form handlers
  const handleScheduleFormChange = (field: keyof ScheduleForm, value: string) => {
    setScheduleFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleVesselFormChange = (field: keyof VesselForm, value: string) => {
    setVesselFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleRouteFormChange = (field: keyof RouteForm, value: string) => {
    setRouteFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const resetScheduleForm = () => {
    setScheduleFormData({
      vesselId: '',
      routeId: '',
      departureTime: '',
      arrivalTime: '',
      totalSeats: '',
      totalCargoCapacity: '',
      seatPrice: '',
      cargoPricePerKg: ''
    });
    setIsEditing(false);
  };

  const resetVesselForm = () => {
    setVesselFormData({
      name: '',
      type: '',
      capacity: '',
      fuelLevel: '',
      status: 'ACTIVE'
    });
    setIsEditingVessel(false);
  };

  const resetRouteForm = () => {
    setRouteFormData({
      departurePort: '',
      destinationPort: '',
      distance: ''
    });
    setIsEditingRoute(false);
  };

  // Edit handlers
  const handleEditSchedule = (schedule: Schedule) => {
    setScheduleFormData({
      id: schedule.id,
      vesselId: schedule.vessel?.id?.toString() || '',
      routeId: schedule.route?.id?.toString() || '',
      departureTime: schedule.departureTime ? schedule.departureTime.substring(0, 16) : '',
      arrivalTime: schedule.arrivalTime ? schedule.arrivalTime.substring(0, 16) : '',
      totalSeats: schedule.totalSeats?.toString() || '0',
      totalCargoCapacity: schedule.totalCargoCapacity?.toString() || '0',
      seatPrice: schedule.seatPrice?.toString() || '0',
      cargoPricePerKg: schedule.cargoPricePerKg?.toString() || '0'
    });
    setIsEditing(true);
    setShowScheduleForm(true);
  };

  const handleEditVessel = (vessel: Vessel) => {
    setVesselFormData({
      id: vessel.id,
      name: vessel.name,
      type: vessel.type,
      capacity: vessel.capacity.toString(),
      fuelLevel: vessel.fuelLevel.toString(),
      status: vessel.status
    });
    setIsEditingVessel(true);
    setShowVesselForm(true);
  };

  const handleEditRoute = (route: Route) => {
    setRouteFormData({
      id: route.id,
      departurePort: route.departurePort,
      destinationPort: route.destinationPort,
      distance: route.distance.toString()
    });
    setIsEditingRoute(true);
    setShowRouteForm(true);
  };

  // Delete handlers
  const handleDeleteSchedule = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this schedule?')) {
      try {
        await deleteSchedule(id).unwrap();
        toast.success('Schedule deleted successfully');
        refetchSchedules();
      } catch (error) {
        toast.error('Failed to delete schedule');
        console.error('Error deleting schedule:', error);
      }
    }
  };

  const handleDeleteVessel = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this vessel? This will also delete all associated schedules.')) {
      try {
        await deleteVessel(id).unwrap();
        toast.success('Vessel deleted successfully');
        refetchVessels();
        refetchSchedules();
      } catch (error) {
        toast.error('Failed to delete vessel');
        console.error('Error deleting vessel:', error);
      }
    }
  };

  const handleDeleteRoute = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this route? This will also delete all associated schedules.')) {
      try {
        await deleteRoute(id).unwrap();
        toast.success('Route deleted successfully');
        refetchRoutes();
        refetchSchedules();
      } catch (error) {
        toast.error('Failed to delete route');
        console.error('Error deleting route:', error);
      }
    }
  };


  const handleSubmitSchedule = async () => {
    try {

      const requiredFields = ['vesselId', 'routeId', 'departureTime', 'arrivalTime'];
      const missingFields = requiredFields.filter(field => {
        return !scheduleFormData[field as keyof ScheduleForm];
      });


      if (missingFields.length > 0) {
        toast.error(`Missing required fields: ${missingFields.join(', ')}`);
        return;
      }

      const numericFields = ['totalSeats', 'totalCargoCapacity', 'seatPrice', 'cargoPricePerKg'];
      for (const field of numericFields) {
        if (isNaN(parseFloat(String(scheduleFormData[field as keyof ScheduleForm] ?? '')))) {
          toast.error(`Invalid value for ${field}`);
          return;
        }
      }


      const scheduleData = {
        vesselId: parseInt(scheduleFormData.vesselId),
        routeId: parseInt(scheduleFormData.routeId),
        departureTime: scheduleFormData.departureTime,
        arrivalTime: scheduleFormData.arrivalTime,
        totalSeats: parseInt(scheduleFormData.totalSeats),
        totalCargoCapacity: parseFloat(scheduleFormData.totalCargoCapacity),
        seatPrice: parseFloat(scheduleFormData.seatPrice),
        cargoPricePerKg: parseFloat(scheduleFormData.cargoPricePerKg)
      };

      if (isEditing && scheduleFormData.id) {
        await updateSchedule({ id: scheduleFormData.id, ...scheduleData }).unwrap();
        toast.success('Schedule updated successfully');
      } else {
        await createSchedule(scheduleData).unwrap();
        toast.success('Schedule created successfully');
      }

      resetScheduleForm();
      setShowScheduleForm(false);
      refetchSchedules();
    } catch (error) {
      const errorMessage = isEditing ? 'updating' : 'creating';
      toast.error(`Error ${errorMessage} schedule`);
      console.error(`Error ${errorMessage} schedule:`, error);
    }
  };

  const handleSubmitVessel = async () => {
    try {
      // Validate all required fields
      const requiredFields = ['name', 'type', 'capacity'];
      const missingFields = requiredFields.filter(field => !vesselFormData[field as keyof VesselForm]);

      if (missingFields.length > 0) {
        toast.error(`Missing required fields: ${missingFields.join(', ')}`);
        return;
      }

      const vesselData = {
        name: vesselFormData.name,
        type: vesselFormData.type,
        capacity: parseInt(vesselFormData.capacity),
        fuelLevel: vesselFormData.fuelLevel ? parseFloat(vesselFormData.fuelLevel) : 0,
        status: vesselFormData.status
      };

      if (isEditingVessel && vesselFormData.id) {
        await updateVessel({ id: vesselFormData.id, ...vesselData }).unwrap();
        toast.success('Vessel updated successfully');
      } else {
        await createVessel(vesselData).unwrap();
        toast.success('Vessel created successfully');
      }

      resetVesselForm();
      setShowVesselForm(false);
      refetchVessels();
    } catch (error) {
      const errorMessage = isEditingVessel ? 'updating' : 'creating';
      toast.error(`Error ${errorMessage} vessel`);
      console.error(`Error ${errorMessage} vessel:`, error);
    }
  };

  const handleSubmitRoute = async () => {
    try {
      // Validate all required fields
      const requiredFields = ['departurePort', 'destinationPort', 'distance'];
      const missingFields = requiredFields.filter(field => !routeFormData[field as keyof RouteForm]);

      if (missingFields.length > 0) {
        toast.error(`Missing required fields: ${missingFields.join(', ')}`);
        return;
      }

      const routeData = {
        departurePort: routeFormData.departurePort,
        destinationPort: routeFormData.destinationPort,
        distance: parseFloat(routeFormData.distance)
      };

      if (isEditingRoute && routeFormData.id) {
        await updateRoute({ id: routeFormData.id, ...routeData }).unwrap();
        toast.success('Route updated successfully');
      } else {
        await createRoute(routeData).unwrap();
        toast.success('Route created successfully');
      }

      resetRouteForm();
      setShowRouteForm(false);
      refetchRoutes();
    } catch (error) {
      const errorMessage = isEditingRoute ? 'updating' : 'creating';
      toast.error(`Error ${errorMessage} route`);
      console.error(`Error ${errorMessage} route:`, error);
    }
  };

  // Utility functions
  const formatDateTime = (dateTimeString: string) => {
    if (!dateTimeString) return 'Not scheduled';

    try {
      const date = new Date(dateTimeString);
      return date.toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return 'Invalid date';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status?.toUpperCase()) {
      case 'ACTIVE':
        return 'bg-green-100 text-green-800';
      case 'MAINTENANCE':
        return 'bg-yellow-100 text-yellow-800';
      case 'STANDBY':
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
          <span className="text-lg">Loading data...</span>
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
            There was an error loading the data. Please try refreshing the page.
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
          <p className="text-gray-600">Manage vessel schedules, vessels, and routes</p>
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
            <button
              onClick={() => setShowVesselList(true)}
              className="mt-2 text-sm text-sky-500 hover:text-sky-600"
            >
              View all vessels
            </button>
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
            <button
              onClick={() => setShowRouteList(true)}
              className="mt-2 text-sm text-sky-500 hover:text-sky-600"
            >
              View all routes
            </button>
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
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setActiveView('calendar')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${activeView === 'calendar'
                ? 'bg-sky-500 text-white shadow-md'
                : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
                }`}
            >
              <Calendar size={16} />
              Calendar View
            </button>
            <button
              onClick={() => setActiveView('list')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${activeView === 'list'
                ? 'bg-sky-500 text-white shadow-md'
                : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
                }`}
            >
              <List size={16} />
              Schedule List
            </button>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => {
                resetVesselForm();
                setShowVesselForm(true);
              }}
              className="flex items-center gap-2 px-4 py-2 bg-white text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-50"
            >
              <Plus size={16} />
              Add Vessel
            </button>
            <button
              onClick={() => {
                resetRouteForm();
                setShowRouteForm(true);
              }}
              className="flex items-center gap-2 px-4 py-2 bg-white text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-50"
            >
              <Plus size={16} />
              Add Route
            </button>
            <button
              onClick={() => {
                resetScheduleForm();
                setShowScheduleForm(true);
              }}
              className="flex items-center gap-2 px-6 py-3 bg-sky-500 text-white rounded-lg hover:bg-sky-600 transition-colors shadow-md"
            >
              <Plus size={16} />
              New Schedule
            </button>
          </div>
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
                      onClick={() => {
                        resetScheduleForm();
                        setShowScheduleForm(true);
                      }}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-sky-500 text-white rounded-lg hover:bg-sky-600 transition-colors"
                    >
                      <Plus size={16} />
                      Create Schedule
                    </button>
                  </div>
                ) : (
                  enhancedSchedules.map((schedule: Schedule) => (
                    <div key={schedule.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="p-2 bg-sky-100 rounded-lg">
                            <Ship size={20} className="text-sky-600" />
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900">
                              {schedule.vessel?.name || 'Unknown Vessel'}
                            </h4>
                            <p className="text-sm text-gray-600">
                              {schedule.vessel?.type} • Capacity: {schedule.vessel?.capacity}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(schedule.vessel?.status || '')}`}>
                            {schedule.vessel?.status || 'Unknown'}
                          </span>
                          <button
                            onClick={() => handleEditSchedule(schedule)}
                            className="p-1 text-gray-500 hover:text-sky-600 transition-colors"
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            onClick={() => handleDeleteSchedule(schedule.id)}
                            className="p-1 text-gray-500 hover:text-red-600 transition-colors"
                          >
                            <Trash2 size={16} />
                          </button>
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
                      <div className="mt-4 grid grid-cols-4 gap-4 text-sm">
                        <div>
                          <p className="text-gray-600">Total Seats</p>
                          <p className="font-medium">
                            {schedule.availableSeatsCount}/{schedule.totalSeats} available
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-600">Cargo Capacity</p>
                          <p className="font-medium">
                            {schedule.availableCargoCapacity.toFixed(1)}/{schedule.totalCargoCapacity} kg available
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-600">Seat Price</p>
                          <p className="font-medium">${schedule.seatPrice.toFixed(2)}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Cargo Price</p>
                          <p className="font-medium">${schedule.cargoPricePerKg.toFixed(2)}/kg</p>
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
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Schedule Details</h3>
                  <p className="text-sm text-gray-600 mt-1">Comprehensive view of all vessel schedules (4 per page)</p>
                </div>
                {enhancedSchedules.length > itemsPerPage && (
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                      className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ChevronLeft size={16} />
                    </button>
                    <span className="text-sm text-gray-600">
                      Page {currentPage} of {totalPages}
                    </span>
                    <button
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                      className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ChevronRight size={16} />
                    </button>
                  </div>
                )}
              </div>
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
                  <div className="grid grid-cols-12 gap-4 text-sm font-medium text-gray-700">
                    <div className="col-span-2">Vessel</div>
                    <div className="col-span-2">Route</div>
                    <div className="col-span-2">Departure</div>
                    <div className="col-span-2">Arrival</div>
                    <div>Seats</div>
                    <div>Cargo</div>
                    <div>Status</div>
                    <div>Actions</div>
                  </div>
                </div>
                <div className="divide-y divide-gray-200">
                  {paginatedSchedules.map((schedule: Schedule) => (
                    <div key={schedule.id} className="p-4 hover:bg-gray-50 transition-colors">
                      <div className="grid grid-cols-12 gap-4 items-center text-sm">
                        <div className="col-span-2">
                          <div className="font-medium text-gray-900">
                            {schedule.vessel?.name || 'Unknown Vessel'}
                          </div>
                          <div className="text-xs text-gray-500">
                            {schedule.vessel?.type}
                          </div>
                        </div>
                        <div className="col-span-2">
                          <div className="text-gray-900">
                            {schedule.route?.departurePort || 'Unknown'} → {schedule.route?.destinationPort || 'Unknown'}
                          </div>
                          <div className="text-xs text-gray-500">
                            {schedule.route?.distance ? `${schedule.route.distance} km` : 'Distance unknown'}
                          </div>
                        </div>
                        <div className="col-span-2 text-gray-600">
                          {formatDateTime(schedule.departureTime)}
                        </div>
                        <div className="col-span-2 text-gray-600">
                          {formatDateTime(schedule.arrivalTime)}
                        </div>
                        <div className="text-gray-600">
                          {schedule.availableSeatsCount}/{schedule.totalSeats}
                        </div>
                        <div className="text-gray-600">
                          {schedule.availableCargoCapacity.toFixed(1)}/{schedule.totalCargoCapacity}kg
                        </div>
                        <div>
                          <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(schedule.vessel?.status || '')}`}>
                            {schedule.vessel?.status || 'Unknown'}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleEditSchedule(schedule)}
                            className="p-1 text-gray-500 hover:text-sky-600 transition-colors"
                            title="Edit"
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            onClick={() => handleDeleteSchedule(schedule.id)}
                            className="p-1 text-gray-500 hover:text-red-600 transition-colors"
                            title="Delete"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                {totalPages > 1 && (
                  <div className="p-4 border-t border-gray-200 flex items-center justify-between">
                    <div className="text-sm text-gray-600">
                      Showing {(currentPage - 1) * itemsPerPage + 1} to{' '}
                      {Math.min(currentPage * itemsPerPage, enhancedSchedules.length)} of{' '}
                      {enhancedSchedules.length} schedules
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                        className="px-3 py-1 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Previous
                      </button>
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                        <button
                          key={page}
                          onClick={() => setCurrentPage(page)}
                          className={`w-8 h-8 rounded-lg ${currentPage === page ? 'bg-sky-500 text-white' : 'border border-gray-200 hover:bg-gray-50'}`}
                        >
                          {page}
                        </button>
                      ))}
                      <button
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                        className="px-3 py-1 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Next
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {/* Schedule Form Modal */}
        {showScheduleForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">
                  {isEditing ? 'Edit Schedule' : 'Create New Schedule'}
                </h2>
                <button
                  onClick={() => setShowScheduleForm(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X size={24} />
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
                      value={scheduleFormData.vesselId}
                      onChange={(e) => handleScheduleFormChange('vesselId', e.target.value)}
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
                      value={scheduleFormData.routeId}
                      onChange={(e) => handleScheduleFormChange('routeId', e.target.value)}
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
                      value={scheduleFormData.departureTime}
                      onChange={(e) => handleScheduleFormChange('departureTime', e.target.value)}
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
                      value={scheduleFormData.arrivalTime}
                      onChange={(e) => handleScheduleFormChange('arrivalTime', e.target.value)}
                    />
                  </div>
                </div>

                {/* Capacity and Pricing */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                      <Users size={16} className="text-sky-500" />
                      Total Seats *
                    </label>
                    <input
                      type="number"
                      min="1"
                      className="w-full p-3 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                      value={scheduleFormData.totalSeats}
                      onChange={(e) => handleScheduleFormChange('totalSeats', e.target.value)}
                      placeholder="Enter total passenger seats"
                    />
                  </div>

                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                      <Package size={16} className="text-sky-500" />
                      Cargo Capacity (kg) *
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      className="w-full p-3 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                      value={scheduleFormData.totalCargoCapacity}
                      onChange={(e) => handleScheduleFormChange('totalCargoCapacity', e.target.value)}
                      placeholder="Enter total cargo capacity"
                    />
                  </div>

                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                      <Users size={16} className="text-sky-500" />
                      Seat Price ($) *
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      className="w-full p-3 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                      value={scheduleFormData.seatPrice}
                      onChange={(e) => handleScheduleFormChange('seatPrice', e.target.value)}
                      placeholder="Enter price per seat"
                    />
                  </div>

                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                      <Package size={16} className="text-sky-500" />
                      Cargo Price ($/kg) *
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      className="w-full p-3 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                      value={scheduleFormData.cargoPricePerKg}
                      onChange={(e) => handleScheduleFormChange('cargoPricePerKg', e.target.value)}
                      placeholder="Enter price per kg of cargo"
                    />
                  </div>
                </div>

                {/* Selected Details Preview */}
                {scheduleFormData.vesselId && scheduleFormData.routeId && (
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 mb-2">Schedule Preview</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Vessel:</span>
                        <span className="font-medium">
                          {vessels.find((v: Vessel) => v.id === parseInt(scheduleFormData.vesselId))?.name}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Route:</span>
                        <span className="font-medium">
                          {routes.find((r: Route) => r.id === parseInt(scheduleFormData.routeId))?.departurePort} → {routes.find((r: Route) => r.id === parseInt(scheduleFormData.routeId))?.destinationPort}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Vessel Capacity:</span>
                        <span className="font-medium">
                          {vessels.find((v: Vessel) => v.id === parseInt(scheduleFormData.vesselId))?.capacity} passengers
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-3 mt-8">
                <button
                  onClick={() => setShowScheduleForm(false)}
                  className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmitSchedule}
                  className="px-6 py-3 bg-sky-500 text-white rounded-lg hover:bg-sky-600 transition-colors"
                >
                  {isEditing ? 'Update Schedule' : 'Create Schedule'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Vessel Form Modal */}
        {showVesselForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">
                  {isEditingVessel ? 'Edit Vessel' : 'Create New Vessel'}
                </h2>
                <button
                  onClick={() => setShowVesselForm(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                      <Ship size={16} className="text-sky-500" />
                      Vessel Name *
                    </label>
                    <input
                      type="text"
                      className="w-full p-3 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                      value={vesselFormData.name}
                      onChange={(e) => handleVesselFormChange('name', e.target.value)}
                      placeholder="Enter vessel name"
                    />
                  </div>

                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                      <Ship size={16} className="text-sky-500" />
                      Vessel Type *
                    </label>
                    <input
                      type="text"
                      className="w-full p-3 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                      value={vesselFormData.type}
                      onChange={(e) => handleVesselFormChange('type', e.target.value)}
                      placeholder="Enter vessel type"
                    />
                  </div>

                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                      <Users size={16} className="text-sky-500" />
                      Capacity *
                    </label>
                    <input
                      type="number"
                      min="1"
                      className="w-full p-3 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                      value={vesselFormData.capacity}
                      onChange={(e) => handleVesselFormChange('capacity', e.target.value)}
                      placeholder="Enter passenger capacity"
                    />
                  </div>

                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                      <Package size={16} className="text-sky-500" />
                      Fuel Level (%)
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      className="w-full p-3 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                      value={vesselFormData.fuelLevel}
                      onChange={(e) => handleVesselFormChange('fuelLevel', e.target.value)}
                      placeholder="Enter fuel level percentage"
                    />
                  </div>

                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                      <CheckCircle size={16} className="text-sky-500" />
                      Status *
                    </label>
                    <div className="relative">
                      <select
                        className="w-full p-3 border border-gray-300 rounded-lg bg-white appearance-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                        value={vesselFormData.status}
                        onChange={(e) => handleVesselFormChange('status', e.target.value)}
                      >
                        <option value="ACTIVE">Active</option>
                        <option value="MAINTENANCE">Maintenance</option>
                        <option value="STANDBY">Standby</option>
                      </select>
                      <ChevronDown size={16} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-8">
                <button
                  onClick={() => setShowVesselForm(false)}
                  className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmitVessel}
                  className="px-6 py-3 bg-sky-500 text-white rounded-lg hover:bg-sky-600 transition-colors"
                >
                  {isEditingVessel ? 'Update Vessel' : 'Create Vessel'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Route Form Modal */}
        {showRouteForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">
                  {isEditingRoute ? 'Edit Route' : 'Create New Route'}
                </h2>
                <button
                  onClick={() => setShowRouteForm(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                      <MapPin size={16} className="text-sky-500" />
                      Departure Port *
                    </label>
                    <input
                      type="text"
                      className="w-full p-3 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                      value={routeFormData.departurePort}
                      onChange={(e) => handleRouteFormChange('departurePort', e.target.value)}
                      placeholder="Enter departure port"
                    />
                  </div>

                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                      <MapPin size={16} className="text-sky-500" />
                      Destination Port *
                    </label>
                    <input
                      type="text"
                      className="w-full p-3 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                      value={routeFormData.destinationPort}
                      onChange={(e) => handleRouteFormChange('destinationPort', e.target.value)}
                      placeholder="Enter destination port"
                    />
                  </div>

                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                      <Package size={16} className="text-sky-500" />
                      Distance (km) *
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      className="w-full p-3 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                      value={routeFormData.distance}
                      onChange={(e) => handleRouteFormChange('distance', e.target.value)}
                      placeholder="Enter distance in kilometers"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-8">
                <button
                  onClick={() => setShowRouteForm(false)}
                  className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmitRoute}
                  className="px-6 py-3 bg-sky-500 text-white rounded-lg hover:bg-sky-600 transition-colors"
                >
                  {isEditingRoute ? 'Update Route' : 'Create Route'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Vessel List Modal */}
        {showVesselList && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">All Vessels</h2>
                <button
                  onClick={() => setShowVesselList(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="bg-gray-50 rounded-lg overflow-hidden border border-gray-200">
                <div className="grid grid-cols-12 gap-4 p-4 bg-gray-100 text-sm font-medium text-gray-700">
                  <div className="col-span-3">Name</div>
                  <div className="col-span-2">Type</div>
                  <div>Capacity</div>
                  <div>Fuel</div>
                  <div>Status</div>
                  <div className="col-span-2">Actions</div>
                </div>
                <div className="divide-y divide-gray-200">
                  {vessels.length === 0 ? (
                    <div className="p-4 text-center text-gray-500">
                      No vessels found. Create your first vessel to get started.
                    </div>
                  ) : (
                    vessels.map((vessel: Vessel) => (
                      <div key={vessel.id} className="grid grid-cols-12 gap-4 p-4 items-center text-sm">
                        <div className="col-span-3 font-medium text-gray-900">
                          {vessel.name}
                        </div>
                        <div className="col-span-2 text-gray-600">
                          {vessel.type}
                        </div>
                        <div className="text-gray-600">
                          {vessel.capacity}
                        </div>
                        <div className="text-gray-600">
                          {vessel.fuelLevel}%
                        </div>
                        <div>
                          <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(vessel.status)}`}>
                            {vessel.status}
                          </span>
                        </div>
                        <div className="col-span-2 flex items-center gap-2">
                          <button
                            onClick={() => handleEditVessel(vessel)}
                            className="p-1 text-gray-500 hover:text-sky-600 transition-colors"
                            title="Edit"
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            onClick={() => handleDeleteVessel(vessel.id)}
                            className="p-1 text-gray-500 hover:text-red-600 transition-colors"
                            title="Delete"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              <div className="flex justify-end mt-6">
                <button
                  onClick={() => {
                    resetVesselForm();
                    setShowVesselList(false);
                    setShowVesselForm(true);
                  }}
                  className="flex items-center gap-2 px-6 py-3 bg-sky-500 text-white rounded-lg hover:bg-sky-600 transition-colors"
                >
                  <Plus size={16} />
                  Add New Vessel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Route List Modal */}
        {showRouteList && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">All Routes</h2>
                <button
                  onClick={() => setShowRouteList(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="bg-gray-50 rounded-lg overflow-hidden border border-gray-200">
                <div className="grid grid-cols-12 gap-4 p-4 bg-gray-100 text-sm font-medium text-gray-700">
                  <div className="col-span-4">Route</div>
                  <div className="col-span-2">Distance</div>
                  <div className="col-span-2">Actions</div>
                </div>
                <div className="divide-y divide-gray-200">
                  {routes.length === 0 ? (
                    <div className="p-4 text-center text-gray-500">
                      No routes found. Create your first route to get started.
                    </div>
                  ) : (
                    routes.map((route: Route) => (
                      <div key={route.id} className="grid grid-cols-12 gap-4 p-4 items-center text-sm">
                        <div className="col-span-4 font-medium text-gray-900">
                          {route.departurePort} → {route.destinationPort}
                        </div>
                        <div className="col-span-2 text-gray-600">
                          {route.distance} km
                        </div>
                        <div className="col-span-2 flex items-center gap-2">
                          <button
                            onClick={() => handleEditRoute(route)}
                            className="p-1 text-gray-500 hover:text-sky-600 transition-colors"
                            title="Edit"
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            onClick={() => handleDeleteRoute(route.id)}
                            className="p-1 text-gray-500 hover:text-red-600 transition-colors"
                            title="Delete"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              <div className="flex justify-end mt-6">
                <button
                  onClick={() => {
                    resetRouteForm();
                    setShowRouteList(false);
                    setShowRouteForm(true);
                  }}
                  className="flex items-center gap-2 px-6 py-3 bg-sky-500 text-white rounded-lg hover:bg-sky-600 transition-colors"
                >
                  <Plus size={16} />
                  Add New Route
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