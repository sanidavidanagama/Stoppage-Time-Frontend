import { NavLink, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import Cookies from 'js-cookie'
import { logout } from '../api/auth'
import { getPublicStats } from '../api/public'
import { BarChartIcon, ListIcon, TrendingUpIcon, TerminalIcon, LogOutIcon } from './Icons'

const navItems = [
  { to: '/', label: 'Stats', icon: BarChartIcon, end: true },
  { to: '/queue', label: 'Queue', icon: ListIcon },
  { to: '/bets', label: 'Bets', icon: TrendingUpIcon },
  { to: '/logs', label: 'Logs', icon: TerminalIcon },
]

export default function Layout({ children }) {
  const navigate = useNavigate()
  const token = Cookies.get('access_token')

  const { data, isError } = useQuery({
    queryKey: ['publicStats'],
    queryFn: getPublicStats,
    refetchInterval: 30000,
    staleTime: 15000,
  })

  const agentActive = data?.agent_status === 'active'
  const agentIdle = data && data.agent_status !== 'active'

  const dotColor = isError ? '#e61d25' : agentActive ? '#3cac3b' : '#f5a623'
  const badgeColor = isError ? '#e61d25' : agentActive ? '#3cac3b' : '#f5a623'
  const badgeBg = isError
    ? 'rgba(230,29,37,0.12)'
    : agentActive
    ? 'rgba(60,172,59,0.12)'
    : 'rgba(245,166,35,0.12)'
  const badgeBorder = isError
    ? 'rgba(230,29,37,0.3)'
    : agentActive
    ? 'rgba(60,172,59,0.3)'
    : 'rgba(245,166,35,0.3)'
  const badgeLabel = isError ? 'Error' : agentActive ? 'Live' : 'Idle'

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-black flex flex-col" style={{ fontFamily: "'Google Sans', system-ui, sans-serif" }}>
      {/* Header */}
      <header className="sticky top-0 z-50 border-b" style={{ backgroundColor: '#0a0a0a', borderColor: '#1e1e1e' }}>
        <div className="max-w-6xl mx-auto px-5 h-14 flex items-center justify-between">

          {/* Brand */}
          <div className="flex items-center gap-3">
            <img
              src="/Stoppage Time.png"
              alt="Stoppage Time"
              className="h-7 w-auto object-contain"
            />
            <div className="leading-tight">
              <div className="text-white font-bold text-sm tracking-tight">Stoppage Time</div>
              <div className="text-xs tracking-widest uppercase" style={{ color: '#474a4a', fontSize: '0.6rem' }}>
                WC 2026 Agent
              </div>
            </div>
            <div
              className={`w-1.5 h-1.5 rounded-full ml-1 ${agentActive ? 'animate-pulse' : ''}`}
              style={{ backgroundColor: dotColor }}
            />
          </div>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map(({ to, label, icon: Icon, end }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                className={({ isActive }) =>
                  `flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    isActive
                      ? 'text-white bg-white/10'
                      : 'hover:bg-white/5'
                  }`
                }
                style={({ isActive }) => ({ color: isActive ? '#ffffff' : '#d1d4d1' })}
              >
                {({ isActive }) => (
                  <>
                    <Icon size={14} />
                    {label}
                  </>
                )}
              </NavLink>
            ))}

            {token && (
              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ml-1 hover:bg-white/5"
                style={{ color: '#e61d25' }}
              >
                <LogOutIcon size={14} />
                Logout
              </button>
            )}

            {/* Status badge */}
            <div className="ml-2 flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold tracking-wide uppercase"
              style={{
                backgroundColor: badgeBg,
                color: badgeColor,
                border: `1px solid ${badgeBorder}`,
                fontSize: '0.6rem',
                letterSpacing: '0.1em',
              }}
            >
              <span
                className={`w-1 h-1 rounded-full ${agentActive ? 'animate-pulse' : ''}`}
                style={{ backgroundColor: badgeColor }}
              />
              {badgeLabel}
            </div>
          </nav>
        </div>
      </header>

      {/* Page content */}
      <main className="flex-1 pb-20 md:pb-0">{children}</main>

      {/* Mobile bottom nav */}
      <nav
        className="md:hidden fixed bottom-0 left-0 right-0 z-50 flex items-stretch"
        style={{ backgroundColor: '#0a0a0a', borderTop: '1px solid #1e1e1e' }}
      >
        {navItems.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className="flex-1 flex flex-col items-center justify-center py-2.5 gap-1 transition-all"
            style={({ isActive }) => ({
              color: isActive ? '#ffffff' : '#474a4a',
            })}
          >
            {({ isActive }) => (
              <>
                <Icon size={18} />
                <span className="text-[0.6rem] font-medium tracking-wide uppercase" style={{ letterSpacing: '0.06em' }}>
                  {label}
                </span>
              </>
            )}
          </NavLink>
        ))}

        {token && (
          <button
            onClick={handleLogout}
            className="flex-1 flex flex-col items-center justify-center py-2.5 gap-1 transition-all"
            style={{ color: '#e61d25' }}
          >
            <LogOutIcon size={18} />
            <span className="text-[0.6rem] font-medium tracking-wide uppercase" style={{ letterSpacing: '0.06em' }}>
              Logout
            </span>
          </button>
        )}
      </nav>
    </div>
  )
}
