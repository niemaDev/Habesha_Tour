import React, { useState } from 'react';
import { X, Smartphone, CreditCard, Lock, Loader2, ShieldCheck, Plane, Bus } from 'lucide-react';

const PaymentModal = ({ isOpen, onClose, tourDetails, onPaymentSuccess }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('telebirr');
  const [arrivalMethod, setArrivalMethod] = useState(''); // Tracking logistics path ('Airport' or 'Bus')
  
  // Input fields state
  const [phoneNumber, setPhoneNumber] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [cardHolder, setCardHolder] = useState('');
  const [errors, setErrors] = useState({});

  if (!isOpen) return null;

  const validateForm = () => {
    const newErrors = {};

    // 1. Validate Arrival Mode selection requirement
    if (!arrivalMethod) {
      newErrors.arrivalMethod = "Please announce your arrival method for your travel agent guide.";
    }

    // 2. Validate payment service providers
    if (paymentMethod === 'telebirr') {
      if (!phoneNumber.trim()) {
        newErrors.phoneNumber = "Phone number is required.";
      } else if (!/^0[79]\d{8}$/.test(phoneNumber)) {
        newErrors.phoneNumber = "Must be exactly 10 digits starting with 09 or 07 (e.g., 0912345678).";
      }
    } else if (paymentMethod === 'card') {
      if (!accountNumber.trim()) {
        newErrors.accountNumber = "Account/Card number is required.";
      } else if (!/^\d{13}$/.test(accountNumber)) {
        newErrors.accountNumber = "Commercial bank account number must be exactly 13 digits.";
      }

      if (!cardHolder.trim()) {
        newErrors.cardHolder = "Account holder name is required.";
      } else if (cardHolder.trim().length < 3) {
        newErrors.cardHolder = "Please enter a valid full name.";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePaySubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      
      // Save state into constant before cleaning up fields
      const chosenArrival = arrivalMethod;

      setPhoneNumber('');
      setAccountNumber('');
      setCardHolder('');
      setArrivalMethod('');
      setErrors({});
      
      // Send selected arrival back to your parent route context handler
      onPaymentSuccess(chosenArrival); 
    }, 2500);
  };

  return (
    <div className="fixed inset-0 bg-[#2D1B14]/40 backdrop-blur-md z-[999] flex items-center justify-center p-4 transition-all duration-300">
      <div className="bg-white rounded-[2.5rem] max-w-md w-full p-8 relative border border-gray-100 shadow-2xl max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-200">
        
        <button 
          type="button"
          onClick={onClose} 
          className="absolute right-6 top-6 p-2 text-gray-400 hover:bg-gray-50 rounded-full transition"
        >
          <X size={20} />
        </button>

        <h3 className="text-xl font-black text-[#2D1B14] mb-2">Secure Gateway Checkout</h3>
        <p className="text-gray-400 text-sm mb-6">Complete transaction for <span className="font-bold text-gray-700">{tourDetails?.tour_name}</span></p>

        <div className="bg-orange-50/50 p-5 rounded-2xl border border-orange-100/50 text-center mb-6">
          <span className="text-xs text-gray-400 uppercase font-bold tracking-wider block mb-1">TOTAL DUE</span>
          <span className="text-3xl font-black text-[#B95B2A]">{parseFloat(tourDetails?.price || 0).toLocaleString()} ETB</span>
        </div>

        <form onSubmit={handlePaySubmit} className="space-y-5">
          
          {/* ARRIVAL LOGISTICS SELECTION PATTERN */}
          <div className="space-y-3">
            <label className="text-[10px] font-black uppercase text-gray-400 tracking-wider block">
              ANNOUNCE ARRIVAL METHOD TO LOGISTICS TEAM
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => { setArrivalMethod('Airport'); if(errors.arrivalMethod) setErrors(prev => ({...prev, arrivalMethod: null})); }}
                className={`p-3 rounded-xl border text-xs font-bold flex flex-col items-center gap-2 transition outline-none ${
                  arrivalMethod === 'Airport'
                    ? 'border-[#B95B2A] bg-orange-50/20 text-[#B95B2A]'
                    : 'border-gray-100 text-gray-500 hover:bg-gray-50'
                }`}
              >
                <Plane size={18} className={arrivalMethod === 'Airport' ? 'text-[#B95B2A]' : 'text-gray-400'} />
                <span>By Airplane / Flight</span>
              </button>

              <button
                type="button"
                onClick={() => { setArrivalMethod('Bus'); if(errors.arrivalMethod) setErrors(prev => ({...prev, arrivalMethod: null})); }}
                className={`p-3 rounded-xl border text-xs font-bold flex flex-col items-center gap-2 transition outline-none ${
                  arrivalMethod === 'Bus'
                    ? 'border-[#B95B2A] bg-orange-50/20 text-[#B95B2A]'
                    : 'border-gray-100 text-gray-500 hover:bg-gray-50'
                }`}
              >
                <Bus size={18} className={arrivalMethod === 'Bus' ? 'text-[#B95B2A]' : 'text-gray-400'} />
                <span>By Bus / Car Route</span>
              </button>
            </div>
            {errors.arrivalMethod && <p className="text-red-500 text-xs font-semibold mt-1">{errors.arrivalMethod}</p>}
          </div>

          <hr className="border-gray-100" />

          <div className="space-y-3">
            <label className="text-[10px] font-black uppercase text-gray-400 tracking-wider">SELECT PROVIDER</label>
            
            <button 
              type="button"
              onClick={() => { setPaymentMethod('telebirr'); setErrors({}); }}
              className={`w-full flex items-center justify-between p-4 rounded-xl border font-bold text-sm transition ${paymentMethod === 'telebirr' ? 'border-[#B95B2A] bg-orange-50/20 text-[#B95B2A]' : 'border-gray-100 hover:bg-gray-50 text-gray-600'}`}
            >
              <span className="flex items-center gap-3"><Smartphone size={18} /> telebirr / Mobile Wallet</span>
              <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${paymentMethod === 'telebirr' ? 'border-[#B95B2A]' : 'border-gray-300'}`}>
                {paymentMethod === 'telebirr' && <div className="w-2 h-2 bg-[#B95B2A] rounded-full" />}
              </div>
            </button>

            <button 
              type="button"
              onClick={() => { setPaymentMethod('card'); setErrors({}); }}
              className={`w-full flex items-center justify-between p-4 rounded-xl border font-bold text-sm transition ${paymentMethod === 'card' ? 'border-[#B95B2A] bg-orange-50/20 text-[#B95B2A]' : 'border-gray-100 hover:bg-gray-50 text-gray-600'}`}
            >
              <span className="flex items-center gap-3"><CreditCard size={18} /> CBE Birr / Local Debit Card</span>
              <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${paymentMethod === 'card' ? 'border-[#B95B2A]' : 'border-gray-300'}`}>
                {paymentMethod === 'card' && <div className="w-2 h-2 bg-[#B95B2A] rounded-full" />}
              </div>
            </button>
          </div>

          <hr className="border-gray-100" />

          <div className="space-y-4">
            {paymentMethod === 'telebirr' ? (
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase text-gray-400 tracking-wider flex items-center gap-1">
                  <Lock size={10} /> telebirr Account Phone Number
                </label>
                <input 
                  type="text"
                  maxLength={10}
                  placeholder="09XXXXXXXX"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ''))} 
                  disabled={isProcessing}
                  className={`w-full p-4 rounded-xl border font-medium text-sm focus:outline-none focus:border-[#B95B2A] transition bg-gray-50/50 ${errors.phoneNumber ? 'border-red-400 bg-red-50/10' : 'border-gray-200'}`}
                />
                {errors.phoneNumber && <p className="text-red-500 text-xs font-semibold mt-1">{errors.phoneNumber}</p>}
              </div>
            ) : (
              <>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase text-gray-400 tracking-wider flex items-center gap-1">
                    <Lock size={10} /> CBE Account Number (13 digits)
                  </label>
                  <input 
                    type="text"
                    maxLength={13}
                    placeholder="1000XXXXXXXXX"
                    value={accountNumber}
                    onChange={(e) => setAccountNumber(e.target.value.replace(/\D/g, ''))} 
                    disabled={isProcessing}
                    className={`w-full p-4 rounded-xl border font-medium text-sm focus:outline-none focus:border-[#B95B2A] transition bg-gray-50/50 ${errors.accountNumber ? 'border-red-400 bg-red-50/10' : 'border-gray-200'}`}
                  />
                  {errors.accountNumber && <p className="text-red-500 text-xs font-semibold mt-1">{errors.accountNumber}</p>}
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase text-gray-400 tracking-wider">Account Holder Name</label>
                  <input 
                    type="text"
                    placeholder="Abebe Bikila"
                    value={cardHolder}
                    onChange={(e) => setCardHolder(e.target.value)}
                    disabled={isProcessing}
                    className={`w-full p-4 rounded-xl border font-medium text-sm focus:outline-none focus:border-[#B95B2A] transition bg-gray-50/50 ${errors.cardHolder ? 'border-red-400 bg-red-50/10' : 'border-gray-200'}`}
                  />
                  {errors.cardHolder && <p className="text-red-500 text-xs font-semibold mt-1">{errors.cardHolder}</p>}
                </div>
              </>
            )}
          </div>

          <button
            type="submit"
            disabled={isProcessing}
            className="w-full bg-[#B95B2A] text-white py-4 rounded-2xl font-bold hover:bg-[#a04e22] transition-colors shadow-lg shadow-orange-200 disabled:opacity-50 flex items-center justify-center gap-2 mt-2"
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Securing Bank Authorization...
              </>
            ) : (
              `Pay ${parseFloat(tourDetails?.price || 0).toLocaleString()} ETB`
            )}
          </button>

          <div className="flex items-center justify-center gap-1.5 text-green-600 mt-2 text-[11px] font-medium">
            <ShieldCheck size={14} /> Secured via Chapa Gateway Integration
          </div>
        </form>
      </div>
    </div>
  );
};

export default PaymentModal;