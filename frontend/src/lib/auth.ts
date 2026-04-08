const API_BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3001";
const AUTH_USER_KEY = "rh_auth_user";
const CONTEXT_AUTH_USER_KEY = "authUser";

type UserRecord = {
  id: number | string;
  name: string;
  email: string;
  password: string;
  role?: "admin" | "user";
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

const toPublicUser = (user: UserRecord): AuthUser => ({
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

export const saveAuthUser = (user: AuthUser, remember: boolean) => {
  const serialized = JSON.stringify(user);
  if (remember) {
    localStorage.setItem(AUTH_USER_KEY, serialized);
    sessionStorage.removeItem(AUTH_USER_KEY);
    return;
  }

  sessionStorage.setItem(AUTH_USER_KEY, serialized);
  localStorage.removeItem(AUTH_USER_KEY);
};

export const getAuthUser = () =>
  getStorageUser(localStorage) ??
  getStorageUser(sessionStorage) ??
  getStorageUserByKey(localStorage, CONTEXT_AUTH_USER_KEY);

export const clearAuthUser = () => {
  localStorage.removeItem(AUTH_USER_KEY);
  sessionStorage.removeItem(AUTH_USER_KEY);
};

export const loginUser = async (email: string, password: string) => {
  try {
    const normalizedEmail = email.trim().toLowerCase();
    const query = new URLSearchParams({
      email: normalizedEmail,
      password,
    });

    const response = await fetch(`${API_BASE_URL}/users?${query.toString()}`);
    if (!response.ok) {
      throw new Error("Unable to reach auth server.");
    }

    const users = (await response.json()) as UserRecord[];
    if (!users.length) {
      throw new Error("Invalid Credentials.");
    }

    return toPublicUser(users[0]);
  } catch (error) {
    throw new Error(parseErrorMessage(error));
  }
};

export const registerUser = async (payload: RegisterPayload) => {
  try {
    const normalizedEmail = payload.email.trim().toLowerCase();

    const existingResponse = await fetch(
      `${API_BASE_URL}/users?email=${encodeURIComponent(normalizedEmail)}`,
    );

    if (!existingResponse.ok) {
      throw new Error("Unable to validate email.");
    }

    const existingUsers = (await existingResponse.json()) as UserRecord[];
    if (existingUsers.length) {
      throw new Error("An account with this email already exists.");
    }

    const createResponse = await fetch(`${API_BASE_URL}/users`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: payload.name.trim(),
        email: normalizedEmail,
        password: payload.password,
        role: "user",
      }),
    });

    if (!createResponse.ok) {
      throw new Error("Could not create account.");
    }

    const createdUser = (await createResponse.json()) as UserRecord;
    return toPublicUser(createdUser);
  } catch (error) {
    throw new Error(parseErrorMessage(error));
  }
};
