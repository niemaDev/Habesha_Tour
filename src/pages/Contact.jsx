import React, { useState } from 'react';
import { MapPin, Phone, Mail, HelpCircle, Send, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';

const Contact = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    message: '',
    humanVerify: ''
  });

  const [status, setStatus] = useState({ type: null, message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Sync all fields to controlled input state handlers
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ type: null, message: "" });

    // Client-side validations
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.phone || !formData.message) {
      setStatus({ type: "error", message: "Please fill in all fields before submitting." });
      return;
    }

    if (parseInt(formData.humanVerify, 10) !== 4) {
      setStatus({ type: "error", message: "Incorrect human verification math response. Please try again." });
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('http://localhost/habesha-backend/submit_contact.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          first_name: formData.firstName,
          last_name: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          message: formData.message,
          captcha_answer: parseInt(formData.humanVerify, 10)
        })
      });

      const result = await response.json();

      if (result.success) {
        setStatus({ type: "success", message: result.message });
        // Clear out the state variables on success
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          message: '',
          humanVerify: ''
        });
      } else {
        setStatus({ type: "error", message: result.message || "An unexpected error occurred." });
      }
    } catch (err) {
      console.error("Submission backend failure: ", err);
      setStatus({ type: "error", message: "Network error. Please verify your connection to the database server." });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-gray-50">
      {/* --- HERO SECTION --- */}
      <section className="justify-center text-center bg-[url('/nature.jpg')] bg-cover bg-center h-screen
      relative min-h-[calc(100vh-214px)] flex items-center text-white pt-20 pb-40 px-6 md:px-16 lg:px-24 overflow-hidden bg-coffee">
        <div className="absolute inset-0 z-0">
          <img 
            src="/nature.jpg" 
            alt="Contact Us" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-[#4B2E20]/60" /> {/* Brand Overlay */}
        </div>
        
        <div className="relative z-10 px-4">
          <h1 className="text-5xl md:text-6xl font-serif font-bold uppercase mb-4">Contact Us</h1>
          <p className="text-lg md:text-xl font-light tracking-wide max-w-2xl mx-auto">
            Get in Touch with Us Today! We're Here to Help.
          </p>
        </div>
      </section>

      {/* --- MAIN CONTENT AREA --- */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* LEFT: Contact Form */}
          <div className="lg:col-span-2 bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-gray-100">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 bg-[#D4A017] rounded-full flex items-center justify-center text-white">
                <Send size={24} />
              </div>
              <h2 className="text-3xl font-bold text-[#4B2E20]">Fill the form below</h2>
            </div>
            
            <p className="text-gray-500 mb-10 leading-relaxed">
              Send us your queries about your next holiday trip. Habesha Tour can guide and assist you to make your holiday an amazing experience!
            </p>

            {/* STATUS MESSAGE DISPLAY BANNER */}
            {status.message && (
              <div className={`mb-6 p-4 rounded-xl flex items-center gap-3 font-bold text-sm border ${
                status.type === 'success' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'
              }`}>
                {status.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
                <span>{status.message}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-[#4B2E20] mb-2">First Name</label>
                  <input 
                    type="text" 
                    name="firstName"
                    value={formData.firstName}
                    placeholder="Enter Name"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#D4A017] outline-none transition font-semibold"
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-[#4B2E20] mb-2">Last Name</label>
                  <input 
                    type="text" 
                    name="lastName"
                    value={formData.lastName}
                    placeholder="Enter Last Name"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#D4A017] outline-none transition font-semibold"
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-[#4B2E20] mb-2">Email</label>
                  <input 
                    type="email" 
                    name="email"
                    value={formData.email}
                    placeholder="Enter Email"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#D4A017] outline-none transition font-semibold"
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-[#4B2E20] mb-2">Phone</label>
                  <input 
                    type="text" 
                    name="phone"
                    value={formData.phone}
                    placeholder="Enter Phone number"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#D4A017] outline-none transition font-semibold"
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-[#4B2E20] mb-2">Message</label>
                <textarea 
                  rows="5" 
                  name="message"
                  value={formData.message}
                  placeholder="Write your message"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#D4A017] outline-none transition resize-none font-semibold"
                  onChange={handleInputChange}
                ></textarea>
              </div>

              <div className="md:w-1/2">
                <label className="block text-sm font-bold text-[#4B2E20] mb-2">Human verification</label>
                <input 
                  type="number" 
                  name="humanVerify"
                  value={formData.humanVerify}
                  placeholder="Are you human? 3 + 1 ="
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#D4A017] outline-none transition font-bold"
                  onChange={handleInputChange}
                />
              </div>

              <button 
                type="submit"
                disabled={isSubmitting}
                className="bg-[#4B2E20] text-white px-10 py-4 rounded-xl font-bold uppercase tracking-widest hover:bg-[#D4A017] transition-all transform hover:scale-102 shadow-lg flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="animate-spin" size={18} /> Sending...
                  </>
                ) : "Submit"}
              </button>
            </form>
          </div>

          {/* RIGHT: Sidebar Info */}
          <div className="space-y-8">
            {/* Address Card */}
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
              <div className="flex items-center gap-3 text-[#D4A017] mb-4">
                <MapPin size={24} />
                <h3 className="text-xl font-bold text-[#4B2E20]">Address</h3>
              </div>
              <p className="text-gray-500 leading-relaxed">
                Bahir Dar, Ethiopia<br />
                Business District, Office #204
              </p>
            </div>

            {/* Help Center Card */}
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
              <div className="flex items-center gap-3 text-[#D4A017] mb-4">
                <HelpCircle size={24} />
                <h3 className="text-xl font-bold text-[#4B2E20]">Help center</h3>
              </div>
              <p className="text-gray-500 mb-6 leading-relaxed">
                Reach out to us today to reach your holiday spot! From planning to travel, we suggest amazing locations with the best offers.
              </p>
              <div className="space-y-4 font-bold text-[#4B2E20]">
                <div className="flex items-center gap-3">
                  <Phone size={18} className="text-[#D4A017]" /> +251 999 999 999
                </div>
                <div className="flex items-center gap-3">
                  <Mail size={18} className="text-[#D4A017]" /> contact@habeshatour.et
                </div>
              </div>
            </div>

            {/* Support Visual */}
            <div className="bg-[#6c6663] rounded-3xl p-8 text-center text-white shadow-xl">
               <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Phone size={32} />
               </div>
               <h3 className="text-lg font-bold mb-2">Need Help?</h3>
               <p className="text-3xl font-black text-[#D4A017]">+251 111 000 111</p>
            </div>
          </div>
        </div>
      </section>

      {/* --- GOOGLE MAPS AREA --- */}
      <div className="w-full h-[400px] bg-gray-200">
        <iframe 
          title="location"
          src="https://maps.google.com/maps?q=Bahir%20Dar&t=&z=13&ie=UTF-8&iwloc=&output=embed"
          className="w-full h-full border-0 grayscale hover:grayscale-0 transition-all duration-500"
          allowFullScreen=""
          loading="lazy"
        ></iframe>
      </div>
    </div>
  );
};

export default Contact;