/**
 * API Client - Centralized API communication layer
 */

import { authFetch, BASE_URL } from "@/lib/auth"
import logger from "@/lib/logger"
import type { z } from "zod"

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public data?: unknown
  ) {
    super(message)
    this.name = "ApiError"
  }
}

export class ValidationError extends Error {
  constructor(
    message: string,
    public issues: z.ZodIssue[]
  ) {
    super(message)
    this.name = "ValidationError"
  }
}

interface RequestOptions extends RequestInit {
  params?: Record<string, string | number | boolean | undefined>
}

async function request<T>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<T> {
  const { params, ...fetchOptions } = options

  let url = `${BASE_URL}${endpoint}`

  // Add query parameters if provided
  if (params) {
    const searchParams = new URLSearchParams()
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        searchParams.append(key, String(value))
      }
    })
    const queryString = searchParams.toString()
    if (queryString) {
      url += `?${queryString}`
    }
  }

  logger.debug(`API Request: ${fetchOptions.method || "GET"} ${url}`)

  const response = await authFetch(url, fetchOptions)

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    logger.error(`API Error: ${response.status}`, errorData)
    throw new ApiError(
      errorData.detail || errorData.message || "Request failed",
      response.status,
      errorData
    )
  }

  // Handle 204 No Content
  if (response.status === 204) {
    return {} as T
  }

  const data = await response.json()
  return data as T
}

/**
 * Make a validated request with Zod schema
 */
async function validatedRequest<T>(
  endpoint: string,
  schema: z.ZodType<T>,
  options: RequestOptions = {}
): Promise<T> {
  const data = await request<unknown>(endpoint, options)

  const result = schema.safeParse(data)
  if (!result.success) {
    logger.warn(`API response validation failed for ${endpoint}:`, result.error.issues)
    // In development, throw the error; in production, log and return data as-is
    if (process.env.NODE_ENV === "development") {
      throw new ValidationError("API response validation failed", result.error.issues)
    }
    return data as T
  }

  return result.data
}

export const api = {
  get: <T>(endpoint: string, options?: RequestOptions) =>
    request<T>(endpoint, { ...options, method: "GET" }),

  post: <T>(endpoint: string, body?: unknown, options?: RequestOptions) =>
    request<T>(endpoint, {
      ...options,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
      },
      body: body ? JSON.stringify(body) : undefined,
    }),

  put: <T>(endpoint: string, body?: unknown, options?: RequestOptions) =>
    request<T>(endpoint, {
      ...options,
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
      },
      body: body ? JSON.stringify(body) : undefined,
    }),

  patch: <T>(endpoint: string, body?: unknown, options?: RequestOptions) =>
    request<T>(endpoint, {
      ...options,
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
      },
      body: body ? JSON.stringify(body) : undefined,
    }),

  delete: <T>(endpoint: string, options?: RequestOptions) =>
    request<T>(endpoint, { ...options, method: "DELETE" }),

  // For file uploads
  upload: <T>(endpoint: string, formData: FormData, options?: RequestOptions) =>
    request<T>(endpoint, {
      ...options,
      method: "POST",
      body: formData,
      // Don't set Content-Type - browser will set it with boundary
    }),

  // Validated requests with Zod schemas
  validated: {
    get: <T>(endpoint: string, schema: z.ZodType<T>, options?: RequestOptions) =>
      validatedRequest<T>(endpoint, schema, { ...options, method: "GET" }),

    post: <T>(endpoint: string, schema: z.ZodType<T>, body?: unknown, options?: RequestOptions) =>
      validatedRequest<T>(endpoint, schema, {
        ...options,
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...options?.headers,
        },
        body: body ? JSON.stringify(body) : undefined,
      }),
  },
}

export default api
