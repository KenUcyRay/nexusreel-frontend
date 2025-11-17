import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom"
import { AuthProvider, useAuthContext } from "./contexts/AuthContext"
import { CartProvider } from "./contexts/CartContext"
import Login from "./components/Auth/Login"
import Register from "./components/Auth/Register"
import Home from "./components/Pages/Home"
import Movies from "./components/Pages/Movies"
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
import CashierBooking from "./components/Cashier/CashierBooking"
import CashierBookingFlow from "./components/Cashier/CashierBookingFlow"
import CashierHistory from "./components/Cashier/CashierHistory"
import CashierSuccess from "./components/Cashier/CashierSuccess"
import QRScanner from "./components/Cashier/QRScanner"
import PrintTicket from "./components/Cashier/PrintTicket"
import DetailMovies from "./components/Pages/Detail/DetailMovies"
import Unauthorized from "./components/Pages/Unauthorized"
import NotFound from "./components/Pages/NotFound"

function AppContent() {
  const location = useLocation();
  const isAdminPage = location.pathname.startsWith('/admin');
  
  // Check if user is cashier
  const { user } = useAuthContext();
  const isCashier = user?.role === 'kasir';
  
  // Hide navbar/footer for specific pages
  const isBookingPage = location.pathname.startsWith('/booking') || location.pathname === '/payment' || location.pathname === '/booking-success';
  const isCashierPage = location.pathname.startsWith('/kasir/');
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';
  const isOwnerDashboard = location.pathname === '/owner/dashboard';
  const hideNavFooter = isOwnerDashboard || isCashierPage || (isCashier && isBookingPage);

  return (
    <div className="flex flex-col min-h-screen">
      {!isAdminPage && !hideNavFooter && !isAuthPage && <Navbar />}
      <div className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Home />} />
          <Route path="/movies" element={<Movies />} />
          <Route path="/movies/:id" element={<DetailMovies />} />

          <Route path="/booking" element={
            <ProtectedRoute>
              <Booking />
            </ProtectedRoute>
          } />
          <Route path="/booking/:scheduleId" element={
            <ProtectedRoute>
              <BookingFlow />
            </ProtectedRoute>
          } />
          <Route path="/payment" element={<Payment />} />
          <Route path="/booking-success" element={<BookingSuccess />} />
          <Route path="/about" element={<About />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route path="/history" element={
            <ProtectedRoute>
              <History />
            </ProtectedRoute>
          } />
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
          <Route path="/kasir/booking" element={
            <ProtectedRoute roles={['kasir']}>
              <CashierBooking />
            </ProtectedRoute>
          } />
          <Route path="/kasir/booking/:scheduleId" element={
            <ProtectedRoute roles={['kasir']}>
              <CashierBookingFlow />
            </ProtectedRoute>
          } />

          <Route path="/kasir/history" element={
            <ProtectedRoute roles={['kasir']}>
              <CashierHistory />
            </ProtectedRoute>
          } />
          <Route path="/kasir/success" element={
            <ProtectedRoute roles={['kasir']}>
              <CashierSuccess />
            </ProtectedRoute>
          } />
          <Route path="/kasir/scan-qr" element={
            <ProtectedRoute roles={['kasir']}>
              <QRScanner />
            </ProtectedRoute>
          } />
          <Route path="/kasir/print-ticket" element={
            <ProtectedRoute roles={['kasir']}>
              <PrintTicket />
            </ProtectedRoute>
          } />
          <Route path="/unauthorized" element={<Unauthorized />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>

      {!isAdminPage && !hideNavFooter && !isAuthPage && <Footer />}
    </div>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <AppContent />
        </CartProvider>
      </AuthProvider>
    </Router>
  )
}

export default App