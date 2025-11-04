"use client"

import { createContext, useContext, useState, useEffect } from "react"
import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile
} from "firebase/auth"
import { doc, setDoc, getDoc } from "firebase/firestore"
import { auth, db } from "../firebase/config"

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth debe ser usado dentro de AuthProvider")
  }
  return context
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [userData, setUserData] = useState(null)
  const [loading, setLoading] = useState(true)

  // Registrar nuevo usuario
  const signup = async (email, password, nombre, telefono) => {
    try {
      // Crear usuario en Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)
      const user = userCredential.user

      // Actualizar perfil con nombre
      await updateProfile(user, {
        displayName: nombre
      })

      // Crear documento en Firestore
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        nombre: nombre,
        email: email,
        telefono: telefono,
        rol: "cliente", // Por defecto es cliente
        createdAt: new Date().toISOString()
      })

      return { success: true, user: userCredential.user }
    } catch (error) {
      console.error("Error en signup:", error)
      return { success: false, error: error.message }
    }
  }

  // Iniciar sesión
  const login = async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password)
      return { success: true, user: userCredential.user }
    } catch (error) {
      console.error("Error en login:", error)
      return { success: false, error: error.message }
    }
  }

  // Cerrar sesión
  const logout = async () => {
    try {
      await signOut(auth)
      setUserData(null)
      return { success: true }
    } catch (error) {
      console.error("Error en logout:", error)
      return { success: false, error: error.message }
    }
  }

  // Obtener datos del usuario desde Firestore
  const getUserData = async (uid) => {
    try {
      const userDoc = await getDoc(doc(db, "users", uid))
      if (userDoc.exists()) {
        return userDoc.data()
      }
      return null
    } catch (error) {
      console.error("Error obteniendo datos del usuario:", error)
      return null
    }
  }

  // Verificar si es admin
  const isAdmin = () => {
    return userData?.rol === "admin"
  }

  // Escuchar cambios en la autenticación
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUser(user)
        // Obtener datos adicionales de Firestore
        const data = await getUserData(user.uid)
        setUserData(data)
      } else {
        setUser(null)
        setUserData(null)
      }
      setLoading(false)
    })

    return unsubscribe
  }, [])

  const value = {
    user,
    userData,
    loading,
    signup,
    login,
    logout,
    isAdmin,
    getUserData
  }

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  )
}