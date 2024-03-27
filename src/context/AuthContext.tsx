import { createContext, PropsWithChildren, useContext } from "react";
import { User } from "../types/users";

type AuthContextType = {
  isSignedIn: boolean;
  user: User | null;
  setToken: (token: string) => void;
};

const AuthContext = createContext<AuthContextType>({
  isSignedIn: false,
  user: null,
  setToken: () => {},
});

type AuthProviderProps = PropsWithChildren & AuthContextType;

function AuthProvider({
  isSignedIn,
  user,
  setToken,
  children,
}: AuthProviderProps) {
  const value = {
    isSignedIn: isSignedIn,
    user,
    setToken,
  };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
}

export default AuthProvider;
