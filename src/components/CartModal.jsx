import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { db } from '../firebase/config'
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'
import toast from 'react-hot-toast'

function CartModal({ isOpen, onClose }) {
  const { cart, removeFromCart, updateQuantity, getTotalPrice, clearCart } = useCart()
  const { user, userData } = useAuth()
  const navigate = useNavigate()
  const total = getTotalPrice()

  // Cerrar modal con tecla ESC
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose()
    }
    if (isOpen) {
      document.addEventListener('keydown', handleEsc)
      document.body.style.overflow = 'hidden'
    }
    return () => {
      document.removeEventListener('keydown', handleEsc)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, onClose])

  // Manejar compra
  const handlePurchase = async () => {
    if (!user) {
      toast.error('Debes iniciar sesión para comprar')
      navigate('/login')
      return
    }

    if (cart.length === 0) {
      toast.error('Tu carrito está vacío')
      return
    }

    try {
      // Crear orden en Firestore
      const orderData = {
        userId: user.uid,
        userName: userData?.nombre || user.displayName || 'Usuario',
        email: user.email,
        items: cart.map(item => ({
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          type: item.type,
          subtotal: item.price * item.quantity
        })),
        total: total,
        fecha: serverTimestamp(),
        estado: 'pendiente',
        metodoPago: 'Por definir'
      }

      const docRef = await addDoc(collection(db, 'ordenes'), orderData)
      
      // Limpiar carrito
      clearCart()
      onClose()

      // Mostrar confirmación
      toast.success('¡Compra realizada con éxito!', {
        duration: 4000,
        icon: '🎉'
      })

      // Redirigir a confirmación
      navigate('/confirmacion-compra', { 
        state: { 
          orderId: docRef.id,
          orderData: orderData
        } 
      })

    } catch (error) {
      console.error('Error al crear orden:', error)
      toast.error('Error al procesar la compra. Intenta nuevamente.')
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Overlay oscuro */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      />

      {/* Modal container */}
      <div className="absolute inset-y-0 right-0 max-w-full flex">
        <div className="w-screen max-w-md">
          <div className="h-full flex flex-col bg-white shadow-xl">
            
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 bg-green-700 text-white">
              <h2 className="text-xl font-bold">Tu Carrito</h2>
              <button
                onClick={onClose}
                className="text-white hover:text-gray-200 transition-colors"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Cart content */}
            <div className="flex-1 overflow-y-auto px-6 py-4">
              {cart.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <svg className="h-24 w-24 text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                  <h3 className="text-xl font-semibold text-gray-700 mb-2">Tu carrito está vacío</h3>
                  <p className="text-gray-500 mb-4">¡Agrega productos para comenzar!</p>
                  <button
                    onClick={onClose}
                    className="btn"
                  >
                    Ver Menú
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {cart.map((item) => (
                    <div key={item.id} className="card p-4">
                      <div className="flex gap-4">
                        {/* Imagen */}
                        <div className="w-20 h-20 flex-shrink-0 rounded overflow-hidden">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.target.src = `https://placehold.co/200x200/1e7d36/ffffff?text=${item.name.charAt(0)}`
                            }}
                          />
                        </div>

                        {/* Info del producto */}
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-gray-800 truncate">{item.name}</h3>
                          <p className="text-sm text-gray-500 capitalize">{item.type === 'menu' ? 'Menú' : 'Merchandising'}</p>
                          <p className="font-bold text-green-700 mt-1">{item.price.toFixed(2)} Bs</p>

                          {/* Controles de cantidad */}
                          <div className="flex items-center gap-2 mt-2">
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="w-7 h-7 rounded bg-gray-200 hover:bg-gray-300 flex items-center justify-center transition-colors"
                            >
                              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                              </svg>
                            </button>
                            
                            <span className="w-10 text-center font-semibold">{item.quantity}</span>
                            
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="w-7 h-7 rounded bg-gray-200 hover:bg-gray-300 flex items-center justify-center transition-colors"
                            >
                              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                              </svg>
                            </button>

                            <button
                              onClick={() => removeFromCart(item.id)}
                              className="ml-auto text-red-500 hover:text-red-700 transition-colors"
                              title="Eliminar"
                            >
                              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </div>

                          {/* Subtotal */}
                          <p className="text-sm text-gray-600 mt-1">
                            Subtotal: <span className="font-semibold">{(item.price * item.quantity).toFixed(2)} Bs</span>
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer con total y botones */}
            {cart.length > 0 && (
              <div className="border-t border-gray-200 px-6 py-4 bg-gray-50">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-lg font-semibold text-gray-700">Total:</span>
                  <span className="text-2xl font-bold text-green-700">{total.toFixed(2)} Bs</span>
                </div>

                <button
                  onClick={handlePurchase}
                  className="w-full btn bg-green-700 text-white hover:bg-green-800 py-3 text-lg font-semibold mb-2"
                >
                  {user ? 'Finalizar Compra' : 'Inicia sesión para comprar'}
                </button>

                <button
                  onClick={() => {
                    if (confirm('¿Estás seguro de vaciar el carrito?')) {
                      clearCart()
                    }
                  }}
                  className="w-full text-red-600 hover:text-red-700 text-sm font-medium transition-colors"
                >
                  Vaciar carrito
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default CartModal