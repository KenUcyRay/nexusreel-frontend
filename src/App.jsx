import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
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
import AdminDashboard from "./components/Admin/AdminDashboard"
import OwnerDashboard from "./components/Owner/OwnerDashboard"
import CashierDashboard from "./components/Cashier/CashierDashboard"
import TestLogin from "./components/TestLogin"
import SimpleLogin from "./components/SimpleLogin"
import Dashboard from "./components/Dashboard"
import DebugLogin from "./components/DebugLogin"
import AdvancedDebugLogin from "./components/AdvancedDebugLogin"
import QuickTest from "./components/QuickTest"
import FixedLogin from "./components/FixedLogin"
import ConnectionTest from "./components/ConnectionTest"
import FixedAuthLogin from "./components/FixedAuthLogin"
import SimpleFixedLogin from "./components/SimpleFixedLogin"
import NoCsrfLogin from "./components/NoCsrfLogin"
import SimpleTokenLogin from "./components/SimpleTokenLogin"
import MovieManagement from "./components/Admin/MovieManagement"

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="flex flex-col min-h-screen">
          {/* Routing */}
          <div className="flex-grow">
          <Routes>
            {/* Default route diarahkan ke Login */}
            <Route path="/" element={<Home />} />
            <Route path="/home" element={<Home />} />
            <Route path="/movies" element={<Movies />} />
            <Route path="/food" element={<Food />} />
            <Route path="/booking" element={<Booking />} />
            <Route path="/about" element={<About />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/test-login" element={<TestLogin />} />
            <Route path="/simple-login" element={<SimpleLogin />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/debug-login" element={<DebugLogin />} />
            <Route path="/advanced-debug" element={<AdvancedDebugLogin />} />
            <Route path="/quick-test" element={<QuickTest />} />
            <Route path="/fixed-login" element={<FixedLogin />} />
            <Route path="/connection-test" element={<ConnectionTest />} />
            <Route path="/fixed-auth" element={<FixedAuthLogin />} />
            <Route path="/simple-login" element={<SimpleFixedLogin />} />
            <Route path="/no-csrf" element={<NoCsrfLogin />} />
            <Route path="/token-login" element={<SimpleTokenLogin />} />
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
            <Route path="/admin/dashboard" element={
              <ProtectedRoute roles={['admin']}>
                <AdminDashboard />
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
            <Route path="/admin/movies" element={
              <ProtectedRoute roles={['admin']}>
                <MovieManagement />
              </ProtectedRoute>
            } />
            </Routes>
          </div>

          {/* Footer selalu tampil */}
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  )
}

export default App
