import React, { useState, useEffect } from 'react';
import { 
  ChevronLeft, ChevronRight, MapPin, Clock, ArrowRight, 
  Star, ShieldCheck, Globe, Users, Calendar, Compass, 
  Award, Plane, Camera
} from 'lucide-react';
import { Link } from 'react-router-dom';

const Home = () => {
  const slides = [
    {
      id: 1,
      image: "/land.jpg", 
      welcome: "Welcome to Ethiopia",
      title: "Discover the Land of Origins",
      subtitle: "Journey through the ancient rock-hewn churches of Lalibela."
    },
    {
      id: 2,
      image: "/terara.jpg", 
      welcome: "Adventure Awaits",
      title: "Explore the Majestic Simien",
      subtitle: "Trek the rooftop of Africa and see wildlife found nowhere else."
    },
    {
      id: 3,
      image: "/nature.jpg", 
      welcome: "living Museum",
      title: "The Spirit of Omo Valley",
      subtitle: "Meet the vibrant tribes and traditions of Southern Ethiopia."
    }
  ];

  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent(prev => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => setCurrent(current === slides.length - 1 ? 0 : current + 1);
  const prevSlide = () => setCurrent(current === 0 ? slides.length - 1 : current - 1);

  return (
    <div className="bg-#B95B2A font-sans overflow-x-hidden">
      
    
      <section className="relative min-h-[70vh] md:h-[90vh] w-full bg-neutral-900">
        {slides.map((slide, index) => (
          <div 
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              index === current ? "opacity-100 z-10" : "opacity-0 z-0"
            }`}
          >
            <img src={slide.image} className="w-full h-full object-cover" alt="Hero" />
            <div className="absolute inset-0 bg-black/50 z-20" />
            
            <div className="absolute inset-0 z-30 flex flex-col items-center justify-center text-center px-6 py-20">
              <span className="bg-[#D4A017] text-white px-4 py-1.5 md:px-6 md:py-2 rounded-full text-[10px] md:text-sm font-bold uppercase tracking-[0.2em] mb-4 md:mb-6 shadow-xl">
                {slide.welcome}
              </span>
              
              <h1 className="text-3xl md:text-7xl lg:text-8xl font-serif font-bold text-white mb-4 md:mb-6 max-w-5xl leading-tight drop-shadow-2xl">
                {slide.title}
              </h1>
              
              <p className="text-sm md:text-2xl text-neutral-100 mb-8 md:mb-10 max-w-2xl font-light italic drop-shadow-lg">
                {slide.subtitle}
              </p>
            </div>
          </div>
        ))}
        
        <button onClick={prevSlide} className="hidden md:flex absolute left-8 top-1/2 -translate-y-1/2 z-40 p-4 rounded-full bg-white/10 backdrop-blur-md text-white hover:bg-[#D4A017] transition-all">
          <ChevronLeft size={32} />
        </button>
        <button onClick={nextSlide} className="hidden md:flex absolute right-8 top-1/2 -translate-y-1/2 z-40 p-4 rounded-full bg-white/10 backdrop-blur-md text-white hover:bg-[#D4A017] transition-all">
          <ChevronRight size={32} />
        </button>
      </section>

      
      <section className="py-16 md:py-24 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-5xl font-serif font-bold text-[#4B2E20] mb-4">Plan Your <span className="text-[#D4A017]">Perfect Trip</span></h2>
          <div className="w-16 md:w-24 h-1 bg-[#D4A017] mx-auto mb-4"></div>
          <p className="text-neutral-500 italic text-sm md:text-base">Experience Ethiopia exactly how you imagined</p>
        </div>
        {/* Grid: 1 col on mobile, 3 on desktop */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          <StepCard icon={<Compass size={32}/>} title="Choose Destination" desc="Select from the high peaks of Simien to the low Danakil Depression." />
          <StepCard icon={<Calendar size={32}/>} title="Book Your Date" desc="Pick a season that fits your desired cultural festival experience." />
          <StepCard icon={<Plane size={32}/>} title="Fly & Explore" desc="Relax as we handle your logistics from arrival to departure." />
        </div>
      </section>

      {/*  EXPLORE TOP PLACES */}
      <section className="py-16 md:py-24 bg-neutral-50 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center md:items-end mb-12 md:mb-16 gap-4 text-center md:text-left">
          <div>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-[#4B2E20]">Explore <span className="text-[#D4A017]">Top Places</span></h2>
            <p className="text-neutral-500 mt-2 text-sm">Discover the most breathtaking destinations</p>
          </div>
          <Link to="/tours" className="text-[#D4A017] font-bold flex items-center gap-2 hover:translate-x-2 transition-transform text-sm">
            See All Places <ArrowRight size={18} />
          </Link>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-10 max-w-7xl mx-auto">
          <TopPlaceCard img="/alnejashi.jpg" name="Al-Nejashi" tours="12 Tours" />
          <TopPlaceCard img="/terara.jpg" name="Simien Mountains" tours="8 Tours" />
          <TopPlaceCard img="/walya.jpg" name="Gambella" tours="15 Tours" />
          <TopPlaceCard img="/tissabay.jpg" name="TissAbay" tours="12 Tours" />
          <TopPlaceCard img="/gonder.jpg" name="Gonder" tours="8 Tours" />
          <TopPlaceCard img="/camel.jpg" name="Afar" tours="15 Tours" />
        </div>
      </section>

      {/*  WHY CHOOSE US  */}
      <section className="py-16 px-6 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="relative">
          <img 
            src="/bdr.jpg" 
            className="rounded-[2rem] md:rounded-[2.5rem] shadow-xl w-full h-[300px] md:h-[450px] object-cover" 
            alt="Unique" 
          />
          <div className="absolute -bottom-4 -right-4 bg-[#4B2E20] p-4 md:p-6 rounded-2xl md:rounded-[2rem] text-white shadow-xl hidden sm:block">
            <p className="text-2xl md:text-3xl font-bold text-[#D4A017]">100%</p>
            <p className="text-[8px] md:text-[10px] uppercase tracking-widest font-bold">Authentic</p>
          </div>
        </div>

        <div className="text-center lg:text-left">
          <span className="text-[#D4A017] font-bold tracking-widest uppercase text-xs">Our Excellence</span>
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-[#4B2E20] mt-2 mb-8 leading-tight">
            What Makes Us <br/><span className="text-[#D4A017]">Truly Unique?</span>
          </h2>
          
          <div className="space-y-8">
            <ReasonItem icon={<Award size={22}/>} title="Expert Guides" desc="Licensed historians with deep local knowledge." />
            <ReasonItem icon={<Users size={22}/>} title="Cultural Integrity" desc="Direct partnerships with local tribes." />
            <ReasonItem icon={<ShieldCheck size={22}/>} title="Safety & Comfort" desc="Modern transport and premium stays." />
          </div>
        </div>
      </section>

      <section className="py-20 md:py-28 px-6 text-center bg-[#4B2E20] text-white">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-5xl font-serif font-bold mb-6">Get Started with <br/><span className="text-[#D4A017]">Habesha Tour</span></h2>
          <p className="text-neutral-400 text-base md:text-xl mb-10 font-light">
            Don't just travel—discover. Let us craft a journey that connects you with the heart of Ethiopia.
          </p>
          <Link to="/contact" className="inline-block bg-[#D4A017] text-white px-10 py-4 md:px-14 md:py-5 rounded-xl md:rounded-2xl font-bold uppercase hover:scale-105 transition-all">
            Contact Expert
          </Link>
        </div>
      </section>
    </div>
  );
};

/* --- REFINED SUB-COMPONENTS --- */

const StepCard = ({ icon, title, desc }) => (
  <div className="p-8 md:p-12 text-center bg-white rounded-[2rem] md:rounded-[3rem] border border-neutral-100 shadow-sm hover:shadow-md transition-all group">
    <div className="bg-neutral-50 text-[#D4A017] w-16 h-16 md:w-24 md:h-24 flex items-center justify-center rounded-2xl md:rounded-[2rem] mx-auto mb-6 md:mb-8 group-hover:bg-[#D4A017] group-hover:text-white transition-all shadow-inner">
      {icon}
    </div>
    <h3 className="text-xl md:text-2xl font-bold text-[#4B2E20] mb-3 md:mb-4">{title}</h3>
    <p className="text-neutral-500 text-sm md:text-base leading-relaxed">{desc}</p>
  </div>
);

const TopPlaceCard = ({ img, name, tours }) => (
  <div className="group relative h-[350px] md:h-[450px] rounded-[2rem] md:rounded-[3rem] overflow-hidden shadow-lg border-4 md:border-8 border-white">
    <img src={img} className="w-full h-full object-cover group-hover:scale-110 transition duration-700" alt={name} />
    <div className="absolute inset-0 bg-gradient-to-t from-[#4B2E20]/90 via-transparent to-transparent" />
    <div className="absolute bottom-6 left-6 md:bottom-10 md:left-10 text-white text-left">
      <h4 className="text-2xl md:text-3xl font-bold mb-1 md:mb-2">{name}</h4>
      <p className="text-[#D4A017] flex items-center gap-2 font-bold tracking-widest text-[10px] uppercase"><Camera size={14}/> {tours}</p>
    </div>
  </div>
);

const ReasonItem = ({ icon, title, desc }) => (
  <div className="flex flex-col md:flex-row items-center md:items-start gap-4 md:gap-8 group text-center md:text-left">
    <div className="bg-neutral-50 p-4 rounded-xl text-[#D4A017] h-fit group-hover:bg-[#D4A017] group-hover:text-white transition-colors">
      {icon}
    </div>
    <div>
      <h4 className="text-xl md:text-2xl font-bold text-[#4B2E20] mb-1 md:mb-2">{title}</h4>
      <p className="text-neutral-500 text-sm md:text-base leading-relaxed">{desc}</p>
    </div>
  </div>
);

export default Home;