import React, { useState, useEffect } from 'react';
import { Search, ChevronDown, AlertCircle, Ticket } from 'lucide-react';

const BookingMonitor = () => {
  const [bookings, setBookings] = useState([]); 
  const [statusFilter, setStatusFilter] = useState('All Status');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost/habesha-backend/get_admin_bookings.php');
        
        if (!response.ok) throw new Error("Server responded with an error");
        
        const data = await response.json();
        setBookings(Array.isArray(data) ? data : []);
        setError(null);
      } catch (error) {
        console.error("Failed to fetch bookings:", error);
        setError("Could not connect to the database.");
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, []);

  const handleStatusChange = async (bookingId, newStatus) => {
    try {
      const response = await fetch('http://localhost/habesha-backend/update_booking_status.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ booking_id: bookingId, status: newStatus })
      });
      
      const data = await response.json();
      if (data.success) {
        setBookings(prev => prev.map(b => b.id === bookingId ? { ...b, status: newStatus } : b));
      } else {
        alert("Error updating status: " + (data.error || "Unknown error"));
      }
    } catch (err) {
      console.error("Status update request connection failed:", err);
    }
  };

  const statusStyles = {
    Confirmed: "bg-green-50 text-green-600 border border-green-200/50",
    Pending: "bg-yellow-50 text-yellow-600 border border-yellow-200/50",
    Completed: "bg-blue-50 text-blue-600 border border-blue-200/50",
    Cancelled: "bg-red-50 text-red-600 border border-red-200/50",
  };

  const filteredBookings = bookings.filter(b => {
    const matchesStatus = statusFilter === 'All Status' || b.status === statusFilter;
    const matchesSearch = 
      (b.customer_name?.toLowerCase().includes(searchQuery.toLowerCase())) || 
      (b.tour_name?.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (b.ticket_token?.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (b.arrival_method?.toLowerCase().includes(searchQuery.toLowerCase())) || // Searchable logistics method strings
      (b.id?.toString().includes(searchQuery));
    return matchesStatus && matchesSearch;
  });

  if (loading) return (
    <div className="p-20 text-center text-gray-500 animate-pulse font-bold">
      Fetching Bookings Manifest...
    </div>
  );

  if (error) return (
    <div className="p-20 text-center flex flex-col items-center gap-4">
      <AlertCircle className="text-red-500" size={48} />
      <p className="text-gray-600 font-medium">{error}</p>
      <button 
        onClick={() => window.location.reload()}
        className="text-sm text-[#B95B2A] underline font-bold"
      >
        Retry Connection
      </button>
    </div>
  );

  return (
    <div className="p-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        {/* Search Bar */}
        <div className="relative flex-grow max-w-md w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input 
            type="text" 
            placeholder="Search by Name, Tour, Token, or Arrival Mode..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:ring-2 focus:ring-[#B95B2A]/10 font-medium transition" 
          />
        </div>

        {/* Status Dropdown */}
        <div className="relative w-full md:w-64">
          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full pl-5 pr-10 py-3 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:ring-2 focus:ring-[#B95B2A]/10 font-bold appearance-none cursor-pointer transition"
          >
            <option>All Status</option>
            <option>Confirmed</option>
            <option>Pending</option>
            <option>Completed</option>
            <option>Cancelled</option>
          </select>
          <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
            <ChevronDown size={18} />
          </div>
        </div>
      </div>

      <div className="overflow-x-auto bg-white rounded-3xl border border-gray-50 shadow-sm">
        <table className="w-full text-left">
          <thead>
            <tr className="text-gray-400 font-bold border-b border-gray-50 text-sm">
              <th className="py-6 px-6">ID</th>
              <th className="py-6 px-6">Ticket Token</th>
              <th className="py-6 px-6">Customer</th>
              <th className="py-6 px-6">Tour Destination</th>
              <th className="py-6 px-6">Arrival Mode</th> {/* New Logistics Column Header */}
              <th className="py-6 px-6">Travel Date</th>
              <th className="py-6 px-6">Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredBookings.map((b) => (
              <tr key={b.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition">
                <td className="py-5 px-6 font-mono font-bold text-gray-400">#{b.id}</td>
                
                <td className="py-5 px-6 font-mono font-bold text-indigo-600 text-sm">
                  <div className="flex items-center gap-1.5">
                    <Ticket size={14} className="text-indigo-400" />
                    {b.ticket_token || `HT-REF-${b.id}`}
                  </div>
                </td>
                
                <td className="py-5 px-6 text-gray-700 font-bold">
                  {b.customer_name || "Unknown Traveler"} 
                </td>
                
                <td className="py-5 px-6 text-gray-600 font-medium">{b.tour_name}</td>
                
                {/* NEW LOGISTICS CELL COLUMN DATA */}
                <td className="py-5 px-6">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold inline-flex items-center gap-1 ${
                    b.arrival_method === 'Airport' 
                      ? 'bg-sky-50 text-sky-600 border border-sky-100' 
                      : b.arrival_method === 'Bus' 
                      ? 'bg-amber-50 text-amber-600 border border-amber-100' 
                      : 'bg-gray-50 text-gray-500 border border-gray-100'
                  }`}>
                    {b.arrival_method === 'Airport' ? '✈️ Flight' : b.arrival_method === 'Bus' ? '🚌 Bus / Car' : 'Not Specified'}
                  </span>
                </td>

                <td className="py-5 px-6 text-gray-500 font-medium">{b.tour_date}</td> 
                
                <td className="py-5 px-6">
                  <select
                    value={b.status}
                    onChange={(e) => handleStatusChange(b.id, e.target.value)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-black uppercase tracking-wider outline-none cursor-pointer transition-all border ${statusStyles[b.status] || "bg-gray-50 text-gray-600 border-gray-200"}`}
                  >
                    <option value="Pending" className="bg-white text-yellow-600 font-bold">Pending</option>
                    <option value="Confirmed" className="bg-white text-green-600 font-bold">Confirmed</option>
                    <option value="Completed" className="bg-white text-blue-600 font-bold">Completed</option>
                    <option value="Cancelled" className="bg-white text-red-600 font-bold">Cancelled</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {filteredBookings.length === 0 && (
          <div className="py-20 text-center text-gray-400 font-medium">
            No matching bookings found on this manifest.
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingMonitor;