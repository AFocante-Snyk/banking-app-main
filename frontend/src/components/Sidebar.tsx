import { NavLink } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  LayoutDashboard,
  Wallet,
  ArrowLeftRight,
  Receipt,
  User,
  ChevronLeft,
  Sparkles,
  AlertTriangle,
} from 'lucide-react'
import { useStore } from '../store/useStore'

const navItems = [
  { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/accounts', label: 'Accounts', icon: Wallet },
  { path: '/transfers', label: 'Transfers', icon: ArrowLeftRight },
  { path: '/transactions', label: 'Transactions', icon: Receipt },
  { path: '/profile', label: 'Profile', icon: User },
  { path: '/search', label: '⚠️ Vuln Demo', icon: AlertTriangle },
]

export function Sidebar() {
  const { sidebarOpen, toggleSidebar } = useStore()

  return (
    <>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{ width: sidebarOpen ? 288 : 80 }}
        className={`fixed top-0 left-0 h-full z-50 glass border-r border-midnight-700/50 flex flex-col ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        } transition-transform lg:transition-none`}
      >
        {/* Logo */}
        <div className="p-6 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-luminous-500 to-luminous-700 flex items-center justify-center shadow-glow">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          {sidebarOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <h1 className="font-display text-xl font-bold text-gradient">
                Luminous
              </h1>
              <p className="text-xs text-midnight-400">Banking</p>
            </motion.div>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {navItems.map(({ path, label, icon: Icon }) => (
            <NavLink
              key={path}
              to={path}
              className={({ isActive }) =>
                `nav-link ${isActive ? 'nav-link-active' : ''} ${
                  !sidebarOpen ? 'justify-center px-3' : ''
                }`
              }
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              {sidebarOpen && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  {label}
                </motion.span>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Collapse button */}
        <div className="p-4 border-t border-midnight-700/50">
          <button
            onClick={toggleSidebar}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-midnight-400 hover:text-white hover:bg-midnight-800/50 transition-colors ${
              !sidebarOpen ? 'justify-center' : ''
            }`}
          >
            <ChevronLeft
              className={`w-5 h-5 transition-transform ${
                !sidebarOpen ? 'rotate-180' : ''
              }`}
            />
            {sidebarOpen && <span className="text-sm">Collapse</span>}
          </button>
        </div>
      </motion.aside>
    </>
  )
}

