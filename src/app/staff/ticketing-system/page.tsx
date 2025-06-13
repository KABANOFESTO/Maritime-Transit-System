'use client';
import React from 'react';

interface TicketDetailsProps {
  // You can make these props dynamic if needed
  ticketData?: {
    ticketId: string;
    passengerName: string;
    vessel: string;
    departureDate: string;
    ticketPrice: string;
    route: string;
    seatNumber: string;
    departureTime: string;
    paymentStatus: 'Paid' | 'Pending' | 'Failed';
    status: 'Confirmed' | 'Pending' | 'Cancelled';
  };
}

const TicketDetails: React.FC<TicketDetailsProps> = ({ 
  ticketData = {
    ticketId: 'TKT001',
    passengerName: 'Ghislaine Biyo',
    vessel: 'Ocean Explorer',
    departureDate: '2024-02-15',
    ticketPrice: '$135.50',
    route: 'Victoria-Kivu',
    seatNumber: '12A',
    departureTime: '08:00',
    paymentStatus: 'Paid',
    status: 'Confirmed'
  }
}) => {
  const handlePrint = () => {
    window.print();
  };

  const handleExport = () => {
    // Export functionality - could be PDF, CSV, etc.
    console.log('Exporting ticket details...');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      {/* Main Container with same horizontal padding as navbar */}
      <div className="px-6 max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
            
            {/* Left Side - Ticket Card */}
            <div className="relative p-8 bg-gradient-to-br from-blue-50 to-indigo-50">
              {/* Ticket Stub */}
              <div className="bg-white rounded-lg shadow-md p-6 relative">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 mb-1">
                      {ticketData.passengerName}
                    </h2>
                    <p className="text-gray-600 text-sm">
                      Destination: {ticketData.route.split('-').join(' Port - ')} Berlt
                    </p>
                  </div>
                  <div className="flex items-center">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      ticketData.status === 'Confirmed' 
                        ? 'bg-green-100 text-green-800' 
                        : ticketData.status === 'Pending'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {ticketData.status}
                    </span>
                  </div>
                </div>
                
                {/* Decorative perforated edge */}
                <div className="absolute right-0 top-0 bottom-0 w-6 bg-gray-50 flex flex-col justify-center items-center space-y-2">
                  {[...Array(8)].map((_, i) => (
                    <div key={i} className="w-2 h-2 bg-white rounded-full"></div>
                  ))}
                </div>
              </div>
              
              {/* Decorative elements */}
              <div className="absolute top-4 right-4 opacity-10">
                <svg width="120" height="120" viewBox="0 0 120 120" fill="none">
                  <path d="M60 20L70 50H100L77.5 67.5L87.5 97.5L60 80L32.5 97.5L42.5 67.5L20 50H50L60 20Z" fill="currentColor"/>
                </svg>
              </div>
            </div>

            {/* Right Side - Ticket Details */}
            <div className="p-8">
              <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                  Ticket Details: {ticketData.ticketId}
                </h1>
              </div>

              <div className="space-y-6">
                {/* Passenger Info */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">
                      Passenger Name:
                    </label>
                    <p className="text-gray-900 font-medium">{ticketData.passengerName}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">
                      Vessel:
                    </label>
                    <p className="text-gray-900 font-medium">{ticketData.vessel}</p>
                  </div>
                </div>

                {/* Journey Details */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">
                      Departure Date:
                    </label>
                    <p className="text-gray-900 font-medium">{ticketData.departureDate}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">
                      Ticket Price:
                    </label>
                    <p className="text-gray-900 font-bold text-lg">{ticketData.ticketPrice}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">
                      Route:
                    </label>
                    <p className="text-gray-900 font-medium">{ticketData.route}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">
                      Seat Number:
                    </label>
                    <p className="text-gray-900 font-medium">{ticketData.seatNumber}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">
                      Departure Time:
                    </label>
                    <p className="text-gray-900 font-medium">{ticketData.departureTime}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">
                      Payment Status:
                    </label>
                    <span className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${
                      ticketData.paymentStatus === 'Paid'
                        ? 'bg-green-100 text-green-800'
                        : ticketData.paymentStatus === 'Pending'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {ticketData.paymentStatus}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 mt-8 pt-6 border-t border-gray-200">
                <button
                  onClick={handlePrint}
                  className="flex items-center justify-center px-6 py-3 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors font-medium"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                  </svg>
                  Print
                </button>
                <button
                  onClick={handleExport}
                  className="flex items-center justify-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Export
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Actions or Information */}
        <div className="mt-6 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Travel Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="flex items-center text-gray-600">
              <svg className="w-5 h-5 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Check-in opens 2 hours before departure
            </div>
            <div className="flex items-center text-gray-600">
              <svg className="w-5 h-5 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Boarding pass required at gate
            </div>
            <div className="flex items-center text-gray-600">
              <svg className="w-5 h-5 mr-2 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              Arrive 30 minutes early
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TicketDetails;