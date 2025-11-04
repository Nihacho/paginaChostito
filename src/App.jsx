import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { ReservasProvider } from "./context/ReservasContext"
import Navbar from "./components/Navbar"
import ScrollToTop from "./components/ScrollToTop"  // ✅ AGREGAR ESTA LÍNEA
import Home from "./pages/Home"
import Menu from "./pages/Menu"
import Delivery from "./pages/Delivery"
import Merchandising from "./pages/Merchandising"
import Reservar from "./pages/Reservar"
import ConfirmacionReserva from "./pages/ConfirmacionReserva"
import Admin from "./pages/Admin"
import Footer from "./components/Footer"
import "./App.css"

function App() {
  return (
    <ReservasProvider>
      <Router>
        <ScrollToTop />  {/* ✅ AGREGAR ESTA LÍNEA - Debe estar dentro de Router pero antes de todo lo demás */}
        <div className="app">
          <Navbar />
          <main className="content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/menu" element={<Menu />} />
              <Route path="/delivery" element={<Delivery />} />
              <Route path="/merchandising" element={<Merchandising />} />
              <Route path="/reservar" element={<Reservar />} />
              <Route path="/confirmacion-reserva" element={<ConfirmacionReserva />} />
              <Route path="/admin" element={<Admin />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </ReservasProvider>
  )
}

export default App