import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import Layout from '../components/Layout'
import { login } from '../api/auth'

export default function Login() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()

  const returnTo = location.state?.from || '/history'

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(username, password)
      navigate(returnTo, { replace: true })
    } catch (err) {
      setError(
        err.response?.status === 401
          ? 'Incorrect username or password.'
          : 'Something went wrong — please try again.'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <Layout>
      <section className="page-fade">
        <div className="fixture-card auth-card">
          <div className="section-tag" style={{ marginBottom: 6 }}>Admin Access</div>
          <h2 className="stamp" style={{ fontSize: 28, marginBottom: 24 }}>Sign In</h2>

          <form onSubmit={handleSubmit}>
            <div>
              <label className="field-label" htmlFor="username">Username</label>
              <input
                id="username"
                className="text-input"
                type="text"
                autoComplete="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="field-label" htmlFor="password">Password</label>
              <input
                id="password"
                className="text-input"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {error && <div className="alert error">{error}</div>}

            <button type="submit" className="kickoff-btn" disabled={loading}>
              {loading ? 'Signing in…' : 'Sign In'}
            </button>
          </form>
        </div>
      </section>
    </Layout>
  )
}
