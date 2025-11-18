// src/components/CartIcon.jsx
import { Link } from "react-router-dom"
import { useCart } from "../context/CartContext"

export default function CartIcon() {
  const { totalItems } = useCart()  // ← Aquí está la clave

  return (
    <Link
      to="/carrito"
      className="fixed bottom-6 right-6 z-50 bg-green-700 text-white w-14 h-14 rounded-full flex items-center justify-center shadow-2xl hover:bg-green-800 transition-all duration-300 hover:scale-110"
    >
      <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
      
      {totalItems > 0 && (
        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center animate-pulse">
          {totalItems > 99 ? "99+" : totalItems}
        </span>
      )}
    </Link>
  )
}