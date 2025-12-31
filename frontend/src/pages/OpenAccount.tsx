import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Sparkles, Shield, TrendingUp, Clock } from 'lucide-react'
import toast from 'react-hot-toast'
import { accountApi } from '../api/accounts'
import { useStore } from '../store/useStore'
import type { AccountType, OpenAccountRequest } from '../types'

interface FormData {
  accountType: AccountType
  initialDeposit: number
}

const accountTypes = [
  {
    type: 'CHECKING' as AccountType,
    name: 'Checking Account',
    description: 'Everyday banking with unlimited transactions',
    icon: '💳',
    features: ['No minimum balance', 'Free debit card', 'Online bill pay'],
    baseRate: '0.10%',
  },
  {
    type: 'SAVINGS' as AccountType,
    name: 'Savings Account',
    description: 'Grow your money with competitive rates',
    icon: '💰',
    features: ['High-yield interest', 'Automatic savings', 'No fees'],
    baseRate: '4.50%',
  },
  {
    type: 'MONEY_MARKET' as AccountType,
    name: 'Money Market',
    description: 'Premium rates with check-writing privileges',
    icon: '📈',
    features: ['Higher rates', 'Check access', 'Tiered interest'],
    baseRate: '5.00%',
  },
  {
    type: 'CERTIFICATE_OF_DEPOSIT' as AccountType,
    name: 'Certificate of Deposit',
    description: 'Lock in the best rates for your savings',
    icon: '🏦',
    features: ['Guaranteed returns', 'FDIC insured', 'Fixed terms'],
    baseRate: '5.50%',
  },
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

export function OpenAccount() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { currentCustomer } = useStore()

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      accountType: 'SAVINGS',
      initialDeposit: 0,
    },
  })

  const selectedType = watch('accountType')

  const openMutation = useMutation({
    mutationFn: (data: OpenAccountRequest) => accountApi.open(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['accounts'] })
      toast.success('Account opened successfully!')
      navigate('/accounts')
    },
    onError: (error: Error) => {
      toast.error(error.message)
    },
  })

  const onSubmit = (data: FormData) => {
    if (!currentCustomer) {
      toast.error('Please set up your profile first')
      navigate('/profile')
      return
    }

    openMutation.mutate({
      customerId: currentCustomer.id,
      accountType: data.accountType,
      initialDeposit: data.initialDeposit,
    })
  }

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="max-w-4xl mx-auto space-y-8"
    >
      {/* Back Button */}
      <motion.button
        variants={item}
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-midnight-400 hover:text-white transition-colors"
      >
        <ArrowLeft className="w-5 h-5" />
        Back to Accounts
      </motion.button>

      {/* Header */}
      <motion.div variants={item} className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-luminous-500 to-luminous-700 shadow-glow mb-6">
          <Sparkles className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-3xl font-display font-bold text-white mb-2">
          Open a New Account
        </h1>
        <p className="text-midnight-400 max-w-md mx-auto">
          Choose the account type that fits your needs. Your personalized interest
          rate will be calculated based on your profile.
        </p>
      </motion.div>

      {/* Account Type Selection */}
      <motion.div variants={item}>
        <h2 className="text-lg font-display font-semibold text-white mb-4">
          Select Account Type
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {accountTypes.map((account) => (
            <button
              key={account.type}
              type="button"
              onClick={() => setValue('accountType', account.type)}
              className={`text-left p-6 rounded-2xl border-2 transition-all ${
                selectedType === account.type
                  ? 'border-luminous-500 bg-luminous-500/10 shadow-glow'
                  : 'border-midnight-700 bg-midnight-800/50 hover:border-midnight-600'
              }`}
            >
              <div className="flex items-start gap-4">
                <span className="text-3xl">{account.icon}</span>
                <div className="flex-1">
                  <h3 className="font-semibold text-white mb-1">{account.name}</h3>
                  <p className="text-sm text-midnight-400 mb-3">
                    {account.description}
                  </p>
                  <div className="flex items-center gap-2 mb-3">
                    <TrendingUp className="w-4 h-4 text-green-400" />
                    <span className="text-sm text-green-400">
                      Up to {account.baseRate} APY
                    </span>
                  </div>
                  <ul className="space-y-1">
                    {account.features.map((feature) => (
                      <li
                        key={feature}
                        className="text-xs text-midnight-400 flex items-center gap-2"
                      >
                        <span className="w-1 h-1 rounded-full bg-luminous-500" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </button>
          ))}
        </div>
      </motion.div>

      {/* Initial Deposit */}
      <motion.div variants={item} className="glass-card">
        <h2 className="text-lg font-display font-semibold text-white mb-4">
          Initial Deposit (Optional)
        </h2>
        <div className="max-w-md">
          <label className="label">Amount</label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-midnight-400">
              $
            </span>
            <input
              type="number"
              step="0.01"
              min="0"
              {...register('initialDeposit', {
                min: { value: 0, message: 'Amount cannot be negative' },
              })}
              className={`input pl-8 ${errors.initialDeposit ? 'input-error' : ''}`}
              placeholder="0.00"
            />
          </div>
          {errors.initialDeposit && (
            <p className="text-sm text-red-400 mt-1">
              {errors.initialDeposit.message}
            </p>
          )}
        </div>
      </motion.div>

      {/* Benefits */}
      <motion.div variants={item} className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="glass-card flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-green-500/20 flex items-center justify-center flex-shrink-0">
            <Shield className="w-5 h-5 text-green-400" />
          </div>
          <div>
            <h3 className="font-medium text-white mb-1">FDIC Insured</h3>
            <p className="text-sm text-midnight-400">
              Your deposits are protected up to $250,000
            </p>
          </div>
        </div>
        <div className="glass-card flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-luminous-500/20 flex items-center justify-center flex-shrink-0">
            <TrendingUp className="w-5 h-5 text-luminous-400" />
          </div>
          <div>
            <h3 className="font-medium text-white mb-1">AI-Powered Rates</h3>
            <p className="text-sm text-midnight-400">
              Personalized rates based on your profile
            </p>
          </div>
        </div>
        <div className="glass-card flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-gold-500/20 flex items-center justify-center flex-shrink-0">
            <Clock className="w-5 h-5 text-gold-400" />
          </div>
          <div>
            <h3 className="font-medium text-white mb-1">Instant Approval</h3>
            <p className="text-sm text-midnight-400">
              Open your account in minutes
            </p>
          </div>
        </div>
      </motion.div>

      {/* Submit */}
      <motion.div variants={item} className="flex justify-end gap-4">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="btn-secondary"
        >
          Cancel
        </button>
        <button
          onClick={handleSubmit(onSubmit)}
          disabled={openMutation.isPending}
          className="btn-gold"
        >
          {openMutation.isPending ? (
            <>
              <div className="w-5 h-5 border-2 border-midnight-900 border-t-transparent rounded-full animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5" />
              Open Account
            </>
          )}
        </button>
      </motion.div>
    </motion.div>
  )
}

