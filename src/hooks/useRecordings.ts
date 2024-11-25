import { useState, useEffect } from 'react'
import { db } from '@/lib/firebase'
import { collection, query, where, orderBy, onSnapshot } from 'firebase/firestore'
import type { Recording } from '@/lib/schema'
import { useAuthContext } from '@/components/AuthProvider'

export function useRecordings(goalId?: string) {
  const { user } = useAuthContext()
  const [recordings, setRecordings] = useState<Recording[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!user) return

    setLoading(true)
    setError(null)

    const recordingsRef = collection(db, 'recordings')
    const constraints = [
      where('userId', '==', user.uid),
      orderBy('createdAt', 'desc')
    ]

    if (goalId) {
      constraints.push(where('goalId', '==', goalId))
    }

    const q = query(recordingsRef, ...constraints)

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const newRecordings = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate(),
        })) as Recording[]

        setRecordings(newRecordings)
        setLoading(false)
      },
      (error) => {
        console.error('Error fetching recordings:', error)
        setError(error.message)
        setLoading(false)
      }
    )

    return () => unsubscribe()
  }, [user, goalId])

  return { recordings, loading, error }
} 