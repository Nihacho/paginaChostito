// src/context/CartContext.jsx
import { createContext, useContext, useState, useEffect } from "react"
import toast from "react-hot-toast"

const CartContext = createContext()

export const useCart = () => useContext(CartContext)

export function CartProvider({ children }) {
  const [cart, setCart] = useState([])

  // Cargar carrito desde localStorage al iniciar
  useEffect(() => {
    const savedCart = localStorage.getItem("chostito-cart")
    if (savedCart) {
      setCart(JSON.parse(savedCart))
    }
  }, [])

  // Guardar en localStorage cada vez que cambie
  useEffect(() => {
    localStorage.setItem("chostito-cart", JSON.stringify(cart))
  }, [cart])

  const addToCart = (product, quantity = 1) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id)
      if (existing) {
        toast.success(`¡${quantity} ${product.name} más añadidos!`)
        return prev.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        )
      }
      toast.success(`${product.name} añadido al carrito`)
      return [...prev, { ...product, quantity }]
    })
  }

  const updateQuantity = (id, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(id)
      return
    }
    setCart(prev => prev.map(item =>
      item.id === id ? { ...item, quantity: newQuantity } : item
    ))
  }

  const removeFromCart = (id) => {
    setCart(prev => {
      const removed = prev.find(i => i.id === id)
      toast.success(`${removed.name} eliminado del carrito`)
      return prev.filter(item => item.id !== id)
    })
  }

  const clearCart = () => setCart([])

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0)
  const totalPrice = cart.reduce((sum, item) => sum + (parseFloat(item.price) * item.quantity), 0).toFixed(2)

  const value = {
    cart,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    totalItems,
    totalPrice: parseFloat(totalPrice)
  }

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  )
}