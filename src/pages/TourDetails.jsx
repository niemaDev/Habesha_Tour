import React, { useState, useEffect } from 'react';
import { Clock, Users, MapPin, Check, X, ArrowRight, Star, Loader2 } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import PaymentModal from './PaymentModal'; 

const TourDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [tour, setTour] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [isPaymentOpen, setIsPaymentOpen] = useState(false); 
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    const fetchTourDetails = async () => {
      try {
        const response = await fetch(`http://localhost/habesha-backend/get_tours.php`);
        const data = await response.json();
        
        if (Array.isArray(data)) {
          const foundTour = data.find(t => t.id.toString() === id);
          setTour(foundTour);
        }
      } catch (error) {
        console.error("Failed to fetch tour details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTourDetails();
  }, [id]);

  const handleBookingTrigger = () => {
    if (!userId) {
      alert("Please login to book this tour.");
      navigate('/login');
      return;
    }
    setIsPaymentOpen(true); 
  };

  const completeBookingTransaction = async (chosenArrival) => {
    setIsPaymentOpen(false); 
    setBookingLoading(true);
    
    try {
      const bookingData = {
        user_id: userId,
        tour_name: tour.tour_name,
        booking_date: new Date().toISOString().split('T')[0], 
        total_price: tour.price,                               
        image_url: tour.image_url,
        arrival_method: chosenArrival                         
      };

      const response = await fetch('http://localhost/habesha-backend/create_booking.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookingData)
      });
      
      const result = await response.json();
      
      if (result.success) {
        alert("Payment Verified! Your journey has been officially reserved. Reference Token: " + result.ticket_token);
        navigate('/dashboard');
      } else {
        alert("Error booking journey: " + (result.error || result.message));
      }
    } catch (error) {
      console.error("Booking connection failed:", error);
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-[#FAF9F6]">
        <Loader2 className="animate-spin text-[#B95B2A] mb-4" size={48} />
        <p className="font-bold text-gray-500">Preparing your adventure...</p>
      </div>
    );
  }

  if (!tour) {
    return <div className="h-screen flex items-center justify-center">Tour not found.</div>;
  }

  return (
    <div className="bg-[#FAF9F6] min-h-screen font-sans text-[#2D1B14]">
      {/* HERO SECTION */}
      <section className="relative h-[60vh] min-h-[500px] flex items-center text-white overflow-hidden">
        <img
          src={tour.image_url?.startsWith('http') ? tour.image_url : `/images/${tour.image_url || 'nature.jpg'}`}
          alt={tour.tour_name}
          className="absolute inset-0 w-full h-full object-cover"
          onError={(e) => { e.target.src = "/images/nature.jpg"; }}
        />
        <div className="absolute inset-0 bg-black/50 z-10" />

        <div className="max-w-7xl mx-auto px-6 md:px-16 lg:px-24 relative z-20 w-full">
          <div className="flex items-center gap-4 mb-6">
            <span className="bg-[#B95B2A] px-4 py-1 rounded-full text-xs font-semibold tracking-wide">
              {tour.region || "Ethiopia"}
            </span>
            <div className="flex items-center gap-1 text-orange-400">
              <Star size={16} fill="currentColor" />
              <span className="text-sm font-bold">4.9 (87 reviews)</span>
            </div>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-serif font-bold mb-6 leading-tight drop-shadow-xl ">
            {tour.tour_name}
          </h1>
          <p className="max-w-3xl text-lg md:text-xl opacity-90 leading-relaxed font-light drop-shadow-md">
            {tour.description}
          </p>
        </div>
      </section>

      {/* KEY STATS */}
      <div className="max-w-7xl mx-auto px-6 md:px-16 lg:px-24 -mt-16 relative z-30 mt-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:w-[calc(66.66%+1.5rem)]">
          {[
            { icon: <Clock className="text-[#B95B2A]" />, label: "Duration", val: tour.duration || "Flexible" },
            { icon: <Users className="text-[#B95B2A]" />, label: "Group Size", val: `Max ${tour.capacity || 10} People` },
            { icon: <MapPin className="text-[#B95B2A]" />, label: "Region", val: tour.region || "Ethiopia" }
          ].map((item, idx) => (
            <div key={idx} className="bg-white p-8 rounded-[2rem] shadow-xl border-b-4 border-orange-100 flex flex-col gap-4 transform transition-transform hover:-translate-y-1">
              <div className="bg-orange-50 w-12 h-12 rounded-2xl flex items-center justify-center">
                {item.icon}
              </div>
              <div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{item.label}</p>
                <p className="font-bold text-lg">{item.val}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* MAIN CONTENT AREA */}
      <div className="max-w-7xl mx-auto px-6 md:px-16 lg:px-24 py-20 grid grid-cols-1 lg:grid-cols-12 gap-16">
        <div className="lg:col-span-8 space-y-16">
          <section>
            <h2 className="text-3xl font-serif font-bold mb-6 relative inline-block">
              About this Journey
              <span className="absolute -bottom-2 left-0 w-12 h-1 bg-[#B95B2A] rounded-full" />
            </h2>
            <p className="text-gray-500 leading-relaxed text-lg">
                {tour.description}
            </p>
          </section>

          <section className="grid md:grid-cols-2 gap-10">
            <div className="bg-white p-10 rounded-[3rem] border border-gray-100">
              <h3 className="text-xl font-bold mb-8 flex items-center gap-2">
                <Check className="text-green-500" /> What's Included
              </h3>
              <ul className="space-y-5">
                {["Professional guide", "All park entrance fees", "Camping equipment & meals", "4WD Transportation"].map((txt, i) => (
                  <li key={i} className="flex gap-3 text-sm text-gray-600 font-medium">
                    <Check className="text-green-500 shrink-0" size={18} /> {txt}
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-white p-10 rounded-[3rem] border border-gray-100">
              <h3 className="text-xl font-bold mb-8 flex items-center gap-2">
                <X className="text-red-500" /> Not Included
              </h3>
              <ul className="space-y-5">
                {["International flights", "Travel insurance", "Personal tips", "Alcoholic beverages"].map((txt, i) => (
                  <li key={i} className="flex gap-3 text-sm text-gray-600 font-medium">
                    <X className="text-red-500 shrink-0" size={18} /> {txt}
                  </li>
                ))}
              </ul>
            </div>
          </section>
        </div>

        {/* RIGHT COLUMN: SIDEBAR */}
        <aside className="lg:col-span-4">
          <div className="bg-white p-10 rounded-[3rem] shadow-2xl border border-gray-50 sticky top-28">
            <div className="mb-10">
              <p className="text-gray-400 text-xs font-black uppercase tracking-widest mb-2">Total Price From</p>
              <div className="flex items-baseline gap-2">
                <h3 className="text-4xl font-black text-[#B95B2A]">{parseFloat(tour.price || 0).toLocaleString()} ETB</h3>
                <span className="text-sm font-medium text-gray-400">/ person</span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleBookingTrigger}
              disabled={bookingLoading}
              className="w-full bg-[#B95B2A] text-white py-5 rounded-2xl font-bold flex items-center justify-center gap-3 hover:brightness-110 transition active:scale-95 shadow-xl shadow-orange-100 disabled:opacity-50"
            >
              {bookingLoading ? (
                <>
                  <Loader2 className="animate-spin text-white" size={20} />
                  Processing...
                </>
              ) : (
                <>Book This Tour <ArrowRight size={20} /></>
              )}
            </button>
            <p className="text-center text-xs text-gray-400 mt-4">Multi-wallet bank clearance protection enabled.</p>
          </div>
        </aside>
      </div>

      <PaymentModal 
        isOpen={isPaymentOpen}
        onClose={() => setIsPaymentOpen(false)}
        tourDetails={tour}
        onPaymentSuccess={completeBookingTransaction}
      />
    </div>
  );
};

export default TourDetails;