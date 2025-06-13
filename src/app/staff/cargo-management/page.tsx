'use client';
import React, { useState } from 'react';
import { Share, Download } from 'lucide-react';

interface Shipment {
  id: string;
  origin: string;
  destination: string;
  container: string;
  estimatedArrival: string;
  status: 'In Transit' | 'Pending' | 'Delivered' | 'Delayed';
}

interface ShipmentDetails {
  id: string;
  origin: string;
  vessel: string;
  weight: string;
  destination: string;
  departureDate: string;
  estimatedArrival: string;
}

const ShipmentDashboard = () => {
  const [selectedShipment, setSelectedShipment] = useState<string>('NGV-CRG-001');
  
  const shipments: Shipment[] = [
    {
      id: 'NGV-CRG-001',
      origin: 'Victoria Port',
      destination: 'Algiers Hub',
      container: 'Refrigerated',
      estimatedArrival: '2024-02-15 14:30',
      status: 'In Transit'
    },
    {
      id: 'NGV-CRG-001',
      origin: 'Victoria Port', 
      destination: 'Algiers Hub',
      container: 'Refrigerated',
      estimatedArrival: '2024-02-15 14:30',
      status: 'Pending'
    },
    {
      id: 'NGV-CRG-001',
      origin: 'Victoria Port',
      destination: 'Algiers Hub', 
      container: 'Refrigerated',
      estimatedArrival: '2024-02-15 14:30',
      status: 'In Transit'
    },
    {
      id: 'NGV-CRG-001',
      origin: 'Victoria Port',
      destination: 'Algiers Hub',
      container: 'Refrigerated', 
      estimatedArrival: '2024-02-15 14:30',
      status: 'In Transit'
    },
    {
      id: 'NGV-CRG-001',
      origin: 'Victoria Port',
      destination: 'Algiers Hub',
      container: 'Refrigerated',
      estimatedArrival: '2024-02-15 14:30', 
      status: 'In Transit'
    }
  ];

  const shipmentDetails: ShipmentDetails = {
    id: 'NGV-CRG-001',
    origin: 'Victoria',
    vessel: 'Ocean Explorer',
    weight: '2500 kg',
    destination: 'Kigali belt',
    departureDate: '2024-02-15',
    estimatedArrival: '2024-02-16'
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'In Transit':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'Pending':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'Delivered':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'Delayed':
        return 'bg-red-100 text-red-700 border-red-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getProgressColor = (status: string) => {
    switch (status) {
      case 'In Transit':
        return 'bg-green-500';
      case 'Pending':
        return 'bg-yellow-500';
      case 'Delivered':
        return 'bg-blue-500';
      case 'Delayed':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main Content - matches navbar spacing */}
      <div className="px-6 py-6">
        <div className="flex flex-col lg:flex-row gap-6 max-w-7xl mx-auto">
          
          {/* Left Panel - Shipment List */}
          <div className="flex-1 lg:max-w-md">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-4 border-b border-gray-100">
                <h2 className="text-lg font-semibold text-gray-900">Shipments</h2>
              </div>
              
              <div className="divide-y divide-gray-100">
                {shipments.map((shipment, index) => (
                  <div
                    key={`${shipment.id}-${index}`}
                    className={`p-4 cursor-pointer transition-colors hover:bg-gray-50 ${
                      selectedShipment === shipment.id ? 'bg-blue-50 border-r-2 border-blue-500' : ''
                    }`}
                    onClick={() => setSelectedShipment(shipment.id)}
                  >
                    {/* Progress Indicator */}
                    <div className="flex items-start gap-3 mb-3">
                      <div className="flex flex-col items-center">
                        <div className={`w-3 h-3 rounded-full ${getProgressColor(shipment.status)}`}></div>
                        {index < shipments.length - 1 && (
                          <div className="w-0.5 h-12 bg-gray-200 mt-2"></div>
                        )}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-semibold text-gray-900 text-sm">
                            Shipment: {shipment.id}
                          </h3>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(shipment.status)}`}>
                            {shipment.status}
                          </span>
                        </div>
                        
                        <div className="space-y-1 text-xs text-gray-600">
                          <p><span className="font-medium">Origin:</span> {shipment.origin}</p>
                          <p><span className="font-medium">Destination:</span> {shipment.destination}</p>
                          <p><span className="font-medium">Container:</span> {shipment.container}</p>
                          <p><span className="font-medium">Est. Arrival:</span> {shipment.estimatedArrival}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Panel - Shipment Details */}
          <div className="flex-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-100">
                <h2 className="text-xl font-semibold text-gray-900">
                  Shipment: {shipmentDetails.id}
                </h2>
              </div>
              
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-500 mb-1">Origin</label>
                      <p className="text-lg text-gray-900">{shipmentDetails.origin}</p>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-500 mb-1">Vessel</label>
                      <p className="text-lg text-gray-900">{shipmentDetails.vessel}</p>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-500 mb-1">Weight</label>
                      <p className="text-lg text-gray-900">{shipmentDetails.weight}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-500 mb-1">Destination</label>
                      <p className="text-lg text-gray-900">{shipmentDetails.destination}</p>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-500 mb-1">Departure Date</label>
                      <p className="text-lg text-gray-900">{shipmentDetails.departureDate}</p>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-500 mb-1">Estimated Arrival</label>
                      <p className="text-lg text-gray-900">{shipmentDetails.estimatedArrival}</p>
                    </div>
                  </div>
                </div>
                
                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <button className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium">
                    <Download size={18} />
                    Export
                  </button>
                  
                  <button className="flex items-center justify-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium">
                    <Share size={18} />
                    Share
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShipmentDashboard;