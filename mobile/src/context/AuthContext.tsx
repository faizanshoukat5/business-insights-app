import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import * as SecureStore from "expo-secure-store";
import { useQueryClient } from "@tanstack/react-query";
import { setAuthToken, setOnUnauthorized } from "../api/client";
import { login as loginRequest, User } from "../api/endpoints";

const TOKEN_KEY = "auth_token";
const USER_KEY = "auth_user";

interface AuthContextValue {
  token: string | null;
  user: User | null;
  /** True while the persisted session is being read from secure storage. */
  isRestoring: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isRestoring, setIsRestoring] = useState(true);
  const queryClient = useQueryClient();

  // Restore a persisted session on launch.
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const [storedToken, storedUser] = await Promise.all([
          SecureStore.getItemAsync(TOKEN_KEY),
          SecureStore.getItemAsync(USER_KEY),
        ]);
        if (mounted && storedToken) {
          setAuthToken(storedToken);
          setToken(storedToken);
          if (storedUser) {
            try {
              setUser(JSON.parse(storedUser) as User);
            } catch {
              // Corrupt stored user is non-fatal; token alone is enough.
            }
          }
        }
      } catch {
        // Secure storage unavailable -> start signed out.
      } finally {
        if (mounted) setIsRestoring(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const result = await loginRequest(email, password);
    setAuthToken(result.token);
    setToken(result.token);
    setUser(result.user);
    try {
      await Promise.all([
        SecureStore.setItemAsync(TOKEN_KEY, result.token),
        SecureStore.setItemAsync(USER_KEY, JSON.stringify(result.user)),
      ]);
    } catch {
      // Persistence failure only means the session won't survive a restart.
    }
  }, []);

  const logout = useCallback(async () => {
    setAuthToken(null);
    setToken(null);
    setUser(null);
    queryClient.clear();
    try {
      await Promise.all([
        SecureStore.deleteItemAsync(TOKEN_KEY),
        SecureStore.deleteItemAsync(USER_KEY),
      ]);
    } catch {
      // Nothing sensible to do if the delete fails.
    }
  }, [queryClient]);

  // Any 401 from a protected endpoint (expired/invalid token) signs the user out.
  useEffect(() => {
    setOnUnauthorized(() => {
      void logout();
    });
    return () => setOnUnauthorized(null);
  }, [logout]);

  const value = useMemo(
    () => ({ token, user, isRestoring, login, logout }),
    [token, user, isRestoring, login, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
