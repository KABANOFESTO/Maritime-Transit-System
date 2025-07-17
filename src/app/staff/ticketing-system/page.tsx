'use client';
import React, { useState, useEffect } from 'react';
import { Printer, Download, Loader2, AlertCircle, Check, X, Clock } from 'lucide-react';
import { useGetTicketsQuery, useGetTicketByIdQuery } from '@/lib/redux/slices/TicketSlice';
import { format } from 'date-fns';

interface Ticket {
  id: number;
  seatNumber: string;
  paid: boolean;
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
    seatPrice: number;
  };
}

const TicketDashboard = () => {
  // Fetch all tickets
  const { data: tickets, isLoading, isError, error } = useGetTicketsQuery({});
  const [selectedTicketId, setSelectedTicketId] = useState<number | null>(null);


  const { data: selectedTicket } = useGetTicketByIdQuery(selectedTicketId as number, {
    skip: !selectedTicketId,
  });


  useEffect(() => {
    if (tickets && tickets.length > 0 && !selectedTicketId) {
      setSelectedTicketId(tickets[0].id);
    }
  }, [tickets, selectedTicketId]);

  const getStatusColor = (paid: boolean) => {
    return paid
      ? 'bg-green-100 text-green-700 border-green-200'
      : 'bg-yellow-100 text-yellow-700 border-yellow-200';
  };

  const getStatusIcon = (paid: boolean) => {
    return paid
      ? <Check className="w-4 h-4 text-green-500" />
      : <Clock className="w-4 h-4 text-yellow-500" />;
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'PPPpp');
    } catch {
      return dateString;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleExport = () => {
    console.log('Exporting ticket details...');
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
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Tickets</h2>
          <p className="text-gray-600 mb-4">
            {error?.toString() || 'Failed to load ticket data. Please try again later.'}
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
                <h2 className="text-lg font-semibold text-gray-900">My Tickets</h2>
                <span className="text-sm text-gray-500">
                  {tickets?.length || 0} tickets
                </span>
              </div>

              <div className="divide-y divide-gray-100 max-h-[calc(100vh-180px)] overflow-y-auto">
                {tickets?.map((ticket: Ticket, index: number) => (
                  <div
                    key={ticket.id}
                    className={`p-4 cursor-pointer transition-colors hover:bg-gray-50 ${selectedTicketId === ticket.id
                        ? 'bg-blue-50 border-r-2 border-blue-500'
                        : ''
                      }`}
                    onClick={() => setSelectedTicketId(ticket.id)}
                  >
                    <div className="flex items-start gap-3 mb-3">
                      <div className="flex flex-col items-center">
                        <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                        {index < (tickets?.length || 0) - 1 && (
                          <div className="w-0.5 h-12 bg-gray-200 mt-2"></div>
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-semibold text-gray-900 text-sm">
                            {ticket.schedule.vessel.name}
                          </h3>
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(ticket.paid)
                              }`}
                          >
                            {ticket.paid ? 'Paid' : 'Pending'}
                          </span>
                        </div>

                        <div className="space-y-1 text-xs text-gray-600">
                          <p>
                            <span className="font-medium">From:</span> {ticket.schedule.route.departurePort}
                          </p>
                          <p>
                            <span className="font-medium">To:</span> {ticket.schedule.route.destinationPort}
                          </p>
                          <p>
                            <span className="font-medium">Seat:</span> {ticket.seatNumber}
                          </p>
                          <p>
                            <span className="font-medium">Departure:</span> {formatDate(ticket.schedule.departureTime)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Panel - Ticket Details */}
          <div className="flex-1">
            {selectedTicket ? (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">
                      Ticket: #{selectedTicket.id}
                    </h2>
                    <p className="text-sm text-gray-500 mt-1">
                      Booked on {formatDate(selectedTicket.schedule.departureTime)}
                    </p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(selectedTicket.paid)
                      }`}
                  >
                    {selectedTicket.paid ? 'Paid' : 'Pending Payment'}
                  </span>
                </div>

                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-500 mb-1">
                          Departure Port
                        </label>
                        <p className="text-lg text-gray-900">
                          {selectedTicket.schedule.route.departurePort}
                        </p>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-500 mb-1">
                          Vessel
                        </label>
                        <p className="text-lg text-gray-900">
                          {selectedTicket.schedule.vessel.name} ({selectedTicket.schedule.vessel.type})
                        </p>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-500 mb-1">
                          Seat Number
                        </label>
                        <p className="text-lg text-gray-900 font-mono">
                          {selectedTicket.seatNumber}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-500 mb-1">
                          Destination Port
                        </label>
                        <p className="text-lg text-gray-900">
                          {selectedTicket.schedule.route.destinationPort}
                        </p>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-500 mb-1">
                          Departure Time
                        </label>
                        <p className="text-lg text-gray-900">
                          {formatDate(selectedTicket.schedule.departureTime)}
                        </p>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-500 mb-1">
                          Estimated Arrival
                        </label>
                        <p className="text-lg text-gray-900">
                          {formatDate(selectedTicket.schedule.arrivalTime)}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Additional Details */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <label className="block text-sm font-medium text-gray-500 mb-1">
                        Ticket Price
                      </label>
                      <p className="text-xl font-semibold text-gray-900">
                        {formatCurrency(selectedTicket.schedule.seatPrice)}
                      </p>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg">
                      <label className="block text-sm font-medium text-gray-500 mb-1">
                        Payment Status
                      </label>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(selectedTicket.paid)}
                        <span className="text-xl font-semibold text-gray-900">
                          {selectedTicket.paid ? 'Paid' : 'Pending'}
                        </span>
                      </div>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg">
                      <label className="block text-sm font-medium text-gray-500 mb-1">
                        Ticket ID
                      </label>
                      <p className="text-xl font-semibold text-gray-900">
                        #{selectedTicket.id}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3">
                    <button
                      className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium"
                      onClick={handlePrint}
                    >
                      <Printer size={18} />
                      Print Ticket
                    </button>

                    <button
                      className="flex items-center justify-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                      onClick={handleExport}
                    >
                      <Download size={18} />
                      Export
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 flex items-center justify-center h-full">
                <div className="text-center">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No ticket selected
                  </h3>
                  <p className="text-gray-500">
                    {tickets?.length === 0
                      ? 'You have no tickets yet.'
                      : 'Select a ticket from the list to view details.'}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="mt-6 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Travel Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="flex items-center text-gray-600">
              <Check className="w-5 h-5 mr-2 text-green-500" />
              Check-in opens 2 hours before departure
            </div>
            <div className="flex items-center text-gray-600">
              <Clock className="w-5 h-5 mr-2 text-blue-500" />
              Boarding starts 30 minutes before departure
            </div>
            <div className="flex items-center text-gray-600">
              <X className="w-5 h-5 mr-2 text-red-500" />
              No refunds for no-shows
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TicketDashboard;