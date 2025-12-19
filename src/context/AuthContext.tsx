import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import {
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  User,
  updateProfile,
} from 'firebase/auth'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { auth, googleProvider, storage } from '../FirebaseConfig'

// Check if Firebase is properly configured
if (!auth || !googleProvider) {
  console.warn('Firebase Auth is not configured. Please set up Firebase environment variables.');
}

interface UserProfile {
  displayName: string
  email: string
  photoURL: string | null
}

interface AuthContextType {
  user: User | null
  userProfile: UserProfile | null
  loading: boolean
  signInWithGoogle: () => Promise<void>
  logout: () => Promise<void>
  updateUserProfile: (data: Partial<UserProfile>) => Promise<void>
  uploadProfilePicture: (file: File) => Promise<string>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!auth) {
      setLoading(false)
      return
    }

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user)
      if (user) {
        setUserProfile({
          displayName: user.displayName || '',
          email: user.email || '',
          photoURL: user.photoURL,
        })
      } else {
        setUserProfile(null)
      }
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  const handleAuthError = (error: any, providerName: string) => {
    console.error(`Error signing in with ${providerName}:`, error)
    
    // Handle specific error codes
    if (error.code === 'auth/configuration-not-found') {
      throw new Error(`Firebase Auth configuration not found. Please verify:\n` +
        `1. Your .env file has VITE_FIREBASE_AUTH_DOMAIN set correctly\n` +
        `2. The authDomain matches your Firebase project (format: project-id.firebaseapp.com)\n` +
        `3. You restarted the dev server after creating/updating .env\n` +
        `4. ${providerName} sign-in is enabled in Firebase Console > Authentication > Sign-in method`)
    }
    
    if (error.code === 'auth/operation-not-allowed') {
      throw new Error(`${providerName} sign-in is not enabled. Please enable it in Firebase Console > Authentication > Sign-in method.`)
    }
    
    if (error.code === 'auth/popup-closed-by-user') {
      throw error // Re-throw to allow silent handling
    }
    
    if (error.code) {
      throw new Error(`Authentication error: ${error.code}${error.message ? ` - ${error.message}` : ''}`)
    }
    throw error
  }

  const signInWithGoogle = async () => {
    if (!auth || !googleProvider) {
      throw new Error('Firebase Auth is not configured. Please set up your .env file with Firebase credentials.')
    }
    
    if (!auth.app || !auth.app.options || !auth.app.options.authDomain) {
      throw new Error('Firebase Auth configuration is invalid. Please verify your .env file has correct VITE_FIREBASE_AUTH_DOMAIN and restart the dev server.')
    }
    
    try {
      await signInWithPopup(auth, googleProvider)
    } catch (error: any) {
      handleAuthError(error, 'Google')
    }
  }


  const logout = async () => {
    if (!auth) {
      throw new Error('Firebase Auth is not configured.')
    }
    try {
      await signOut(auth)
    } catch (error) {
      console.error('Error signing out:', error)
      throw error
    }
  }

  const updateUserProfile = async (data: Partial<UserProfile>) => {
    if (!user) throw new Error('No user logged in')
    try {
      await updateProfile(user, {
        displayName: data.displayName,
        photoURL: data.photoURL || undefined,
      })
      setUserProfile((prev) => (prev ? { ...prev, ...data } : null))
    } catch (error) {
      console.error('Error updating profile:', error)
      throw error
    }
  }


  const uploadProfilePicture = async (file: File): Promise<string> => {
    if (!user || !storage) {
      throw new Error('User not logged in or Firebase Storage not configured')
    }

    try {
      // Create a reference to the file location
      const fileRef = ref(storage, `profile-pictures/${user.uid}/${Date.now()}_${file.name}`)
      
      // Upload the file
      await uploadBytes(fileRef, file)
      
      // Get the download URL
      const downloadURL = await getDownloadURL(fileRef)
      
      // Update user profile with the new photo URL
      await updateProfile(user, { photoURL: downloadURL })
      
      // Update local state
      setUserProfile((prev) => (prev ? { ...prev, photoURL: downloadURL } : null))
      
      return downloadURL
    } catch (error) {
      console.error('Error uploading profile picture:', error)
      throw error
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        userProfile,
        loading,
        signInWithGoogle,
        logout,
        updateUserProfile,
        uploadProfilePicture,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
