import React, { useState, useEffect } from 'react';
import { Mail, Lock, User, Eye, EyeOff, ArrowLeft, ArrowRight, RotateCcw, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const Register = () => {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState({});
  const [serverMsg, setServerMsg] = useState({ type: '', text: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (serverMsg.text) {
      const timer = setTimeout(() => setServerMsg({ type: '', text: '' }), 5000);
      return () => clearTimeout(timer);
    }
  }, [serverMsg]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors(prev => ({ ...prev, [e.target.name]: "" }));
    }
  };

  const handleReset = () => {
    setFormData({ fullName: '', email: '', password: '', confirmPassword: '' });
    setErrors({});
    setServerMsg({ type: '', text: '' });
  };

  const validate = () => {
    let newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.fullName.trim()) newErrors.fullName = "Please enter your full name";
    if (!emailRegex.test(formData.email)) newErrors.email = "Please provide a valid email address";
    if (formData.password.length < 8) newErrors.password = "Password must be at least 8 characters";
    if (!/(?=.*[0-9])/.test(formData.password)) newErrors.password = "Include at least one number";
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = "Passwords do not match";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validate()) {
        setServerMsg({ type: 'error', text: 'Please fix the highlighted errors.' });
        return;
    }

    setLoading(true);
    try {
      const response = await fetch('http://localhost/habesha-backend/register.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: formData.fullName,
          email: formData.email,
          password: formData.password
        }),
      });

      const result = await response.json();

      if (response.ok) {
        setServerMsg({ type: 'success', text: 'Welcome! Redirecting to login...' });
        setTimeout(() => navigate('/login'), 2000);
      } else {
        setErrors({ email: true });
        setServerMsg({ type: 'error', text: result.error || "This email is already registered." });
      }
    } catch (error) {
      setServerMsg({ type: 'error', text: "Connection error. Ensure your local server is running." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#B95B2A] flex justify-center items-start px-4 pt-[114px] pb-20 relative font-sans">
      <div className="absolute inset-0 opacity-10 pointer-events-none" 
           style={{ backgroundImage: `radial-gradient(#2D1B14 1px, transparent 1px)`, backgroundSize: '30px 30px' }}></div>

      <div className="relative z-10 bg-white w-full max-w-[440px] rounded-[2.5rem] shadow-2xl p-8 flex flex-col mt-6 overflow-hidden">
        
        {serverMsg.text && (
          <div className={`absolute top-0 left-0 w-full p-4 flex items-center gap-3 text-xs font-bold transition-all duration-300 animate-in slide-in-from-top ${serverMsg.type === 'error' ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
            {serverMsg.type === 'error' ? <AlertCircle size={16} /> : <CheckCircle2 size={16} />}
            {serverMsg.text}
          </div>
        )}

        <button onClick={() => navigate('/login')} className="flex items-center gap-1.5 text-gray-400 font-bold hover:text-[#B95B2A] transition mb-4 mt-4 text-[10px] uppercase tracking-wider">
          <ArrowLeft size={14} /> Back to Login
        </button>

        <div className="text-center mb-8">
          <h1 className="text-3xl font-black tracking-tight text-[#2D1B14] mb-1 uppercase">Join HabeshaTour</h1>
          <p className="text-gray-400 text-xs font-medium">Create an account to explore Ethiopia</p>
        </div>

        <form onSubmit={handleSubmit} className="w-full space-y-5">
          {/* Full Name */}
          <div className="space-y-1.5 group">
            <label className={`block text-[10px] font-bold ml-1 uppercase tracking-[0.15em] transition ${errors.fullName ? 'text-red-500' : 'text-[#2D1B14]'}`}>Full Name</label>
            <div className="relative">
              <User className={`absolute left-4 top-1/2 -translate-y-1/2 transition ${errors.fullName ? 'text-red-500' : 'text-[#B95B2A]'}`} size={16} />
              <input 
                type="text" 
                name="fullName" 
                value={formData.fullName} 
                onChange={handleChange} 
                placeholder="Nimet Yayualem" 
                className={`w-full pl-11 pr-4 py-3.5 bg-gray-50 border rounded-2xl outline-none text-sm transition-all ${errors.fullName ? 'border-red-200 ring-2 ring-red-500/10 animate-shake' : 'border-gray-100 focus:border-[#B95B2A] focus:ring-4 focus:ring-[#B95B2A]/5'}`} 
              />
            </div>
            {errors.fullName && <p className="text-[10px] text-red-500 font-bold ml-1 flex items-center gap-1"><AlertCircle size={10}/> {errors.fullName}</p>}
          </div>

          {/* Email */}
          <div className="space-y-1.5">
            <label className={`block text-[10px] font-bold ml-1 uppercase tracking-[0.15em] transition ${errors.email ? 'text-red-500' : 'text-[#2D1B14]'}`}>Email Address</label>
            <div className="relative">
              <Mail className={`absolute left-4 top-1/2 -translate-y-1/2 transition ${errors.email ? 'text-red-500' : 'text-[#B95B2A]'}`} size={16} />
              <input 
                type="text" 
                name="email" 
                value={formData.email} 
                onChange={handleChange} 
                placeholder="yourname@gmail.com" 
                className={`w-full pl-11 pr-4 py-3.5 bg-gray-50 border rounded-2xl outline-none text-sm transition-all ${errors.email ? 'border-red-200 ring-2 ring-red-500/10 animate-shake' : 'border-gray-100 focus:border-[#B95B2A] focus:ring-4 focus:ring-[#B95B2A]/5'}`} 
              />
            </div>
            {errors.email && <p className="text-[10px] text-red-500 font-bold ml-1 flex items-center gap-1"><AlertCircle size={10}/> {errors.email}</p>}
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <label className={`block text-[10px] font-bold ml-1 uppercase tracking-[0.15em] transition ${errors.password ? 'text-red-500' : 'text-[#2D1B14]'}`}>Password</label>
            <div className="relative">
              <Lock className={`absolute left-4 top-1/2 -translate-y-1/2 transition ${errors.password ? 'text-red-500' : 'text-[#B95B2A]'}`} size={16} />
              <input 
                type={showPassword ? "text" : "password"} 
                name="password" 
                value={formData.password} 
                onChange={handleChange} 
                placeholder="••••••••" 
                className={`w-full pl-11 pr-12 py-3.5 bg-gray-50 border rounded-2xl outline-none text-sm transition-all ${errors.password ? 'border-red-200 ring-2 ring-red-500/10' : 'border-gray-100 focus:border-[#B95B2A] focus:ring-4 focus:ring-[#B95B2A]/5'}`} 
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#B95B2A] transition">
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {errors.password && <p className="text-[10px] text-red-500 font-bold ml-1 flex items-center gap-1"><AlertCircle size={10}/> {errors.password}</p>}
          </div>

          {/* Confirm Password */}
          <div className="space-y-1.5">
            <label className={`block text-[10px] font-bold ml-1 uppercase tracking-[0.15em] transition ${errors.confirmPassword ? 'text-red-500' : 'text-[#2D1B14]'}`}>Confirm Password</label>
            <div className="relative">
              <Lock className={`absolute left-4 top-1/2 -translate-y-1/2 transition ${errors.confirmPassword ? 'text-red-500' : 'text-[#B95B2A]'}`} size={16} />
              <input 
                type={showConfirmPassword ? "text" : "password"} 
                name="confirmPassword" 
                value={formData.confirmPassword} 
                onChange={handleChange} 
                placeholder="••••••••" 
                className={`w-full pl-11 pr-12 py-3.5 bg-gray-50 border rounded-2xl outline-none text-sm transition-all ${errors.confirmPassword ? 'border-red-200 ring-2 ring-red-500/10' : 'border-gray-100 focus:border-[#B95B2A] focus:ring-4 focus:ring-[#B95B2A]/5'}`} 
              />
              <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#B95B2A] transition">
                {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {errors.confirmPassword && <p className="text-[10px] text-red-500 font-bold ml-1 flex items-center gap-1"><AlertCircle size={10}/> {errors.confirmPassword}</p>}
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-3 mt-8">
            <button 
                type="submit" 
                disabled={loading} 
                className="w-full bg-[#B95B2A] text-white py-4 rounded-2xl font-bold text-xs shadow-lg shadow-[#B95B2A]/20 hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-2 uppercase tracking-widest disabled:opacity-70"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>Create Account <ArrowRight size={16} /></>
              )}
            </button>

            <button type="button" onClick={handleReset} className="w-full bg-gray-50 text-gray-400 py-4 rounded-2xl font-bold text-xs hover:bg-gray-100 hover:text-gray-600 transition-all flex items-center justify-center gap-2 uppercase tracking-widest">
              <RotateCcw size={16} /> Reset Form
            </button>
          </div>
        </form>

        <div className="mt-8 pt-5 border-t border-gray-50 text-center text-[11px] text-gray-500 font-medium">
          Already have an account? <Link to="/login" className="text-[#B95B2A] font-bold hover:underline ml-1">Sign In</Link>
        </div>
      </div>

      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-4px); }
          75% { transform: translateX(4px); }
        }
        .animate-shake { animation: shake 0.2s ease-in-out 0s 2; }
      `}</style>
    </div>
  );
};

export default Register;