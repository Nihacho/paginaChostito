import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { AuthProvider } from "./context/AuthContext"
import Navbar from "./components/Navbar"
import Footer from "./components/Footer"
import ScrollToTop from "./components/ScrollToTop"
import ProtectedRoute from "./components/ProtectedRoute"

// Pages
import Home from "./pages/Home"
import Menu from "./pages/Menu"
import Delivery from "./pages/Delivery"
import Merchandising from "./pages/Merchandising"
import Reservar from "./pages/Reservar"
import ConfirmacionReserva from "./pages/ConfirmacionReserva"
import Contacto from "./pages/Contacto"
import Login from "./pages/Login"
import Register from "./pages/Register"
import MisReservas from "./pages/MisReservas"
import Admin from "./pages/Admin"
import AdminTrue from "./pages/AdminTrue"

import "./App.css"

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="App">
          <Navbar />
          <ScrollToTop />
          <Routes>
            {/* Rutas públicas */}
            <Route path="/" element={<Home />} />
            <Route path="/menu" element={<Menu />} />
            <Route path="/delivery" element={<Delivery />} />
            <Route path="/merchandising" element={<Merchandising />} />
            <Route path="/contacto" element={<Contacto />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Rutas protegidas - Requieren autenticación */}
            <Route
              path="/reservar"
              element={
                <ProtectedRoute>
                  <Reservar />
                </ProtectedRoute>
              }
            />
            <Route
              path="/confirmacion-reserva"
              element={
                <ProtectedRoute>
                  <ConfirmacionReserva />
                </ProtectedRoute>
              }
            />
            <Route
              path="/mis-reservas"
              element={
                <ProtectedRoute>
                  <MisReservas />
                </ProtectedRoute>
              }
            />

            {/* Ruta admin - Solo administradores */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute allowedRoles={["empleado", "admin"]}>
                  <Admin />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin-true"
              element={
                <ProtectedRoute requireAdmin={true}>
                  <AdminTrue />
                </ProtectedRoute>
              }
            />
          </Routes>
          <Footer />
        </div>
      </AuthProvider>
    </Router>
  )
}

export default App