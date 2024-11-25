import { auth } from '@/lib/firebase'
import { sendEmailVerification } from 'firebase/auth'

export async function sendVerificationEmail() {
  const user = auth.currentUser
  if (user && !user.emailVerified) {
    await sendEmailVerification(user)
  }
}

export function checkEmailVerification() {
  const user = auth.currentUser
  return user?.emailVerified ?? false
} 