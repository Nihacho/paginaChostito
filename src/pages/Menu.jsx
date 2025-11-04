function Menu() {
  return (
    <div className="container py-12">
      {/* CORREGIDO: Agregado padding top y mejor espaciado */}
      <div className="text-center mb-12">
        <h1 className="section-title">Nuestro Menú</h1>
        <div className="section-divider"></div>
        <p className="section-subtitle">Descubre nuestra selección de cafés, postres y bocadillos</p>
      </div>

      {/* Sección de Cafés */}
      <MenuSection title="Cafés" items={coffees} />

      {/* Sección de Postres */}
      <MenuSection title="Postres" items={desserts} />

      {/* Sección de Bocadillos */}
      <MenuSection title="Bocadillos" items={snacks} isLast />
    </div>
  )
}

// MEJORA: Componente reutilizable para evitar repetición de código
function MenuSection({ title, items, isLast = false }) {
  return (
    <div className={isLast ? "" : "mb-16"}>
      <h2 className="text-3xl font-semibold mb-8 text-green-700 border-b-2 border-green-200 pb-3">
        {title}
      </h2>
      
      {/* CORREGIDO: 4 columnas con mejor balance */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {items.map((item, index) => (
          <MenuCard key={index} item={item} />
        ))}
      </div>
    </div>
  )
}

// MEJORA: Componente separado para cada tarjeta - Tamaño balanceado para 4 columnas
function MenuCard({ item }) {
  return (
    <div className="card hover:shadow-xl transition-shadow duration-300">
      {/* CORREGIDO: Imagen con altura balanceada para 4 columnas */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={item.image}
          alt={item.name}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.onerror = null
            e.target.src = `https://placehold.co/400x300/1e7d36/ffffff?text=${item.name.replace(/ /g, "+")}`
          }}
        />
      </div>
      {/* CORREGIDO: Padding balanceado */}
      <div className="p-5">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-semibold text-gray-800 flex-1">{item.name}</h3>
          <span className="font-bold text-green-700 text-lg ml-2 whitespace-nowrap">${item.price}</span>
        </div>
        <p className="text-gray-600 text-sm leading-relaxed">{item.description}</p>
      </div>
    </div>
  )
}

const coffees = [
  {
    name: "Espresso",
    description: "Café concentrado con un sabor intenso y aroma excepcional",
    price: "2.50",
    image: "https://images.unsplash.com/photo-1610889556528-9a770e32642f?q=80&w=600",
  },
  {
    name: "Cappuccino",
    description: "Espresso con leche vaporizada y espuma de leche en partes iguales",
    price: "4.00",
    image: "https://images.unsplash.com/photo-1534778101976-62847782c213?q=80&w=600",
  },
  {
    name: "Americano",
    description: "Espresso diluido con agua caliente para un sabor más suave",
    price: "3.00",
    image: "https://images.unsplash.com/photo-1551030173-122aabc4489c?q=80&w=600",
  },
  {
    name: "Mocha",
    description: "Espresso con chocolate, leche vaporizada y crema batida",
    price: "4.50",
    image: "https://images.unsplash.com/photo-1578314675249-a6910f80cc4e?q=80&w=600",
  },
  {
    name: "Flat White",
    description: "Espresso con microespuma de leche para un sabor más intenso",
    price: "4.25",
    image: "https://images.unsplash.com/photo-1577968897966-3d4325b36b61?q=80&w=600",
  },
  {
    name: "Cold Brew",
    description: "Café preparado en frío durante 12 horas para un sabor suave y refrescante",
    price: "4.75",
    image: "https://images.unsplash.com/photo-1517701604599-bb29b565090c?q=80&w=600",
  },
]

const desserts = [
  {
    name: "Cheesecake",
    description: "Tarta de queso cremosa con base de galleta y cobertura de frutos rojos",
    price: "5.50",
    image: "https://images.unsplash.com/photo-1533134242443-d4fd215305ad?q=80&w=600",
  },
  {
    name: "Brownie",
    description: "Brownie de chocolate con nueces y servido con helado de vainilla",
    price: "4.75",
    image: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?q=80&w=600",
  },
  {
    name: "Tarta de Manzana",
    description: "Tarta casera de manzana con canela y servida caliente",
    price: "5.25",
    image: "https://images.unsplash.com/photo-1535920527002-b35e96722eb9?q=80&w=600",
  },
  {
    name: "Muffin de Arándanos",
    description: "Muffin esponjoso con arándanos frescos",
    price: "3.50",
    image: "https://images.unsplash.com/photo-1607958996333-41aef7caefaa?q=80&w=600",
  },
]

const snacks = [
  {
    name: "Sandwich de Pavo",
    description: "Pan integral con pavo, queso, lechuga, tomate y mayonesa",
    price: "6.50",
    image: "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?q=80&w=600",
  },
  {
    name: "Wrap Vegetariano",
    description: "Tortilla de trigo con hummus, aguacate, espinacas y verduras asadas",
    price: "5.75",
    image: "https://images.unsplash.com/photo-1626700051175-6818013e1d4f?q=80&w=600",
  },
  {
    name: "Bagel con Salmón",
    description: "Bagel tostado con queso crema, salmón ahumado, alcaparras y cebolla roja",
    price: "7.25",
    image: "https://images.unsplash.com/photo-1592767049184-5bdc21bc2944?q=80&w=600",
  },
]

export default Menu