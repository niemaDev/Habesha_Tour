import React, { useState, useEffect } from 'react';
import { TrendingUp, Download, PieChart, ArrowUpRight, Loader2 } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const Reports = () => {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch report data on component mount
  useEffect(() => {
    const fetchReportMetrics = async () => {
      try {
        const response = await fetch('http://localhost/habesha-backend/get_report_data.php');
        const json = await response.json();
        if (json.success) {
          setData(json);
        }
      } catch (error) {
        console.error("Failed to collect analytics context:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchReportMetrics();
  }, []);

  // EXPORT LIVE DATA TO EXCEL / CSV FORMAT
  const handleExportData = async () => {
    try {
      // Re-use your backend booking script to gather all raw database table rows
      const res = await fetch('http://localhost/habesha-backend/get_customer_bookings.php');
      const bookingsList = await res.json();

      if (!Array.isArray(bookingsList) || bookingsList.length === 0) {
        alert("No active booking data found to export.");
        return;
      }

      // Define CSV headers
      const headers = ["Booking ID", "Ticket Token", "User ID", "Tour Destination", "Tour Date", "Price (ETB)", "Status"];
      
      // Map data array to match exact database schema column indices
      const csvRows = [
        headers.join(','), // First row is column headers
        ...bookingsList.map(b => [
          `"${b.id}"`,
          `"${b.ticket_token || ''}"`,
          `"${b.user_id || ''}"`,
          `"${b.tour_name ? b.tour_name.replace(/"/g, '""') : ''}"`,
          `"${b.tour_date || ''}"`, // Formatted to match database table layout
          `"${b.price || 0}"`,
          `"${b.status || 'Pending'}"`
        ].join(','))
      ];

      // Package array lines as file context blob object
      const csvContent = "data:text/csv;charset=utf-8," + csvRows.join("\n");
      const encodedUri = encodeURI(csvContent);
      
      // Auto-trigger download execution across window document target
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", `Habesha_Tours_System_Report_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

    } catch (err) {
      console.error("Failed downstream file transformation schema processing:", err);
      alert("Error parsing backup rows during export pipeline operation.");
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-3">
        <Loader2 className="animate-spin text-[#B95B2A]" size={36} />
        <p className="text-gray-400 font-bold text-sm">Compiling System Analytics...</p>
      </div>
    );
  }

  // Dynamic structural mapping with updated verification checks
  const statsSummary = [
    { 
      label: "Growth", 
      value: data?.stats?.growth !== undefined ? data.stats.growth : "+0%", 
      icon: TrendingUp, 
      color: "text-green-500" 
    },
    { 
      label: "Bookings", 
      value: data?.stats?.total_bookings !== undefined ? String(data.stats.total_bookings) : "0", 
      icon: ArrowUpRight, 
      color: "text-orange-600" 
    },
    { 
      label: "Avg. Price", 
      value: data?.stats?.avg_price || "0 ETB", 
      icon: PieChart, 
      color: "text-amber-800" 
    }
  ];

  return (
    <div className="p-8">
      {/* HEADER SECTION */}
      <div className="flex justify-between items-center mb-10">
        <h3 className="text-2xl font-bold text-[#2D1B14]">System Analytics</h3>
        <button 
          onClick={handleExportData}
          className="flex items-center gap-2 bg-[#2D1B14] text-white px-6 py-3 rounded-xl font-bold hover:bg-[#3d251b] transition shadow-md active:scale-95 duration-200"
        >
          <Download size={18} /> Export Data
        </button>
      </div>
      
      {/* ANALYTICS METRICS GRID CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        {statsSummary.map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-xs hover:shadow-md transition duration-300">
            <div className="flex justify-between items-start mb-4">
              <p className="text-gray-400 text-xs uppercase font-bold tracking-widest">{stat.label}</p>
              <stat.icon className={stat.color} size={20} />
            </div>
            <p className="text-3xl font-black text-[#2D1B14]">{stat.value}</p>
          </div>
        ))}
      </div>
      
      {/* LIVE INTERACTIVE CHART PANEL */}
      <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-xs">
        <div className="mb-6">
          <h4 className="font-bold text-lg text-[#2D1B14]">Reservation Activity Chart</h4>
          <p className="text-xs text-gray-400">Showing volume frequency fluctuations for upcoming journey milestones</p>
        </div>

        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={data?.chartData || []}
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorReservations" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#B95B2A" stopOpacity={0.2}/>
                  <stop offset="95%" stopColor="#B95B2A" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
              <XAxis 
                dataKey="date" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#9CA3AF', fontSize: 12, fontWeight: 600 }}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#9CA3AF', fontSize: 12, fontWeight: 600 }}
              />
              <Tooltip 
                contentStyle={{ backgroundColor: '#fff', borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}
                labelStyle={{ fontWeight: 'bold', color: '#2D1B14' }}
              />
              <Area 
                type="monotone" 
                dataKey="Reservations" 
                stroke="#B95B2A" 
                strokeWidth={3}
                fillOpacity={1} 
                fill="url(#colorReservations)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Reports;