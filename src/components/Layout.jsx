import { useEffect, useState } from 'react'
import { NavLink, useNavigate, useLocation } from 'react-router-dom'
import { logout, isAuthenticated } from '../api/auth'

const navItems = [
  { to: '/', label: 'Home', end: true },
  { to: '/stats', label: 'Stats' },
  { to: '/fixture', label: 'Fixture Analysis' },
  { to: '/history', label: 'Bet History' },
  { to: '/how-it-works', label: 'How It Works' },
]

// data-page drives the ambient background gradient per route (see index.css)
const AMBIENT_PAGE = {
  '/': 'home',
  '/stats': 'stats',
  '/fixture': 'fixture',
  '/history': 'history',
  '/how-it-works': 'teamsheet',
  '/login': 'login',
}

function ambientPageFor(pathname) {
  if (AMBIENT_PAGE[pathname]) return AMBIENT_PAGE[pathname]
  if (pathname.startsWith('/history/')) return 'detail'
  return 'home'
}

export default function Layout({ children }) {
  const navigate = useNavigate()
  const location = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)
  // isAuthenticated() is a cheap synchronous cookie check — read it fresh on
  // every render instead of syncing it into state (Layout already re-renders
  // on every navigation, which is exactly when this needs to be current).
  const authed = isAuthenticated()

  // Reset the mobile menu when the route changes. Adjusting state during
  // render (not in an effect) on a prop/derived-value change is the pattern
  // React recommends for this — see https://react.dev/learn/you-might-not-need-an-effect
  const [prevPathname, setPrevPathname] = useState(location.pathname)
  if (location.pathname !== prevPathname) {
    setPrevPathname(location.pathname)
    setMenuOpen(false)
  }

  useEffect(() => {
    document.body.dataset.page = ambientPageFor(location.pathname)
  }, [location.pathname])

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <>
      <div id="ambient" />
      <nav className="top-nav">
        <div className="brand" onClick={() => navigate('/')}>
          <img src="/Stoppage Time.png" alt="Stoppage Time mark" />
          <div className="brand-name cond">Stoppage Time</div>
        </div>

        <div className="navlinks">
          {navItems.map((item) => (
            <NavLink key={item.to} to={item.to} end={item.end}>
              {item.label}
            </NavLink>
          ))}
        </div>

        <div className="nav-actions">
          {authed ? (
            <button className="signin-btn" onClick={handleLogout}>Sign Out</button>
          ) : (
            <button className="signin-btn" onClick={() => navigate('/login')}>Sign In</button>
          )}
          <button
            className="mobile-menu-btn"
            aria-label="Toggle menu"
            onClick={() => setMenuOpen((v) => !v)}
          >
            {menuOpen ? '✕' : '☰'}
          </button>
        </div>

        <div className={`mobile-menu-panel ${menuOpen ? 'open' : ''}`}>
          {navItems.map((item) => (
            <NavLink key={item.to} to={item.to} end={item.end} onClick={() => setMenuOpen(false)}>
              {item.label}
            </NavLink>
          ))}
          {authed && (
            <button className="signout" onClick={handleLogout}>Sign Out</button>
          )}
        </div>
      </nav>

      <main>{children}</main>

      <footer>Stoppage Time &mdash; World Cup 2026 Arena</footer>
    </>
  )
}
