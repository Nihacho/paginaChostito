// src/pages/Carrito.jsx
import { useState } from "react"
import { useCart } from "../context/CartContext"
import { useAuth } from "../context/AuthContext"
import { useNavigate, Link } from "react-router-dom"
import { collection, addDoc, serverTimestamp } from "firebase/firestore"
import { db } from "../firebase/config"
import toast from "react-hot-toast"

export default function Carrito() {
  const { cart, totalPrice, updateQuantity, removeFromCart, clearCart } = useCart()
  const { user } = useAuth()
  const navigate = useNavigate()

  const [loading, setLoading] = useState(false)

  // IVA 13%
  const iva = totalPrice * 0.13
  const totalFinal = totalPrice + iva

  const handlePurchase = async () => {
    if (loading) return // evita doble clic
    if (!user) {
      toast.error("Debes iniciar sesión para comprar")
      navigate("/login")
      return
    }

    try {
      setLoading(true)

      await addDoc(collection(db, "ordenes"), {
        userId: user.uid,
        userEmail: user.email,
        items: cart,
        subtotal: totalPrice,
        iva: iva,
        total: totalFinal,
        estado: "pendiente",
        createdAt: serverTimestamp()
      })

      clearCart()
      toast.success("¡Compra realizada con éxito!")
      navigate("/confirmacion-compra")
    } catch (error) {
      console.error("Error al guardar orden:", error)
      toast.error("Hubo un error al procesar tu compra")
    } finally {
      setLoading(false)
    }
  }

  // Carrito vacío
  if (cart.length === 0) {
    return (
      <div className="cart-empty-wrapper">
        <div className="cart-empty-card">
          <h1>Tu carrito está vacío 🛒</h1>
          <p>Explora nuestro menú y agrega algo delicioso.</p>
          <Link to="/menu" className="btn-primary">
            Ir al Menú
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="cart-container">
      <br /><br /><br /><br />
      <h1 className="cart-title">Carrito de Compras</h1>

      <div className="cart-grid">
        {/* Lista de productos */}
        <div className="cart-items">
          {cart.map((item) => (
            <div key={item.id} className="cart-item-card">
              <img
                src={item.image || "https://placehold.co/120x120?text=Producto"}
                alt={item.name}
                className="cart-item-img"
              />

              <div className="cart-item-info">
                <h3>{item.name}</h3>
                <span className="cart-price">{item.price} Bs c/u</span>
              </div>

              <div className="cart-quantity">
                <button disabled={loading} onClick={() => updateQuantity(item.id, item.quantity - 1)}>
                  -
                </button>
                <span>{item.quantity}</span>
                <button disabled={loading} onClick={() => updateQuantity(item.id, item.quantity + 1)}>
                  +
                </button>
              </div>

              <button
                disabled={loading}
                onClick={() => removeFromCart(item.id)}
                className="cart-remove"
              >
                ✕
              </button>
            </div>
          ))}
        </div>

        {/* Resumen */}
        <div className="cart-summary">
          <h2>Resumen del Pedido</h2>

          <div className="summary-info">
            <div className="summary-row">
              <span>Subtotal</span>
              <strong>{totalPrice.toFixed(2)} Bs</strong>
            </div>

            <div className="summary-row">
              <span>IVA (13%)</span>
              <strong>{iva.toFixed(2)} Bs</strong>
            </div>

            <div className="summary-row total">
              <span>Total</span>
              <strong>{totalFinal.toFixed(2)} Bs</strong>
            </div>
          </div>

          <button
            className={`btn-primary full ${loading ? "loading" : ""}`}
            onClick={handlePurchase}
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinner"></span> Procesando...
              </>
            ) : user ? (
              "Finalizar Compra"
            ) : (
              "Iniciar sesión para comprar"
            )}
          </button>

          {!user && (
            <p className="login-hint">
              ¿Ya tienes cuenta?{" "}
              <Link to="/login" className="highlight-link">
                Inicia sesión aquí
              </Link>
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
