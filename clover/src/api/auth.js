import client from './client'

export async function register({ username, email, password, firstName, lastName }) {
  const { data } = await client.post('/auth/register/', {
    username,
    email,
    password,
    first_name: firstName || '',
    last_name: lastName || '',
  })
  return data
}

export async function login({ username, password }) {
  const { data } = await client.post('/auth/login/', { username, password })
  localStorage.setItem('clover_access', data.access)
  localStorage.setItem('clover_refresh', data.refresh)
  return data
}

export function logout() {
  localStorage.removeItem('clover_access')
  localStorage.removeItem('clover_refresh')
}

export async function fetchMe() {
  const { data } = await client.get('/auth/me/')
  return data
}

export function isLoggedIn() {
  return Boolean(localStorage.getItem('clover_access'))
}
