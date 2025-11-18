"use client"

import logo from "../assets/Chostito.png"
import { useState, useEffect } from "react"
import { useAuth } from "../context/AuthContext"
import { useNavigate, Link, useLocation } from "react-router-dom"

// NUEVO: Importamos el contexto del carrito
import { useCart } from "../context/CartContext"  // <-- Crea este archivo después

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const { user, userData, logout } = useAuth()

  // NUEVO: Obtenemos la cantidad de items del carrito
  const { cartItemCount } = useCart()

  const [userMenuOpen, setUserMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Cerrar menú de usuario al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuOpen && !event.target.closest('.user-menu-container')) {
        setUserMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [userMenuOpen])

  const getUserInitial = () => {
    if (userData?.nombre) return userData.nombre.charAt(0).toUpperCase()
    if (user?.displayName) return user.displayName.charAt(0).toUpperCase()
    return user?.email?.charAt(0).toUpperCase() || 'U'
  }

  // Ícono del carrito (SVG limpio y bonito)
  const CartIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
      <circle cx="9" cy="21" r="1" />
      <circle cx="20" cy="21" r="1" />
      <path d="M1 1h4l2.68 12.08a2 2 0 0 0 2 1.92h9.72a2 2 0 0 0 2-1.92L23 6H6" />
    </svg>
  )

  return (
    <nav className={`navbar ${scrolled ? "bg-green-800" : "bg-green-700"}`} style={{ transition: "background-color 0.3s ease" }}>
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <div className="logo-image">
            <img
              src={logo}
              alt="Café Chostito Logo"
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.onerror = null
                e.target.src = "https://placehold.co/200x200/1e7d36/ffffff?text=CC"
              }}
            />
          </div>
          <span className="logo-text hidden sm:block">Coffe Chostito</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="navbar-links">
          <Link to="/" className={location.pathname === "/" ? "text-green-200" : ""}>Home</Link>
          <Link to="/menu" className={location.pathname === "/menu" ? "text-green-200" : ""}>Menú</Link>
          <Link to="/delivery" className={location.pathname === "/delivery" ? "text-green-200" : ""}>Delivery</Link>
          <Link to="/merchandising" className={location.pathname === "/merchandising" ? "text-green-200" : ""}>Merchandising</Link>
          <Link to="/reservar" className={location.pathname === "/reservar" ? "text-green-200" : ""}>Reservar</Link>
          <Link to="/mis-reservas" className={location.pathname === "/mis-reservas" ? "text-green-200" : ""}>Mis Reservas</Link>
        </div>

        {/* Área de usuario + CARRITO */}
        <div className="ml-4 relative user-menu-container flex items-center gap-4">

          {/* CARRITO DE COMPRAS - NUEVO */}
          <Link
            to="/carrito"
            className="relative p-2 rounded-full hover:bg-white/20 transition-all duration-200 group"
            title="Carrito de compras"
          >
            <CartIcon />
            {cartItemCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold min-w-5 h-5 flex items-center justify-center rounded-full border-2 border-white shadow-lg animate-pulse">
                {cartItemCount > 99 ? '99+' : cartItemCount}
              </span>
            )}
          </Link>

          {/* Usuario logueado o botones de login */}
          {user ? (
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="w-10 h-10 rounded-full bg-white text-green-700 flex items-center justify-center font-bold text-lg hover:bg-green-50 transition-all duration-200 shadow-md hover:shadow-lg"
                title={user.email}
              >
                {getUserInitial()}
              </button>

              {userMenuOpen && (
                <div className="origin-top-right absolute right-0 mt-2 w-56 rounded-lg shadow-xl bg-white ring-1 ring-black ring-opacity-5 z-50 overflow-hidden">
                  <div className="px-4 py-3 border-b border-gray-200 bg-green-50">
                    <p className="text-sm font-medium text-gray-900 truncate">{user.email}</p>
                  </div>
                  <div className="py-1">
                    <button
                      onClick={async () => {
                        await logout()
                        setUserMenuOpen(false)
                        navigate("/")
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-red-50 transition-colors"
                    >
                      Cerrar sesión
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="hidden md:flex items-center gap-3">
              <Link to="/login" className="px-4 py-2 text-white hover:text-green-200 font-medium transition">
                Iniciar sesión
              </Link>
              <span className="text-white/50">|</span>
              <Link to="/register" className="px-4 py-2 text-white hover:text-green-200 font-medium transition">
                Registrarse
              </Link>
            </div>
          )}

          {/* Botón menú móvil */}
          <button className="navbar-toggle" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
          </button>
        </div>
      </div>

      {/* Menú móvil */}
      {isMenuOpen && (
        <div className="mobile-menu">
          {/* ... tus links móviles ... */}
          <Link to="/carrito" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-3 px-4 py-3 hover:bg-green-700/50">
            <CartIcon />
            <span>Carrito ({cartItemCount})</span>
          </Link>
          {/* resto de links móviles como ya tenías */}
        </div>
      )}
    </nav>
  )
}

export default Navbar