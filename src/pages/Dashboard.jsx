import React, { useState, useEffect } from "react";
import { Calendar, MapPin, Clock, PlusCircle, User, Phone, ShieldAlert } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("bookings"); 
  const [myBookings, setMyBookings] = useState([]);
  const [availableTours, setAvailableTours] = useState([]);
  const [loading, setLoading] = useState(true);

  const userName = localStorage.getItem("userName") || "Traveler";
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!userId) return;
      setLoading(true);
      try {
        const resTours = await fetch(
          `http://localhost/habesha-backend/get_tours.php`
        );
        const dataTours = await resTours.json();
        if (Array.isArray(dataTours)) setAvailableTours(dataTours);

        const resBookings = await fetch(
          `http://localhost/habesha-backend/get_customer_bookings.php?user_id=${userId}`
        );
        const dataBookings = await resBookings.json();
        if (Array.isArray(dataBookings)) setMyBookings(dataBookings);
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [userId]);

  return (
    <div className="min-h-screen bg-[#FDFBF9] pt-[100px] pb-12 px-4 md:px-8 font-sans text-[#2D1B14]">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-8">

        {/* SIDEBAR */}
        <aside className="lg:col-span-1 space-y-4">
          <div className="bg-white rounded-3xl p-6 shadow-sm text-center border border-gray-100">
            <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center text-[#B95B2A] text-3xl font-bold mx-auto mb-4">
              {userName.charAt(0).toUpperCase()}
            </div>
            <h2 className="font-bold text-xl text-[#2D1B14] mb-1">{userName}</h2>
            <span className="text-xs bg-orange-50 text-[#B95B2A] px-3 py-1 rounded-full font-bold uppercase tracking-wider">
              Active Explorer
            </span>
          </div>

          <nav className="space-y-2">
            {[
              { id: "bookings", label: "My Bookings", icon: Calendar },
              { id: "book-now", label: "New Journey", icon: PlusCircle },
              { id: "profile", label: "My Profile", icon: User },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 p-4 rounded-2xl font-bold transition-all ${
                  activeTab === tab.id
                    ? "bg-[#B95B2A] text-white shadow-md shadow-orange-100"
                    : "bg-white text-gray-400 hover:bg-orange-50/50 hover:text-gray-600"
                }`}
              >
                <tab.icon size={20} />
                {tab.label}
              </button>
            ))}
          </nav>
        </aside>

        {/* MAIN */}
        <main className="lg:col-span-3">
          {loading ? (
            <div className="h-64 flex items-center justify-center">
              <div className="animate-spin h-10 w-10 border-t-2 border-[#B95B2A] rounded-full"></div>
            </div>
          ) : (
            <div>

              {/* BOOKINGS VIEW */}
              {activeTab === "bookings" && (
                <section>
                  <h1 className="text-2xl font-serif font-bold mb-6">My Journeys</h1>

                  {myBookings.length === 0 ? (
                    <div className="bg-white rounded-3xl p-8 text-center text-gray-400 border border-gray-100">
                      No bookings discovered yet. Start exploring new horizons!
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {myBookings.map((b) => (
                        <div
                          key={b.id}
                          className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-5"
                        >
                          {/* Top Info Layout */}
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-50 pb-4">
                            <div className="flex gap-4 items-center">
                              <img
                                src={
                                  b.image_url?.startsWith("http")
                                    ? b.image_url
                                    : `/images/${b.image_url || "nature.jpg"}`
                                }
                                className="w-16 h-16 rounded-xl object-cover bg-gray-50 flex-shrink-0"
                                alt=""
                                onError={(e) => { e.target.src = "/images/nature.jpg"; }}
                              />
                              <div>
                                <h3 className="font-bold text-lg text-[#2D1B14]">{b.tour_name}</h3>
                                <p className="text-sm text-gray-400 flex items-center gap-1 mt-0.5">
                                  <Calendar size={12} /> {b.tour_date}
                                </p>
                              </div>
                            </div>
                            <div className="sm:text-right flex sm:flex-col justify-between sm:justify-start items-center sm:items-end gap-1">
                              <p className="text-[#B95B2A] font-black text-xl">
                                {parseFloat(b.price || 0).toLocaleString()} ETB
                              </p>
                              <span className="text-[10px] uppercase font-black tracking-widest text-green-600 bg-green-50 px-2.5 py-1 rounded-md">
                                {b.status || "Confirmed"}
                              </span>
                            </div>
                          </div>

                          {/* DYNAMIC DIGITAL GROUND ARRIVAL PASS */}
                          <div className="bg-slate-50 border border-dashed border-slate-200 rounded-2xl p-5 space-y-4">
                            
                            {/* Verification Token Bar */}
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-slate-200 pb-3">
                              <div>
                                <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">Digital Verification Pass</span>
                                <p className="text-sm font-mono font-bold text-indigo-600">{b.ticket_token || `HT-REF-${b.id}`}</p>
                              </div>
                              <div className="text-[11px] font-bold text-amber-700 bg-amber-50 border border-amber-200/60 px-2.5 py-1 rounded-lg flex items-center gap-1">
                                <ShieldAlert size={14} /> Show screen to guide upon arrival
                              </div>
                            </div>

                            {/* Conditional Ground Transit Protocols Grid */}
                            <div>
                              <h4 className="text-xs font-black tracking-wide text-gray-500 uppercase mb-3">
                                📍 Ground Rendezvous Protocols {b.arrival_method && b.arrival_method !== 'Not Specified' && `(Selected: ${b.arrival_method})`}
                              </h4>
                              <div className="grid grid-cols-1 gap-4">
                                
                                {/* Air Route */}
                                {(b.arrival_method === 'Airport' || b.arrival_method === 'Plane' || b.arrival_method === 'Flight' || !b.arrival_method || b.arrival_method === '' || b.arrival_method === 'Not Specified') && (
                                  <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-2xs">
                                    <span className="text-xs font-bold text-blue-700 block mb-1.5">✈️ If Arriving by Flight:</span>
                                    <p className="text-xs text-gray-600 leading-relaxed font-medium">
                                      {b.airport_pickup || "Our operations shuttle will await your arrival outside the terminal baggage exit gates holding a Habesha Tour placard."}
                                    </p>
                                  </div>
                                )}

                                {/* Surface Route */}
                                {(b.arrival_method === 'Bus' || b.arrival_method === 'Car' || !b.arrival_method || b.arrival_method === '' || b.arrival_method === 'Not Specified') && (
                                  <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-2xs">
                                    <span className="text-xs font-bold text-emerald-700 block mb-1.5">🚌 If Arriving by Bus / Car:</span>
                                    <p className="text-xs text-gray-600 leading-relaxed font-medium">
                                      {b.bus_pickup || "Our local coordinator will meet you directly at the main entrance gate structure of the central station terminal."}
                                    </p>
                                  </div>
                                )}

                              </div>
                            </div>

                            {/* Guide Contact Helpline Footer */}
                            <div className="pt-3 border-t border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-gray-400 font-medium">
                              <div className="flex items-center gap-1.5 text-gray-600">
                                <Phone size={14} className="text-slate-400" />
                                <span>Local Guide Hotline:</span>
                                <span className="font-mono font-bold text-indigo-600 bg-indigo-50/50 px-2 py-0.5 rounded border border-indigo-100/30">
                                  {b.guide_contact || "+251-911-XX-XX-XX"}
                                </span>
                              </div>
                              <div className="text-slate-400 italic">Habesha Tour Ground Logistics Team</div>
                            </div>

                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </section>
              )}

              {/* BOOK NOW */}
              {activeTab === "book-now" && (
                <section>
                  <h1 className="text-2xl font-serif font-bold mb-6">Available Tours</h1>

                  <div className="grid md:grid-cols-2 gap-6">
                    {availableTours.map((tour) => (
                      <div
                        key={tour.id}
                        className="bg-white rounded-[2.5rem] overflow-hidden shadow-sm border border-gray-100 flex flex-col justify-between h-full group hover:shadow-md transition-shadow duration-300"
                      >
                        {/* TOUR IMAGE */}
                        <div className="w-full h-52 overflow-hidden bg-gray-100 relative">
                          <img
                            src={
                              tour.image_url?.startsWith("http")
                                ? tour.image_url
                                : `/images/${tour.image_url || "nature.jpg"}`
                            }
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            alt={tour.tour_name}
                            onError={(e) => { e.target.src = "/images/nature.jpg"; }}
                          />
                        </div>

                        {/* CARD BODY INFORMATION */}
                        <div className="p-8 flex flex-col flex-grow">
                          <h4 className="text-2xl font-serif font-bold text-[#2D1B14] mb-2">
                            {tour.tour_name}
                          </h4>
                          <p className="text-gray-400 text-sm font-medium mb-6 line-clamp-2">
                            {tour.description || "Explore Ethiopia's structural wonderlands and dramatic vistas."}
                          </p>

                          {/* META TAGS */}
                          <div className="flex items-center gap-6 text-sm font-semibold text-gray-400 mb-8 mt-auto">
                            <div className="flex items-center gap-1.5">
                              <MapPin size={16} className="text-gray-300" />
                              <span>{tour.region || "Ethiopia"}</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <Clock size={16} className="text-gray-300" />
                              <span>{tour.duration || "Flexible"}</span>
                            </div>
                          </div>

                          {/* BOTTOM FOOTER */}
                          <div className="flex items-center justify-between border-t border-gray-50 pt-5 mt-auto">
                            <div className="flex flex-col">
                              <span className="text-[10px] font-black tracking-widest text-gray-300 uppercase">FROM</span>
                              <span className="text-xl font-black text-[#B95B2A]">
                                {parseFloat(tour.price || 0).toLocaleString()} ETB
                              </span>
                            </div>

                            <button
                              type="button"
                              onClick={() => navigate(`/tour/${tour.id}`)}
                              className="bg-[#B95B2A] text-white font-bold text-sm px-6 py-3.5 rounded-2xl flex items-center gap-2 hover:bg-[#a04e22] transition-all shadow-md shadow-orange-100 active:scale-95"
                            >
                              Book Now
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                              </svg>
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* PROFILE */}
              {activeTab === "profile" && (
                <section>
                  <h1 className="text-2xl font-serif font-bold mb-6">My Profile</h1>
                  <div className="bg-white rounded-3xl p-8 border border-gray-100 space-y-4">
                    <div>
                      <label className="text-[10px] font-black tracking-wider text-gray-400 uppercase">Full Identity Name</label>
                      <p className="text-lg font-bold text-[#2D1B14]">{userName}</p>
                    </div>
                    <div>
                      <label className="text-[10px] font-black tracking-wider text-gray-400 uppercase">System Serial ID</label>
                      <p className="text-sm font-mono bg-gray-50 p-3 rounded-xl text-gray-600 border border-gray-100 mt-1 inline-block">
                        {userId || "Not Authenticated"}
                      </p>
                    </div>
                  </div>
                </section>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;