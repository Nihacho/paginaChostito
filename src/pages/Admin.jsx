"use client"

import { useState, useEffect } from "react"
import { collection, query, orderBy, onSnapshot, doc, deleteDoc, updateDoc } from "firebase/firestore"
import { db } from "../firebase/config"
import { useAuth } from "../context/AuthContext"
import { useNavigate } from "react-router-dom"

function Admin() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [reservas, setReservas] = useState([])
  const [filteredReservas, setFilteredReservas] = useState([])
  const [filter, setFilter] = useState("todas")
  const [dateFilter, setDateFilter] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [isLoading, setIsLoading] = useState(true)

  // Cargar reservas en tiempo real desde Firestore
  useEffect(() => {
    const q = query(collection(db, "reservas"), orderBy("createdAt", "desc"))

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const reservasData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))
        console.log("📋 Reservas cargadas:", reservasData.length)
        setReservas(reservasData)
        setIsLoading(false)
      },
      (error) => {
        console.error("Error cargando reservas:", error)
        setIsLoading(false)
      }
    )

    return () => unsubscribe()
  }, [])

  // Filtrar reservas
  useEffect(() => {
    let result = [...reservas]

    if (searchTerm) {
      result = result.filter(
        (reserva) =>
          reserva.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          reserva.telefono?.includes(searchTerm) ||
          reserva.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          reserva.comentarios?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (dateFilter) {
      result = result.filter((reserva) => reserva.fecha === dateFilter)
    }

    if (filter !== "todas") {
      result = result.filter((reserva) => reserva.estado === filter)
    }

    result.sort((a, b) => {
      const dateA = new Date(`${a.fecha}T${a.hora}`)
      const dateB = new Date(`${b.fecha}T${b.hora}`)
      return dateB - dateA
    })

    setFilteredReservas(result)
  }, [reservas, filter, dateFilter, searchTerm])

  const handleLogout = async () => {
    const result = await logout()
    if (result.success) {
      navigate("/")
    }
  }

  const handleDeleteReserva = async (id) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar esta reserva?")) {
      try {
        await deleteDoc(doc(db, "reservas", id))
        console.log("✅ Reserva eliminada:", id)
      } catch (error) {
        console.error("Error eliminando reserva:", error)
        alert("Error al eliminar la reserva")
      }
    }
  }

  const handleUpdateStatus = async (id, newStatus) => {
    try {
      await updateDoc(doc(db, "reservas", id), {
        estado: newStatus,
      })
      console.log(`✅ Estado actualizado para ${id}: ${newStatus}`)
    } catch (error) {
      console.error("Error actualizando estado:", error)
      alert("Error al actualizar el estado")
    }
  }

  const formatearFecha = (fechaStr) => {
    const fecha = new Date(fechaStr)
    return fecha.toLocaleDateString("es-ES", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const exportarDatos = () => {
    const csvContent = [
      ["Nombre", "Email", "Teléfono", "Fecha", "Hora", "Personas", "Estado", "Comentarios", "Creado"],
      ...filteredReservas.map((r) => [
        r.nombre,
        r.email,
        r.telefono,
        r.fecha,
        r.hora,
        r.personas,
        r.estado,
        r.comentarios || "",
        r.createdAt?.toDate ? r.createdAt.toDate().toLocaleString() : "N/A",
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `reservas_${new Date().toISOString().split("T")[0]}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando panel de administración...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="admin-container">
      {/* Header */}
      <div className="admin-header">
        <div className="container mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <div>
              <br /><br />
              <h1 className="text-3xl font-bold text-white">Panel de Administración</h1>
              <p className="text-green-100 mt-1">Sistema de Gestión de Reservas - Café Chostito</p>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors flex items-center"
              >
                <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                  />
                </svg>
                Cerrar Sesión
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Estadísticas - NUEVO DISEÑO */}
        <div className="stats-grid">
          <div className="stat-card blue">
            <div className="flex items-center justify-between">
              <div className="stat-icon-wrapper blue">
                <svg className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <div className="text-right">
                <p className="stat-label">Total Reservas</p>
                <p className="stat-value">{reservas.length}</p>
              </div>
            </div>
          </div>

          <div className="stat-card green">
            <div className="flex items-center justify-between">
              <div className="stat-icon-wrapper green">
                <svg className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div className="text-right">
                <p className="stat-label">Confirmadas</p>
                <p className="stat-value">{reservas.filter((r) => r.estado === "confirmada").length}</p>
              </div>
            </div>
          </div>

          <div className="stat-card yellow">
            <div className="flex items-center justify-between">
              <div className="stat-icon-wrapper yellow">
                <svg className="h-8 w-8 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div className="text-right">
                <p className="stat-label">Hoy</p>
                <p className="stat-value">
                  {reservas.filter((r) => r.fecha === new Date().toISOString().split("T")[0]).length}
                </p>
              </div>
            </div>
          </div>

          <div className="stat-card purple">
            <div className="flex items-center justify-between">
              <div className="stat-icon-wrapper purple">
                <svg className="h-8 w-8 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </div>
              <div className="text-right">
                <p className="stat-label">Total Personas</p>
                <p className="stat-value">
                  {reservas.reduce((total, r) => total + Number.parseInt(r.personas || 0), 0)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Filtros y Búsqueda - NUEVO DISEÑO */}
        <div className="filter-panel">
          <div className="filter-header">
            <h2 className="filter-title">Filtros y Búsqueda</h2>
            <button onClick={exportarDatos} className="btn-export">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              Exportar CSV
            </button>
          </div>

          <div className="filters-grid">
            <div>
              <label htmlFor="searchTerm" className="filter-label">
                🔎 Buscar
              </label>
              <div className="filter-input-wrapper">
                <svg className="h-5 w-5 filter-input-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                <input
                  type="text"
                  id="searchTerm"
                  className="filter-input"
                  placeholder="Nombre, email, teléfono..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label htmlFor="dateFilter" className="filter-label">
                📅 Fecha
              </label>
              <div className="filter-input-wrapper">
                <svg className="h-5 w-5 filter-input-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                <input
                  type="date"
                  id="dateFilter"
                  className="filter-input"
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label htmlFor="statusFilter" className="filter-label">
                📊 Estado
              </label>
              <div className="filter-input-wrapper">
                <svg className="h-5 w-5 filter-input-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                  />
                </svg>
                <select
                  id="statusFilter"
                  className="filter-input"
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                >
                  <option value="todas">Todas las reservas</option>
                  <option value="confirmada">✅ Confirmadas</option>
                  <option value="cancelada">❌ Canceladas</option>
                  <option value="completada">✨ Completadas</option>
                </select>
              </div>
            </div>

            <div>
              <label className="filter-label">🔄 Limpiar</label>
              <button
                className="btn-clear"
                onClick={() => {
                  setFilter("todas")
                  setDateFilter("")
                  setSearchTerm("")
                }}
              >
                Restablecer Filtros
              </button>
            </div>
          </div>
        </div>

        {/* Tabla de Reservas */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          <div className="px-8 py-6 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Base de Datos de Reservas</h2>
                <p className="text-gray-600 mt-1">
                  Mostrando {filteredReservas.length} de {reservas.length} reservas
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                  🔥 Tiempo Real
                </div>
              </div>
            </div>
          </div>

          {filteredReservas.length === 0 ? (
            <div className="text-center py-16">
              <div className="mx-auto h-24 w-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                <svg className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {reservas.length === 0 ? "No hay reservas registradas" : "No hay reservas que coincidan"}
              </h3>
              <p className="text-gray-500 max-w-md mx-auto">
                {reservas.length === 0
                  ? "Las reservas aparecerán aquí automáticamente cuando los clientes las realicen."
                  : "Intenta ajustar los filtros de búsqueda."}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">#</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Cliente</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Email</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Teléfono</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Fecha</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Hora</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Personas</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Estado</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Comentarios</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Acciones</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  {filteredReservas.map((reserva, index) => (
                    <tr
                      key={reserva.id}
                      className="hover:bg-gradient-to-r hover:from-green-50 hover:to-emerald-50 transition-all duration-200 group"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="h-8 w-8 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center">
                          <span className="text-xs font-bold text-gray-600">#{index + 1}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-10 w-10 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center mr-3">
                            <span className="text-white font-bold text-sm">
                              {reserva.nombre?.charAt(0).toUpperCase() || "?"}
                            </span>
                          </div>
                          <div>
                            <div className="text-sm font-semibold text-gray-900">{reserva.nombre}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-900">{reserva.email}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-mono text-gray-900">{reserva.telefono}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="bg-purple-50 px-3 py-2 rounded-lg">
                          <div className="text-sm font-medium text-purple-900">{formatearFecha(reserva.fecha)}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="bg-orange-50 px-3 py-2 rounded-lg">
                          <div className="text-sm font-mono font-medium text-orange-900">{reserva.hora}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <div className="inline-flex items-center bg-indigo-100 px-3 py-2 rounded-full">
                          <span className="text-sm font-bold text-indigo-900">{reserva.personas}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <select
                          value={reserva.estado}
                          onChange={(e) => handleUpdateStatus(reserva.id, e.target.value)}
                          className={`text-xs font-bold rounded-full px-4 py-2 border-0 cursor-pointer transition-all ${
                            reserva.estado === "confirmada"
                              ? "bg-gradient-to-r from-green-100 to-emerald-100 text-green-800"
                              : reserva.estado === "cancelada"
                                ? "bg-gradient-to-r from-red-100 to-pink-100 text-red-800"
                                : "bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800"
                          }`}
                        >
                          <option value="confirmada">✅ Confirmada</option>
                          <option value="cancelada">❌ Cancelada</option>
                          <option value="completada">✨ Completada</option>
                        </select>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600 max-w-xs">
                        {reserva.comentarios ? (
                          <div className="bg-gray-50 px-3 py-2 rounded-lg">
                            <p className="truncate">{reserva.comentarios}</p>
                          </div>
                        ) : (
                          <span className="text-gray-400 italic">Sin comentarios</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => handleDeleteReserva(reserva.id)}
                          className="bg-red-100 hover:bg-red-200 text-red-700 px-3 py-2 rounded-lg text-xs font-semibold transition-all"
                          title="Eliminar reserva"
                        >
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Info System */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-xl p-6">
          <div className="flex items-start">
            <svg className="h-6 w-6 text-blue-600 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <div>
              <h3 className="text-sm font-medium text-blue-800">Información del Sistema</h3>
              <div className="mt-2 text-sm text-blue-700">
                <p className="mb-2">
                  <strong>Estado:</strong> ✅ Conectado a Firebase Firestore
                </p>
                <p className="mb-2">
                  <strong>Sincronización:</strong> 🔥 Tiempo Real Activado
                </p>
                <p>
                  <strong>Última actualización:</strong> {new Date().toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
  //hola
  //hoalsdfalskdj 
}

export default Admin