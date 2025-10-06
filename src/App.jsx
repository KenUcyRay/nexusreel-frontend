import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Login from "./components/Auth/Login"
import Register from "./components/Auth/Register"
import Home from "./components/Pages/Home"
import Footer from "./components/ui/Footer"
import Navbar from "./components/ui/navbar"

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        {/* Routing */}
        <div className="flex-grow">
          <Routes>
            {/* Default route diarahkan ke Login */}
            <Route path="/" element={<Home />} />
            <Route path="/home" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Routes>
        </div>

        {/* Footer selalu tampil */}
        <Footer />
      </div>
    </Router>
  )
}

export default App
