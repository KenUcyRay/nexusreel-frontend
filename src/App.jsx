import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom"
import { AuthProvider } from "./contexts/AuthContext"
import Login from "./components/Auth/Login"
import Register from "./components/Auth/Register"
import Home from "./components/Pages/Home"
import Movies from "./components/Pages/Movies"
import Food from "./components/Pages/Food"
import Booking from "./components/Pages/Booking"
import BookingFlow from "./components/Pages/Booking/BookingFlow"
import Payment from "./components/Pages/Payment"
import BookingSuccess from "./components/Pages/BookingSuccess"
import About from "./components/Pages/About"
import Footer from "./components/ui/Footer"
import Navbar from "./components/ui/MainNavbar"
import History from "./components/User/History"
import Profile from "./components/User/Profile"
import ProtectedRoute from "./components/ProtectedRoute"
import AdminLayout from "./components/Admin/AdminLayout"
import OwnerDashboard from "./components/Owner/OwnerDashboard"
import CashierDashboard from "./components/Cashier/CashierDashboard"
import DetailMovies from "./components/Pages/Detail/DetailMovies"
import Unauthorized from "./components/Pages/Unauthorized"
import NotFound from "./components/Pages/NotFound"
import FoodPayment from "./components/Pages/FoodPayment"

function AppContent() {
  const location = useLocation();
  const isAdminPage = location.pathname.startsWith('/admin');
  
  // Check if user is cashier
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const isCashier = user.role === 'kasir';
  
  // Hide navbar/footer for cashier on booking pages
  const isBookingPage = location.pathname.startsWith('/booking') || location.pathname === '/payment' || location.pathname === '/food-payment' || location.pathname === '/booking-success' || location.pathname.startsWith('/kasir/');
  const hideNavFooter = isCashier && isBookingPage;

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Home />} />
          <Route path="/movies" element={<Movies />} />
          <Route path="/movies/:id" element={<DetailMovies />} />
          <Route path="/food" element={<Food />} />
          <Route path="/food-payment" element={<FoodPayment />} />
          <Route path="/booking" element={<Booking />} />
          <Route path="/booking/:scheduleId" element={<BookingFlow />} />
          <Route path="/payment" element={<Payment />} />
          <Route path="/booking-success" element={<BookingSuccess />} />
          <Route path="/about" element={<About />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route path="/history" element={<History />} />
          <Route path="/profile" element={
            <ProtectedRoute roles={['user']}>
              <Profile />
            </ProtectedRoute>
          } />
          <Route path="/admin/*" element={
            <ProtectedRoute roles={['admin']}>
              <AdminLayout />
            </ProtectedRoute>
          } />
          <Route path="/owner/dashboard" element={
            <ProtectedRoute roles={['owner']}>
              <OwnerDashboard />
            </ProtectedRoute>
          } />
          <Route path="/kasir/dashboard" element={
            <ProtectedRoute roles={['kasir']}>
              <CashierDashboard />
            </ProtectedRoute>
          } />
          <Route path="/kasir/success" element={
            <ProtectedRoute roles={['kasir']}>
              <BookingSuccess />
            </ProtectedRoute>
          } />
          <Route path="/unauthorized" element={<Unauthorized />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>

      {!isAdminPage && !hideNavFooter && <Footer />}
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  )
}

export default App
