import React, { useState, useEffect } from 'react'; 
import { Search, Filter, Plus, Edit, Trash2, Check, X } from 'lucide-react';
import AddTourModal from './AddTourModal';

const ManageTours = () => {
  const [tours, setTours] = useState([]); 
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Tracking state for editing rows
  const [editingId, setEditingId] = useState(null);
  const [editFormData, setEditFormData] = useState({
    tour_name: '',
    region: '',
    duration: '',
    price: '',
    maxPeople: ''
  });

  const fetchTours = async () => {
    try {
      const response = await fetch('http://localhost/habesha-backend/get_tours.php');
      const data = await response.json();
      
      const cleanedData = data.map(tour => ({
        ...tour,
        tour_name: tour.tour_name || tour.name,
        region: tour.region || 'N/A',
        duration: tour.duration || 'N/A',
        status: tour.status || 'Active',
        maxPeople: tour.capacity || tour.maxPeople || 0 
      }));

      setTours(cleanedData);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching tours:", error);
      setTours([]); 
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTours();
  }, []);

  // DELETE FUNCTIONALITY
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to permanently delete this tour?")) {
      try {
        const response = await fetch('http://localhost/habesha-backend/delete_tour.php', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id })
        });
        
        const result = await response.json();
        if (result.success) {
          // Optimistically remove the deleted tour from state immediately
          setTours(tours.filter(t => t.id !== id));
        } else {
          alert("Error: " + (result.message || "Failed to delete tour."));
        }
      } catch (error) {
        console.error("Connection error during deletion:", error);
        alert("Failed to reach backend server.");
      }
    }
  };

  // EDIT ACTIVATION
  const startEditing = (t) => {
    setEditingId(t.id);
    setEditFormData({
      tour_name: t.tour_name || '',
      region: t.region || '',
      duration: t.duration || '',
      price: t.price || '',
      maxPeople: t.maxPeople || 0
    });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditFormData(prev => ({ ...prev, [name]: value }));
  };

  // SAVE EDIT UPDATES
  const handleSaveEdit = async (id) => {
    try {
      const updateData = {
        id: id,
        tour_name: editFormData.tour_name,
        region: editFormData.region,
        duration: editFormData.duration,
        price: parseFloat(editFormData.price) || 0,
        capacity: parseInt(editFormData.maxPeople, 10) || 0 // Maps back to backend column
      };

      const response = await fetch('http://localhost/habesha-backend/update_tour.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateData)
      });

      const result = await response.json();
      if (result.success) {
        // Correctly match properties so UI viewing mode updates properly
        setTours(prevTours =>
          prevTours.map(t =>
            t.id === id
              ? {
                  ...t,
                  tour_name: editFormData.tour_name,
                  region: editFormData.region,
                  duration: editFormData.duration,
                  price: editFormData.price,
                  maxPeople: editFormData.maxPeople
                }
              : t
          )
        );
        
        // Exits editing mode and resets display icons
        setEditingId(null);
      } else {
        alert("Error: " + (result.message || "Failed to update tour data."));
      }
    } catch (error) {
      console.error("Connection error during update:", error);
      alert("Failed to update backend records.");
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-pulse text-[#B95B2A] font-bold text-xl">Loading Ethiopia Tours...</div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <AddTourModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onTourAdded={fetchTours}
      />
      
      <div className="flex justify-between items-center mb-8 gap-4">
        <div className="relative flex-grow max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input 
            type="text" 
            placeholder="Search tours..." 
            className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-orange-200 outline-none" 
          />
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-5 py-3 border border-gray-200 rounded-xl font-bold text-[#2D1B14] hover:bg-gray-50 transition">
            <Filter size={18}/> Filter
          </button>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 bg-[#B95B2A] text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-orange-100 hover:brightness-110 transition"
          >
            <Plus size={18}/> Add Tour
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="text-gray-400 font-bold border-b border-gray-50 text-sm">
              <th className="pb-4 px-4">Tour Name</th>
              <th className="pb-4 px-4">Region</th>
              <th className="pb-4 px-4">Duration</th>
              <th className="pb-4 px-4">Price</th>
              <th className="pb-4 px-4 text-center">Max People</th>
              <th className="pb-4 px-4">Status</th>
              <th className="pb-4 px-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {tours.map((t) => (
              <tr key={t.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition">
                {editingId === t.id ? (
                  <>
                    <td className="py-3 px-2">
                      <input 
                        type="text" 
                        name="tour_name" 
                        value={editFormData.tour_name} 
                        onChange={handleEditChange}
                        className="w-full border rounded-lg px-2 py-1.5 font-bold text-sm outline-none border-orange-200"
                      />
                    </td>
                    <td className="py-3 px-2">
                      <input 
                        type="text" 
                        name="region" 
                        value={editFormData.region} 
                        onChange={handleEditChange}
                        className="w-full border rounded-lg px-2 py-1.5 text-sm outline-none border-orange-200"
                      />
                    </td>
                    <td className="py-3 px-2">
                      <input 
                        type="text" 
                        name="duration" 
                        value={editFormData.duration} 
                        onChange={handleEditChange}
                        className="w-full border rounded-lg px-2 py-1.5 text-sm outline-none border-orange-200"
                      />
                    </td>
                    <td className="py-3 px-2">
                      <input 
                        type="number" 
                        name="price" 
                        value={editFormData.price} 
                        onChange={handleEditChange}
                        className="w-full border rounded-lg px-2 py-1.5 font-bold text-sm outline-none border-orange-200"
                      />
                    </td>
                    <td className="py-3 px-2 max-w-[80px]">
                      <input 
                        type="number" 
                        name="maxPeople" 
                        value={editFormData.maxPeople} 
                        onChange={handleEditChange}
                        className="w-full border rounded-lg px-2 py-1.5 text-center text-sm outline-none border-orange-200"
                      />
                    </td>
                    <td className="py-3 px-4">
                      <span className="bg-orange-50 text-orange-600 px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider">
                        Editing
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex justify-center gap-2">
                        <button 
                          onClick={() => handleSaveEdit(t.id)} 
                          className="text-emerald-600 hover:bg-emerald-50 p-2 rounded-lg transition"
                          title="Save changes"
                        >
                          <Check size={18}/>
                        </button>
                        <button 
                          onClick={() => setEditingId(null)} 
                          className="text-gray-400 hover:bg-gray-100 p-2 rounded-lg transition"
                          title="Cancel"
                        >
                          <X size={18}/>
                        </button>
                      </div>
                    </td>
                  </>
                ) : (
                  <>
                    <td className="py-5 px-4 font-bold text-[#2D1B14]">{t.tour_name}</td>
                    <td className="py-5 px-4 text-gray-500 font-medium">{t.region}</td>
                    <td className="py-5 px-4 text-gray-500 font-medium">{t.duration}</td>
                    <td className="py-5 px-4 font-bold text-[#B95B2A]">{parseFloat(t.price || 0).toLocaleString()} ETB</td>
                    <td className="py-5 px-4 text-gray-500 font-medium text-center">{t.maxPeople}</td>
                    <td className="py-5 px-4">
                      <span className="bg-green-50 text-green-600 px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider">
                        {t.status}
                      </span>
                    </td>
                    <td className="py-5 px-4">
                      <div className="flex justify-center gap-3">
                        <button 
                          onClick={() => startEditing(t)}
                          className="text-[#B95B2A] hover:bg-orange-50 p-2 rounded-lg transition"
                        >
                          <Edit size={18}/>
                        </button>
                        <button 
                          onClick={() => handleDelete(t.id)}
                          className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition"
                        >
                          <Trash2 size={18}/>
                        </button>
                      </div>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
        
        {tours.length === 0 && (
          <div className="py-20 text-center flex flex-col items-center">
            <div className="text-gray-300 mb-2 font-medium">No tours found in your database.</div>
            <button 
               onClick={() => setIsModalOpen(true)}
               className="text-[#B95B2A] font-bold hover:underline"
            >
              Add your first tour
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageTours;