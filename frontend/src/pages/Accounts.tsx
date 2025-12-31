import { motion } from 'framer-motion'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { PlusCircle, Wallet, MoreVertical, X, TrendingUp } from 'lucide-react'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { accountApi } from '../api/accounts'
import { formatCurrency, formatDate } from '../utils/format'
import type { Account } from '../types'

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

export function Accounts() {
  const queryClient = useQueryClient()
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null)

  const { data: accounts = [], isLoading } = useQuery({
    queryKey: ['accounts'],
    queryFn: accountApi.getAll,
  })

  const closeMutation = useMutation({
    mutationFn: accountApi.close,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['accounts'] })
      toast.success('Account closed successfully')
      setSelectedAccount(null)
    },
    onError: (error: Error) => {
      toast.error(error.message)
    },
  })

  const getAccountTypeIcon = (type: string) => {
    switch (type) {
      case 'SAVINGS':
        return '💰'
      case 'CHECKING':
        return '💳'
      case 'MONEY_MARKET':
        return '📈'
      case 'CERTIFICATE_OF_DEPOSIT':
        return '🏦'
      default:
        return '💼'
    }
  }

  const getAccountGradient = (type: string) => {
    switch (type) {
      case 'SAVINGS':
        return 'from-green-500/20 to-emerald-500/10'
      case 'CHECKING':
        return 'from-luminous-500/20 to-blue-500/10'
      case 'MONEY_MARKET':
        return 'from-purple-500/20 to-violet-500/10'
      case 'CERTIFICATE_OF_DEPOSIT':
        return 'from-gold-500/20 to-amber-500/10'
      default:
        return 'from-midnight-700/50 to-midnight-800/50'
    }
  }

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-8"
    >
      {/* Header */}
      <motion.div variants={item} className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-display font-bold text-white">
            Your Accounts
          </h2>
          <p className="text-midnight-400 mt-1">
            Manage your bank accounts and view balances
          </p>
        </div>
        <Link to="/accounts/open" className="btn-primary">
          <PlusCircle className="w-5 h-5" />
          Open Account
        </Link>
      </motion.div>

      {/* Accounts Grid */}
      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-10 h-10 border-3 border-luminous-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : accounts.length === 0 ? (
        <motion.div variants={item} className="glass-card text-center py-16">
          <Wallet className="w-16 h-16 text-midnight-600 mx-auto mb-4" />
          <h3 className="text-xl font-display font-semibold text-white mb-2">
            No accounts yet
          </h3>
          <p className="text-midnight-400 mb-6">
            Open your first account to get started with Luminous Banking
          </p>
          <Link to="/accounts/open" className="btn-primary">
            <PlusCircle className="w-5 h-5" />
            Open Your First Account
          </Link>
        </motion.div>
      ) : (
        <motion.div
          variants={container}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {accounts.map((account) => (
            <motion.div
              key={account.id}
              variants={item}
              className={`glass-card relative overflow-hidden bg-gradient-to-br ${getAccountGradient(
                account.accountType
              )}`}
            >
              {/* Background decoration */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
              
              <div className="relative">
                {/* Header */}
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">
                      {getAccountTypeIcon(account.accountType)}
                    </span>
                    <div>
                      <p className="font-medium text-white">
                        {account.accountType.replace(/_/g, ' ')}
                      </p>
                      <p className="text-sm text-midnight-400 font-mono">
                        {account.accountNumber}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedAccount(account)}
                    className="p-2 rounded-lg hover:bg-midnight-800/50 text-midnight-400 hover:text-white transition-colors"
                  >
                    <MoreVertical className="w-5 h-5" />
                  </button>
                </div>

                {/* Balance */}
                <div className="mb-6">
                  <p className="text-sm text-midnight-400 mb-1">Available Balance</p>
                  <p className="text-3xl font-bold font-display text-white">
                    {formatCurrency(account.balance)}
                  </p>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between pt-4 border-t border-white/10">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-green-400" />
                    <span className="text-sm text-green-400">
                      {(account.interestRate * 100).toFixed(2)}% APY
                    </span>
                  </div>
                  <span
                    className={`badge ${
                      account.status === 'ACTIVE'
                        ? 'badge-success'
                        : account.status === 'CLOSED'
                        ? 'badge-error'
                        : 'badge-warning'
                    }`}
                  >
                    {account.status}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Account Details Modal */}
      {selectedAccount && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setSelectedAccount(null)}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative glass-card max-w-md w-full"
          >
            <button
              onClick={() => setSelectedAccount(null)}
              className="absolute top-4 right-4 p-2 rounded-lg hover:bg-midnight-800/50 text-midnight-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-display font-semibold text-white mb-6">
              Account Details
            </h3>

            <div className="space-y-4">
              <div className="flex justify-between py-3 border-b border-midnight-700">
                <span className="text-midnight-400">Account Number</span>
                <span className="text-white font-mono">
                  {selectedAccount.accountNumber}
                </span>
              </div>
              <div className="flex justify-between py-3 border-b border-midnight-700">
                <span className="text-midnight-400">Type</span>
                <span className="text-white">
                  {selectedAccount.accountType.replace(/_/g, ' ')}
                </span>
              </div>
              <div className="flex justify-between py-3 border-b border-midnight-700">
                <span className="text-midnight-400">Balance</span>
                <span className="text-white font-semibold">
                  {formatCurrency(selectedAccount.balance)}
                </span>
              </div>
              <div className="flex justify-between py-3 border-b border-midnight-700">
                <span className="text-midnight-400">Interest Rate</span>
                <span className="text-green-400">
                  {(selectedAccount.interestRate * 100).toFixed(2)}% APY
                </span>
              </div>
              <div className="flex justify-between py-3 border-b border-midnight-700">
                <span className="text-midnight-400">Opened</span>
                <span className="text-white">
                  {formatDate(selectedAccount.createdAt)}
                </span>
              </div>
              <div className="flex justify-between py-3">
                <span className="text-midnight-400">Status</span>
                <span
                  className={`badge ${
                    selectedAccount.status === 'ACTIVE'
                      ? 'badge-success'
                      : 'badge-error'
                  }`}
                >
                  {selectedAccount.status}
                </span>
              </div>
            </div>

            {selectedAccount.status === 'ACTIVE' && (
              <div className="mt-6 pt-6 border-t border-midnight-700">
                <button
                  onClick={() => closeMutation.mutate(selectedAccount.id)}
                  disabled={closeMutation.isPending || selectedAccount.balance > 0}
                  className="w-full btn bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 disabled:opacity-50"
                >
                  {selectedAccount.balance > 0
                    ? 'Withdraw funds to close'
                    : 'Close Account'}
                </button>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </motion.div>
  )
}

