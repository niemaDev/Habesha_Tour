import React from 'react';
import { 
  Users, Globe, Headset, ShieldCheck, 
  Heart, Star, CheckCircle, ArrowRight 
} from 'lucide-react';

const About = () => {
  return (
    <div className=" bg-transparent font-poppins">
      
      {/* --- SECTION 1: HERO --- */}
      <section className="
      justify-center text-center bg-[url('/nature.jpg')] bg-cover bg-center h-screen
      relative min-h-[calc(100vh-214px)] flex items-center  text-white pt-20 pb-40 px-6 md:px-16 lg:px-24 overflow-hidden bg-coffee">
        <div className="absolute inset-0 z-0">
          <img 
            src="/bdr.jpg" 
            alt="Ethiopian Landmarks" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-[#4B2E20]/70" />
        </div>
        <div className="relative z-10 px-4">
          <h1 className="text-5xl md:text-7xl font-serif font-bold uppercase mb-4 tracking-tight">About Us</h1>
          <p className="text-xl md:text-2xl font-light italic text-[#D4A017]">
            Discover the Heart and Soul of Habesha Heritage
          </p>
        </div>
      </section>

      {/* --- SECTION 2: INTRO TEXT --- */}
      <section className="max-w-5xl mx-auto px-6 py-16 text-center">
        <p className="text-lg md:text-xl text-gray-600 leading-relaxed italic">
          Habesha Tour has always taken a step ahead to maintain a fairly individual relationship to all our travelers. 
          We specialize in designer tours that showcase the hidden gems of Ethiopia, from the rock-hewn churches of Lalibela 
          to the vibrant cultures of the Omo Valley.
        </p>
      </section>

      {/* --- SECTION 3: CORE VALUES GRID --- */}
      <section className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <ValueCard 
          icon={<Users className="text-[#D4A017]" size={32} />}
          title="Seamless Travel"
          highlight="Experience"
          desc="From hassle-free booking to on-the-ground support, we make your entire travel experience effortless."
        />
        <ValueCard 
          icon={<Globe className="text-[#D4A017]" size={32} />}
          title="Global"
          highlight="Connections"
          desc="Benefit from our extensive network across Ethiopia, opening doors to exclusive cultural experiences."
        />
        <ValueCard 
          icon={<Headset className="text-[#D4A017]" size={32} />}
          title="H24"
          highlight="Support"
          desc="Travel with peace of mind knowing our dedicated support team is available around the clock."
        />
        <ValueCard 
          icon={<ShieldCheck className="text-[#D4A017]" size={32} />}
          title="Expertise You Can"
          highlight="Trust"
          desc="Our team of local experts ensures every detail of your journey is meticulously planned."
        />
        <ValueCard 
          icon={<Heart className="text-[#D4A017]" size={32} />}
          title="Tailored to Your"
          highlight="Desires"
          desc="We customize every trip to your preferences, ensuring your travel dreams become reality."
        />
        <ValueCard 
          icon={<Star className="text-[#D4A017]" size={32} />}
          title="Exceptional"
          highlight="Value"
          desc="We are committed to delivering the best value, ensuring you get the most out of your budget."
        />
      </section>

      {/* --- SECTION 4: VISION & MISSION --- */}
      <section className="max-w-7xl mx-auto px-6 py-20 border-t border-gray-100">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
          <div>
            <h2 className="text-3xl font-bold text-[#4B2E20] mb-6">Our Vision</h2>
            <p className="text-gray-500 leading-loose">
              To be the premier travel partner of choice for discerning travelers worldwide. We aspire to set 
              industry standards by leveraging our professional expertise, dynamic team, and extensive network 
              to guarantee the best prices and authentic cultural immersions.
            </p>
          </div>
          <div>
            <h2 className="text-3xl font-bold text-[#4B2E20] mb-6">Our Mission</h2>
            <p className="text-gray-500 leading-loose">
              Our mission is to create extraordinary travel experiences that leave an indelible mark on our 
              clients' lives. We are dedicated to maintaining personalized relationships, offering unparalleled 
              customer service, and managing every aspect of your journey with meticulous care.
            </p>
          </div>
        </div>
      </section>

      {/* --- SECTION 5: OUR STORY SPLIT --- */}
      <section className="flex flex-col md:flex-row h-auto md:h-[500px]">
        <div className="w-full md:w-1/2 h-[300px] md:h-full">
          <img src="/city.jpg" alt="Our Story" className="w-full h-full object-cover" />
        </div>
        <div className="w-full md:w-1/2 bg-[#D4A017] flex items-center p-12 lg:p-20">
          <div className="text-white">
            <h2 className="text-4xl font-serif font-bold mb-6 italic uppercase">"Our Story"</h2>
            <p className="leading-relaxed opacity-90">
              At Habesha Tour, our journey is fueled by an unwavering passion for the land of origins. 
              Since our inception, we've been dedicated to crafting travel experiences that transform 
              wanderlust into unforgettable memories. Our reputation as a trusted partner is built 
              on meticulous planning and deep understanding of Ethiopian heritage.
            </p>
          </div>
        </div>
      </section>

      {/* --- SECTION 6: TESTIMONIALS --- */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-center text-4xl font-bold text-[#4B2E20] mb-4">WHAT <span className="text-[#D4A017]">CUSTOMERS</span> SAYS</h2>
          <p className="text-center text-gray-500 mb-12 italic">Satisfied Travelers Share Their Experiences.</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <TestimonialCard name="Abebe Bikila" rating={5} text="Habesha Tour made my dream vacation a reality. Their attention to detail and expert local guides were exceptional!" />
            <TestimonialCard name="Sarah Johnson" rating={4} text="I can't thank the team enough for organizing our family trip. From Lalibela to the South, everything was seamless." />
            <TestimonialCard name="Michael Chen" rating={5} text="Best travel agency in Ethiopia. Their knowledge of the hidden spots is unmatched. Highly recommend!" />
            <TestimonialCard name="Elena Rodriguez" rating={5} text="A truly transformative experience. The cultural immersion they provided was deeper than anything I expected." />
          </div>
        </div>
      </section>

      {/* --- SECTION 7: CALL TO ACTION --- */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="flex flex-col md:flex-row items-center gap-12 bg-transparent rounded-3xl p-8 shadow-2xl border border-gray-100">
          <div className="w-full md:w-1/2">
            <img src="/gojo.jpg" alt="Get Started" className="w-full h-auto" />
          </div>
          <div className="w-full md:w-1/2 space-y-6">
            <h2 className="text-4xl font-bold text-[#4B2E20]">Get started <span className="text-[#D4A017]">with Habesha Tour</span></h2>
            <p className="text-gray-500 italic">Explore, Discover, and Create Unforgettable Memories</p>
            <ul className="space-y-4">
              <Step number="1" text="Personalized Planning" />
              <Step number="2" text="Seamless Booking" />
              <Step number="3" text="Memorable Experiences" />
            </ul>
            <button className="mt-6 bg-[#4B2E20] text-white px-10 py-4 rounded-xl font-bold hover:bg-[#D4A017] transition flex items-center gap-2">
              Start Now <ArrowRight size={20} />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

// --- HELPER COMPONENTS ---

const ValueCard = ({ icon, title, highlight, desc }) => (
  <div className="bg-transparent p-8 rounded-2xl shadow-sm border border-gray-50 hover:shadow-md transition group">
    <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-6 group-hover:bg-[#D4A017]/10 transition">
      {icon}
    </div>
    <h3 className="text-xl font-bold text-[#4B2E20] mb-3">
      {title} <span className="text-[#D4A017]">{highlight}</span>
    </h3>
    <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
  </div>
);

const TestimonialCard = ({ name, rating, text }) => (
  <div className="bg-transparent p-8 rounded-2xl border border-gray-100 shadow-sm">
    <h4 className="text-lg font-bold text-[#4B2E20] mb-4">{name}</h4>
    <p className="text-gray-600 italic mb-6 leading-relaxed">"{text}"</p>
    <div className="flex gap-1">
      {[...Array(5)].map((_, i) => (
        <Star key={i} size={16} fill={i < rating ? "#D4A017" : "none"} className={i < rating ? "text-[#D4A017]" : "text-gray-300"} />
      ))}
    </div>
  </div>
);

const Step = ({ number, text }) => (
  <div className="flex items-center gap-4">
    <div className="w-8 h-8 bg-[#D4A017] text-white rounded-full flex items-center justify-center font-bold text-sm">
      {number}
    </div>
    <span className="text-[#4B2E20] font-medium">{text}</span>
  </div>
);

export default About;