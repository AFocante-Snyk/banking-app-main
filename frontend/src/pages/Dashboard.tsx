import { motion } from 'framer-motion'
import { useQuery } from '@tanstack/react-query'
import {
  Wallet,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  PlusCircle,
  Activity,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { accountApi } from '../api/accounts'
import { formatCurrency } from '../utils/format'
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'

// Demo chart data
const chartData = [
  { month: 'Jan', balance: 15000 },
  { month: 'Feb', balance: 18000 },
  { month: 'Mar', balance: 16500 },
  { month: 'Apr', balance: 21000 },
  { month: 'May', balance: 19500 },
  { month: 'Jun', balance: 24000 },
  { month: 'Jul', balance: 28500 },
]

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
}

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
}

export function Dashboard() {
  const { data: accounts = [], isLoading } = useQuery({
    queryKey: ['accounts'],
    queryFn: accountApi.getAll,
  })

  const totalBalance = accounts.reduce((sum, acc) => sum + acc.balance, 0)
  const activeAccounts = accounts.filter((acc) => acc.status === 'ACTIVE').length
  const savingsBalance = accounts
    .filter((acc) => acc.accountType === 'SAVINGS')
    .reduce((sum, acc) => sum + acc.balance, 0)

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-8"
    >
      {/* Welcome Section */}
      <motion.div variants={item} className="glass-card relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-luminous-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-gold-500/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
        
        <div className="relative">
          <h2 className="text-2xl font-display font-bold text-white mb-2">
            Welcome back! 👋
          </h2>
          <p className="text-midnight-400 mb-6">
            Here's an overview of your financial health
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-luminous-500/20 flex items-center justify-center">
                <Wallet className="w-6 h-6 text-luminous-400" />
              </div>
              <div>
                <p className="text-sm text-midnight-400">Total Balance</p>
                <p className="text-2xl font-bold font-display text-white">
                  {formatCurrency(totalBalance)}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-green-400" />
              </div>
              <div>
                <p className="text-sm text-midnight-400">Active Accounts</p>
                <p className="text-2xl font-bold font-display text-white">
                  {activeAccounts}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gold-500/20 flex items-center justify-center">
                <Activity className="w-6 h-6 text-gold-400" />
              </div>
              <div>
                <p className="text-sm text-midnight-400">Savings</p>
                <p className="text-2xl font-bold font-display text-white">
                  {formatCurrency(savingsBalance)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Chart and Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Balance Chart */}
        <motion.div variants={item} className="lg:col-span-2 glass-card">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-display font-semibold text-white">
              Balance Overview
            </h3>
            <div className="flex items-center gap-2 text-sm">
              <span className="text-green-400 flex items-center gap-1">
                <ArrowUpRight className="w-4 h-4" />
                +12.5%
              </span>
              <span className="text-midnight-400">vs last month</span>
            </div>
          </div>
          
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0969da" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#0969da" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey="month"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#64748b', fontSize: 12 }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#64748b', fontSize: 12 }}
                  tickFormatter={(value) => `$${value / 1000}k`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1e293b',
                    border: '1px solid #334155',
                    borderRadius: '12px',
                    color: '#fff',
                  }}
                  formatter={(value: number) => [formatCurrency(value), 'Balance']}
                />
                <Area
                  type="monotone"
                  dataKey="balance"
                  stroke="#0969da"
                  strokeWidth={2}
                  fill="url(#colorBalance)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div variants={item} className="glass-card">
          <h3 className="text-lg font-display font-semibold text-white mb-6">
            Quick Actions
          </h3>
          
          <div className="space-y-3">
            <Link
              to="/accounts/open"
              className="flex items-center gap-3 p-4 rounded-xl bg-luminous-500/10 border border-luminous-500/20 hover:bg-luminous-500/20 transition-colors group"
            >
              <div className="w-10 h-10 rounded-lg bg-luminous-500/20 flex items-center justify-center">
                <PlusCircle className="w-5 h-5 text-luminous-400" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-white">Open Account</p>
                <p className="text-sm text-midnight-400">Start a new account</p>
              </div>
              <ArrowUpRight className="w-5 h-5 text-midnight-400 group-hover:text-luminous-400 transition-colors" />
            </Link>

            <Link
              to="/transfers"
              className="flex items-center gap-3 p-4 rounded-xl bg-gold-500/10 border border-gold-500/20 hover:bg-gold-500/20 transition-colors group"
            >
              <div className="w-10 h-10 rounded-lg bg-gold-500/20 flex items-center justify-center">
                <ArrowUpRight className="w-5 h-5 text-gold-400" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-white">Transfer Money</p>
                <p className="text-sm text-midnight-400">Send funds instantly</p>
              </div>
              <ArrowUpRight className="w-5 h-5 text-midnight-400 group-hover:text-gold-400 transition-colors" />
            </Link>

            <Link
              to="/transactions"
              className="flex items-center gap-3 p-4 rounded-xl bg-midnight-800/50 border border-midnight-700 hover:bg-midnight-800 transition-colors group"
            >
              <div className="w-10 h-10 rounded-lg bg-midnight-700 flex items-center justify-center">
                <ArrowDownRight className="w-5 h-5 text-midnight-300" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-white">View History</p>
                <p className="text-sm text-midnight-400">See all transactions</p>
              </div>
              <ArrowUpRight className="w-5 h-5 text-midnight-400 group-hover:text-white transition-colors" />
            </Link>
          </div>
        </motion.div>
      </div>

      {/* Recent Accounts */}
      <motion.div variants={item} className="glass-card">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-display font-semibold text-white">
            Your Accounts
          </h3>
          <Link to="/accounts" className="text-sm text-luminous-400 hover:text-luminous-300">
            View all →
          </Link>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="w-8 h-8 border-2 border-luminous-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : accounts.length === 0 ? (
          <div className="text-center py-12">
            <Wallet className="w-12 h-12 text-midnight-600 mx-auto mb-4" />
            <p className="text-midnight-400 mb-4">No accounts yet</p>
            <Link to="/accounts/open" className="btn-primary">
              Open Your First Account
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {accounts.slice(0, 3).map((account) => (
              <div
                key={account.id}
                className="p-4 rounded-xl bg-midnight-800/50 border border-midnight-700 hover:border-midnight-600 transition-colors"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="badge badge-info">{account.accountType}</span>
                  <span
                    className={`badge ${
                      account.status === 'ACTIVE'
                        ? 'badge-success'
                        : 'badge-warning'
                    }`}
                  >
                    {account.status}
                  </span>
                </div>
                <p className="text-sm text-midnight-400 font-mono mb-1">
                  {account.accountNumber}
                </p>
                <p className="text-xl font-bold font-display text-white">
                  {formatCurrency(account.balance)}
                </p>
                <p className="text-xs text-midnight-500 mt-2">
                  {account.interestRate * 100}% APY
                </p>
              </div>
            ))}
          </div>
        )}
      </motion.div>
    </motion.div>
  )
}

