"use client"

import logo from "../assets/Chostito.png"
import { useState, useEffect } from "react"
import { Link, useLocation } from "react-router-dom"

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const location = useLocation()

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
        </div>
      )}
    </nav>
  )
}

export default Navbar
