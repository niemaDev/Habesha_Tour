import React from "react";
import { Routes, Route } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import AdminLayout from "./layouts/AdminLayout";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import ScrollToTop from "./components/ScrollToTop";

// Public Pages
import Home from "./pages/Home";
import Tours from "./pages/Tours";
import TourDetails from "./pages/TourDetails";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Contact from "./pages/Contact";
import About from "./pages/About";
import Destinations from "./pages/Destinations";
import DestinationDetail from "./pages/DestinationDetail";


import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import BookingPage from "./pages/BookingPage";
import PaymentModal from "./pages/PaymentModal";
import AdminDashboard from "./pages/AdminDashboard";
import ManageTours from "./pages/admin/ManageTours";
import Reports from "./pages/admin/Reports";
import BookingMonitor from "./pages/admin/BookingMonitor";

function App() {
  return (
   
    <div className="min-h-screen w-full flex flex-col bg-[#F8F9FA] text-[#2D1B14] overflow-x-hidden">
      
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="tours" element={<Tours />} />
          <Route path="tour/:id" element={<TourDetails />} />
          <Route path="/tour/:id" element={<TourDetails />} />
          <Route path="login" element={<Login />} />
          <Route path="contact" element={<Contact />} />
          <Route path="destinations-list" element={<Destinations />} />
          <Route path="destinations/:regionId" element={<DestinationDetail />} />
          <Route path="about" element={<About />} />
          <Route path="signup" element={<Register />} />
          
          <Route element={<ProtectedRoute allowedRoles={['customer', 'admin']} />}>
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="booking" element={<BookingPage />} />
            <Route path="profile" element={<Profile/>} />
          </Route>
        </Route>

        {/* 2. ADMIN ROUTES */}
        {/* AdminLayout handles the Mobile Toggle Sidebar */}
        <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="tours" element={<ManageTours />} />
            <Route path="reports" element={<Reports />} />
            <Route path="bookings" element={<BookingMonitor />} />
          </Route>
        </Route>
      </Routes>
    </div>
  );
}

export default App;