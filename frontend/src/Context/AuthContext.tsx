import { createContext, useContext, useReducer, useEffect, useState } from "react";

type User = {
  id: string | number;
  name: string;
  email: string;
  role: "admin" | "user";
};

type AuthState = {
  user: User | null;
};

type AuthAction =
  | { type: "LOGIN"; payload: User }
  | { type: "LOGOUT" };

const AuthContext = createContext<any>(null);

function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case "LOGIN":
      return { user: action.payload };

    case "LOGOUT":
      return { user: null };

    default:
      return state;
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(authReducer, { user: null });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem("authUser");
    if (stored) 
    {
      dispatch({ type: "LOGIN", payload: JSON.parse(stored) });
    }
    setLoading(false);
  }, []);

  const login = (user: User) => {
    localStorage.setItem("authUser", JSON.stringify(user));
    dispatch({ type: "LOGIN", payload: user });
  };

  const logout = () => {
    localStorage.removeItem("authUser");
    dispatch({ type: "LOGOUT" });
  };

  return (
    <AuthContext.Provider value={{ user: state.user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);