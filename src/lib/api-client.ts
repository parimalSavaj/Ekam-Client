// NEXT_PUBLIC_AUTH_URL is the public origin of the Express API (the same one Better Auth uses).
const baseURL = process.env.NEXT_PUBLIC_AUTH_URL;
if (!baseURL) throw new Error("NEXT_PUBLIC_AUTH_URL is required");

const FALLBACK_MESSAGE = "Something went wrong. Please try again.";

/** A failed API call. The message is written for people and is safe to show in the UI. */
export class ApiRequestError extends Error {
  constructor(readonly status: number, message: string) {
    super(message);
    this.name = "ApiRequestError";
  }
}

/** Turns anything thrown by an API call into text for an Alert. Unexpected errors never leak details. */
export function errorMessage(cause: unknown): string {
  return cause instanceof ApiRequestError ? cause.message : FALLBACK_MESSAGE;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

type RequestOptions = {
  method?: "GET" | "POST" | "PATCH" | "DELETE";
  /** A plain value is sent as JSON. FormData is sent as multipart (file uploads). */
  body?: unknown;
};

/**
 * Calls the Ekam API with the session cookie. Success bodies look like { statusCode, data };
 * failures look like { statusCode, message }.
 */
export async function apiRequest<T>(path: string, { method = "GET", body }: RequestOptions = {}): Promise<T> {
  // For FormData the browser sets the multipart Content-Type itself, including the boundary.
  const isForm = body instanceof FormData;
  let response: Response;
  try {
    response = await fetch(`${baseURL}${path}`, {
      method,
      credentials: "include",
      headers: body === undefined || isForm ? undefined : { "Content-Type": "application/json" },
      body: body === undefined ? undefined : isForm ? body : JSON.stringify(body),
    });
  } catch {
    throw new ApiRequestError(0, "Could not reach the server. Check your connection and try again.");
  }

  const payload: unknown = await response.json().catch(() => null);

  if (!response.ok) {
    if (response.status === 401) throw new ApiRequestError(401, "Your session has ended. Please log in again.");
    const message = isRecord(payload) && typeof payload.message === "string" ? payload.message : FALLBACK_MESSAGE;
    throw new ApiRequestError(response.status, message);
  }

  if (!isRecord(payload) || !("data" in payload)) throw new ApiRequestError(response.status, FALLBACK_MESSAGE);
  return payload.data as T;
}
