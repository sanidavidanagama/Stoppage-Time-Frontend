import { NavLink, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import Cookies from 'js-cookie'
import { logout } from '../api/auth'
import { getPublicStats } from '../api/public'

const navItems = [
  { to: '/', label: 'Stats', icon: '📊', end: true },
  { to: '/queue', label: 'Queue', icon: '📋' },
  { to: '/bets', label: 'Bets', icon: '💰' },
  { to: '/logs', label: 'Logs', icon: '📝' },
]

export default function Layout({ children }) {
  const navigate = useNavigate()
  const token = Cookies.get('access_token')

  const { data } = useQuery({
    queryKey: ['publicStats'],
    queryFn: getPublicStats,
    refetchInterval: 30000,
    staleTime: 15000,
  })

  const agentActive = data?.agent_status === 'active'

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="sticky top-0 z-50 bg-[#2A398D] text-white px-4 py-3 flex items-center justify-between shadow-md">
        <div className="flex items-center gap-2">
          <span className="font-bold text-lg tracking-tight">Stoppage Time</span>
          <span
            className={`w-2 h-2 rounded-full transition-all ${
              agentActive ? 'bg-[#3CAC3B] animate-pulse' : 'bg-gray-500'
            }`}
          />
        </div>
        <nav className="hidden md:flex items-center gap-6">
          {navItems.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `text-sm font-medium transition-colors ${
                  isActive ? 'text-white underline underline-offset-4' : 'text-blue-200 hover:text-white'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
          {token && (
            <button
              onClick={handleLogout}
              className="text-sm text-red-300 hover:text-red-100 ml-2 transition-colors"
            >
              Logout
            </button>
          )}
        </nav>
      </header>

      <main className="flex-1 pb-20 md:pb-0">{children}</main>

      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 flex items-stretch">
        {navItems.map(item => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              `flex-1 flex flex-col items-center justify-center py-2 text-xs gap-0.5 transition-colors ${
                isActive ? 'text-[#2A398D]' : 'text-gray-500'
              }`
            }
          >
            <span className="text-lg leading-none">{item.icon}</span>
            {item.label}
          </NavLink>
        ))}
        {token && (
          <button
            onClick={handleLogout}
            className="flex-1 flex flex-col items-center justify-center py-2 text-xs gap-0.5 text-[#E61D25] transition-colors"
          >
            <span className="text-lg leading-none">🚪</span>
            Logout
          </button>
        )}
      </nav>
    </div>
  )
}
