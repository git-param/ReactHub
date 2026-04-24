const API_BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:8000";
const AUTH_USER_KEY = "rh_auth_user";
const AUTH_TOKEN_KEY = "rh_auth_token";
const CONTEXT_AUTH_USER_KEY = "authUser";

type BackendUserResponse = {
  id: number;
  name: string;
  email: string;
  role?: "admin" | "user";
  is_active: boolean;
  created_at: string;
};

type BackendLoginResponse = {
  access_token: string;
  token_type: string;
  user: BackendUserResponse;
};

export type AuthUser = {
  id: number | string;
  name: string;
  email: string;
  role: "admin" | "user";
};

export type RegisterPayload = {
  name: string;
  email: string;
  password: string;
};

const toPublicUser = (user: BackendUserResponse): AuthUser => ({
  id: user.id,
  name: user.name,
  email: user.email,
  role: user.role === "admin" ? "admin" : "user",
});

const parseErrorMessage = (error: unknown) => {
  if (error instanceof Error) {
    return error.message;
  }

  return "Something went wrong. Please try again.";
};

const getStorageUser = (storage: Storage) => {
  const raw = storage.getItem(AUTH_USER_KEY);
  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw) as AuthUser;
  } catch {
    storage.removeItem(AUTH_USER_KEY);
    return null;
  }
};

const getStorageUserByKey = (storage: Storage, key: string) => {
  const raw = storage.getItem(key);
  if (!raw) {
    return null;
  }

  try {
    const parsed = JSON.parse(raw) as Partial<AuthUser>;
    if (!parsed?.name || !parsed?.email) {
      return null;
    }
    return {
      id: parsed.id ?? "",
      name: parsed.name,
      email: parsed.email,
    } as AuthUser;
  } catch {
    return null;
  }
};

export const saveAuthUser = (user: AuthUser, token: string, remember: boolean) => {
  const userSerialized = JSON.stringify(user);
  if (remember) {
    localStorage.setItem(AUTH_USER_KEY, userSerialized);
    localStorage.setItem(AUTH_TOKEN_KEY, token);
    sessionStorage.removeItem(AUTH_USER_KEY);
    sessionStorage.removeItem(AUTH_TOKEN_KEY);
    return;
  }

  sessionStorage.setItem(AUTH_USER_KEY, userSerialized);
  sessionStorage.setItem(AUTH_TOKEN_KEY, token);
  localStorage.removeItem(AUTH_USER_KEY);
  localStorage.removeItem(AUTH_TOKEN_KEY);
};

export const getAuthUser = () =>
  getStorageUser(localStorage) ??
  getStorageUser(sessionStorage) ??
  getStorageUserByKey(localStorage, CONTEXT_AUTH_USER_KEY);

export const getAuthToken = () =>
  localStorage.getItem(AUTH_TOKEN_KEY) ?? 
  sessionStorage.getItem(AUTH_TOKEN_KEY);

export const clearAuthUser = () => {
  localStorage.removeItem(AUTH_USER_KEY);
  localStorage.removeItem(AUTH_TOKEN_KEY);
  sessionStorage.removeItem(AUTH_USER_KEY);
  sessionStorage.removeItem(AUTH_TOKEN_KEY);
};

export const loginUser = async (email: string, password: string) => {
  try {
    const normalizedEmail = email.trim().toLowerCase();

    const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: normalizedEmail,
        password: password,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || "Invalid email or password.");
    }

    const loginResponse = (await response.json()) as BackendLoginResponse;
    
    return {
      user: toPublicUser(loginResponse.user),
      token: loginResponse.access_token,
    };
  } catch (error) {
    throw new Error(parseErrorMessage(error));
  }
};

export const registerUser = async (payload: RegisterPayload) => {
  try {
    const normalizedEmail = payload.email.trim().toLowerCase();

    const createResponse = await fetch(`${API_BASE_URL}/api/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: payload.name.trim(),
        email: normalizedEmail,
        password: payload.password,
      }),
    });

    if (!createResponse.ok) {
      const errorData = await createResponse.json().catch(() => ({}));
      throw new Error(errorData.detail || "Could not create account.");
    }

    const createdUser = (await createResponse.json()) as BackendUserResponse;
    return {
      user: toPublicUser(createdUser),
      token: null,
    };
  } catch (error) {
    throw new Error(parseErrorMessage(error));
  }
};
