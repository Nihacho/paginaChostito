import React, { useEffect, useState } from "react"
import { useAuth } from "../context/AuthContext"
import { collection, getDocs, query, orderBy, addDoc, serverTimestamp, updateDoc, deleteDoc, doc } from "firebase/firestore"
import { db } from "../firebase/config"
import { Toaster, toast } from "react-hot-toast"
import { Navigate } from "react-router-dom"

function AdminTrue() {
  const { user, userData, loading } = useAuth()
  const [users, setUsers] = useState([])
  const [loadingUsers, setLoadingUsers] = useState(true)
  const [creating, setCreating] = useState(false)
  const [form, setForm] = useState({ email: "", name: "", password: "", rol: "empleado" })

  useEffect(() => {
    if (!user) return
    if (userData?.rol !== "admin") return
    const load = async () => {
      setLoadingUsers(true)
      try {
        const q = query(collection(db, "users"), orderBy("createdAt", "desc"))
        const snap = await getDocs(q)
        setUsers(snap.docs.map(d => ({ id: d.id, ...d.data() })))
      } catch (err) {
        console.error(err)
        toast.error("No se pudieron cargar los usuarios")
      } finally {
        setLoadingUsers(false)
      }
    }
    load()
  }, [user, userData])

  if (loading) return <div> Cargando... </div>
  if (!user) return <Navigate to="/login" replace />

  if (userData?.rol !== "admin") {
    return <div>Acceso denegado</div>
  }

  const handleChange = (e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))

  const handleCreate = async (e) => {
    e.preventDefault()
    setCreating(true)
    try {
      // Crear solo el documento en Firestore (sin crear cuenta Auth)
      const usersCol = collection(db, "users")
      const docRef = await addDoc(usersCol, {
        name: form.name || null,
        email: form.email || null,
        rol: form.rol || "empleado",
        createdAt: serverTimestamp(),
        createdByUid: user.uid,
        createdByEmail: user.email,
        // campos adicionales de auditoría
        audit: {
          createdFrom: "admin-panel",
        }
      })

      toast.success("Empleado registrado en Firestore correctamente")
      // recargar lista
      const q = query(collection(db, "users"), orderBy("createdAt", "desc"))
      const snap = await getDocs(q)
      setUsers(snap.docs.map(d => ({ id: d.id, ...d.data() })))
      setForm({ email: "", name: "", password: "", rol: "empleado" })
    } catch (err) {
      console.error(err)
      toast.error(err.message || "Error creando empleado")
    } finally {
      setCreating(false)
    }
  }

  const handleUpdateRole = async (userId, newRole) => {
    try {
      await updateDoc(doc(db, "users", userId), { rol: newRole, updatedAt: serverTimestamp(), updatedBy: user.email })
      toast.success("Rol actualizado")
      const q = query(collection(db, "users"), orderBy("createdAt", "desc"))
      const snap = await getDocs(q)
      setUsers(snap.docs.map(d => ({ id: d.id, ...d.data() })))
    } catch (err) {
      console.error(err)
      toast.error("Error actualizando rol")
    }
  }

  const handleDeleteUser = async (userId) => {
    if (!window.confirm("¿Eliminar usuario? Esto no borra su cuenta de Auth, solo el documento.")) return
    try {
      await deleteDoc(doc(db, "users", userId))
      toast.success("Usuario eliminado (solo documento Firestore)")
      setUsers(prev => prev.filter(u => u.id !== userId))
    } catch (err) {
      console.error(err)
      toast.error("Error eliminando usuario")
    }
  }
 

  return (
    <div className="p-6">
      <Toaster position="top-center" />
      <h1 className="text-2xl font-bold mb-4">Gestión de Usuarios (Admin)</h1>

      <section className="mb-6">
        <form onSubmit={handleCreate} className="space-y-2 max-w-md">
          <input name="name" value={form.name} onChange={handleChange} placeholder="Nombre" className="form-input" />
          <input name="email" value={form.email} onChange={handleChange} placeholder="Email" className="form-input" />
          <input name="password" value={form.password} onChange={handleChange} placeholder="Password" className="form-input" />
          <select name="rol" value={form.rol} onChange={handleChange} className="form-input">
            <option value="empleado">Empleado</option>
            <option value="admin">Admin</option>
            <option value="cliente">Cliente</option>
          </select>
          <button type="submit" className="login-submit btn" disabled={creating}>{creating ? "Creando..." : "Crear empleado"}</button>
        </form>
      </section>

      <section>
        <h2 className="text-lg font-semibold mb-2">Usuarios registrados</h2>
        {loadingUsers ? <div>Cargando usuarios...</div> : (
          <table className="min-w-full bg-white">
            <thead>
              <tr>
                <th>Nombre</th><th>Email</th><th>Rol</th><th>Creado</th><th>Creado por</th>
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                  <tr key={u.id}>
                    <td>{u.name || "-"}</td>
                    <td>{u.email}</td>
                    <td>
                      <select
                        value={u.rol}
                        onChange={(e) => handleUpdateRole(u.id, e.target.value)}
                        className="form-input"
                      >
                        <option value="cliente">Cliente</option>
                        <option value="empleado">Empleado</option>
                        <option value="admin">Admin</option>
                      </select>
                    </td>
                    <td>{u.createdAt?.toDate ? u.createdAt.toDate().toLocaleString() : u.createdAt || "-"}</td>
                    <td>{u.createdByEmail || "-"}</td>
                    <td>
                      <button
                        onClick={() => handleDeleteUser(u.id)}
                        className="bg-red-100 hover:bg-red-200 text-red-700 px-3 py-1 rounded-lg text-xs font-semibold"
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </div>
  )
}

export default AdminTrue