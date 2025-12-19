import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { signInWithEmailAndPassword, signOut, onAuthStateChanged, User } from 'firebase/auth'
import { ref, get } from 'firebase/database'
import { auth, db } from '../FirebaseConfig'

interface AdminAuthContextType {
  isAuthenticated: boolean
  adminUser: User | null
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  loading: boolean
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined)

// Admin email addresses (stored in Firebase Realtime Database)
const ADMIN_COLLECTION = 'admins'

export const AdminAuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [adminUser, setAdminUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  // Check if user is admin
  const checkIfAdmin = async (user: User): Promise<boolean> => {
    if (!db || !user.email) return false

    try {
      const adminRef = ref(db, `${ADMIN_COLLECTION}/${user.uid}`)
      const snapshot = await get(adminRef)
      
      if (snapshot.exists()) {
        return true
      }

      // Also check by email
      const adminsRef = ref(db, ADMIN_COLLECTION)
      const adminsSnapshot = await get(adminsRef)
      
      if (adminsSnapshot.exists()) {
        const admins = adminsSnapshot.val()
        return Object.values(admins).some((admin: any) => admin.email === user.email)
      }

      return false
    } catch (error) {
      console.error('Error checking admin status:', error)
      return false
    }
  }

  useEffect(() => {
    if (!auth) {
      setLoading(false)
      return
    }

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const isAdmin = await checkIfAdmin(user)
        setIsAuthenticated(isAdmin)
        setAdminUser(isAdmin ? user : null)
      } else {
        setIsAuthenticated(false)
        setAdminUser(null)
      }
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  const login = async (email: string, password: string): Promise<void> => {
    if (!auth) {
      throw new Error('Firebase Auth is not configured')
    }

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password)
      const isAdmin = await checkIfAdmin(userCredential.user)
      
      if (!isAdmin) {
        await signOut(auth)
        throw new Error('Access denied. This account is not authorized as an admin.')
      }

      setIsAuthenticated(true)
      setAdminUser(userCredential.user)
    } catch (error: any) {
      console.error('Admin login error:', error)
      if (error.code === 'auth/user-not-found') {
        throw new Error('No account found with this email address.')
      }
      if (error.code === 'auth/wrong-password') {
        throw new Error('Incorrect password. Please try again.')
      }
      if (error.code === 'auth/invalid-email') {
        throw new Error('Invalid email address.')
      }
      if (error.code === 'auth/user-disabled') {
        throw new Error('This account has been disabled.')
      }
      throw new Error(error.message || 'Login failed. Please try again.')
    }
  }

  const logout = async () => {
    if (!auth) {
      throw new Error('Firebase Auth is not configured')
    }
    try {
      await signOut(auth)
      setIsAuthenticated(false)
      setAdminUser(null)
    } catch (error) {
      console.error('Error signing out:', error)
      throw error
    }
  }

  return (
    <AdminAuthContext.Provider value={{ isAuthenticated, adminUser, login, logout, loading }}>
      {children}
    </AdminAuthContext.Provider>
  )
}

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext)
  if (!context) {
    throw new Error('useAdminAuth must be used within AdminAuthProvider')
  }
  return context
}
