import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { login } from '../api/auth'
import { LockIcon, UserIcon } from '../components/Icons'

export default function Login() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login({ username, password })
      navigate('/queue')
    } catch (err) {
      setError(
        err.response?.status === 401
          ? 'Incorrect username or password.'
          : 'Something went wrong. Please try again.'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{ backgroundColor: '#000000', fontFamily: "'Google Sans', system-ui, sans-serif" }}
    >
      <div className="w-full max-w-sm">

        {/* Brand mark */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-5">
            <img
              src="/Stoppage Time.png"
              alt="Stoppage Time"
              className="h-16 w-auto object-contain"
            />
          </div>
          <p
            className="text-xs uppercase tracking-widest font-medium"
            style={{ color: '#474a4a', letterSpacing: '0.2em' }}
          >
            Admin Dashboard
          </p>
        </div>

        {/* Card */}
        <div
          className="rounded-2xl p-6 space-y-4"
          style={{ backgroundColor: '#111111', border: '1px solid #1e1e1e' }}
        >

          <div className="space-y-1">
            <label className="block text-xs font-medium uppercase tracking-wide" style={{ color: '#d1d4d1', letterSpacing: '0.08em' }}>
              Username
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#474a4a' }}>
                <UserIcon size={16} />
              </span>
              <input
                type="text"
                value={username}
                onChange={e => setUsername(e.target.value)}
                autoComplete="username"
                placeholder="Enter username"
                className="w-full pl-9 pr-3 py-2.5 text-sm rounded-lg outline-none transition-all placeholder-[#474a4a]"
                style={{
                  backgroundColor: '#0a0a0a',
                  border: '1px solid #2a2a2a',
                  color: '#ffffff',
                }}
                onFocus={e => {
                  e.target.style.borderColor = '#2a398d'
                }}
                onBlur={e => {
                  e.target.style.borderColor = '#2a2a2a'
                }}
                required
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-medium uppercase tracking-wide" style={{ color: '#d1d4d1', letterSpacing: '0.08em' }}>
              Password
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#474a4a' }}>
                <LockIcon size={16} />
              </span>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                autoComplete="current-password"
                placeholder="Enter password"
                className="w-full pl-9 pr-3 py-2.5 text-sm rounded-lg outline-none transition-all placeholder-[#474a4a]"
                style={{
                  backgroundColor: '#0a0a0a',
                  border: '1px solid #2a2a2a',
                  color: '#ffffff',
                }}
                onFocus={e => {
                  e.target.style.borderColor = '#2a398d'
                }}
                onBlur={e => {
                  e.target.style.borderColor = '#2a2a2a'
                }}
                required
              />
            </div>
          </div>

          {error && (
            <p
              className="text-xs rounded-lg px-3 py-2.5"
              style={{ color: '#e61d25', backgroundColor: 'rgba(230,29,37,0.08)', border: '1px solid rgba(230,29,37,0.2)' }}
            >
              {error}
            </p>
          )}

          <button
            type="button"
            onClick={handleSubmit}
            disabled={loading}
            className="w-full py-2.5 rounded-lg text-sm font-semibold transition-all disabled:opacity-50"
            style={{ backgroundColor: '#2a398d', color: '#ffffff' }}
            onMouseEnter={e => { if (!loading) e.target.style.backgroundColor = '#1e2d7a' }}
            onMouseLeave={e => { e.target.style.backgroundColor = '#2a398d' }}
          >
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </div>

        <p
          className="text-center text-xs mt-4"
          style={{ color: '#474a4a' }}
        >
          Stoppage Time &mdash; WC 2026
        </p>
      </div>
    </div>
  )
}
