const API_URL = (
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'
).replace(/\/$/, '');

export type User = {
  id: string;
  name: string;
  email: string;
  createdAt?: string;
};

export type Vehicle = {
  id: string;
  userId?: string;
  brand: string;
  model: string;
  year: number;
  modelYear?: number | null;
  plate?: string | null;
  renavam?: string | null;
  chassis?: string | null;
  color?: string | null;
  fuel?: string | null;
  vehicleType?: string | null;
  nickname?: string | null;
  createdAt?: string;
  updatedAt?: string;
};

export type VehiclePayload = Omit<
  Vehicle,
  'id' | 'userId' | 'createdAt' | 'updatedAt'
>;

export function getToken() {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('drivo-access-token');
}

export function getUser(): User | null {
  if (typeof window === 'undefined') return null;

  try {
    const value = localStorage.getItem('drivo-user');
    return value ? JSON.parse(value) : null;
  } catch {
    return null;
  }
}

export function logout() {
  localStorage.removeItem('drivo-access-token');
  localStorage.removeItem('drivo-user');
}

async function request<T>(
  path: string,
  init: RequestInit = {},
  auth = true
): Promise<T> {
  const headers = new Headers(init.headers);

  if (!(init.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }

  if (auth) {
    const token = getToken();
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
  }

  const response = await fetch(`${API_URL}${path}`, {
    ...init,
    headers,
  });

  const payload = await response.json().catch(() => null);

  if (!response.ok) {
    const message = Array.isArray(payload?.message)
      ? payload.message.join(' ')
      : payload?.message;

    if (
      response.status === 401 &&
      typeof window !== 'undefined'
    ) {
      logout();
    }

    throw new Error(
      message || `Erro na API (${response.status}).`
    );
  }

  return payload as T;
}

export async function login(
  email: string,
  password: string
) {
  const result = await request<{
    user: User;
    accessToken: string;
  }>(
    '/auth/login',
    {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    },
    false
  );

  localStorage.setItem(
    'drivo-access-token',
    result.accessToken
  );

  localStorage.setItem(
    'drivo-user',
    JSON.stringify(result.user)
  );

  return result;
}

export async function register(
  name: string,
  email: string,
  password: string
) {
  const result = await request<{
    user: User;
    accessToken: string;
  }>(
    '/auth/register',
    {
      method: 'POST',
      body: JSON.stringify({ name, email, password }),
    },
    false
  );

  localStorage.setItem(
    'drivo-access-token',
    result.accessToken
  );

  localStorage.setItem(
    'drivo-user',
    JSON.stringify(result.user)
  );

  return result;
}

export async function currentUser() {
  return request<{ id: string; email: string }>(
    '/auth/me'
  );
}

export async function changePassword(
  currentPassword: string,
  newPassword: string,
): Promise<{ message: string }> {
  return request<{ message: string }>(
    '/auth/change-password',
    {
      method: 'PATCH',
      body: JSON.stringify({
        currentPassword,
        newPassword,
      }),
    },
  );
}

export const vehiclesApi = {
  list: () => request<Vehicle[]>('/vehicles'),

  get: (id: string) =>
    request<Vehicle>(
      `/vehicles/${encodeURIComponent(id)}`
    ),

  create: (data: VehiclePayload) =>
    request<Vehicle>('/vehicles', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  update: (
    id: string,
    data: Partial<VehiclePayload>
  ) =>
    request<Vehicle>(
      `/vehicles/${encodeURIComponent(id)}`,
      {
        method: 'PATCH',
        body: JSON.stringify(data),
      }
    ),

  remove: (id: string) =>
    request<{ message: string }>(
      `/vehicles/${encodeURIComponent(id)}`,
      {
        method: 'DELETE',
      }
    ),
};

export async function extractCrlv(file: File) {
  const body = new FormData();
  body.append('file', file);

  return request<Omit<VehiclePayload, 'nickname'>>(
    '/crlv/extract',
    {
      method: 'POST',
      body,
    }
  );
}