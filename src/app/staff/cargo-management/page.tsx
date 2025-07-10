'use client';
import React, { useState, useEffect } from 'react';
import { Share, Download, Loader2, AlertCircle } from 'lucide-react';
import {
  useGetCargoesQuery,
  useGetCargoByIdQuery,
  useDeleteCargoMutation
} from '@/lib/redux/slices/CargoSlice';
import { format } from 'date-fns';

interface Cargo {
  id: number;
  description: string;
  weight: number;
  trackingNumber: string;
  currentStatus: string;
  price: number;
  schedule: {
    id: number;
    vessel: {
      name: string;
      type: string;
    };
    route: {
      departurePort: string;
      destinationPort: string;
    };
    departureTime: string;
    arrivalTime: string;
  };
}

const ShipmentDashboard = () => {

  const { data: cargoes, isLoading, isError, error } = useGetCargoesQuery({});
  const [selectedCargoId, setSelectedCargoId] = useState<number | null>(null);

  const { data: selectedCargo } = useGetCargoByIdQuery(selectedCargoId as number, {
    skip: !selectedCargoId,
  });


  const [deleteCargo] = useDeleteCargoMutation();


  useEffect(() => {
    if (cargoes && cargoes.length > 0 && !selectedCargoId) {
      setSelectedCargoId(cargoes[0].id);
    }
  }, [cargoes, selectedCargoId]);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'in transit':
      case 'shipped':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'pending':
      case 'registered':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'delivered':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'delayed':
      case 'cancelled':
        return 'bg-red-100 text-red-700 border-red-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getProgressColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'in transit':
      case 'shipped':
        return 'bg-green-500';
      case 'pending':
      case 'registered':
        return 'bg-yellow-500';
      case 'delivered':
        return 'bg-blue-500';
      case 'delayed':
      case 'cancelled':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'PPPpp');
    } catch {
      return dateString;
    }
  };

  const handleDeleteCargo = async (id: number) => {
    try {
      await deleteCargo(id).unwrap();
      if (selectedCargoId === id && cargoes) {
        const newSelection = cargoes.find((cargo: Cargo) => cargo.id !== id);
        setSelectedCargoId(newSelection?.id || null);
      }
    } catch (err) {
      console.error('Failed to delete cargo:', err);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="animate-spin h-12 w-12 text-blue-500" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white p-6 rounded-lg shadow-md max-w-md text-center">
          <AlertCircle className="h-10 w-10 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Shipments</h2>
          <p className="text-gray-600 mb-4">
            {error?.toString() || 'Failed to load shipment data. Please try again later.'}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">

      <div className="px-6 py-6">
        <div className="flex flex-col lg:flex-row gap-6 max-w-7xl mx-auto">

          <div className="flex-1 lg:max-w-md">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-4 border-b border-gray-100 flex justify-between items-center">
                <h2 className="text-lg font-semibold text-gray-900">My Shipments</h2>
                <span className="text-sm text-gray-500">
                  {cargoes?.length || 0} shipments
                </span>
              </div>

              <div className="divide-y divide-gray-100 max-h-[calc(100vh-180px)] overflow-y-auto">
                {cargoes?.map((cargo: Cargo, index: number) => (
                  <div
                    key={cargo.id}
                    className={`p-4 cursor-pointer transition-colors hover:bg-gray-50 ${selectedCargoId === cargo.id
                        ? 'bg-blue-50 border-r-2 border-blue-500'
                        : ''
                      }`}
                    onClick={() => setSelectedCargoId(cargo.id)}
                  >

                    <div className="flex items-start gap-3 mb-3">
                      <div className="flex flex-col items-center">
                        <div
                          className={`w-3 h-3 rounded-full ${getProgressColor(cargo.currentStatus)
                            }`}
                        ></div>
                        {index < (cargoes?.length || 0) - 1 && (
                          <div className="w-0.5 h-12 bg-gray-200 mt-2"></div>
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-semibold text-gray-900 text-sm">
                            {cargo.trackingNumber}
                          </h3>
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(cargo.currentStatus)
                              }`}
                          >
                            {cargo.currentStatus}
                          </span>
                        </div>

                        <div className="space-y-1 text-xs text-gray-600">
                          <p>
                            <span className="font-medium">From:</span> {cargo.schedule.route.departurePort}
                          </p>
                          <p>
                            <span className="font-medium">To:</span> {cargo.schedule.route.destinationPort}
                          </p>
                          <p>
                            <span className="font-medium">Weight:</span> {cargo.weight} kg
                          </p>
                          <p>
                            <span className="font-medium">Est. Arrival:</span> {formatDate(cargo.schedule.arrivalTime)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex-1">
            {selectedCargo ? (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">
                      Shipment: {selectedCargo.trackingNumber}
                    </h2>
                    <p className="text-sm text-gray-500 mt-1">
                      Created on {formatDate(selectedCargo.schedule.departureTime)}
                    </p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(selectedCargo.currentStatus)
                      }`}
                  >
                    {selectedCargo.currentStatus}
                  </span>
                </div>

                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-500 mb-1">
                          Origin Port
                        </label>
                        <p className="text-lg text-gray-900">
                          {selectedCargo.schedule.route.departurePort}
                        </p>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-500 mb-1">
                          Vessel
                        </label>
                        <p className="text-lg text-gray-900">
                          {selectedCargo.schedule.vessel.name} ({selectedCargo.schedule.vessel.type})
                        </p>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-500 mb-1">
                          Cargo Description
                        </label>
                        <p className="text-lg text-gray-900">
                          {selectedCargo.description}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-500 mb-1">
                          Destination Port
                        </label>
                        <p className="text-lg text-gray-900">
                          {selectedCargo.schedule.route.destinationPort}
                        </p>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-500 mb-1">
                          Departure Time
                        </label>
                        <p className="text-lg text-gray-900">
                          {formatDate(selectedCargo.schedule.departureTime)}
                        </p>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-500 mb-1">
                          Estimated Arrival
                        </label>
                        <p className="text-lg text-gray-900">
                          {formatDate(selectedCargo.schedule.arrivalTime)}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <label className="block text-sm font-medium text-gray-500 mb-1">
                        Cargo Weight
                      </label>
                      <p className="text-xl font-semibold text-gray-900">
                        {selectedCargo.weight} kg
                      </p>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg">
                      <label className="block text-sm font-medium text-gray-500 mb-1">
                        Shipping Cost
                      </label>
                      <p className="text-xl font-semibold text-gray-900">
                        ${selectedCargo.price.toFixed(2)}
                      </p>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg">
                      <label className="block text-sm font-medium text-gray-500 mb-1">
                        Cargo ID
                      </label>
                      <p className="text-xl font-semibold text-gray-900">
                        {selectedCargo.id}
                      </p>
                    </div>
                  </div>


                  <div className="flex flex-col sm:flex-row gap-3">
                    <button
                      className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium"
                      onClick={() => {

                        console.log('Exporting:', selectedCargo.id);
                      }}
                    >
                      <Download size={18} />
                      Export
                    </button>

                    <button
                      className="flex items-center justify-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                      onClick={() => {

                        console.log('Sharing:', selectedCargo.id);
                      }}
                    >
                      <Share size={18} />
                      Share
                    </button>

                    <button
                      className="flex items-center justify-center gap-2 px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-medium"
                      onClick={() => handleDeleteCargo(selectedCargo.id)}
                    >
                      Delete Shipment
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 flex items-center justify-center h-full">
                <div className="text-center">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No shipment selected
                  </h3>
                  <p className="text-gray-500">
                    {cargoes?.length === 0
                      ? 'You have no shipments yet.'
                      : 'Select a shipment from the list to view details.'}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShipmentDashboard;