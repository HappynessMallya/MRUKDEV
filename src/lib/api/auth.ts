// Auth fetchers for the Fanisi Studio API.
//
// Tokens are returned in the response BODY (no cookies). Store both:
// the 7-day access token (sent as `Authorization: Bearer` on protected calls)
// and the 30-day refresh token (POST /auth/refresh to mint a new pair).
// `/auth/refresh` still needs the tenant header (apiFetch adds it).

import { apiFetch } from '@/lib/apiClient'
import type {
  ApiLoginResponse,
  ApiRegisterResponse,
  LoginInput,
  RegisterInput,
} from '@/types/api'

export function login(input: LoginInput): Promise<ApiLoginResponse> {
  return apiFetch<ApiLoginResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify(input),
  })
}

export function register(input: RegisterInput): Promise<ApiRegisterResponse> {
  return apiFetch<ApiRegisterResponse>('/auth/register', {
    method: 'POST',
    body: JSON.stringify(input),
  })
}

export function refresh(refreshToken: string): Promise<ApiLoginResponse> {
  return apiFetch<ApiLoginResponse>('/auth/refresh', {
    method: 'POST',
    body: JSON.stringify({ refreshToken }),
  })
}
