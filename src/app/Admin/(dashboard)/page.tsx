"use client"
import React, { useState } from 'react'
import { useCreateVesselMutation, useGetVesselsQuery } from '@/lib/redux/slices/VesselSlice'
import { useCreateScheduleMutation, useGetSchedulesQuery } from '@/lib/redux/slices/ScheduleSlice'
import { useGetRoutesQuery } from '@/lib/redux/slices/RouteSlice'

// Type definitions
interface Vessel {
  id: string;
  name: string;
  type: string;
  capacity: number;
  fuelLevel: number;
  status: 'ACTIVE' | 'MAINTENANCE' | 'STANDBY';
}

interface Route {
  id: string;
  departurePort: string;
  destinationPort: string;
}

interface Schedule {
  id: string;
  vesselId: string;
  routeId: string;
  departureTime: string;
  arrivalTime: string;
  totalSeats: number;
  totalCargoCapacity: number;
  seatPrice: number;
  cargoPricePerKg: number;
  bookedSeatsCount: number;
  availableSeatsCount: number;
  bookedCargoWeight: number;
  vessel?: Vessel;
  route?: Route;
}

interface RouteStats {
  routeName: string;
  passengers: number;
  cargo: number;
}

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  iconBg: string;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
}

interface VesselFormData {
  name: string;
  type: string;
  capacity: number;
  fuelLevel: number;
  status: 'ACTIVE' | 'MAINTENANCE' | 'STANDBY';
}

interface ScheduleFormData {
  vesselName: string;
  routeName: string;
  departureTime: string;
  arrivalTime: string;
  totalSeats: number;
  totalCargoCapacity: number;
  seatPrice: number;
  cargoPricePerKg: number;
}

const StatCard = ({ title, value, icon, iconBg, trend, trendValue }: StatCardProps) => {
  const trendColor = trend === 'up' ? 'text-green-500' : trend === 'down' ? 'text-red-500' : 'text-gray-500'
  const trendIcon = trend === 'up' ? '↑' : trend === 'down' ? '↓' : '→'

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center gap-3 mb-4">
        <div className={`p-2 rounded-lg ${iconBg}`}>
          {icon}
        </div>
        <span className="text-sm text-gray-600">{title}</span>
      </div>
      <div className="flex items-end justify-between">
        <div className="text-2xl font-bold text-gray-900">{value}</div>
        {trend && (
          <div className={`text-sm ${trendColor} flex items-center gap-1`}>
            <span>{trendIcon}</span>
            <span>{trendValue}</span>
          </div>
        )}
      </div>
    </div>
  )
}

