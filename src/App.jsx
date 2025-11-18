import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { AuthProvider } from "./context/AuthContext"
import { CartProvider } from "./context/CartContext"
import { Toaster } from 'react-hot-toast'

import Navbar from "./components/Navbar"
import Footer from "./components/Footer"
import ScrollToTop from "./components/ScrollToTop"
import ProtectedRoute from "./components/ProtectedRoute"
import CartIcon from "./components/CartIcon"

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

// NUEVAS PÁGINAS DEL CARRITO
import Carrito from "./pages/Carrito"                    // ¡FALTABA!
import ConfirmacionCompra from "./pages/ConfirmacionCompra" // ¡FALTABA!

import "./App.css"

function App() {
  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <div className="min-h-screen flex flex-col">
            <Navbar />
            
            {/* Icono flotante del carrito (visible en toda la app) */}
            {/* <CartIcon /> */}

            <ScrollToTop />

            {/* Contenido principal */}
            <main className="flex-1">
              <Routes>
                {/* Rutas públicas */}
                <Route path="/" element={<Home />} />
                <Route path="/menu" element={<Menu />} />
                <Route path="/delivery" element={<Delivery />} />
                <Route path="/merchandising" element={<Merchandising />} />
                <Route path="/contacto" element={<Contacto />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                {/* RUTAS DEL CARRITO - NUEVAS */}
                <Route path="/carrito" element={<Carrito />} />
                <Route 
                  path="/confirmacion-compra" 
                  element={
                    <ProtectedRoute>
                      <ConfirmacionCompra />
                    </ProtectedRoute>
                  } 
                />

                {/* Rutas protegidas (requieren login) */}
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

                {/* Paneles de administración */}
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

                {/* Ruta 404 opcional */}
                <Route path="*" element={<Home />} />
              </Routes>
            </main>

            <Footer />
          </div>

          {/* Notificaciones globales */}
          <Toaster 
            position="top-center"
            reverseOrder={false}
            gutter={12}
            toastOptions={{
              duration: 4000,
              style: {
                background: '#1e7d36',
                color: '#fff',
                fontSize: '16px',
                borderRadius: '12px',
                padding: '16px',
              },
              success: {
                icon: 'Check',
              },
              error: {
                icon: 'Warning',
              },
            }}
          />
        </CartProvider>
      </AuthProvider>
    </Router>
  )
}

export default App