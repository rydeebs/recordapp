"use client"

import { createContext, useContext, useState, useEffect } from 'react'
import { 
  auth
} from '@/lib/firebase'
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, updateProfile, User } from 'firebase/auth'
import { ProfileSetup } from './ProfileSetup'

interface AuthContextType {
  user: User | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [showProfileSetup, setShowProfileSetup] = useState(false)

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user)
      if (user && !user.displayName) {
        setShowProfileSetup(true)
      }
    })

    return () => unsubscribe()
  }, [])

  const signIn = async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password)
    } catch (error) {
      throw error
    }
  }

  const signUp = async (email: string, password: string) => {
    try {
      await createUserWithEmailAndPassword(auth, email, password)
    } catch (error) {
      throw error
    }
  }

  const signOut = async () => {
    try {
      await signOut(auth)
    } catch (error) {
      throw error
    }
  }

  const updateUserProfile = async (user: User, displayName: string, photoURL?: string) => {
    try {
      await updateProfile(user, {
        displayName,
        photoURL
      });
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, signIn, signUp, signOut }}>
      {children}
      {showProfileSetup && (
        <ProfileSetup onComplete={() => setShowProfileSetup(false)} />
      )}
    </AuthContext.Provider>
  )
}

export function useAuthContext() {
  return useContext(AuthContext)
} 