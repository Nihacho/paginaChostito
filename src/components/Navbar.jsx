"use client"

import logo from "../assets/Chostito.png"
import { useState, useEffect } from "react"
import { useAuth } from "../context/AuthContext"
import { useNavigate } from "react-router-dom"
import { Link, useLocation } from "react-router-dom"

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const { user, userData, logout } = useAuth()
  const [userMenuOpen, setUserMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true)
      } else {
        setScrolled(false)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
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

  // Obtener inicial del usuario
  const getUserInitial = () => {
    if (userData?.nombre) {
      return userData.nombre.charAt(0).toUpperCase()
    }
    if (user?.displayName) {
      return user.displayName.charAt(0).toUpperCase()
    }
    return user?.email?.charAt(0).toUpperCase() || 'U'
  }

  return (
    <nav
      className={`navbar ${scrolled ? "bg-green-800" : "bg-green-700"}`}
      style={{ transition: "background-color 0.3s ease" }}
    >
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
          <Link to="/" className={location.pathname === "/" ? "text-green-200" : ""}>
            Home
          </Link>
          <Link to="/menu" className={location.pathname === "/menu" ? "text-green-200" : ""}>
            Menú
          </Link>
          <Link to="/delivery" className={location.pathname === "/delivery" ? "text-green-200" : ""}>
            Delivery
          </Link>
          <Link to="/merchandising" className={location.pathname === "/merchandising" ? "text-green-200" : ""}>
            Merchandising
          </Link>
          <Link to="/reservar" className={location.pathname === "/reservar" ? "text-green-200" : ""}>
            Reservar
          </Link>
          <Link to="/mis-reservas" className={location.pathname === "/mis-reservas" ? "text-green-200" : ""}>
            Mis Reservas
          </Link>
        </div>

        {/* User area - SIMPLIFICADO */}
        <div className="ml-4 relative user-menu-container">
          {user ? (
            <div className="relative">
              {/* Avatar circular con inicial */}
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="w-10 h-10 rounded-full bg-white text-green-700 flex items-center justify-center font-bold text-lg hover:bg-green-50 transition-all duration-200 shadow-md hover:shadow-lg"
                title={user.email}
              >
                {getUserInitial()}
              </button>

              {/* Dropdown menu simple */}
              {userMenuOpen && (
                <div className="origin-top-right absolute right-0 mt-2 w-56 rounded-lg shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50 overflow-hidden">
                  {/* Correo del usuario */}
                  <div className="px-4 py-3 border-b border-gray-200">
                    <p className="text-sm text-gray-900 truncate font-medium">
                      {user.email}
                    </p>
                  </div>

                  {/* Botón cerrar sesión */}
                  <div className="py-1">
                    <button
                      onClick={async () => {
                        await logout()
                        setUserMenuOpen(false)
                        navigate("/")
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                    >
                      Cerrar sesión
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <Link 
                to="/login" 
                className="px-4 py-2 text-white hover:text-green-200 transition-colors font-medium"
              >
                Iniciar sesión
              </Link>
              <Link 
                to="/register" 
                className="px-4 py-2 text-white hover:text-green-200 transition-colors font-medium"
              >
                Registrarse
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Navigation Button */}
        <button className="navbar-toggle" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line>
          </svg>
        </button>
      </div>

      {/* Mobile Navigation Menu */}
      {isMenuOpen && (
        <div className="mobile-menu">
          <Link
            to="/"
            onClick={() => setIsMenuOpen(false)}
            className={location.pathname === "/" ? "text-green-200" : ""}
          >
            Home
          </Link>
          <Link
            to="/menu"
            onClick={() => setIsMenuOpen(false)}
            className={location.pathname === "/menu" ? "text-green-200" : ""}
          >
            Menú
          </Link>
          <Link
            to="/delivery"
            onClick={() => setIsMenuOpen(false)}
            className={location.pathname === "/delivery" ? "text-green-200" : ""}
          >
            Delivery
          </Link>
          <Link
            to="/merchandising"
            onClick={() => setIsMenuOpen(false)}
            className={location.pathname === "/merchandising" ? "text-green-200" : ""}
          >
            Merchandising
          </Link>
          <Link
            to="/reservar"
            onClick={() => setIsMenuOpen(false)}
            className={location.pathname === "/reservar" ? "text-green-200" : ""}
          >
            Reservar
          </Link>
          <Link
            to="/mis-reservas"
            onClick={() => setIsMenuOpen(false)}
            className={location.pathname === "/mis-reservas" ? "text-green-200" : ""}
          >
            Mis Reservas
          </Link>

          {/* Mobile user section */}
          {user && (
            <>
              <div className="border-t border-green-600 my-2"></div>
              <div className="px-4 py-2 text-green-100 text-sm">
                {user.email}
              </div>
              <button
                onClick={async () => {
                  await logout()
                  setIsMenuOpen(false)
                  navigate("/")
                }}
                className="w-full text-left text-red-300 hover:text-red-200"
              >
                Cerrar sesión
              </button>
            </>
          )}
        </div>
      )}
    </nav>
  )
}

export default Navbar