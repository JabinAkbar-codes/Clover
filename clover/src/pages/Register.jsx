import React, { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { apiError } from '../api/orders'
import Seo from '../components/Seo'
import '../styles/Pages.css'

export default function Register() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [form, setForm] = useState({ username: '', email: '', password: '', confirm: '' })
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value })

  const submit = async (e) => {
    e.preventDefault(); setError('')
    if (form.password !== form.confirm) return setError('Passwords do not match.')
    setBusy(true)
    try { await register({ username: form.username, email: form.email, password: form.password }); navigate(location.state?.from || '/', { replace: true }) }
    catch (err) {
      const d = err?.response?.data
      const first = d && Object.values(d).flat()[0]
      setError(typeof first === 'string' ? first : apiError(err, 'Could not create your account.'))
    } finally { setBusy(false) }
  }

  return (
    <div className="auth-page">
      <Seo title="Create account" />
      <div className="auth-card">
        <h1>Create account</h1>
        <p className="auth-sub">Save your wishlist and track orders.</p>
        <form onSubmit={submit}>
          {error && <p className="form-error" role="alert">{error}</p>}
          <div className="field"><label htmlFor="ru">Username</label><input id="ru" autoComplete="username" value={form.username} onChange={set('username')} required /></div>
          <div className="field"><label htmlFor="re">Email</label><input id="re" type="email" autoComplete="email" value={form.email} onChange={set('email')} required /></div>
          <div className="field"><label htmlFor="rp">Password</label><input id="rp" type="password" autoComplete="new-password" minLength={8} value={form.password} onChange={set('password')} required /></div>
          <div className="field"><label htmlFor="rc">Confirm password</label><input id="rc" type="password" autoComplete="new-password" value={form.confirm} onChange={set('confirm')} required /></div>
          <button type="submit" className="btn-clover btn-block" disabled={busy}>{busy ? 'Creating…' : 'Create account'}</button>
        </form>
        <p className="auth-switch">Already have an account? <Link to="/login" state={location.state}>Login</Link></p>
      </div>
    </div>
  )
}
