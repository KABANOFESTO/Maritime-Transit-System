"use client"
import React, { useState, useMemo } from 'react'
import { useGetSchedulesQuery, useDeleteScheduleMutation } from '@/lib/redux/slices/ScheduleSlice'
import { Trash2, AlertTriangle, CheckCircle, XCircle, Eye, Calendar, Ship, Package, Users } from 'lucide-react'

// Type definitions
interface Vessel {
  id: string;
  name: string;
  type: string;
  capacity: number;
  fuelLevel: number;
  status: 'ACTIVE' | 'STANDBY' | 'MAINTENANCE';
}

interface Route {
  id: string;
  departurePort: string;
  destinationPort: string;
}

interface Schedule {
  id: string;
  vessel: Vessel;
  route: Route;
  departureTime: string;
  bookedSeatsCount: number;
  totalSeats: number;
  bookedCargoWeight: number;
  totalCargoCapacity: number;
}

interface VesselCompliance extends Vessel {
  complianceStatus: 'Compliant' | 'Non-Compliant';
  riskLevel: 'Low' | 'Medium' | 'Critical';
  pendingItems: string[];
  totalSchedules: number;
  activeSchedules: number;
  utilization: number;
  cargoUtilization: number;
  lastInspection: string;
  nextDue: string;
  schedules: Schedule[];
}

interface ComplianceStats {
  totalVessels: number;
  compliantVessels: number;
  criticalIssues: number;
  pendingInspections: number;
  averageUtilization: number;
  lowFuelVessels: number;
}

interface ComplianceData {
  vessels: VesselCompliance[];
  stats: ComplianceStats;
}

interface VesselGroup {
  vessel: Vessel;
  schedules: Schedule[];
}

type VesselGroups = Record<string, VesselGroup>;

