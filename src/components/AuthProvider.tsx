import { createContext, useContext } from 'react';
import { useAuth } from '@/hooks/useAuth';

const AuthContext = createContext<ReturnType<typeof useAuth>>({} as ReturnType<typeof useAuth>);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const auth = useAuth();

  return (
    <AuthContext.Provider value={auth}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuthContext = () => useContext(AuthContext); 