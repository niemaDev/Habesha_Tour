import React, { useState } from 'react';
import { Search, MapPin, Clock, ArrowRight, Filter, Star } from 'lucide-react';
import { Link } from 'react-router-dom';

const Tours = () => {
  // ==========================================
  // 1. STATE & STATIC DATA
  // ==========================================
  const [region, setRegion] = useState('All Regions');
  const [activity, setActivity] = useState('All Activities');
  const [priceRange, setPriceRange] = useState(100000);
  const [searchQuery, setSearchQuery] = useState('');

  const tours = [
    { id: 1, title: "Simien Mountains Trek", location: "Amhara", duration: "7 Days", price: "45,000", type: "Trekking", rating: "4.9", img: "/terara.jpg" },
    { id: 2, title: "Omo Valley Safari", location: "Southern Nations", duration: "5 Days", price: "38,000", type: "Safari", rating: "4.8", img: "/nature.jpg" },
    { id: 3, title: "Tiss Abay Water Fall", location: "Amhara", duration: "10 Days", price: "52,000", type: "Cultural", rating: "4.7", img: "/tissabay.jpg" },
    { id: 4, title: "Lalibela Churches Tour", location: "Amhara", duration: "4 Days", price: "28,000", type: "Cultural", rating: "5.0", img: "/lalibela.jpg" },
    { id: 5, title: "Danakil Depression", location: "Afar", duration: "6 Days", price: "42,000", type: "Adventure", rating: "4.7", img: "/colored.jpg" },
    { id: 6, title: "Bale Mountains Wildlife", location: "Oromia", duration: "5 Days", price: "35,000", type: "Wildlife", rating: "4.8", img: "/terr.jpg" },
  ];

  // ==========================================
  // 2. FILTER LOGIC
  // ==========================================
  const filteredTours = tours.filter((tour) => {
    const matchesRegion = region === 'All Regions' || tour.location === region;
    const matchesActivity = activity === 'All Activities' || tour.type === activity;
    const tourPrice = parseInt(tour.price.replace(/,/g, ''));
    const matchesPrice = tourPrice <= priceRange;
    const matchesSearch = tour.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesRegion && matchesActivity && matchesPrice && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#FDFBF9]">
      
      {/* ==========================================
          3. HERO SECTION (With Background Image)
      ========================================== */}
      <div className="
       justify-center text-center bg-[url('/nature.jpg')] bg-cover bg-center h-screen
      relative min-h-[calc(100vh-214px)] flex items-center  text-white pt-20 pb-40 px-6 md:px-16 lg:px-24 overflow-hidden bg-coffee">
        {/* Background Image */}
        <img 
          src="/nature.jpg" // Replace with your actual background image file
          className="absolute inset-0 w-full h-full object-cover"
          alt="Explore Tours Background"
        />
        {/* Dark Overlay for Readability */}
        <div className="absolute inset-0 bg-black/40 z-10" />

        <div className="relative z-20 px-6">
          <h1 className="text-5xl md:text-7xl font-serif font-bold text-white mb-4 drop-shadow-lg">
            Explore Our Tours
          </h1>
          <p className="text-white/90 text-lg md:text-xl font-medium drop-shadow-md">
            Discover unique experiences across Ethiopia
          </p>
        </div>
      </div>

      {/* ==========================================
          4. MAIN CONTENT (Sidebar + Grid)
      ========================================== */}
      <div className="max-w-7xl mx-auto px-6 py-12 flex flex-col lg:flex-row gap-8">
        
        {/* SIDEBAR FILTERS */}
        <aside className="w-full lg:w-72 space-y-8">
          <div className="bg-transparent p-8 rounded-[2rem] shadow-sm border border-gray-100">
            <div className="flex items-center gap-2 text-[#B95B2A] font-bold uppercase tracking-wider text-xs mb-6">
              <Filter size={16} /> Filters
            </div>
            <div className="space-y-6">
              {/* Region Select */}
              <div>
                <label className="block text-sm font-bold text-[#2D1B14] mb-3">Region</label>
                <select 
                  value={region} 
                  onChange={(e) => setRegion(e.target.value)}
                  className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl outline-none text-sm font-medium"
                >
                  <option>All Regions</option>
                  <option>Amhara</option>
                  <option>Oromia</option>
                  <option>Tigray</option>
                  <option>Afar</option>
                  <option>Southern Nations</option>
                </select>
              </div>

              {/* Activity Select */}
              <div>
                <label className="block text-sm font-bold text-[#2D1B14] mb-3">Activity Type</label>
                <select 
                  value={activity} 
                  onChange={(e) => setActivity(e.target.value)}
                  className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl outline-none text-sm font-medium"
                >
                  <option>All Activities</option>
                  <option>Trekking</option>
                  <option>Safari</option>
                  <option>Adventure</option>
                  <option>Cultural</option>
                  <option>Wildlife</option>
                </select>
              </div>

              {/* Price Slider */}
              <div>
                <div className="flex justify-between mb-3">
                  <label className="text-sm font-bold text-[#2D1B14]">Price Range</label>
                  <span className="text-xs font-bold text-[#B95B2A]">{Number(priceRange).toLocaleString()} ETB</span>
                </div>
                <input 
                  type="range" 
                  min="0" max="100000" step="1000"
                  value={priceRange} 
                  onChange={(e) => setPriceRange(e.target.value)}
                  className="w-full accent-[#B95B2A] cursor-pointer" 
                />
              </div>
            </div>
          </div>
        </aside>

        {/* TOUR GRID */}
        <main className="flex-1">
          {/* Search Bar */}
          <div className="relative mb-8">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-300" size={24} />
            <input 
              type="text" 
              placeholder="Search destinations..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-16 pr-8 py-5 bg-transparent border border-gray-100 rounded-[2rem] shadow-sm outline-none focus:ring-2 focus:ring-[#B95B2A]/10 transition text-lg"
            />
          </div>

          <p className="text-gray-400 font-bold mb-6">
            Showing {filteredTours.length} tours
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {filteredTours.length > 0 ? (
              filteredTours.map((tour) => (
                <div key={tour.id} className="bg-transparent rounded-[2.5rem] overflow-hidden shadow-sm border border-gray-100 group hover:shadow-xl transition-all duration-500">
                  {/* Card Image */}
                  <div className="relative h-64 overflow-hidden">
                    <img 
                      src={tour.img} 
                      alt={tour.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition duration-700" 
                      onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1523805009345-7448845a9e53?q=80&w=800'; }}
                    />
                    <div className="absolute top-4 left-4 bg-transparent/90 backdrop-blur-md px-3 py-1 rounded-full flex items-center gap-1 font-bold text-sm">
                      <Star size={14} fill="#B95B2A" className="text-[#B95B2A]" /> {tour.rating}
                    </div>
                    <div className="absolute top-4 right-4 bg-[#B95B2A] text-white px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest">
                      {tour.type}
                    </div>
                  </div>

                  {/* Card Info */}
                  <div className="p-8">
                    <h3 className="text-2xl font-serif font-bold text-[#2D1B14] mb-2">{tour.title}</h3>
                    <p className="text-gray-400 text-sm mb-6">Explore Ethiopia's dramatic landscapes.</p>
                    
                    <div className="flex items-center gap-6 text-gray-400 text-sm mb-8">
                      <div className="flex items-center gap-2"><MapPin size={16} /> {tour.location}</div>
                      <div className="flex items-center gap-2"><Clock size={16} /> {tour.duration}</div>
                    </div>

                    <div className="flex items-center justify-between border-t border-gray-50 pt-6">
                      <div>
                        <p className="text-xs text-gray-400 font-bold uppercase">From</p>
                        <p className="text-xl font-bold text-[#B95B2A]">{tour.price} ETB</p>
                      </div>
                      <Link
                        to={`/tour/${tour.id}`} 
                        className="bg-[#B95B2A] text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 hover:brightness-110 transition active:scale-95 shadow-lg shadow-[#B95B2A]/20"
                      >
                        Book Now <ArrowRight size={18} />
                      </Link>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-2 text-center py-20 bg-transparent rounded-[2.5rem] border border-dashed border-gray-200">
                <p className="text-gray-400 font-medium">No tours match your current filters.</p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Tours;