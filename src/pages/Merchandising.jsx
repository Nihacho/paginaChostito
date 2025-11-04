function Merchandising() {
  return (
    <div className="container py-8">
      <h1 className="section-title">Merchandising</h1>

      <p className="text-center text-lg mb-10 max-w-2xl mx-auto">
        Lleva contigo un pedacito de Café Chostito. Nuestra colección de merchandising está diseñada para los verdaderos
        amantes del café.
      </p>

      <div className="grid sm-grid-cols-2 lg-grid-cols-3 gap-8">
        {merchandiseItems.map((item, index) => (
          <div key={index} className="card">
            <img
              src={item.image || "/placeholder.svg"}
              alt={item.name}
              className="card-image"
              style={{ height: "250px" }}
              onError={(e) => {
                e.target.onerror = null
                e.target.src = `https://placehold.co/600x400/1e7d36/ffffff?text=${item.name.replace(/ /g, "+")}`
              }}
            />
            <div className="p-4">
              <h3 className="text-xl font-semibold mb-2">{item.name}</h3>
              <p className="text-gray-600 mb-4">{item.description}</p>
              <div className="flex justify-between items-center">
                <span className="text-green-700 font-bold">{item.price} BS</span>
                <button className="btn">Ver detalles</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-16 bg-green-50 p-8 rounded">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold mb-4">Colecciones Especiales</h2>
          <p className="text-lg">Descubre nuestras ediciones limitadas y colecciones de temporada.</p>
        </div>

        <div className="grid sm-grid-cols-2 gap-8">
          <div className="card">
            <img
              src="https://images.unsplash.com/photo-1607082349566-187342175e2f?q=80&w=600"
              alt="Colección Navideña"
              className="card-image"
              style={{ height: "250px" }}
              onError={(e) => {
                e.target.onerror = null
                e.target.src = "https://placehold.co/600x400/1e7d36/ffffff?text=Colección+Navideña"
              }}
            />
            <div className="p-4">
              <h3 className="text-xl font-semibold mb-2">Colección Navideña</h3>
              <p className="text-gray-600">
                Productos especiales para celebrar la temporada navideña con el espíritu de Café Chostito.
              </p>
            </div>
          </div>

          <div className="card">
            <img
              src="https://images.unsplash.com/photo-1445116572660-236099ec97a0?q=80&w=600"
              alt="Colección Verano"
              className="card-image"
              style={{ height: "250px" }}
              onError={(e) => {
                e.target.onerror = null
                e.target.src = "https://placehold.co/600x400/1e7d36/ffffff?text=Colección+Verano"
              }}
            />
            <div className="p-4">
              <h3 className="text-xl font-semibold mb-2">Colección Verano</h3>
              <p className="text-gray-600">
                Productos refrescantes y coloridos para disfrutar de la temporada de calor con estilo.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

const merchandiseItems = [
  {
    name: "Gorras Emprendedoras",
    description: "Gorra de algodón premium con el logo bordado de Café Chostito",
    price: "19.99",
    image: "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?q=80&w=600",
  },
  {
    name: "Taza Térmica",
    description: "Mantén tu café caliente por horas con nuestra taza térmica de acero inoxidable",
    price: "24.99",
    image: "https://images.unsplash.com/photo-1577937927133-66ef06acdf18?q=80&w=600",
  },
  {
    name: "Camiseta Signature",
    description: "Camiseta 100% algodón orgánico con diseño exclusivo de Café Chostito",
    price: "22.50",
    image: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?q=80&w=600",
  },
  {
    name: "Bolsa de Café Premium",
    description: "Nuestro blend exclusivo para preparar en casa, 250g de granos enteros",
    price: "15.75",
    image: "https://images.unsplash.com/photo-1611854779393-1b2da9d400fe?q=80&w=600",
  },
  {
    name: "Libreta Barista",
    description: "Libreta de notas con papel reciclado y cubierta de cuero sintético",
    price: "12.50",
    image: "https://images.unsplash.com/photo-1531346878377-a5be20888e57?q=80&w=600",
  },
  {
    name: "Set de Posavasos",
    description: "Set de 4 posavasos con diseños inspirados en nuestros cafés más populares",
    price: "9.99",
    image: "https://images.unsplash.com/photo-1614632537197-38a17061c2bd?q=80&w=600",
  },
]

export default Merchandising
