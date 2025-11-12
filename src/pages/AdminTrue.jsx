import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { db } from "../firebase/config";
import {
  collection,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import { FaUser, FaTrash, FaUsers, FaUserTie, FaUserFriends, FaPlus, FaTimes, FaToggleOn, FaToggleOff } from "react-icons/fa";
import "../App.css";

function AdminTrue() {
  const { logout } = useAuth();
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [nuevoUsuario, setNuevoUsuario] = useState({
    nombre: "",
    email: "",
    telefono: "",
    rol: "cliente",
    estado: "Activo",
  });

  // Obtener usuarios desde Firestore
  useEffect(() => {
    const obtenerUsuarios = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "users"));
        const usuariosData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          // Si no tiene estado, asignar "Activo" por defecto
          estado: doc.data().estado || "Activo",
        }));
        setUsuarios(usuariosData);
      } catch (error) {
        console.error("Error al obtener usuarios:", error);
      } finally {
        setLoading(false);
      }
    };
    obtenerUsuarios();
  }, []);

  // Eliminar usuario
  const handleDelete = async (id) => {
    if (window.confirm("¿Estás seguro de eliminar este usuario?")) {
      try {
        await deleteDoc(doc(db, "users", id));
        setUsuarios(usuarios.filter((u) => u.id !== id));
        alert("Usuario eliminado correctamente");
      } catch (error) {
        console.error("Error al eliminar:", error);
        alert("Error al eliminar el usuario");
      }
    }
  };

  // Cambiar estado del usuario
  const handleToggleEstado = async (id, estadoActual) => {
    const nuevoEstado = estadoActual === "Activo" ? "Inactivo" : "Activo";
    try {
      const usuarioRef = doc(db, "users", id);
      await updateDoc(usuarioRef, { estado: nuevoEstado });
      setUsuarios(
        usuarios.map((u) =>
          u.id === id ? { ...u, estado: nuevoEstado } : u
        )
      );
    } catch (error) {
      console.error("Error al cambiar estado:", error);
      alert("Error al cambiar el estado del usuario");
    }
  };

  // Agregar nuevo usuario
  const handleAgregarUsuario = async (e) => {
    e.preventDefault();
    
    // Validaciones básicas
    if (!nuevoUsuario.nombre || !nuevoUsuario.email || !nuevoUsuario.telefono) {
      alert("Por favor completa todos los campos obligatorios");
      return;
    }

    try {
      const docRef = await addDoc(collection(db, "users"), {
        nombre: nuevoUsuario.nombre,
        email: nuevoUsuario.email,
        telefono: nuevoUsuario.telefono,
        rol: nuevoUsuario.rol,
        estado: nuevoUsuario.estado,
        createdAt: serverTimestamp(),
      });

      // Actualizar estado local
      setUsuarios([...usuarios, { 
        id: docRef.id, 
        ...nuevoUsuario,
        createdAt: new Date().toISOString(),
      }]);
      
      // Resetear formulario y cerrar modal
      setNuevoUsuario({
        nombre: "",
        email: "",
        telefono: "",
        rol: "cliente",
        estado: "Activo",
      });
      setShowModal(false);
      alert("Usuario agregado exitosamente");
    } catch (error) {
      console.error("Error al agregar usuario:", error);
      alert("Error al agregar el usuario");
    }
  };

  // Manejar cambios en el formulario
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNuevoUsuario({ ...nuevoUsuario, [name]: value });
  };

  if (loading) {
    return <div className="loading">Cargando datos...</div>;
  }

  // Métricas corregidas - contando por rol (case insensitive)
  const cantidadEmpleados = usuarios.filter(
    (u) => u.rol && u.rol.toLowerCase() === "empleado"
  ).length;
  
  const cantidadClientes = usuarios.filter(
    (u) => u.rol && u.rol.toLowerCase() === "cliente"
  ).length;
  
  const cantidadAdmins = usuarios.filter(
    (u) => u.rol && u.rol.toLowerCase() === "admin"
  ).length;
  
  const totalPersonas = usuarios.length;

  return (
    <div className="admin-container fadeIn">
      <header className="admin-header pulse">
        <br /><br /><br /><br /><br /><br />
        <h1>Panel de Administración</h1>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button 
            className="btn-confirm" 
            onClick={() => setShowModal(true)}
            style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            <FaPlus /> Agregar Usuario
          </button>
          <button className="logout-button" onClick={logout}>
            Cerrar sesión
          </button>
        </div>
      </header>

      {/* Indicadores superiores */}
      <section className="admin-stats fadeIn">
        <div className="stat-card empleados">
          <FaUserTie className="stat-icon" />
          <h3>Empleados</h3>
          <p>{cantidadEmpleados}</p>
        </div>
        <div className="stat-card clientes">
          <FaUserFriends className="stat-icon" />
          <h3>Clientes</h3>
          <p>{cantidadClientes}</p>
        </div>
        <div className="stat-card admins" style={{ background: '#e3f2fd' }}>
          <FaUser className="stat-icon" style={{ color: '#1976d2' }} />
          <h3>Admins</h3>
          <p>{cantidadAdmins}</p>
        </div>
        <div className="stat-card total">
          <FaUsers className="stat-icon" />
          <h3>Total Personas</h3>
          <p>{totalPersonas}</p>
        </div>
      </section>

      {/* Modal para agregar usuario */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Agregar Nuevo Usuario</h2>
              <button 
                className="modal-close" 
                onClick={() => setShowModal(false)}
              >
                <FaTimes />
              </button>
            </div>
            <form onSubmit={handleAgregarUsuario} className="user-form">
              <div className="form-row">
                <div className="form-group">
                  <label>Nombre Completo *</label>
                  <input
                    type="text"
                    name="nombre"
                    value={nuevoUsuario.nombre}
                    onChange={handleInputChange}
                    required
                    className="form-input"
                    placeholder="Ej: Juan Pérez"
                  />
                </div>
                <div className="form-group">
                  <label>Email *</label>
                  <input
                    type="email"
                    name="email"
                    value={nuevoUsuario.email}
                    onChange={handleInputChange}
                    required
                    className="form-input"
                    placeholder="ejemplo@correo.com"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Teléfono *</label>
                  <input
                    type="tel"
                    name="telefono"
                    value={nuevoUsuario.telefono}
                    onChange={handleInputChange}
                    required
                    className="form-input"
                    placeholder="69696969"
                  />
                </div>
                <div className="form-group">
                  <label>Rol *</label>
                  <select
                    name="rol"
                    value={nuevoUsuario.rol}
                    onChange={handleInputChange}
                    className="form-input"
                  >
                    <option value="cliente">Cliente</option>
                    <option value="empleado">Empleado</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
              </div>

              <div className="form-actions">
                <button type="submit" className="btn-confirm">
                  <FaPlus /> Agregar Usuario
                </button>
                <button 
                  type="button" 
                  className="btn-cancel"
                  onClick={() => setShowModal(false)}
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Tabla de usuarios */}
      <main className="admin-content">
        {usuarios.length > 0 ? (
          <div className="table-container">
            <table className="admin-table fadeIn">
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Email</th>
                  <th>Teléfono</th>
                  <th>Rol</th>
                  <th>Estado</th>
                  <th>Fecha Registro</th>
                  <th style={{ width: '200px', textAlign: 'center' }}>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {usuarios.map((usuario) => (
                  <tr key={usuario.id}>
                    <td>{usuario.nombre || "Sin nombre"}</td>
                    <td>{usuario.email || "N/A"}</td>
                    <td>{usuario.telefono || "N/A"}</td>
                    <td>
                      <span className={`rol-badge ${usuario.rol?.toLowerCase() || 'default'}`}>
                        {usuario.rol || "N/A"}
                      </span>
                    </td>
                    <td>
                      <span
                        className={`estado ${
                          usuario.estado === "Activo"
                            ? "activo"
                            : usuario.estado === "Inactivo"
                            ? "inactivo"
                            : "pendiente"
                        }`}
                      >
                        {usuario.estado || "Activo"}
                      </span>
                    </td>
                    <td>
                      {usuario.createdAt?.toDate 
                        ? usuario.createdAt.toDate().toLocaleDateString('es-ES')
                        : usuario.createdAt 
                        ? new Date(usuario.createdAt).toLocaleDateString('es-ES')
                        : "N/A"}
                    </td>
                    <td>
                      <div className="acciones">
                        <button
                          className={usuario.estado === "Activo" ? "btn-inactive btn-small" : "btn-confirm btn-small"}
                          onClick={() => handleToggleEstado(usuario.id, usuario.estado)}
                          title={usuario.estado === "Activo" ? "Desactivar" : "Activar"}
                        >
                          {usuario.estado === "Activo" ? <FaToggleOff /> : <FaToggleOn />}
                        </button>
                        <button
                          className="btn-delete btn-small"
                          onClick={() => handleDelete(usuario.id)}
                          title="Eliminar"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="no-reservas">No hay usuarios registrados en el sistema</p>
        )}
      </main>
    </div>
  );
}

export default AdminTrue;