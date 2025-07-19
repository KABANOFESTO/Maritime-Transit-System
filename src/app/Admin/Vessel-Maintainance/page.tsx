"use client"
import React, { useState, useMemo } from 'react'
import { useCreateVesselMutation, useUpdateVesselMutation, useDeleteVesselMutation, useGetVesselsQuery } from '@/lib/redux/slices/VesselSlice'

interface Vessel {
  id: number;
  name: string;
  type: string;
  capacity: number;
  fuelLevel: number;
  status: 'ACTIVE' | 'STANDBY' | 'MAINTENANCE';
}

interface VesselFormData {
  name: string;
  type: string;
  capacity: number;
  fuelLevel: number;
  status: 'ACTIVE' | 'STANDBY' | 'MAINTENANCE';
}

const VesselMaintenanceDashboard = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingVessel, setEditingVessel] = useState<Vessel | null>(null);
  const [formData, setFormData] = useState<VesselFormData>({
    name: '',
    type: '',
    capacity: 0,
    fuelLevel: 0,
    status: 'ACTIVE'
  });

  const itemsPerPage = 5;

  // Query hooks
  const { data: vessels = [], isLoading, isError, refetch } = useGetVesselsQuery({});
  const [createVessel, { isLoading: isCreating }] = useCreateVesselMutation();
  const [updateVessel, { isLoading: isUpdating }] = useUpdateVesselMutation();
  const [deleteVessel, { isLoading: isDeleting }] = useDeleteVesselMutation();

  // Calculate stats from real vessel data
  const stats = useMemo(() => {
    const totalVessels = vessels.length;
    const activeVessels = vessels.filter((vessel: any) => vessel.status === 'ACTIVE').length;
    const maintenanceVessels = vessels.filter((vessel: any) => vessel.status === 'MAINTENANCE').length;
    const standbyVessels = vessels.filter((vessel: any) => vessel.status === 'STANDBY').length;
    const averageFuel = totalVessels > 0 ? vessels.reduce((sum: number, vessel: any) => sum + vessel.fuelLevel, 0) / totalVessels : 0;
    const totalCapacity = vessels.reduce((sum: number, vessel: any) => sum + vessel.capacity, 0);

    return {
      totalVessels,
      activeVessels,
      maintenanceVessels,
      standbyVessels,
      averageFuel: Math.round(averageFuel * 10) / 10,
      totalCapacity
    };
  }, [vessels]);

  // Pagination
  const totalPages = Math.ceil(vessels.length / itemsPerPage);
  const paginatedVessels = vessels.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const resetForm = () => {
    setFormData({
      name: '',
      type: '',
      capacity: 0,
      fuelLevel: 0,
      status: 'ACTIVE'
    });
    setEditingVessel(null);
    setShowAddForm(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (editingVessel) {
        await updateVessel({ id: editingVessel.id, ...formData }).unwrap();
      } else {
        await createVessel(formData).unwrap();
      }
      resetForm();
      refetch();
    } catch (error) {
      console.error('Error saving vessel:', error);
    }
  };

  const handleEdit = (vessel: Vessel) => {
    setFormData({
      name: vessel.name,
      type: vessel.type,
      capacity: vessel.capacity,
      fuelLevel: vessel.fuelLevel,
      status: vessel.status
    });
    setEditingVessel(vessel);
    setShowAddForm(true);
  };

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this vessel?')) {
      try {
        await deleteVessel(id).unwrap();
        refetch();
      } catch (error) {
        console.error('Error deleting vessel:', error);
      }
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'STANDBY':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'MAINTENANCE':
        return 'text-red-600 bg-red-50 border-red-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getFuelLevelColor = (level: number) => {
    if (level >= 70) return 'text-green-600';
    if (level >= 30) return 'text-yellow-600';
    return 'text-red-600';
  };

  if (isLoading) {
    return (
      <div className="w-full px-6 py-6 bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading vessels...</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="w-full px-6 py-6 bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-xl mb-2">⚠️</div>
          <p className="text-red-600">Error loading vessel data</p>
          <button
            onClick={() => refetch()}
            className="mt-2 px-4 py-2 bg-sky-500 text-white rounded-lg hover:bg-sky-600"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full px-6 py-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Vessel Management Dashboard</h1>
        <p className="text-gray-600">Monitor and manage your fleet operations and maintenance status</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Total Fleet */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-blue-50 rounded-lg">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3 18h18v-2l-2-1V9a2 2 0 0 0-2-2V5a1 1 0 0 0-1-1H8a1 1 0 0 0-1 1v2a2 2 0 0 0-2 2v6l-2 1v2z" stroke="#3B82F6" strokeWidth="2" />
              </svg>
            </div>
            <span className="text-sm font-medium text-gray-600">Total Fleet</span>
          </div>
          <div className="space-y-1">
            <h3 className="text-3xl font-bold text-gray-900">{stats.totalVessels}</h3>
            <p className="text-sm text-blue-600">Vessels in fleet</p>
          </div>
        </div>

        {/* Active Vessels */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-green-50 rounded-lg">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="10" stroke="#10B981" strokeWidth="2" />
                <path d="9 12l2 2 4-4" stroke="#10B981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <span className="text-sm font-medium text-gray-600">Active Vessels</span>
          </div>
          <div className="space-y-1">
            <h3 className="text-3xl font-bold text-gray-900">{stats.activeVessels}</h3>
            <p className="text-sm text-green-600">Currently operational</p>
          </div>
        </div>

        {/* Under Maintenance */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-red-50 rounded-lg">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" stroke="#EF4444" strokeWidth="2" />
              </svg>
            </div>
            <span className="text-sm font-medium text-gray-600">Under Maintenance</span>
          </div>
          <div className="space-y-1">
            <h3 className="text-3xl font-bold text-gray-900">{stats.maintenanceVessels}</h3>
            <p className="text-sm text-red-600">Requiring attention</p>
          </div>
        </div>

        {/* Fleet Capacity */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-purple-50 rounded-lg">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" stroke="#8B5CF6" strokeWidth="2" />
              </svg>
            </div>
            <span className="text-sm font-medium text-gray-600">Total Capacity</span>
          </div>
          <div className="space-y-1">
            <h3 className="text-3xl font-bold text-gray-900">{stats.totalCapacity.toLocaleString()}</h3>
            <p className="text-sm text-purple-600">Combined capacity</p>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Vessel Table */}
        <div className="lg:col-span-2 bg-white rounded-lg border border-gray-200 shadow-sm">
          {/* Table Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Fleet Overview</h2>
            <button
              onClick={() => setShowAddForm(true)}
              className="flex items-center gap-2 px-4 py-2 bg-sky-500 text-white rounded-lg hover:bg-sky-600 transition-colors"
              disabled={isCreating}
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M8 3.33334V12.6667M3.33334 8H12.6667" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Add Vessel
            </button>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vessel ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Capacity</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fuel Level</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {paginatedVessels.map((vessel: any) => (
                  <tr key={vessel.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">#{vessel.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">{vessel.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{vessel.type}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{vessel.capacity.toLocaleString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className={`font-medium ${getFuelLevelColor(vessel.fuelLevel)}`}>
                        {vessel.fuelLevel}%
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(vessel.status)}`}>
                        {vessel.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                      <button
                        onClick={() => handleEdit(vessel)}
                        className="text-sky-600 hover:text-sky-700 font-medium"
                        disabled={isUpdating}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(vessel.id)}
                        className="text-red-600 hover:text-red-700 font-medium"
                        disabled={isDeleting}
                      >
                        Delete
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
                className="p-2 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M10 12L6 8L10 4" stroke="#6B7280" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              <span className="text-sm text-gray-600">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="p-2 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M6 4L10 8L6 12" stroke="#6B7280" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>
            <span className="text-sm text-gray-500">
              Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, vessels.length)} of {vessels.length} vessels
            </span>
          </div>
        </div>

        {/* Right Side Content */}
        <div className="space-y-6">
          {/* Fleet Status Overview */}
          <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Fleet Status Distribution</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">Active</span>
                </div>
                <span className="text-sm font-medium">{stats.activeVessels} vessels</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full" style={{ width: `${stats.totalVessels > 0 ? (stats.activeVessels / stats.totalVessels) * 100 : 0}%` }}></div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">Standby</span>
                </div>
                <span className="text-sm font-medium">{stats.standbyVessels} vessels</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-yellow-500 h-2 rounded-full" style={{ width: `${stats.totalVessels > 0 ? (stats.standbyVessels / stats.totalVessels) * 100 : 0}%` }}></div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">Maintenance</span>
                </div>
                <span className="text-sm font-medium">{stats.maintenanceVessels} vessels</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-red-500 h-2 rounded-full" style={{ width: `${stats.totalVessels > 0 ? (stats.maintenanceVessels / stats.totalVessels) * 100 : 0}%` }}></div>
              </div>
            </div>
          </div>

          {/* Maintenance Alerts */}
          <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Maintenance Alerts</h3>
            {stats.maintenanceVessels > 0 ? (
              <div className="space-y-3">
                {vessels.filter((v: Vessel) => v.status === 'MAINTENANCE').slice(0, 3).map((vessel: any) => (
                  <div key={vessel.id} className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 mt-0.5">
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" fill="#EF4444" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-red-800">{vessel.name}</h4>
                        <p className="text-sm text-red-700 mt-1">
                          {vessel.type} - Fuel: {vessel.fuelLevel}%
                        </p>
                        <p className="text-xs text-red-600 mt-1">Requires maintenance attention</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center gap-3">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="10" cy="10" r="10" fill="#10B981" />
                    <path d="6 10l2 2 4-4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <div>
                    <h4 className="font-medium text-green-800">All Systems Operational</h4>
                    <p className="text-sm text-green-700">No maintenance alerts at this time</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Quick Stats */}
          <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Fleet Statistics</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Average Fuel Level</span>
                <span className={`font-medium ${getFuelLevelColor(stats.averageFuel)}`}>
                  {stats.averageFuel}%
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Total Fleet Capacity</span>
                <span className="font-medium text-gray-900">{stats.totalCapacity.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Operational Rate</span>
                <span className="font-medium text-green-600">
                  {stats.totalVessels > 0 ? Math.round((stats.activeVessels / stats.totalVessels) * 100) : 0}%
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add/Edit Vessel Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                {editingVessel ? 'Edit Vessel' : 'Add New Vessel'}
              </h3>
              <button
                onClick={resetForm}
                className="text-gray-400 hover:text-gray-500"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500"
                  placeholder="Vessel name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                <input
                  type="text"
                  required
                  value={formData.type}
                  onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500"
                  placeholder="e.g., Cargo Ship, Ferry"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Capacity</label>
                <input
                  type="number"
                  required
                  min="1"
                  value={formData.capacity}
                  onChange={(e) => setFormData(prev => ({ ...prev, capacity: parseInt(e.target.value) || 0 }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500"
                  placeholder="Capacity"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Fuel Level (%)</label>
                <input
                  type="number"
                  required
                  min="0"
                  max="100"
                  value={formData.fuelLevel}
                  onChange={(e) => setFormData(prev => ({ ...prev, fuelLevel: parseFloat(e.target.value) || 0 }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500"
                  placeholder="0-100"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as 'ACTIVE' | 'STANDBY' | 'MAINTENANCE' }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500"
                >
                  <option value="ACTIVE">Active</option>
                  <option value="STANDBY">Standby</option>
                  <option value="MAINTENANCE">Maintenance</option>
                </select>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={resetForm}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isCreating || isUpdating}
                  className="flex-1 px-4 py-2 bg-sky-500 text-white rounded-lg hover:bg-sky-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isCreating || isUpdating ? 'Saving...' : (editingVessel ? 'Update' : 'Create')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default VesselMaintenanceDashboard;