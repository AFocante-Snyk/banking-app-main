import { motion } from 'framer-motion'
import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import {
  ArrowUpRight,
  ArrowDownLeft,
  ArrowLeftRight,
  Receipt,
  Filter,
  Search,
} from 'lucide-react'
import { accountApi } from '../api/accounts'
import { transactionApi } from '../api/transactions'
import { formatCurrency, formatDateTime } from '../utils/format'
import type { Transaction, TransactionType } from '../types'

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.05 },
  },
}

const item = {
  hidden: { opacity: 0, x: -20 },
  show: { opacity: 1, x: 0 },
}

const getTransactionIcon = (type: TransactionType) => {
  switch (type) {
    case 'DEPOSIT':
    case 'INTEREST_CREDIT':
    case 'REFUND':
      return ArrowDownLeft
    case 'WITHDRAWAL':
    case 'FEE':
      return ArrowUpRight
    case 'TRANSFER':
      return ArrowLeftRight
    default:
      return Receipt
  }
}

const getTransactionColor = (type: TransactionType) => {
  switch (type) {
    case 'DEPOSIT':
    case 'INTEREST_CREDIT':
    case 'REFUND':
      return 'text-green-400 bg-green-500/10'
    case 'WITHDRAWAL':
    case 'FEE':
      return 'text-red-400 bg-red-500/10'
    case 'TRANSFER':
      return 'text-luminous-400 bg-luminous-500/10'
    default:
      return 'text-midnight-400 bg-midnight-700'
  }
}

const isCredit = (type: TransactionType) => {
  return ['DEPOSIT', 'INTEREST_CREDIT', 'REFUND'].includes(type)
}

export function Transactions() {
  const [selectedAccountId, setSelectedAccountId] = useState<string>('')
  const [searchTerm, setSearchTerm] = useState('')

  const { data: accounts = [] } = useQuery({
    queryKey: ['accounts'],
    queryFn: accountApi.getAll,
  })

  const { data: transactionData, isLoading } = useQuery({
    queryKey: ['transactions', selectedAccountId],
    queryFn: () => transactionApi.getByAccountId(selectedAccountId, 0, 50),
    enabled: !!selectedAccountId,
  })

  const transactions = transactionData?.content || []

  const filteredTransactions = transactions.filter(
    (tx) =>
      tx.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tx.transactionReference.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-8"
    >
      {/* Header */}
      <motion.div variants={item}>
        <h2 className="text-2xl font-display font-bold text-white">
          Transaction History
        </h2>
        <p className="text-midnight-400 mt-1">
          View all your account transactions and activity
        </p>
      </motion.div>

      {/* Filters */}
      <motion.div variants={item} className="glass-card">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <label className="label flex items-center gap-2">
              <Filter className="w-4 h-4" />
              Select Account
            </label>
            <select
              value={selectedAccountId}
              onChange={(e) => setSelectedAccountId(e.target.value)}
              className="input"
            >
              <option value="">Choose an account</option>
              {accounts.map((account) => (
                <option key={account.id} value={account.id}>
                  {account.accountType} - {account.accountNumber}
                </option>
              ))}
            </select>
          </div>

          {selectedAccountId && (
            <div className="flex-1">
              <label className="label flex items-center gap-2">
                <Search className="w-4 h-4" />
                Search Transactions
              </label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input"
                placeholder="Search by description or reference..."
              />
            </div>
          )}
        </div>
      </motion.div>

      {/* Transactions List */}
      {!selectedAccountId ? (
        <motion.div variants={item} className="glass-card text-center py-16">
          <Receipt className="w-16 h-16 text-midnight-600 mx-auto mb-4" />
          <h3 className="text-xl font-display font-semibold text-white mb-2">
            Select an Account
          </h3>
          <p className="text-midnight-400">
            Choose an account above to view its transaction history
          </p>
        </motion.div>
      ) : isLoading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-10 h-10 border-3 border-luminous-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : filteredTransactions.length === 0 ? (
        <motion.div variants={item} className="glass-card text-center py-16">
          <Receipt className="w-16 h-16 text-midnight-600 mx-auto mb-4" />
          <h3 className="text-xl font-display font-semibold text-white mb-2">
            No Transactions Found
          </h3>
          <p className="text-midnight-400">
            {searchTerm
              ? 'No transactions match your search'
              : 'This account has no transactions yet'}
          </p>
        </motion.div>
      ) : (
        <motion.div variants={container} className="space-y-3">
          {filteredTransactions.map((transaction, index) => (
            <TransactionRow key={transaction.id} transaction={transaction} index={index} />
          ))}
        </motion.div>
      )}
    </motion.div>
  )
}

function TransactionRow({
  transaction,
  index,
}: {
  transaction: Transaction
  index: number
}) {
  const Icon = getTransactionIcon(transaction.type)
  const colorClass = getTransactionColor(transaction.type)
  const credit = isCredit(transaction.type)

  return (
    <motion.div
      variants={item}
      style={{ animationDelay: `${index * 0.05}s` }}
      className="glass-card flex items-center gap-4 py-4"
    >
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${colorClass}`}>
        <Icon className="w-6 h-6" />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className="font-medium text-white truncate">
            {transaction.description || transaction.type.replace(/_/g, ' ')}
          </p>
          <span
            className={`badge ${
              transaction.status === 'COMPLETED'
                ? 'badge-success'
                : transaction.status === 'PENDING'
                ? 'badge-warning'
                : 'badge-error'
            }`}
          >
            {transaction.status}
          </span>
        </div>
        <p className="text-sm text-midnight-400">
          {formatDateTime(transaction.createdAt)}
        </p>
        <p className="text-xs text-midnight-500 font-mono mt-1">
          {transaction.transactionReference}
        </p>
      </div>

      <div className="text-right">
        <p
          className={`text-lg font-semibold ${
            credit ? 'text-green-400' : 'text-red-400'
          }`}
        >
          {credit ? '+' : '-'}
          {formatCurrency(transaction.amount)}
        </p>
        {transaction.balanceAfter !== undefined && (
          <p className="text-sm text-midnight-400">
            Balance: {formatCurrency(transaction.balanceAfter)}
          </p>
        )}
      </div>
    </motion.div>
  )
}

