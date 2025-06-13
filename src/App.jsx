import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Navbar from "./components/Navbar"
import Home from "./pages/Home"
import Menu from "./pages/Menu"
import Delivery from "./pages/Delivery"
import Merchandising from "./pages/Merchandising"
import Contacto from "./pages/Contacto"
import Footer from "./components/Footer"
import "./App.css"

function App() {
  return (
    <Router>
      <div className="app">
        <Navbar />
        <main className="content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/menu" element={<Menu />} />
            <Route path="/delivery" element={<Delivery />} />
            <Route path="/merchandising" element={<Merchandising />} />
            <Route path="/contacto" element={<Contacto />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  )
}

export default App
