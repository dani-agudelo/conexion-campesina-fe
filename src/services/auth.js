import { fetcher } from "../lib/http";

const API_URL = import.meta.env.VITE_API_URL;

export const login = async (loginDto) => {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',

    },
    body: JSON.stringify(loginDto)
  })

  return await res.json()
}

export const register = async (registerDto) => {
  const res = await fetch(`${API_URL}/auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',

    },
    body: JSON.stringify(registerDto)
  })

  return await res.json()
}

export const getUser = async () => {
  return await fetcher('auth/verify')
}

export const getUserById = async (userId) => {
  return await fetcher(`auth/userinfo/${userId}`);
}

