import { Menu, Bell, Search } from 'lucide-react'
import { useStore } from '../store/useStore'
import { useLocation } from 'react-router-dom'

const pageTitles: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/accounts': 'Accounts',
  '/accounts/open': 'Open New Account',
  '/transfers': 'Transfers',
  '/transactions': 'Transactions',
  '/profile': 'Profile',
  '/search': '⚠️ Vulnerability Demo',
}

export function Header() {
  const { toggleSidebar, currentCustomer } = useStore()
  const location = useLocation()

  const pageTitle = pageTitles[location.pathname] || 'Luminous Banking'

  return (
    <header className="sticky top-0 z-30 glass border-b border-midnight-700/50">
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-4">
          <button
            onClick={toggleSidebar}
            className="lg:hidden p-2 rounded-lg hover:bg-midnight-800/50 text-midnight-400 hover:text-white transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-xl font-display font-semibold text-white">
              {pageTitle}
            </h1>
            <p className="text-sm text-midnight-400">
              {new Date().toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* Search */}
          <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-midnight-800/50 border border-midnight-700 rounded-xl">
            <Search className="w-4 h-4 text-midnight-400" />
            <input
              type="text"
              placeholder="Search..."
              className="bg-transparent border-none outline-none text-sm text-white placeholder-midnight-400 w-40"
            />
          </div>

          {/* Notifications */}
          <button className="relative p-2 rounded-xl hover:bg-midnight-800/50 text-midnight-400 hover:text-white transition-colors">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-gold-500 rounded-full" />
          </button>

          {/* User avatar */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-luminous-500 to-gold-500 flex items-center justify-center text-white font-semibold text-sm">
              {currentCustomer
                ? `${currentCustomer.firstName[0]}${currentCustomer.lastName[0]}`
                : 'LB'}
            </div>
            <div className="hidden sm:block">
              <p className="text-sm font-medium text-white">
                {currentCustomer
                  ? `${currentCustomer.firstName} ${currentCustomer.lastName}`
                  : 'Guest User'}
              </p>
              <p className="text-xs text-midnight-400">
                {currentCustomer?.email || 'demo@luminous.bank'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

