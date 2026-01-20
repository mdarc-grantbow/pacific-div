import { useQuery } from "@tanstack/react-query";
import { createContext, useContext } from "react";
import type { User } from "@shared/schema";

interface AuthContextType {
  user: User | undefined;
  isLoading: boolean;
  isAuthenticated: boolean;
}

export const AuthContext = createContext<AuthContextType>({
  user: undefined,
  isLoading: true,
  isAuthenticated: false,
});

export function useAuth() {
  const { data: user, isLoading } = useQuery<User>({
    queryKey: ["/api/auth/user"],
    retry: false,
  });
  if (!user) {
    throw new Error('useAuth must be used');
    //return {
    //  user: undefined,
    //  isLoading: false,
    //  isAuthenticated: false,
    //};
  }

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
  };
}

export function useAuthContext() {
  return useContext(AuthContext);
}
