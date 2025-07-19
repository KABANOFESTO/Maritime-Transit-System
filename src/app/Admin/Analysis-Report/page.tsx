"use client"
import React, { useMemo, useRef } from 'react'
import { useGetSchedulesQuery } from '@/lib/redux/slices/ScheduleSlice'

interface StatCardProps {
  title: string;
  value: string;
  bgColor?: string;
  icon?: React.ReactNode;
}

interface ProcessedData {
  totalRevenue: number;
  totalPassengers: number;
  totalCargo: number;
  routeData: { [key: string]: { passengers: number; cargo: number; revenue: number } };
  vesselReports: any[];
  monthlyData: { [key: string]: { ticketRevenue: number; cargoRevenue: number } };
}

const StatCard = ({ title, value, bgColor = "bg-white", icon }: StatCardProps) => {
  return (
    <div className={`${bgColor} rounded-lg border border-gray-200 p-6 text-center shadow-sm hover:shadow-md transition-shadow`}>
      <div className="flex items-center justify-center mb-3">
        {icon && <div className="mr-2">{icon}</div>}
        <h3 className="text-sm font-medium text-gray-500">{title}</h3>
      </div>
      <div className="text-3xl font-bold text-gray-900">{value}</div>
    </div>
  )
}

const RevenueAnalyticsDashboard = () => {
  const { data: schedules = [], isLoading, isError } = useGetSchedulesQuery({})
  const dashboardRef = useRef<HTMLDivElement>(null)

  const processedData: ProcessedData = useMemo(() => {
    if (!schedules.length) {
      return {
        totalRevenue: 0,
        totalPassengers: 0,
        totalCargo: 0,
        routeData: {},
        vesselReports: [],
        monthlyData: {}
      }
    }

    let totalRevenue = 0
    let totalPassengers = 0
    let totalCargo = 0
    const routeData: { [key: string]: { passengers: number; cargo: number; revenue: number } } = {}
    const monthlyData: { [key: string]: { ticketRevenue: number; cargoRevenue: number } } = {}

    const vesselReports = schedules.map((schedule: any) => {
      const ticketRevenue = schedule.bookedSeatsCount * schedule.seatPrice
      const cargoRevenue = schedule.bookedCargoWeight * schedule.cargoPricePerKg
      const scheduleRevenue = ticketRevenue + cargoRevenue

      totalRevenue += scheduleRevenue
      totalPassengers += schedule.bookedSeatsCount
      totalCargo += schedule.bookedCargoWeight

      // Group by route
      const routeKey = `${schedule.route.departurePort} - ${schedule.route.destinationPort}`
      if (!routeData[routeKey]) {
        routeData[routeKey] = { passengers: 0, cargo: 0, revenue: 0 }
      }
      routeData[routeKey].passengers += schedule.bookedSeatsCount
      routeData[routeKey].cargo += schedule.bookedCargoWeight
      routeData[routeKey].revenue += scheduleRevenue

      // Group by month for trends
      const month = new Date(schedule.departureTime).toLocaleDateString('en-US', { month: 'short' })
      if (!monthlyData[month]) {
        monthlyData[month] = { ticketRevenue: 0, cargoRevenue: 0 }
      }
      monthlyData[month].ticketRevenue += ticketRevenue
      monthlyData[month].cargoRevenue += cargoRevenue

      return {
        id: schedule.id,
        vessel: schedule.vessel.name,
        route: routeKey,
        revenue: scheduleRevenue,
        passengers: schedule.bookedSeatsCount,
        cargo: schedule.bookedCargoWeight,
        fuel: schedule.vessel.fuelLevel,
        departureTime: schedule.departureTime,
        status: schedule.vessel.status,
        availableSeats: schedule.availableSeatsCount,
        totalSeats: schedule.totalSeats
      }
    })

    return {
      totalRevenue,
      totalPassengers,
      totalCargo,
      routeData,
      vesselReports,
      monthlyData
    }
  }, [schedules])

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

  const exportToPDF = async () => {
    try {
      // Import jsPDF dynamically to avoid SSR issues
      const jsPDF = (await import('jspdf')).default
      const html2canvas = (await import('html2canvas')).default

      if (!dashboardRef.current) return

      // Create PDF
      const pdf = new jsPDF('p', 'mm', 'a4')
      const pdfWidth = pdf.internal.pageSize.getWidth()
      const pdfHeight = pdf.internal.pageSize.getHeight()

      // Add header
      pdf.setFontSize(20)
      pdf.setTextColor(31, 41, 55) // gray-800
      pdf.text('Revenue Analytics Report', 20, 20)

      pdf.setFontSize(12)
      pdf.setTextColor(107, 114, 128) // gray-500
      pdf.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, 30)

      // Add summary statistics
      let yPosition = 50
      pdf.setFontSize(16)
      pdf.setTextColor(31, 41, 55)
      pdf.text('Summary Statistics', 20, yPosition)

      yPosition += 15
      pdf.setFontSize(12)
      pdf.text(`Total Revenue: ${formatCurrency(processedData.totalRevenue)}`, 20, yPosition)
      yPosition += 8
      pdf.text(`Total Passengers: ${formatNumber(processedData.totalPassengers)}`, 20, yPosition)
      yPosition += 8
      pdf.text(`Total Cargo: ${formatNumber(processedData.totalCargo)} kg`, 20, yPosition)

      // Add vessel reports table
      yPosition += 20
      pdf.setFontSize(16)
      pdf.text('Detailed Reports', 20, yPosition)
      yPosition += 15

      // Table headers
      pdf.setFontSize(10)
      pdf.setTextColor(75, 85, 99) // gray-600
      pdf.text('Vessel', 20, yPosition)
      pdf.text('Route', 60, yPosition)
      pdf.text('Revenue', 120, yPosition)
      pdf.text('Passengers', 150, yPosition)
      pdf.text('Cargo (kg)', 180, yPosition)

      yPosition += 8

      // Table data
      processedData.vesselReports.slice(0, 15).forEach((report) => {
        if (yPosition > 250) {
          pdf.addPage()
          yPosition = 20
        }

        pdf.setTextColor(31, 41, 55)
        pdf.text(report.vessel.substring(0, 15), 20, yPosition)
        pdf.text(report.route.substring(0, 20), 60, yPosition)
        pdf.text(formatCurrency(report.revenue), 120, yPosition)
        pdf.text(formatNumber(report.passengers), 150, yPosition)
        pdf.text(formatNumber(report.cargo), 180, yPosition)
        yPosition += 8
      })

      // Save PDF
      pdf.save('revenue-analytics-report.pdf')
    } catch (error) {
      console.error('Error generating PDF:', error)
      alert('Error generating PDF. Please try again.')
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading analytics data...</p>
        </div>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">Error loading analytics data</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  const routeEntries = Object.entries(processedData.routeData).slice(0, 3)
  const monthEntries = Object.entries(processedData.monthlyData).slice(0, 7)

  return (
    <div className="min-h-screen bg-gray-50" ref={dashboardRef}>
      {/* Header with Export Button */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Revenue Analytics Dashboard</h1>
            <p className="text-gray-600">Real-time insights from your shipping operations</p>
          </div>
          <button
            onClick={exportToPDF}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Export PDF
          </button>
        </div>
      </div>

      <div className="px-6 py-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatCard
            title="Total Revenue"
            value={formatCurrency(processedData.totalRevenue)}
            icon={<svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" /></svg>}
          />

          <StatCard
            title="Total Passengers"
            value={formatNumber(processedData.totalPassengers)}
            icon={<svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>}
          />

          <StatCard
            title="Total Cargo Shipped"
            value={`${formatNumber(processedData.totalCargo)} kg`}
            icon={<svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>}
          />
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Revenue Trends */}
          <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Monthly Revenue Trends</h3>
            <div className="relative h-64">
              <div className="w-full h-full flex items-end justify-between px-4">
                <svg className="w-full h-full" viewBox="0 0 400 200">
                  {monthEntries.length > 1 && (
                    <>
                      {/* Ticket revenue line */}
                      <path
                        d={`M ${monthEntries.map((_, i) => `${20 + i * 60} ${180 - (monthEntries[i][1].ticketRevenue / Math.max(...monthEntries.map(m => m[1].ticketRevenue)) * 80)}`).join(' L ')}`}
                        stroke="#8B5CF6"
                        strokeWidth="3"
                        fill="none"
                        strokeLinecap="round"
                      />
                      {/* Cargo revenue line */}
                      <path
                        d={`M ${monthEntries.map((_, i) => `${20 + i * 60} ${180 - (monthEntries[i][1].cargoRevenue / Math.max(...monthEntries.map(m => m[1].cargoRevenue)) * 80)}`).join(' L ')}`}
                        stroke="#10B981"
                        strokeWidth="3"
                        fill="none"
                        strokeLinecap="round"
                      />

                      {/* Data points */}
                      {monthEntries.map(([month, data], i) => (
                        <g key={month}>
                          <circle
                            cx={20 + i * 60}
                            cy={180 - (data.ticketRevenue / Math.max(...monthEntries.map(m => m[1].ticketRevenue)) * 80)}
                            r="4"
                            fill="#8B5CF6"
                          />
                          <circle
                            cx={20 + i * 60}
                            cy={180 - (data.cargoRevenue / Math.max(...monthEntries.map(m => m[1].cargoRevenue)) * 80)}
                            r="4"
                            fill="#10B981"
                          />
                        </g>
                      ))}
                    </>
                  )}
                </svg>
              </div>
              <div className="flex justify-between text-xs text-gray-500 mt-4">
                {monthEntries.map(([month]) => (
                  <span key={month}>{month}</span>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-6 mt-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-0.5 bg-purple-500"></div>
                <span className="text-sm text-gray-600">Ticket Revenue</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-0.5 bg-green-500"></div>
                <span className="text-sm text-gray-600">Cargo Revenue</span>
              </div>
            </div>
          </div>

          {/* Route Performance */}
          <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Route Performance</h3>
            <div className="h-64 flex items-end justify-center gap-8">
              {routeEntries.map(([route, data]) => {
                const maxPassengers = Math.max(...routeEntries.map(r => r[1].passengers))
                const maxCargo = Math.max(...routeEntries.map(r => r[1].cargo))
                const passengerHeight = (data.passengers / maxPassengers) * 80 + 20
                const cargoHeight = (data.cargo / maxCargo) * 80 + 20

                return (
                  <div key={route} className="flex flex-col items-center gap-2">
                    <div className="flex flex-col items-center gap-1">
                      <div className="w-12 bg-blue-500 rounded-t" style={{ height: `${passengerHeight}px` }}></div>
                      <div className="w-12 bg-green-500 rounded-b" style={{ height: `${cargoHeight}px` }}></div>
                    </div>
                    <span className="text-xs font-medium text-gray-700 text-center max-w-20 leading-tight">
                      {route.split(' - ').map(port => port.split(' ')[0]).join('-')}
                    </span>
                  </div>
                )
              })}
            </div>
            <div className="flex items-center gap-6 mt-6 justify-center">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-500 rounded"></div>
                <span className="text-sm text-gray-600">Passengers</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded"></div>
                <span className="text-sm text-gray-600">Cargo</span>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Reports Table */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Detailed Schedule Reports</h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="text-left py-4 px-6 text-sm font-medium text-gray-700">Vessel</th>
                  <th className="text-left py-4 px-6 text-sm font-medium text-gray-700">Route</th>
                  <th className="text-left py-4 px-6 text-sm font-medium text-gray-700">Departure</th>
                  <th className="text-left py-4 px-6 text-sm font-medium text-gray-700">Revenue</th>
                  <th className="text-left py-4 px-6 text-sm font-medium text-gray-700">Passengers</th>
                  <th className="text-left py-4 px-6 text-sm font-medium text-gray-700">Cargo (kg)</th>
                  <th className="text-left py-4 px-6 text-sm font-medium text-gray-700">Status</th>
                </tr>
              </thead>
              <tbody>
                {processedData.vesselReports.map((report) => (
                  <tr key={report.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="py-4 px-6 text-sm text-gray-900 font-medium">{report.vessel}</td>
                    <td className="py-4 px-6 text-sm text-gray-900">{report.route}</td>
                    <td className="py-4 px-6 text-sm text-gray-900">
                      {new Date(report.departureTime).toLocaleDateString()}
                    </td>
                    <td className="py-4 px-6 text-sm text-gray-900 font-semibold text-green-600">
                      {formatCurrency(report.revenue)}
                    </td>
                    <td className="py-4 px-6 text-sm text-gray-900">
                      {report.passengers}/{report.totalSeats}
                    </td>
                    <td className="py-4 px-6 text-sm text-gray-900">{formatNumber(report.cargo)}</td>
                    <td className="py-4 px-6">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${report.status === 'ACTIVE'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                        }`}>
                        {report.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>Generated on {new Date().toLocaleDateString()} • Total Schedules: {schedules.length}</p>
        </div>
      </div>
    </div>
  )
}

export default RevenueAnalyticsDashboard;