"use client"
import React from 'react'

interface VesselCompliance {
  id: string;
  name: string;
  complianceStatus: 'Compliant' | 'Non-Compliant';
  pendingCertifications: string | null;
  lastInspection: string;
  nextDue: string;
}

interface ComplianceStats {
  vesselsInCompliance: { current: number; total: number };
  pendingCertifications: number;
  upcomingExpirations: number;
  safetyIncidents: number;
}

const VesselComplianceDashboard = () => {
  // Sample data
  const stats: ComplianceStats = {
    vesselsInCompliance: { current: 45, total: 50 },
    pendingCertifications: 5,
    upcomingExpirations: 8,
    safetyIncidents: 3
  };

  const vessels: VesselCompliance[] = [
    {
      id: '1',
      name: 'Vessel A',
      complianceStatus: 'Compliant',
      pendingCertifications: null,
      lastInspection: '2024-01-10',
      nextDue: '2024-06-15'
    },
    {
      id: '2',
      name: 'Vessel B',
      complianceStatus: 'Non-Compliant',
      pendingCertifications: 'Safety Certification',
      lastInspection: '2024-01-10',
      nextDue: '2024-06-15'
    }
  ];

  const criticalAlerts = [
    "8 certifications are expiring in the next 30 days. Review required.",
    "2 vessels have major compliance violations that need immediate attention."
  ];

  // Calculate compliance percentage for pie chart
  const compliancePercentage = (stats.vesselsInCompliance.current / stats.vesselsInCompliance.total) * 100;
  const nonCompliancePercentage = 100 - compliancePercentage;

  return (
    <div className="w-full px-6 py-6 bg-gray-50 min-h-screen">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Vessels in Full Compliance */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-sm font-medium text-gray-600">Vessels in Full Compliance</span>
          </div>
          <h3 className="text-3xl font-bold text-gray-900">
            {stats.vesselsInCompliance.current}/{stats.vesselsInCompliance.total}
          </h3>
        </div>

        {/* Pending Certifications */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
            <span className="text-sm font-medium text-gray-600">Pending Certifications</span>
          </div>
          <h3 className="text-3xl font-bold text-gray-900">{stats.pendingCertifications}</h3>
        </div>

        {/* Upcoming Certification Expirations */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
            <span className="text-sm font-medium text-gray-600">Upcoming Certification Expirations</span>
          </div>
          <h3 className="text-3xl font-bold text-gray-900">{stats.upcomingExpirations}</h3>
        </div>

        {/* Safety Incidents This Month */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
            <span className="text-sm font-medium text-gray-600">Safety Incidents This Month</span>
          </div>
          <h3 className="text-3xl font-bold text-gray-900">{stats.safetyIncidents}</h3>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Vessel Compliance Table */}
        <div className="lg:col-span-2 space-y-6">
          {/* Table */}
          <div className="bg-white rounded-lg border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gray-50 rounded-lg">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <h2 className="text-lg font-semibold text-gray-900">Vessel Compliance Status</h2>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vessel Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Compliance Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pending Certifications</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Inspection</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Next Due</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {vessels.map((vessel) => (
                    <tr key={vessel.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {vessel.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          vessel.complianceStatus === 'Compliant' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {vessel.complianceStatus}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {vessel.pendingCertifications || 'None'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {vessel.lastInspection}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {vessel.nextDue}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                          View/edit
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          {/* Compliance Distribution Pie Chart */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Compliance Distribution</h3>
            
            {/* Pie Chart */}
            <div className="flex justify-center mb-6">
              <div className="relative w-48 h-48">
                <svg width="192" height="192" viewBox="0 0 192 192" className="transform -rotate-90">
                  {/* Background circle */}
                  <circle
                    cx="96"
                    cy="96"
                    r="80"
                    fill="none"
                    stroke="#f3f4f6"
                    strokeWidth="4"
                  />
                  
                  {/* Compliant segment (green) */}
                  <circle
                    cx="96"
                    cy="96"
                    r="80"
                    fill="none"
                    stroke="#10b981"
                    strokeWidth="32"
                    strokeDasharray={`${(compliancePercentage * 502.65) / 100} 502.65`}
                    strokeDashoffset="0"
                    strokeLinecap="round"
                  />
                  
                  {/* Non-compliant segment (red) */}
                  <circle
                    cx="96"
                    cy="96"
                    r="80"
                    fill="none"
                    stroke="#ef4444"
                    strokeWidth="32"
                    strokeDasharray={`${(nonCompliancePercentage * 502.65) / 100} 502.65`}
                    strokeDashoffset={`-${(compliancePercentage * 502.65) / 100}`}
                    strokeLinecap="round"
                  />
                </svg>
              </div>
            </div>

            {/* Legend */}
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-sm text-gray-700">Compliant</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <span className="text-sm text-gray-700">Non-Compliant</span>
              </div>
            </div>
          </div>

          {/* Critical Alerts */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Critical Alerts</h3>
            <div className="space-y-4">
              {criticalAlerts.map((alert, index) => (
                <div key={index} className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 mt-0.5">
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M6.86 1.45L1.18 11.16a1.67 1.67 0 001.42 2.51h11.36a1.67 1.67 0 001.42-2.51L9.86 1.45a1.67 1.67 0 00-3 0z" fill="#F59E0B"/>
                        <path d="M8.5 6v2.5M8.5 11h.01" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                    <p className="text-sm text-yellow-800 leading-relaxed">{alert}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VesselComplianceDashboard;