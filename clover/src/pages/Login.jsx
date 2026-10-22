import React, { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Seo from '../components/Seo'
import '../styles/Pages.css'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [form, setForm] = useState({ username: '', password: '' })
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const redirectTo = location.state?.from || '/'

  const submit = async (e) => {
    e.preventDefault(); setError(''); setBusy(true)
    try { await login(form); navigate(redirectTo, { replace: true }) }
    catch (err) { setError(err?.response ? 'Invalid username or password.' : 'Cannot reach the server. Please try again in a moment.') }
    finally { setBusy(false) }
  }

  return (
    <div className="auth-page">
      <Seo title="Login" />
      <div className="auth-card">
        <h1>Login</h1>
        <p className="auth-sub">Welcome back to CLOVER.</p>
        <form onSubmit={submit}>
          {error && <p className="form-error" role="alert">{error}</p>}
          <div className="field"><label htmlFor="u">Username</label><input id="u" autoComplete="username" value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} required /></div>
          <div className="field"><label htmlFor="p">Password</label><input id="p" type="password" autoComplete="current-password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required /></div>
          <button type="submit" className="btn-clover btn-block" disabled={busy}>{busy ? 'Logging in…' : 'Login'}</button>
        </form>
        <p className="auth-switch">New to CLOVER? <Link to="/register" state={location.state}>Create an account</Link></p>
      </div>
    </div>
  )
}
