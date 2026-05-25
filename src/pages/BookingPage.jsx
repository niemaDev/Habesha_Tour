import React, { useState, useEffect } from 'react';
import { 
  User, Mail, Phone, Calendar, 
  Users, CreditCard, ArrowRight, ArrowLeft
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const BookingPage = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // State for form data
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    departureDate: '',
    travelers: '1',
    agreeToTerms: false
  });

  // Check if user is logged in before booking
  useEffect(() => {
    if (localStorage.getItem('isLoggedIn') !== 'true') {
      alert("Please login to book a tour");
      navigate('/login');
    }
  }, [navigate]);

  const PRICE_PER_PERSON = 45000;
  const total = PRICE_PER_PERSON * parseInt(formData.travelers);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleProceedToPayment = async (e) => {
    if (e) e.preventDefault();

    if (!formData.firstName || !formData.email || !formData.departureDate) {
      alert("Please fill in the required details.");
      return;
    }
    if (!formData.agreeToTerms) {
      alert("Please agree to the terms.");
      return;
    }

    setIsSubmitting(true);

    try {
      const userId = localStorage.getItem('userId');
      
      const bookingData = {
        user_id: userId,
        tour_name: "Simien Mountains Trek", // This can be dynamic based on selection
        tour_date: formData.departureDate,
        price: total,
        image_url: "https://images.unsplash.com/photo-1541410965313-d53b3c16ef17?auto=format&fit=crop&q=80",
        status: 'Confirmed'
      };

      const response = await fetch('http://localhost/habesha-backend/add_booking.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookingData)
      });

      const result = await response.json();

      if (result.success) {
        alert(`Success! Your booking for ${bookingData.tour_name} is confirmed.`);
        navigate('/dashboard'); // Redirect to dashboard to see the new entry
      } else {
        alert("Booking failed: " + result.message);
      }
    } catch (error) {
      console.error("Connection Error:", error);
      alert("Could not connect to the server.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-[#FAF9F6] min-h-screen font-sans text-[#2D1B14] pb-32 lg:pb-12">
      <div className="max-w-7xl mx-auto px-4 md:px-16 lg:px-24 pt-8">
        <button 
          onClick={() => navigate(-1)} 
          className="flex items-center gap-2 text-gray-400 hover:text-[#B95B2A] transition font-bold text-sm"
        >
          <ArrowLeft size={16} /> Back to Tours
        </button>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-16 lg:px-24 py-8">
        <div className="mb-8 md:mb-12">
          <h1 className="text-3xl md:text-4xl font-serif font-bold mb-2">Complete Your Booking</h1>
          <p className="text-gray-500 text-sm md:text-base">Fill in your details to reserve your spot</p>
        </div>

        <form onSubmit={handleProceedToPayment} className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12">
          <div className="lg:col-span-8 space-y-6 md:space-y-10">
            {/* Personal Info */}
            <section className="bg-white p-6 md:p-8 rounded-3xl border border-gray-100 shadow-sm">
              <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-6">Personal Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <FormInput label="First Name *" name="firstName" value={formData.firstName} onChange={handleInputChange} icon={<User size={18}/>} placeholder="John" required />
                <FormInput label="Last Name *" name="lastName" value={formData.lastName} onChange={handleInputChange} icon={<User size={18}/>} placeholder="Doe" required />
                <FormInput label="Email Address *" name="email" type="email" value={formData.email} onChange={handleInputChange} icon={<Mail size={18}/>} placeholder="john@example.com" required />
                <FormInput label="Phone Number *" name="phone" type="tel" value={formData.phone} onChange={handleInputChange} icon={<Phone size={18}/>} placeholder="+251..." required />
              </div>
            </section>

            {/* Travel Details */}
            <section className="bg-white p-6 md:p-8 rounded-3xl border border-gray-100 shadow-sm">
              <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-6">Travel Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <FormInput label="Departure Date *" name="departureDate" type="date" value={formData.departureDate} onChange={handleInputChange} icon={<Calendar size={18}/>} required />
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-bold ml-1">Travelers *</label>
                  <div className="relative">
                    <select 
                      name="travelers" value={formData.travelers} onChange={handleInputChange}
                      className="w-full p-4 bg-gray-50 border-none rounded-2xl outline-none appearance-none font-medium text-gray-700"
                    >
                      {[1, 2, 3, 4, 5, 6].map(n => <option key={n} value={n}>{n} {n === 1 ? 'Person' : 'People'}</option>)}
                    </select>
                    <Users size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                  </div>
                </div>
              </div>
            </section>

            <div className="space-y-6">
              <label className="flex items-start gap-4 cursor-pointer">
                <input type="checkbox" name="agreeToTerms" checked={formData.agreeToTerms} onChange={handleInputChange} className="mt-1 accent-[#B95B2A] w-5 h-5 rounded" />
                <span className="text-xs md:text-sm text-gray-500 leading-relaxed">I agree to the terms and conditions.</span>
              </label>

              <button 
                type="submit" disabled={isSubmitting}
                className={`w-full py-6 rounded-2xl font-black text-lg flex items-center justify-center gap-3 shadow-2xl transition-all ${
                  isSubmitting ? 'bg-gray-300' : 'bg-[#B95B2A] text-white hover:bg-[#a04e24]'
                }`}
              >
                {isSubmitting ? "Processing..." : <><CreditCard size={22} /> Confirm Booking <ArrowRight /></>}
              </button>
            </div>
          </div>

          {/* Sidebar Summary */}
          <aside className="hidden lg:block lg:col-span-4">
            <div className="bg-white p-8 rounded-[3rem] border border-gray-50 sticky top-10 shadow-2xl shadow-gray-200/50">
              <h3 className="text-xl font-bold mb-6">Summary</h3>
              <div className="flex justify-between text-sm font-medium mb-4">
                <span className="text-gray-400">Total Price</span>
                <span className="text-[#2D1B14] font-black text-xl">{total.toLocaleString()} ETB</span>
              </div>
            </div>
          </aside>
        </form>
      </div>
    </div>
  );
};

const FormInput = ({ label, icon, placeholder, name, value, onChange, type = "text", required }) => (
  <div className="flex flex-col gap-2">
    <label className="text-sm font-bold ml-1">{label}</label>
    <div className="relative">
      <input 
        required={required} name={name} type={type} value={value} onChange={onChange}
        className="w-full p-4 pl-12 bg-gray-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-orange-100 transition-all font-medium text-gray-700"
        placeholder={placeholder}
      />
      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#B95B2A]">{icon}</div>
    </div>
  </div>
);

export default BookingPage;