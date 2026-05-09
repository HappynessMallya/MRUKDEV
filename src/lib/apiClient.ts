// One base fetcher. The browser sends cookies + the Host header automatically;
// the backend reads Host → resolves the tenant → queries the right DB.
// No tenant ID needs to be passed in the request body or URL.

export async function apiFetch<T>(
  path: string,
  options?: RequestInit
): Promise<T> {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL ?? ''
  const res = await fetch(`${baseUrl}${path}`, {
    ...options,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  })

  if (!res.ok) {
    const body = await res.text().catch(() => '')
    throw new Error(`API ${res.status} ${path}: ${body}`)
  }

  return res.json() as Promise<T>
}
