"use client"

import { Link } from "react-router-dom"
import { useState, useEffect } from "react"

function Home() {
  const [isVisible, setIsVisible] = useState({
    welcome: false,
    products: false,
  })

  useEffect(() => {
    const handleScroll = () => {
      const welcomeSection = document.getElementById("welcome-section")
      const productsSection = document.getElementById("products-section")

      if (welcomeSection) {
        const welcomePosition = welcomeSection.getBoundingClientRect()
        if (welcomePosition.top < window.innerHeight * 0.75) {
          setIsVisible((prev) => ({ ...prev, welcome: true }))
        }
      }

      if (productsSection) {
        const productsPosition = productsSection.getBoundingClientRect()
        if (productsPosition.top < window.innerHeight * 0.75) {
          setIsVisible((prev) => ({ ...prev, products: true }))
        }
      }
    }

    window.addEventListener("scroll", handleScroll)
    // Trigger once on load
    setTimeout(handleScroll, 500)

    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  return (
    <div>
      {/* Hero Section - CORREGIDO: Eliminados todos los <br /> */}
      <section className="relative h-screen min-h-[600px] max-h-[800px] ">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?q=80&w=1200"
            alt="Café Chostito"
            className="w-full h-full object-cover brightness-[0.4]"
            style={{width : "100%"}}
            onError={(e) => {
              e.target.onerror = null
              e.target.src = "https://placehold.co/1200x500/1e7d36/ffffff?text=Café+Chostito"
            }}
          />
        </div>
        
        {/* CORREGIDO: flex con justify-center y items-center centra automáticamente */}
        <div className="relative flex flex-col items-center justify-center h-full text-center text-white px-4">
          <h1 className="hero-title">Café Chostito</h1>
          <p className="hero-subtitle">Donde cada sorbo cuenta una historia</p>
          
          <div className="flex flex-col sm:flex-row gap-4 mt-8">
            <Link to="/menu" className="btn">
              Explorar Menú
            </Link>
            <Link to="/reservar" className="btn btn-secondary">
              Reservar Mesa
            </Link>
          </div>
        </div>
      </section>

      
      {/* Welcome Section - CORREGIDO: Padding en lugar de <br /> */}
      <section
        id="welcome-section"
        className={`section py-20 ${isVisible.welcome ? "animate-fade-in" : ""}`}
        style={{
          opacity: isVisible.welcome ? 1 : 0,
          transform: isVisible.welcome ? "translateY(0)" : "translateY(20px)",
          transition: "opacity 0.8s ease, transform 0.8s ease",
        }}
      >
        <div className="container">
          {/* CORREGIDO: Padding top en lugar de múltiples <br /> */}
          <div className="text-center mb-16">
            <h2 className="section-title">Bienvenidos a Café Chostito</h2>
            <div className="section-divider"></div>
            <p className="section-subtitle">Una experiencia única de café en un ambiente acogedor</p>
          </div>

          {/* CORREGIDO: Grid responsive y centrado vertical */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-16">
            {/* CORREGIDO: flex flex-col justify-center centra el contenido verticalmente */}
            <div className="flex flex-col justify-center space-y-6">
              <div>
                <h3 className="text-2xl mb-3 fancy-heading">Nuestra Pasión</h3>
                <p className="text-lg text-gray-700">
                  En Café Chostito, nos apasiona ofrecer la mejor experiencia de café. Nuestros granos son seleccionados
                  cuidadosamente de las mejores regiones productoras del mundo y tostados a la perfección para resaltar
                  sus sabores únicos.
                </p>
              </div>
              
              <div>
                <h3 className="text-2xl mb-3 fancy-heading">Nuestro Equipo</h3>
                <p className="text-lg text-gray-700">
                  Nuestro equipo de baristas altamente capacitados está dedicado a preparar cada bebida con precisión y
                  amor, asegurando que cada visita sea especial.
                </p>
              </div>
              
              <div>
                <h3 className="text-2xl mb-3 fancy-heading">Tu Espacio</h3>
                <p className="text-lg text-gray-700">
                  Te invitamos a disfrutar de nuestro acogedor ambiente, perfecto para reuniones, trabajo o simplemente
                  para disfrutar de un momento de tranquilidad con una deliciosa taza de café.
                </p>
              </div>
            </div>
            
            {/* CORREGIDO: Altura y estilos de imagen mejorados */}
            <div className="relative h-[500px] rounded-lg overflow-hidden shadow-xl">
              <img
                src="https://images.unsplash.com/photo-1554118811-1e0d58224f24?q=80&w=600"
                alt="Interior de Café Chostito"
                className="w-full h-full object-cover object-center"
                onError={(e) => {
                  e.target.onerror = null
                  e.target.src = "https://placehold.co/600x400/1e7d36/ffffff?text=Interior+Café"
                }}
              />
            </div>
          </div>

          {/* Features Grid - Sin cambios necesarios aquí */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="feature-icon mx-auto">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="28"
                  height="28"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M17 8h1a4 4 0 1 1 0 8h-1"></path>
                  <path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z"></path>
                  <line x1="6" y1="2" x2="6" y2="4"></line>
                  <line x1="10" y1="2" x2="10" y2="4"></line>
                  <line x1="14" y1="2" x2="14" y2="4"></line>
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2 mt-4">Café de Especialidad</h3>
              <p className="text-gray-600">Seleccionamos los mejores granos de café de todo el mundo para ofrecerte una experiencia única.</p>
            </div>
            
            <div className="text-center">
              <div className="feature-icon mx-auto">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="28"
                  height="28"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 2a8 8 0 0 0-8 8c0 1.892.402 3.13 1.5 4.5L12 22l6.5-7.5c1.098-1.37 1.5-2.608 1.5-4.5a8 8 0 0 0-8-8Z"></path>
                  <circle cx="12" cy="10" r="3"></circle>
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2 mt-4">Ambiente Acogedor</h3>
              <p className="text-gray-600">Un espacio diseñado para tu comodidad, perfecto para trabajar, estudiar o simplemente relajarte.</p>
            </div>
            
            <div className="text-center">
              <div className="feature-icon mx-auto">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="28"
                  height="28"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path>
                  <polyline points="14 2 14 8 20 8"></polyline>
                  <line x1="16" y1="13" x2="8" y2="13"></line>
                  <line x1="16" y1="17" x2="8" y2="17"></line>
                  <line x1="10" y1="9" x2="8" y2="9"></line>
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2 mt-4">Menú Variado</h3>
              <p className="text-gray-600">Además de nuestro café, ofrecemos una amplia variedad de alimentos y bebidas para todos los gustos.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section
        id="products-section"
        className={`section bg-green-50 py-20 ${isVisible.products ? "animate-fade-in" : ""}`}
        style={{
          opacity: isVisible.products ? 1 : 0,
          transform: isVisible.products ? "translateY(0)" : "translateY(20px)",
          transition: "opacity 0.8s ease, transform 0.8s ease",
        }}
      >
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="section-title">Nuestros Destacados</h2>
            <div className="section-divider"></div>
            <p className="section-subtitle">Descubre nuestros productos más populares y déjate sorprender</p>
          </div>

          <div className="product-grid">
            {featuredProducts.map((product, index) => (
              <div key={index} className="product-card">
                <img
                  src={product.image}
                  alt={product.name}
                  className="product-image"
                  onError={(e) => {
                    e.target.onerror = null
                    e.target.src = `https://placehold.co/600x400/1e7d36/ffffff?text=${product.name.replace(/ /g, "+")}`
                  }}
                />
                <div className="product-content">
                  <h3 className="product-title">{product.name}</h3>
                  <p className="product-description">{product.description}</p>
                  <div className="product-action">
                    <span className="product-price">{product.price} Bs</span>
                    <Link to="/menu" className="product-link">
                      Ver más
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
              <Link to="/menu" className="btn">
                Ver Menú Completo
              </Link>
          </div>
        </div>
      </section>

      {/* Reservation CTA Section */}
      <section className="section bg-green-700 text-white py-20">
        <div className="container">
          <div className="text-center">
            <h2 className="section-title text-white">¿Listo para visitarnos?</h2>
            <p className="text-xl mb-8">Reserva tu mesa ahora y disfruta de la mejor experiencia de café</p>
            <Link to="/reservar" className="btn btn-white">
              Reservar Mesa
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

const featuredProducts = [
  {
    name: "Café Latte Especial",
    description: "Nuestro espresso signature con leche cremosa y un toque de vainilla",
    price: "4.50",
    image: "https://images.unsplash.com/photo-1541167760496-1628856ab772?q=80&w=600",
  },
  {
    name: "Croissant de Almendras",
    description: "Horneado diariamente con mantequilla francesa y almendras tostadas",
    price: "3.75",
    image: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?q=80&w=600",
  },
  {
    name: "Frappuccino de Caramelo",
    description: "Bebida helada con café, leche, hielo y caramelo, coronada con crema batida",
    price: "5.25",
    image: "https://images.unsplash.com/photo-1586917049334-dc082efcf137?q=80&w=600",
  },
  {
    name: "Espresso Doble",
    description: "Doble shot de nuestro mejor espresso, intenso y aromático",
    price: "3.50",
    image: "https://images.unsplash.com/photo-1610889556528-9a770e32642f?q=80&w=600",
  },
  {
    name: "Tarta de Chocolate",
    description: "Deliciosa tarta de chocolate con ganache y frutos rojos",
    price: "5.50",
    image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?q=80&w=600",
  },
  {
    name: "Sandwich Vegetariano",
    description: "Pan artesanal con hummus, aguacate y vegetales frescos",
    price: "6.25",
    image: "https://images.unsplash.com/photo-1540914124281-342587941389?q=80&w=600",
  },
]

export default Home