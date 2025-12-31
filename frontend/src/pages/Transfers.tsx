import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { ArrowRight, ArrowDownUp, Wallet, Send, Download } from 'lucide-react'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { accountApi } from '../api/accounts'
import { formatCurrency } from '../utils/format'
import type { TransferRequest, Account } from '../types'

type TransactionMode = 'transfer' | 'deposit' | 'withdraw'

interface TransferFormData {
  sourceAccountNumber: string
  destinationAccountNumber: string
  amount: number
  description?: string
}

interface DepositWithdrawFormData {
  accountNumber: string
  amount: number
  description?: string
}

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

export function Transfers() {
  const queryClient = useQueryClient()
  const [mode, setMode] = useState<TransactionMode>('transfer')

  const { data: accounts = [] } = useQuery({
    queryKey: ['accounts'],
    queryFn: accountApi.getAll,
  })

  const activeAccounts = accounts.filter((acc) => acc.status === 'ACTIVE')

  const transferForm = useForm<TransferFormData>()
  const depositForm = useForm<DepositWithdrawFormData>()
  const withdrawForm = useForm<DepositWithdrawFormData>()

  const transferMutation = useMutation({
    mutationFn: (data: TransferRequest) => accountApi.transfer(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['accounts'] })
      toast.success('Transfer completed successfully!')
      transferForm.reset()
    },
    onError: (error: Error) => {
      toast.error(error.message)
    },
  })

  const depositMutation = useMutation({
    mutationFn: (data: DepositWithdrawFormData) =>
      accountApi.deposit(data.accountNumber, data.amount, data.description),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['accounts'] })
      toast.success('Deposit completed successfully!')
      depositForm.reset()
    },
    onError: (error: Error) => {
      toast.error(error.message)
    },
  })

  const withdrawMutation = useMutation({
    mutationFn: (data: DepositWithdrawFormData) =>
      accountApi.withdraw(data.accountNumber, data.amount, data.description),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['accounts'] })
      toast.success('Withdrawal completed successfully!')
      withdrawForm.reset()
    },
    onError: (error: Error) => {
      toast.error(error.message)
    },
  })

  const onTransfer = (data: TransferFormData) => {
    if (data.sourceAccountNumber === data.destinationAccountNumber) {
      toast.error('Source and destination accounts must be different')
      return
    }
    transferMutation.mutate({
      sourceAccountNumber: data.sourceAccountNumber,
      destinationAccountNumber: data.destinationAccountNumber,
      amount: data.amount,
      description: data.description,
    })
  }

  const getAccountLabel = (account: Account) =>
    `${account.accountType} - ${account.accountNumber} (${formatCurrency(account.balance)})`

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="max-w-3xl mx-auto space-y-8"
    >
      {/* Header */}
      <motion.div variants={item}>
        <h2 className="text-2xl font-display font-bold text-white">
          Money Transfers
        </h2>
        <p className="text-midnight-400 mt-1">
          Transfer funds between accounts or make deposits and withdrawals
        </p>
      </motion.div>

      {/* Mode Selector */}
      <motion.div variants={item} className="flex gap-2">
        <button
          onClick={() => setMode('transfer')}
          className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl transition-all ${
            mode === 'transfer'
              ? 'bg-luminous-500 text-white shadow-glow'
              : 'bg-midnight-800/50 text-midnight-400 hover:text-white'
          }`}
        >
          <ArrowDownUp className="w-5 h-5" />
          Transfer
        </button>
        <button
          onClick={() => setMode('deposit')}
          className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl transition-all ${
            mode === 'deposit'
              ? 'bg-green-500 text-white'
              : 'bg-midnight-800/50 text-midnight-400 hover:text-white'
          }`}
        >
          <Download className="w-5 h-5" />
          Deposit
        </button>
        <button
          onClick={() => setMode('withdraw')}
          className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl transition-all ${
            mode === 'withdraw'
              ? 'bg-gold-500 text-midnight-900'
              : 'bg-midnight-800/50 text-midnight-400 hover:text-white'
          }`}
        >
          <Send className="w-5 h-5" />
          Withdraw
        </button>
      </motion.div>

      {/* Transfer Form */}
      {mode === 'transfer' && (
        <motion.form
          variants={item}
          onSubmit={transferForm.handleSubmit(onTransfer)}
          className="glass-card space-y-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="label">From Account</label>
              <select
                {...transferForm.register('sourceAccountNumber', {
                  required: 'Please select a source account',
                })}
                className="input"
              >
                <option value="">Select account</option>
                {activeAccounts.map((account) => (
                  <option key={account.id} value={account.accountNumber}>
                    {getAccountLabel(account)}
                  </option>
                ))}
              </select>
              {transferForm.formState.errors.sourceAccountNumber && (
                <p className="text-sm text-red-400 mt-1">
                  {transferForm.formState.errors.sourceAccountNumber.message}
                </p>
              )}
            </div>

            <div>
              <label className="label">To Account</label>
              <select
                {...transferForm.register('destinationAccountNumber', {
                  required: 'Please select a destination account',
                })}
                className="input"
              >
                <option value="">Select account</option>
                {activeAccounts.map((account) => (
                  <option key={account.id} value={account.accountNumber}>
                    {getAccountLabel(account)}
                  </option>
                ))}
              </select>
              {transferForm.formState.errors.destinationAccountNumber && (
                <p className="text-sm text-red-400 mt-1">
                  {transferForm.formState.errors.destinationAccountNumber.message}
                </p>
              )}
            </div>
          </div>

          <div>
            <label className="label">Amount</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-midnight-400">
                $
              </span>
              <input
                type="number"
                step="0.01"
                min="0.01"
                {...transferForm.register('amount', {
                  required: 'Amount is required',
                  min: { value: 0.01, message: 'Amount must be greater than 0' },
                })}
                className="input pl-8"
                placeholder="0.00"
              />
            </div>
            {transferForm.formState.errors.amount && (
              <p className="text-sm text-red-400 mt-1">
                {transferForm.formState.errors.amount.message}
              </p>
            )}
          </div>

          <div>
            <label className="label">Description (Optional)</label>
            <input
              type="text"
              {...transferForm.register('description')}
              className="input"
              placeholder="What's this transfer for?"
            />
          </div>

          <button
            type="submit"
            disabled={transferMutation.isPending}
            className="w-full btn-primary"
          >
            {transferMutation.isPending ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <ArrowRight className="w-5 h-5" />
                Transfer Funds
              </>
            )}
          </button>
        </motion.form>
      )}

      {/* Deposit Form */}
      {mode === 'deposit' && (
        <motion.form
          variants={item}
          onSubmit={depositForm.handleSubmit((data) => depositMutation.mutate(data))}
          className="glass-card space-y-6"
        >
          <div>
            <label className="label">To Account</label>
            <select
              {...depositForm.register('accountNumber', {
                required: 'Please select an account',
              })}
              className="input"
            >
              <option value="">Select account</option>
              {activeAccounts.map((account) => (
                <option key={account.id} value={account.accountNumber}>
                  {getAccountLabel(account)}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="label">Amount</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-midnight-400">
                $
              </span>
              <input
                type="number"
                step="0.01"
                min="0.01"
                {...depositForm.register('amount', {
                  required: 'Amount is required',
                  min: { value: 0.01, message: 'Amount must be greater than 0' },
                })}
                className="input pl-8"
                placeholder="0.00"
              />
            </div>
          </div>

          <div>
            <label className="label">Description (Optional)</label>
            <input
              type="text"
              {...depositForm.register('description')}
              className="input"
              placeholder="Deposit description"
            />
          </div>

          <button
            type="submit"
            disabled={depositMutation.isPending}
            className="w-full btn bg-green-500 text-white hover:bg-green-600"
          >
            {depositMutation.isPending ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <Download className="w-5 h-5" />
                Make Deposit
              </>
            )}
          </button>
        </motion.form>
      )}

      {/* Withdraw Form */}
      {mode === 'withdraw' && (
        <motion.form
          variants={item}
          onSubmit={withdrawForm.handleSubmit((data) => withdrawMutation.mutate(data))}
          className="glass-card space-y-6"
        >
          <div>
            <label className="label">From Account</label>
            <select
              {...withdrawForm.register('accountNumber', {
                required: 'Please select an account',
              })}
              className="input"
            >
              <option value="">Select account</option>
              {activeAccounts.map((account) => (
                <option key={account.id} value={account.accountNumber}>
                  {getAccountLabel(account)}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="label">Amount</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-midnight-400">
                $
              </span>
              <input
                type="number"
                step="0.01"
                min="0.01"
                {...withdrawForm.register('amount', {
                  required: 'Amount is required',
                  min: { value: 0.01, message: 'Amount must be greater than 0' },
                })}
                className="input pl-8"
                placeholder="0.00"
              />
            </div>
          </div>

          <div>
            <label className="label">Description (Optional)</label>
            <input
              type="text"
              {...withdrawForm.register('description')}
              className="input"
              placeholder="Withdrawal description"
            />
          </div>

          <button
            type="submit"
            disabled={withdrawMutation.isPending}
            className="w-full btn-gold"
          >
            {withdrawMutation.isPending ? (
              <div className="w-5 h-5 border-2 border-midnight-900 border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <Send className="w-5 h-5" />
                Withdraw Funds
              </>
            )}
          </button>
        </motion.form>
      )}

      {/* No Accounts Warning */}
      {activeAccounts.length === 0 && (
        <motion.div variants={item} className="glass-card text-center py-12">
          <Wallet className="w-12 h-12 text-midnight-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-white mb-2">
            No Active Accounts
          </h3>
          <p className="text-midnight-400">
            You need at least one active account to make transfers.
          </p>
        </motion.div>
      )}
    </motion.div>
  )
}