const AddVesselModal = ({ isOpen, onClose, onSubmit }: {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: VesselFormData) => void;
}) => {
  const [formData, setFormData] = useState<VesselFormData>({
    name: '',
    type: 'Cargo Ship',
    capacity: 5000,
    fuelLevel: 100,
    status: 'ACTIVE'
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
    onClose()
    setFormData({
      name: '',
      type: 'Cargo Ship',
      capacity: 5000,
      fuelLevel: 100,
      status: 'ACTIVE'
    })
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Add New Vessel</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Vessel Name
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter vessel name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Vessel Type
            </label>
            <select
              value={formData.type}
              onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="Cargo Ship">Cargo Ship</option>
              <option value="Passenger Ferry">Passenger Ferry</option>
              <option value="Container Ship">Container Ship</option>
              <option value="Tanker">Tanker</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Capacity
            </label>
            <input
              type="number"
              required
              min="1"
              value={formData.capacity}
              onChange={(e) => setFormData(prev => ({ ...prev, capacity: parseInt(e.target.value) || 0 }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Fuel Level (%)
            </label>
            <input
              type="number"
              required
              min="0"
              max="100"
              step="0.1"
              value={formData.fuelLevel}
              onChange={(e) => setFormData(prev => ({ ...prev, fuelLevel: parseFloat(e.target.value) || 0 }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              value={formData.status}
              onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as 'ACTIVE' | 'MAINTENANCE' | 'STANDBY' }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="ACTIVE">Active</option>
              <option value="MAINTENANCE">Maintenance</option>
              <option value="STANDBY">Standby</option>
            </select>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Add Vessel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

const ScheduleRouteModal = ({
  isOpen,
  onClose,
  onSubmit,
  vessels,
  routes
}: {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ScheduleFormData) => void;
  vessels: Vessel[];
  routes: Route[];
}) => {
  const [formData, setFormData] = useState<ScheduleFormData>({
    vesselName: '',
    routeName: '',
    departureTime: '',
    arrivalTime: '',
    totalSeats: 100,
    totalCargoCapacity: 5000,
    seatPrice: 50,
    cargoPricePerKg: 2.5
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
    onClose()
    setFormData({
      vesselName: '',
      routeName: '',
      departureTime: '',
      arrivalTime: '',
      totalSeats: 100,
      totalCargoCapacity: 5000,
      seatPrice: 50,
      cargoPricePerKg: 2.5
    })
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Schedule Route</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Select Vessel
            </label>
            <select
              required
              value={formData.vesselName}
              onChange={(e) => setFormData(prev => ({ ...prev, vesselName: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Choose a vessel</option>
              {vessels.filter(vessel => vessel.status === 'ACTIVE').map((vessel) => (
                <option key={vessel.id} value={vessel.name}>
                  {vessel.name} ({vessel.type})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Select Route
            </label>
            <select
              required
              value={formData.routeName}
              onChange={(e) => setFormData(prev => ({ ...prev, routeName: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Choose a route</option>
              {routes.map((route) => (
                <option key={route.id} value={`${route.departurePort} - ${route.destinationPort}`}>
                  {route.departurePort} → {route.destinationPort}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Departure Time
            </label>
            <input
              type="datetime-local"
              required
              value={formData.departureTime}
              onChange={(e) => setFormData(prev => ({ ...prev, departureTime: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Arrival Time
            </label>
            <input
              type="datetime-local"
              required
              value={formData.arrivalTime}
              onChange={(e) => setFormData(prev => ({ ...prev, arrivalTime: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Total Seats
            </label>
            <input
              type="number"
              required
              min="1"
              value={formData.totalSeats}
              onChange={(e) => setFormData(prev => ({ ...prev, totalSeats: parseInt(e.target.value) || 0 }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Total Cargo Capacity (kg)
            </label>
            <input
              type="number"
              required
              min="0"
              step="0.01"
              value={formData.totalCargoCapacity}
              onChange={(e) => setFormData(prev => ({ ...prev, totalCargoCapacity: parseFloat(e.target.value) || 0 }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Seat Price ($)
            </label>
            <input
              type="number"
              required
              min="0"
              step="0.01"
              value={formData.seatPrice}
              onChange={(e) => setFormData(prev => ({ ...prev, seatPrice: parseFloat(e.target.value) || 0 }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Cargo Price per Kg ($)
            </label>
            <input
              type="number"
              required
              min="0"
              step="0.01"
              value={formData.cargoPricePerKg}
              onChange={(e) => setFormData(prev => ({ ...prev, cargoPricePerKg: parseFloat(e.target.value) || 0 }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Schedule Route
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

const Dashboard = () => {
  const [showVesselModal, setShowVesselModal] = useState(false)
  const [showScheduleModal, setShowScheduleModal] = useState(false)

  // Fetch data from API
  const { data: vessels = [], isLoading: vesselsLoading } = useGetVesselsQuery({})
  const { data: schedules = [], isLoading: schedulesLoading } = useGetSchedulesQuery({})
  const { data: routes = [], isLoading: routesLoading } = useGetRoutesQuery({})
  const [createVessel] = useCreateVesselMutation()
  const [createSchedule] = useCreateScheduleMutation()

  // Type the fetched data
  const typedVessels = vessels as Vessel[]
  const typedSchedules = schedules as Schedule[]
  const typedRoutes = routes as Route[]

  // Calculate statistics
  const activeVessels = typedVessels.filter((v: Vessel) => v.status === 'ACTIVE').length
  const maintenanceVessels = typedVessels.filter((v: Vessel) => v.status === 'MAINTENANCE').length
  const standbyVessels = typedVessels.filter((v: Vessel) => v.status === 'STANDBY').length

  const totalPassengers = typedSchedules.reduce((sum: number, s: Schedule) => sum + (s.bookedSeatsCount || 0), 0)
  const totalCargo = typedSchedules.reduce((sum: number, s: Schedule) => sum + (s.bookedCargoWeight || 0), 0)

  const efficiencyPercentage = typedVessels.length > 0
    ? Math.round((activeVessels / typedVessels.length) * 100)
    : 0

  // Group schedules by route for the chart
  const routeStats: RouteStats[] = typedRoutes.map((route: Route) => {
    const routeSchedules = typedSchedules.filter((s: Schedule) => s.route?.id === route.id)
    return {
      routeName: `${route.departurePort} - ${route.destinationPort}`,
      passengers: routeSchedules.reduce((sum: number, s: Schedule) => sum + (s.bookedSeatsCount || 0), 0),
      cargo: routeSchedules.reduce((sum: number, s: Schedule) => sum + (s.bookedCargoWeight || 0), 0),
    }
  })

  // Get recent schedules (next 7 days)
  const now = new Date()
  const sevenDaysFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)
  const upcomingSchedules = typedSchedules
    .filter((s: Schedule) => new Date(s.departureTime) > now && new Date(s.departureTime) <= sevenDaysFromNow)
    .sort((a: Schedule, b: Schedule) => new Date(a.departureTime).getTime() - new Date(b.departureTime).getTime())
    .slice(0, 3)

  // Handle adding new vessel
  const handleAddVessel = async (vesselData: VesselFormData) => {
    try {
      await createVessel(vesselData).unwrap()
    } catch (err) {
      console.error('Failed to add vessel:', err)
    }
  }

  // Handle scheduling a route
  const handleScheduleRoute = async (scheduleData: ScheduleFormData) => {
    try {
      // Find vessel by name
      const vessel = typedVessels.find(v => v.name === scheduleData.vesselName)
      if (!vessel) {
        console.error('Vessel not found')
        return
      }

      // Find route by name
      const route = typedRoutes.find(r =>
        `${r.departurePort} - ${r.destinationPort}` === scheduleData.routeName
      )
      if (!route) {
        console.error('Route not found')
        return
      }

      const newSchedule = {
        vesselId: vessel.id,
        routeId: route.id,
        departureTime: new Date(scheduleData.departureTime).toISOString(),
        arrivalTime: new Date(scheduleData.arrivalTime).toISOString(),
        totalSeats: scheduleData.totalSeats,
        totalCargoCapacity: scheduleData.totalCargoCapacity,
        seatPrice: scheduleData.seatPrice,
        cargoPricePerKg: scheduleData.cargoPricePerKg
      }

      await createSchedule(newSchedule).unwrap()
    } catch (err) {
      console.error('Failed to schedule route:', err)
    }
  }

  if (vesselsLoading || schedulesLoading || routesLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main Content */}
      <div className="px-6 py-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Active Vessels"
            value={`${activeVessels}/${typedVessels.length}`}
            icon={
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3 18H21L19 12H17L15 8H9L7 12H5L3 18Z" stroke="#60A5FA" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M21 18V20C21 20.5523 20.5523 21 20 21H4C3.44772 21 3 20.5523 3 20V18" stroke="#60A5FA" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            }
            iconBg="bg-blue-100"
            trend={activeVessels > typedVessels.length / 2 ? 'up' : 'down'}
            trendValue={`${Math.round((activeVessels / typedVessels.length) * 100)}%`}
          />

          <StatCard
            title="Cargo in Transit"
            value={`${totalCargo.toFixed(1)} kg`}
            icon={
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M21 16V8C21 6.89543 20.1046 6 19 6H5C3.89543 6 3 6.89543 3 8V16C3 17.1046 3.89543 18 5 18H19C20.1046 18 21 17.1046 21 16Z" stroke="#F59E0B" strokeWidth="2" />
                <path d="M7 10H17M7 14H13" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" />
              </svg>
            }
            iconBg="bg-amber-100"
            trend="up"
            trendValue="+12%"
          />

          <StatCard
            title="Total Passengers"
            value={totalPassengers}
            icon={
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M17 21V19C17 16.7909 15.2091 15 13 15H5C2.79086 15 1 16.7909 1 19V21" stroke="#8B5CF6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <circle cx="9" cy="7" r="4" stroke="#8B5CF6" strokeWidth="2" />
                <path d="M23 21V19C23 17.1362 21.7252 15.5701 20 15.126" stroke="#8B5CF6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M16 3.12598C17.7252 3.56992 19 5.13616 19 7C19 8.86384 17.7252 10.4301 16 10.874" stroke="#8B5CF6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            }
            iconBg="bg-purple-100"
            trend="up"
            trendValue="+8%"
          />

          <StatCard
            title="Fleet Efficiency"
            value={`${efficiencyPercentage}%`}
            icon={
              <div className="w-5 h-5 rounded-full border-2 border-green-500 flex items-center justify-center">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              </div>
            }
            iconBg="bg-green-100"
            trend={efficiencyPercentage > 80 ? 'up' : 'down'}
          />
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Cargo Shipment Trends */}
          <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Cargo Shipment Trends</h3>
            <div className="relative h-64">
              {/* Chart Area */}
              <div className="w-full h-full flex items-end justify-between px-4">
                {/* Simulated chart with SVG curve */}
                <svg className="w-full h-full" viewBox="0 0 400 200">
                  <path
                    d="M 20 150 Q 80 120 120 140 T 200 100 T 280 120 T 380 140"
                    stroke="#60A5FA"
                    strokeWidth="3"
                    fill="none"
                    strokeLinecap="round"
                  />
                  {/* Data points */}
                  <circle cx="20" cy="150" r="4" fill="#60A5FA" />
                  <circle cx="120" cy="140" r="4" fill="#60A5FA" />
                  <circle cx="200" cy="100" r="4" fill="#60A5FA" />
                  <circle cx="280" cy="120" r="4" fill="#60A5FA" />
                  <circle cx="380" cy="140" r="4" fill="#60A5FA" />
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
            <div className="flex items-center gap-2 mt-4">
              <div className="w-3 h-0.5 bg-blue-400"></div>
              <span className="text-sm text-gray-600">Total cargo (kg)</span>
            </div>
          </div>

          {/* Ticket Sales by Route */}
          <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Ticket Sales by Route</h3>
            <div className="h-64 flex items-end justify-center gap-8">
              {routeStats.map((route: RouteStats, index: number) => {
                const maxHeight = Math.max(...routeStats.map(r => r.passengers), 100)
                const height = (route.passengers / maxHeight) * 180
                const colors = ['bg-purple-200', 'bg-sky-400', 'bg-amber-400']

                return (
                  <div key={index} className="flex flex-col items-center gap-2">
                    <div className="flex flex-col items-center gap-1">
                      <div
                        className={`w-8 ${colors[index % colors.length]} rounded-t`}
                        style={{ height: `${height}px` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium text-gray-700 text-center">
                      {route.routeName.split(' - ')[0]}<br />
                      to<br />
                      {route.routeName.split(' - ')[1]}
                    </span>
                    <span className="text-xs text-gray-500">{route.passengers} passengers</span>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Fleet Availability */}
          <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Fleet Status</h3>
            <div className="flex items-center justify-center h-48">
              {/* Donut Chart */}
              <div className="relative w-40 h-40">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  {/* Background circle */}
                  <circle
                    cx="50"
                    cy="50"
                    r="35"
                    fill="none"
                    stroke="#F3F4F6"
                    strokeWidth="10"
                  />
                  {/* Active (blue) */}
                  <circle
                    cx="50"
                    cy="50"
                    r="35"
                    fill="none"
                    stroke="#60A5FA"
                    strokeWidth="10"
                    strokeDasharray={`${(activeVessels / typedVessels.length) * 100} ${100 - (activeVessels / typedVessels.length) * 100}`}
                    strokeDashoffset="0"
                  />
                  {/* Maintenance (yellow) */}
                  <circle
                    cx="50"
                    cy="50"
                    r="35"
                    fill="none"
                    stroke="#F59E0B"
                    strokeWidth="10"
                    strokeDasharray={`${(maintenanceVessels / typedVessels.length) * 100} ${100 - (maintenanceVessels / typedVessels.length) * 100}`}
                    strokeDashoffset={`-${(activeVessels / typedVessels.length) * 100}`}
                  />
                  {/* Standby (green) */}
                  <circle
                    cx="50"
                    cy="50"
                    r="35"
                    fill="none"
                    stroke="#10B981"
                    strokeWidth="10"
                    strokeDasharray={`${(standbyVessels / typedVessels.length) * 100} ${100 - (standbyVessels / typedVessels.length) * 100}`}
                    strokeDashoffset={`-${((activeVessels + maintenanceVessels) / typedVessels.length) * 100}`}
                  />
                </svg>
                {/* Center content */}
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-2xl font-bold text-gray-900">{typedVessels.length}</span>
                  <span className="text-xs text-gray-500">vessels</span>
                </div>
              </div>
            </div>
            {/* Legend */}
            <div className="flex justify-center gap-6 mt-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-blue-400"></div>
                <span className="text-sm text-gray-600">Active ({activeVessels})</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-amber-400"></div>
                <span className="text-sm text-gray-600">Maintenance ({maintenanceVessels})</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-green-400"></div>
                <span className="text-sm text-gray-600">Standby ({standbyVessels})</span>
              </div>
            </div>
          </div>

          {/* Upcoming Schedules */}
          <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Upcoming Schedules</h3>
            {upcomingSchedules.length > 0 ? (
              <div className="space-y-4">
                {upcomingSchedules.map((schedule: Schedule) => (
                  <div key={schedule.id} className="border-b border-gray-100 pb-4 last:border-0 last:pb-0">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium text-gray-900">
                          {schedule.vessel?.name} - {schedule.route?.departurePort} to {schedule.route?.destinationPort}
                        </h4>
                        <p className="text-sm text-gray-500">
                          {new Date(schedule.departureTime).toLocaleString()} - {new Date(schedule.arrivalTime).toLocaleString()}
                        </p>
                      </div>
                      <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                        {schedule.availableSeatsCount} seats available
                      </span>
                    </div>
                    <div className="mt-2 flex justify-between text-sm">
                      <span className="text-gray-600">
                        Passengers: {schedule.bookedSeatsCount}/{schedule.totalSeats}
                      </span>
                      <span className="text-gray-600">
                        Cargo: {schedule.bookedCargoWeight.toFixed(1)}/{schedule.totalCargoCapacity.toFixed(1)} kg
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="h-48 flex items-center justify-center text-gray-500">
                No upcoming schedules in the next 7 days
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-6 bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Quick Actions</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              onClick={() => setShowVesselModal(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg p-4 flex items-center justify-center gap-3 transition-colors"
            >
              <div className="w-6 h-6 rounded-full border-2 border-white flex items-center justify-center">
                <span className="text-white text-lg font-bold">+</span>
              </div>
              <span className="font-medium">Add New Vessel</span>
            </button>

            <button
              onClick={() => setShowScheduleModal(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg p-4 flex items-center justify-center gap-3 transition-colors"
            >
              <div className="w-6 h-6 flex items-center justify-center">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <span className="font-medium">Schedule Route</span>
            </button>
          </div>
        </div>
      </div>

      {/* Modals */}
      <AddVesselModal
        isOpen={showVesselModal}
        onClose={() => setShowVesselModal(false)}
        onSubmit={handleAddVessel}
      />

      <ScheduleRouteModal
        isOpen={showScheduleModal}
        onClose={() => setShowScheduleModal(false)}
        onSubmit={handleScheduleRoute}
        vessels={typedVessels}
        routes={typedRoutes}
      />
    </div>
  )
}

export default Dashboard