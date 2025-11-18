import { useLocation, useNavigate, Link } from 'react-router-dom'
import { useEffect } from 'react'

function ConfirmacionCompra() {
  const location = useLocation()
  const navigate = useNavigate()
  const { orderId, orderData } = location.state || {}

  useEffect(() => {
    // Si no hay datos de orden, redirigir al inicio
    if (!orderId) {
      navigate('/')
    }
  }, [orderId, navigate])

  if (!orderData) {
    return null
  }

  return (
    <div className="container py-12">
      <br /><br /><br />
      
      <div className="max-w-2xl mx-auto">
        {/* Mensaje de éxito */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-4">
            <svg
              className="h-12 w-12 text-green-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          
          <h1 className="section-title text-green-700">¡Compra Realizada con Éxito!</h1>
          <div className="section-divider"></div>
          <p className="text-lg text-gray-600">
            Tu pedido ha sido registrado correctamente
          </p>
        </div>

        {/* Detalles de la orden */}
        <div className="card p-6 mb-6">
          <div className="border-b border-gray-200 pb-4 mb-4">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Detalles del Pedido</h2>
            <p className="text-sm text-gray-600">ID de orden: <span className="font-mono text-green-700">{orderId}</span></p>
          </div>

          {/* Items */}
          <div className="space-y-3 mb-4">
            {orderData.items.map((item, index) => (
              <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100">
                <div className="flex-1">
                  <p className="font-medium text-gray-800">{item.name}</p>
                  <p className="text-sm text-gray-500">
                    {item.quantity} x {item.price.toFixed(2)} Bs
                  </p>
                </div>
                <p className="font-semibold text-gray-800">
                  {item.subtotal.toFixed(2)} Bs
                </p>
              </div>
            ))}
          </div>

          {/* Total */}
          <div className="border-t-2 border-gray-200 pt-4">
            <div className="flex justify-between items-center">
              <span className="text-xl font-bold text-gray-800">Total:</span>
              <span className="text-2xl font-bold text-green-700">
                {orderData.total.toFixed(2)} Bs
              </span>
            </div>
          </div>
        </div>

        {/* Información adicional */}
        <div className="bg-green-50 rounded-lg p-6 mb-6">
          <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
            <svg className="h-5 w-5 text-green-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            ¿Qué sigue?
          </h3>
          <ul className="space-y-2 text-sm text-gray-700">
            <li className="flex items-start gap-2">
              <span className="text-green-700 mt-1">✓</span>
              <span>Recibirás un correo de confirmación en <strong>{orderData.email}</strong></span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-700 mt-1">✓</span>
              <span>Nuestro equipo procesará tu pedido en las próximas 24 horas</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-700 mt-1">✓</span>
              <span>Te contactaremos para coordinar el método de pago y entrega</span>
            </li>
          </ul>
        </div>

        {/* Botones de acción */}
        <div className="flex gap-4 justify-center">
          <Link to="/menu" className="btn bg-green-700 text-white hover:bg-green-800">
            Seguir Comprando
          </Link>
          <Link to="/" className="btn bg-gray-200 text-gray-700 hover:bg-gray-300">
            Volver al Inicio
          </Link>
        </div>
      </div>
    </div>
  )
}

export default ConfirmacionCompra