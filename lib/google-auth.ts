import { BASE_URL, saveAuthToStorage, type AuthPayloadLike } from "./auth";

export interface GoogleAuthResponse extends AuthPayloadLike {
  access: string;
  refresh: string;
  account_type: string;
}

export interface GoogleAuthError {
  detail?: string;
  id_token?: string[];
}

/**
 * Authenticate with Google using an ID token from the Google OAuth popup.
 *
 * @param idToken - The Google ID token from the frontend
 * @returns The authentication response with JWT tokens
 * @throws Error if authentication fails
 */
export async function authenticateWithGoogle(
  idToken: string
): Promise<GoogleAuthResponse> {
  const res = await fetch(`${BASE_URL}/api/auth/google/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({ id_token: idToken }),
  });

  const data = await res.json();

  if (!res.ok) {
    const errorData = data as GoogleAuthError;
    // Extract error message
    let errorMessage = "Google authentication failed";
    if (errorData.detail) {
      errorMessage = errorData.detail;
    } else if (errorData.id_token && errorData.id_token.length > 0) {
      errorMessage = errorData.id_token[0];
    }
    throw new Error(errorMessage);
  }

  // Save tokens to localStorage
  saveAuthToStorage(data);

  return data as GoogleAuthResponse;
}
