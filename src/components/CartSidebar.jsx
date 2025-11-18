import React from 'react'
import { useCart } from '../context/CartContext.jsx' // RUTA CORREGIDA
import { Link } from 'react-router-dom'
import { ShoppingCart, X, Minus, Plus, Trash2 } from 'lucide-react' // Usaremos iconos modernos

function CartSidebar() {
  const {
    cart,
    isCartOpen,
    closeCart,
    getTotalPrice,
    getTotalItems,
    removeFromCart,
    updateQuantity,
    clearCart,
  } = useCart()

  const totalPrice = getTotalPrice()
  const totalItems = getTotalItems()

  // Bloquear scroll del cuerpo cuando el carrito está abierto
  React.useEffect(() => {
    if (isCartOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'auto'
    }
    return () => {
      document.body.style.overflow = 'auto'
    }
  }, [isCartOpen])

  return (
    <>
      {/* Overlay oscuro para cerrar */}
      <div
        className={`fixed inset-0 z-40 bg-gray-900 bg-opacity-50 transition-opacity duration-300 ${
          isCartOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={closeCart}
      ></div>

      {/* Sidebar del Carrito */}
      <div
        className={`fixed top-0 right-0 h-full w-full max-w-sm bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out
          ${isCartOpen ? 'translate-x-0' : 'translate-x-full'}
        `}
      >
        <div className="flex flex-col h-full">
          {/* Encabezado */}
          <div className="p-5 border-b border-gray-200 flex justify-between items-center sticky top-0 bg-white">
            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
              <ShoppingCart className="w-6 h-6 text-green-600" />
              Tu Pedido ({totalItems})
            </h2>
            <button onClick={closeCart} className="text-gray-400 hover:text-gray-600 transition-colors">
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Contenido del Carrito (Scrollable) */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {cart.length === 0 ? (
              <div className="text-center py-10">
                <p className="text-gray-500 italic">Tu carrito está vacío. ¡Añade algo delicioso!</p>
                <button
                  onClick={closeCart}
                  className="mt-4 btn bg-green-700 text-white hover:bg-green-800"
                >
                  Ir al Menú
                </button>
              </div>
            ) : (
              cart.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-4 p-3 border border-gray-100 rounded-lg shadow-sm bg-white"
                >
                  <img
                    src={item.image || `https://placehold.co/80x80/1e7d36/ffffff?text=${item.type}`}
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded-md flex-shrink-0"
                    onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = `https://placehold.co/80x80/1e7d36/ffffff?text=${item.type}`;
                    }}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-800 truncate">{item.name}</p>
                    <p className="text-sm text-green-700 font-medium">
                      {(item.price * item.quantity).toFixed(2)} Bs
                    </p>
                  </div>

                  <div className="flex items-center border border-gray-300 rounded-full px-1 py-0.5 flex-shrink-0">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="p-1 text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="font-medium text-sm w-6 text-center">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="p-1 text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>

                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="p-2 text-red-500 hover:text-red-700 rounded-full transition-colors flex-shrink-0"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Pie de página (Totales y Botón de Pago) */}
          {cart.length > 0 && (
            <div className="p-5 border-t border-gray-200 bg-white sticky bottom-0">
              <div className="flex justify-between items-center text-lg font-semibold mb-4">
                <span className="text-gray-700">Subtotal:</span>
                <span className="text-green-700">{totalPrice.toFixed(2)} Bs</span>
              </div>
              <Link
                to="/checkout"
                onClick={closeCart}
                className="btn w-full text-center bg-green-700 text-white hover:bg-green-800 py-3 text-lg font-bold shadow-md"
              >
                Pagar: {totalPrice.toFixed(2)} Bs
              </Link>
              <button onClick={clearCart} className="text-sm text-red-500 hover:underline mt-2 w-full text-center">
                Vaciar Carrito
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  )
}

export default CartSidebar