import axios, { AxiosError, AxiosResponse } from "axios";

/** Envelope returned by every backend endpoint, success or error. */
export interface ApiEnvelope<T> {
  success: boolean;
  message: string;
  data: T;
}

const BASE_URL =
  process.env.EXPO_PUBLIC_API_URL || "https://business-insights-api.onrender.com";

/**
 * Long timeout on purpose: the API lives on Render's free tier and a cold
 * start can take ~50 seconds before the first response arrives.
 */
const client = axios.create({
  baseURL: BASE_URL,
  timeout: 90000,
  headers: { "Content-Type": "application/json" },
});

// Module-level token + 401 callback so AuthContext and this module do not
// import each other (avoids a circular dependency).
let authToken: string | null = null;
let onUnauthorized: (() => void) | null = null;

export function setAuthToken(token: string | null): void {
  authToken = token;
}

export function setOnUnauthorized(callback: (() => void) | null): void {
  onUnauthorized = callback;
}

client.interceptors.request.use((config) => {
  if (authToken) {
    config.headers.Authorization = `Bearer ${authToken}`;
  }
  return config;
});

client.interceptors.response.use(
  (response: AxiosResponse<ApiEnvelope<unknown>>) => {
    const body = response.data;
    // Unwrap the { success, message, data } envelope: resolved value IS `data`.
    if (body && typeof body === "object" && "data" in body) {
      return body.data as unknown as AxiosResponse;
    }
    return response;
  },
  (error: AxiosError<ApiEnvelope<null>>) => {
    const status = error.response?.status;
    const hadAuthHeader = Boolean(error.config?.headers?.Authorization);

    // Expired/invalid token on a protected call -> force logout.
    if (status === 401 && hadAuthHeader && onUnauthorized) {
      onUnauthorized();
    }

    const serverMessage = error.response?.data?.message;
    let message: string;
    if (serverMessage) {
      message = serverMessage;
    } else if (error.code === "ECONNABORTED") {
      message =
        "The request timed out. The server may still be waking up — please try again.";
    } else {
      message = "Network error. Please check your connection and try again.";
    }
    return Promise.reject(new Error(message));
  }
);

export default client;
