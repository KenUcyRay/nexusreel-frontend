import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom"
import { AuthProvider } from "./contexts/AuthContext"
import Login from "./components/Auth/Login"
import Register from "./components/Auth/Register"
import Home from "./components/Pages/Home"
import Movies from "./components/Pages/Movies"
import Food from "./components/Pages/Food"
import Booking from "./components/Pages/Booking"
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

function AppContent() {
  const location = useLocation();
  const isAdminPage = location.pathname.startsWith('/admin');

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Home />} />
          <Route path="/movies" element={<Movies />} />
          <Route path="/movies/:id" element={<DetailMovies />} />
          <Route path="/food" element={<Food />} />
          <Route path="/booking" element={<Booking />} />
          <Route path="/about" element={<About />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route path="/history" element={
            <ProtectedRoute roles={['user']}>
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
        </Routes>
      </div>

      {!isAdminPage && <Footer />}
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
