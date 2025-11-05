function Delivery() {
  return (
    <div className="container py-8">
      <br />
      <br />
      <br />
      <br />
      <h1 className="section-title">Servicio de Delivery</h1>
      <div className="section-divider"></div>

      <p className="text-center text-lg mb-10 max-w-2xl mx-auto">
        Disfruta de nuestros productos favoritos sin salir de casa. Trabajamos con las mejores plataformas de delivery
        para llevarte la experiencia Café Chostito donde estés.
      </p>

      <div className="grid sm-grid-cols-2 lg-grid-cols-4 gap-6">
        {deliveryServices.map((service, index) => (
          <a key={index} href="#" className="card transform transition-transform hover:scale-105">
            <img
              src={service.image || "/placeholder.svg"}
              alt={service.name}
              className="card-image"
              onError={(e) => {
                e.target.onerror = null
                e.target.src = `https://placehold.co/600x400/1e7d36/ffffff?text=${service.name.replace(/ /g, "+")}`
              }}
            />
            <div className="p-4 text-center">
              <h3 className="text-xl font-semibold mb-2">{service.name}</h3>
              <p className="text-gray-600">{service.description}</p>
            </div>
          </a>
        ))}
      </div>

      <div className="mt-16 bg-green-50 rounded p-6 max-w-3xl mx-auto">
        <h2 className="text-2xl font-semibold mb-4 text-center">Información de Delivery</h2>
        <div className="space-y-4">
          <div className="flex items-start">
            <div className="bg-green-700 text-white p-2 rounded-full mr-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold">Horario de Delivery</h3>
              <p>Lunes a Domingo: 8:00 - 20:00</p>
            </div>
          </div>

          <div className="flex items-start">
            <div className="bg-green-700 text-white p-2 rounded-full mr-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold">Métodos de Pago</h3>
              <p>Aceptamos tarjetas de crédito/débito, efectivo y transferencias bancarias.</p>
            </div>
          </div>

          <div className="flex items-start">
            <div className="bg-green-700 text-white p-2 rounded-full mr-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold">Pedidos por Teléfono</h3>
              <p>Llámanos al: (01) 234-5678</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

const deliveryServices = [
  {
    name: "Uber Eats",
    description: "Rápido y confiable, con seguimiento en tiempo real",
    image: "https://images.unsplash.com/photo-1653750722200-9c0e2e29d3c8?q=80&w=600",
  },
  {
    name: "Yango",
    description: "Entregas rápidas con tarifas competitivas",
    image: "https://images.unsplash.com/photo-1526367790999-0150786686a2?q=80&w=600",
  },
  {
    name: "InDrive",
    description: "Servicio personalizado con precios negociables",
    image: "https://images.unsplash.com/photo-1619454016518-697bc231e7cb?q=80&w=600",
  },
  {
    name: "Delivery Propio",
    description: "Nuestro equipo de repartidores te lo lleva directamente",
    image: "https://images.unsplash.com/photo-1617347454431-f49d7ff5c3b1?q=80&w=600",
  },
]

export default Delivery