const VesselComplianceDashboard: React.FC = () => {
  const { data: schedules, isLoading, error, refetch } = useGetSchedulesQuery({});
  const [deleteSchedule] = useDeleteScheduleMutation();
  const [selectedVessel, setSelectedVessel] = useState<VesselCompliance | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [scheduleToDelete, setScheduleToDelete] = useState<Schedule | null>(null);

  // Process schedules data for compliance analysis
  const complianceData: ComplianceData = useMemo(() => {
    if (!schedules) return { vessels: [], stats: {} as ComplianceStats };

    // Group schedules by vessel
    const vesselGroups: VesselGroups = schedules.reduce((acc: VesselGroups, schedule: Schedule) => {
      const vesselId: string = schedule.vessel.id;
      if (!acc[vesselId]) {
        acc[vesselId] = {
          vessel: schedule.vessel,
          schedules: []
        };
      }
      acc[vesselId].schedules.push(schedule);
      return acc;
    }, {});

    // Calculate compliance metrics for each vessel
    const vessels: VesselCompliance[] = Object.values(vesselGroups).map((group: VesselGroup) => {
      const { vessel, schedules } = group;
      const totalSchedules: number = schedules.length;
      const activeSchedules: number = schedules.filter((s: Schedule) => new Date(s.departureTime) > new Date()).length;
      const utilization: number = schedules.reduce((sum: number, s: Schedule) => sum + (s.bookedSeatsCount / s.totalSeats), 0) / totalSchedules;
      const cargoUtilization: number = schedules.reduce((sum: number, s: Schedule) =>
        s.totalCargoCapacity > 0 ? sum + (s.bookedCargoWeight / s.totalCargoCapacity) : sum, 0
      ) / schedules.filter((s: Schedule) => s.totalCargoCapacity > 0).length || 0;

      // Determine compliance status based on fuel level, utilization, and activity
      let complianceStatus: 'Compliant' | 'Non-Compliant' = 'Compliant';
      let pendingItems: string[] = [];
      let riskLevel: 'Low' | 'Medium' | 'Critical' = 'Low';

      if (vessel.fuelLevel < 20) {
        complianceStatus = 'Non-Compliant';
        pendingItems.push('Critical Fuel Level');
        riskLevel = 'Critical';
      } else if (vessel.fuelLevel < 50) {
        pendingItems.push('Low Fuel Warning');
        riskLevel = 'Medium';
      }

      if (vessel.status === 'STANDBY' && activeSchedules > 0) {
        pendingItems.push('Status Verification Required');
        riskLevel = riskLevel === 'Critical' ? 'Critical' : 'Medium';
      }

      if (utilization < 0.3 && activeSchedules > 0) {
        pendingItems.push('Low Capacity Utilization');
        riskLevel = riskLevel === 'Critical' ? 'Critical' : 'Medium';
      }

      // Check for overdue maintenance (simulated based on last schedule)
      const lastSchedule: Schedule = schedules.sort((a: Schedule, b: Schedule) => new Date(b.departureTime).getTime() - new Date(a.departureTime).getTime())[0];
      const daysSinceLastSchedule: number = Math.floor((new Date().getTime() - new Date(lastSchedule.departureTime).getTime()) / (1000 * 60 * 60 * 24));

      if (daysSinceLastSchedule > 30 && daysSinceLastSchedule < 0) { // Future schedule
        const nextInspection: Date = new Date(lastSchedule.departureTime);
        nextInspection.setDate(nextInspection.getDate() + 90);

        return {
          id: vessel.id,
          name: vessel.name,
          type: vessel.type,
          capacity: vessel.capacity,
          fuelLevel: vessel.fuelLevel,
          status: vessel.status,
          complianceStatus,
          riskLevel,
          pendingItems,
          totalSchedules,
          activeSchedules,
          utilization: Math.round(utilization * 100),
          cargoUtilization: Math.round(cargoUtilization * 100),
          lastInspection: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          nextDue: nextInspection.toISOString().split('T')[0],
          schedules
        };
      }

      const nextInspection: Date = new Date();
      nextInspection.setDate(nextInspection.getDate() + Math.floor(Math.random() * 60 + 30));

      return {
        id: vessel.id,
        name: vessel.name,
        type: vessel.type,
        capacity: vessel.capacity,
        fuelLevel: vessel.fuelLevel,
        status: vessel.status,
        complianceStatus,
        riskLevel,
        pendingItems,
        totalSchedules,
        activeSchedules,
        utilization: Math.round(utilization * 100),
        cargoUtilization: Math.round(cargoUtilization * 100),
        lastInspection: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        nextDue: nextInspection.toISOString().split('T')[0],
        schedules
      };
    });

    // Calculate overall stats
    const stats: ComplianceStats = {
      totalVessels: vessels.length,
      compliantVessels: vessels.filter((v: VesselCompliance) => v.complianceStatus === 'Compliant').length,
      criticalIssues: vessels.filter((v: VesselCompliance) => v.riskLevel === 'Critical').length,
      pendingInspections: vessels.filter((v: VesselCompliance) => new Date(v.nextDue) <= new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)).length,
      averageUtilization: Math.round(vessels.reduce((sum: number, v: VesselCompliance) => sum + v.utilization, 0) / vessels.length),
      lowFuelVessels: vessels.filter((v: VesselCompliance) => v.fuelLevel < 50).length
    };

    return { vessels, stats };
  }, [schedules]);

  const handleDeleteSchedule = async (scheduleId: string): Promise<void> => {
    try {
      await deleteSchedule(scheduleId).unwrap();
      setShowDeleteModal(false);
      setScheduleToDelete(null);
      refetch(); // Refresh data after deletion
    } catch (error) {
      console.error('Failed to delete schedule:', error);
    }
  };

  const confirmDelete = (schedule: Schedule): void => {
    setScheduleToDelete(schedule);
    setShowDeleteModal(true);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <XCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <p className="text-red-600">Error loading compliance data</p>
          <button
            onClick={() => refetch()}
            className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const { vessels, stats } = complianceData;

  return (
    <div className="w-full px-6 py-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Vessel Compliance Dashboard</h1>
        <p className="text-gray-600">Monitor vessel compliance, safety metrics, and operational status</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 mb-8">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-2">
            <Ship className="h-5 w-5 text-blue-600" />
            <span className="text-sm font-medium text-gray-600">Total Vessels</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900">{stats.totalVessels}</h3>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-2">
            <CheckCircle className="h-5 w-5 text-green-600" />
            <span className="text-sm font-medium text-gray-600">Compliant</span>
          </div>
          <h3 className="text-2xl font-bold text-green-600">{stats.compliantVessels}/{stats.totalVessels}</h3>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-2">
            <AlertTriangle className="h-5 w-5 text-red-600" />
            <span className="text-sm font-medium text-gray-600">Critical Issues</span>
          </div>
          <h3 className="text-2xl font-bold text-red-600">{stats.criticalIssues}</h3>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-2">
            <Calendar className="h-5 w-5 text-orange-600" />
            <span className="text-sm font-medium text-gray-600">Due Soon</span>
          </div>
          <h3 className="text-2xl font-bold text-orange-600">{stats.pendingInspections}</h3>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-2">
            <Users className="h-5 w-5 text-blue-600" />
            <span className="text-sm font-medium text-gray-600">Avg Utilization</span>
          </div>
          <h3 className="text-2xl font-bold text-blue-600">{stats.averageUtilization}%</h3>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-2">
            <Package className="h-5 w-5 text-yellow-600" />
            <span className="text-sm font-medium text-gray-600">Low Fuel</span>
          </div>
          <h3 className="text-2xl font-bold text-yellow-600">{stats.lowFuelVessels}</h3>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Vessel Compliance Table */}
        <div className="lg:col-span-3 bg-white rounded-lg border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Vessel Compliance Overview</h2>
            <p className="text-sm text-gray-600 mt-1">Comprehensive vessel status and compliance monitoring</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vessel</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Compliance</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Risk Level</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fuel Level</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Utilization</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Next Due</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {vessels.map((vessel: VesselCompliance) => (
                  <tr key={vessel.id} className="hover:bg-gray-50 transition-colors duration-200">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{vessel.name}</div>
                        <div className="text-sm text-gray-500">{vessel.type}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${vessel.status === 'ACTIVE' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                        {vessel.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${vessel.complianceStatus === 'Compliant'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                        }`}>
                        {vessel.complianceStatus === 'Compliant' ? (
                          <CheckCircle className="h-3 w-3 mr-1" />
                        ) : (
                          <XCircle className="h-3 w-3 mr-1" />
                        )}
                        {vessel.complianceStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${vessel.riskLevel === 'Critical' ? 'bg-red-100 text-red-800' :
                        vessel.riskLevel === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                        {vessel.riskLevel === 'Critical' && <AlertTriangle className="h-3 w-3 mr-1" />}
                        {vessel.riskLevel}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="text-sm text-gray-900">{vessel.fuelLevel}%</div>
                        <div className="ml-2 w-16 bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${vessel.fuelLevel < 20 ? 'bg-red-500' :
                              vessel.fuelLevel < 50 ? 'bg-yellow-500' :
                                'bg-green-500'
                              }`}
                            style={{ width: `${Math.min(vessel.fuelLevel, 100)}%` }}
                          ></div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {vessel.utilization}%
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {vessel.nextDue}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setSelectedVessel(vessel)}
                          className="text-blue-600 hover:text-blue-800 p-1 rounded hover:bg-blue-50"
                          title="View Details"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Sidebar - Vessel Details or Alerts */}
        <div className="space-y-6">
          {selectedVessel ? (
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">{selectedVessel.name} Details</h3>
                <button
                  onClick={() => setSelectedVessel(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Pending Items</h4>
                  {selectedVessel.pendingItems.length > 0 ? (
                    <div className="space-y-2">
                      {selectedVessel.pendingItems.map((item: string, index: number) => (
                        <div key={index} className="bg-yellow-50 border border-yellow-200 rounded p-3">
                          <div className="flex items-center gap-2">
                            <AlertTriangle className="h-4 w-4 text-yellow-600" />
                            <span className="text-sm text-yellow-800">{item}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-green-600">No pending compliance issues</p>
                  )}
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Schedules ({selectedVessel.activeSchedules} active)</h4>
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {selectedVessel.schedules.map((schedule: Schedule) => (
                      <div key={schedule.id} className="bg-gray-50 rounded p-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium">{schedule.route.departurePort} → {schedule.route.destinationPort}</p>
                            <p className="text-xs text-gray-600">{new Date(schedule.departureTime).toLocaleDateString()}</p>
                          </div>
                          <button
                            onClick={() => confirmDelete(schedule)}
                            className="text-red-600 hover:text-red-800 p-1 rounded hover:bg-red-50"
                            title="Delete Schedule"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button className="w-full text-left p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
                  <div className="text-sm font-medium text-blue-900">Generate Compliance Report</div>
                  <div className="text-xs text-blue-600">Export current status</div>
                </button>
                <button className="w-full text-left p-3 bg-green-50 rounded-lg hover:bg-green-100 transition-colors">
                  <div className="text-sm font-medium text-green-900">Schedule Inspections</div>
                  <div className="text-xs text-green-600">Bulk schedule upcoming</div>
                </button>
                <button className="w-full text-left p-3 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors">
                  <div className="text-sm font-medium text-orange-900">View Alerts</div>
                  <div className="text-xs text-orange-600">Critical notifications</div>
                </button>
              </div>
            </div>
          )}

          {/* Critical Alerts */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">System Alerts</h3>
            <div className="space-y-3">
              {stats.criticalIssues > 0 && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-red-600" />
                    <span className="text-sm font-medium text-red-800">
                      {stats.criticalIssues} vessel{stats.criticalIssues !== 1 ? 's' : ''} require immediate attention
                    </span>
                  </div>
                </div>
              )}

              {stats.lowFuelVessels > 0 && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                  <div className="flex items-center gap-2">
                    <Package className="h-4 w-4 text-yellow-600" />
                    <span className="text-sm font-medium text-yellow-800">
                      {stats.lowFuelVessels} vessel{stats.lowFuelVessels !== 1 ? 's' : ''} have low fuel levels
                    </span>
                  </div>
                </div>
              )}

              {stats.pendingInspections > 0 && (
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-orange-600" />
                    <span className="text-sm font-medium text-orange-800">
                      {stats.pendingInspections} inspection{stats.pendingInspections !== 1 ? 's' : ''} due within 30 days
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center gap-3 mb-4">
              <AlertTriangle className="h-6 w-6 text-red-600" />
              <h3 className="text-lg font-semibold text-gray-900">Confirm Deletion</h3>
            </div>

            <p className="text-gray-600 mb-6">
              Are you sure you want to delete the schedule from {scheduleToDelete?.route.departurePort} to {scheduleToDelete?.route.destinationPort}?
              This action cannot be undone.
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteSchedule(scheduleToDelete!.id)}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Delete Schedule
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VesselComplianceDashboard;