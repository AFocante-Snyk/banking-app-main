import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { User, Mail, Phone, MapPin, Briefcase, CreditCard, Save, Sparkles } from 'lucide-react'
import toast from 'react-hot-toast'
import { useStore } from '../store/useStore'
import { customerApi } from '../api/customers'
import type { Customer, EmploymentStatus } from '../types'

interface ProfileFormData {
  firstName: string
  lastName: string
  email: string
  phone: string
  dateOfBirth: string
  address: string
  city: string
  state: string
  zipCode: string
  country: string
  creditScore: number
  annualIncome: number
  employmentStatus: EmploymentStatus
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

export function Profile() {
  const queryClient = useQueryClient()
  const { currentCustomer, setCurrentCustomer } = useStore()

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm<ProfileFormData>({
    defaultValues: currentCustomer
      ? {
          firstName: currentCustomer.firstName,
          lastName: currentCustomer.lastName,
          email: currentCustomer.email,
          phone: currentCustomer.phone,
          dateOfBirth: currentCustomer.dateOfBirth,
          address: currentCustomer.address,
          city: currentCustomer.city,
          state: currentCustomer.state,
          zipCode: currentCustomer.zipCode,
          country: currentCustomer.country,
          creditScore: currentCustomer.creditScore,
          annualIncome: currentCustomer.annualIncome,
          employmentStatus: currentCustomer.employmentStatus,
        }
      : {
          country: 'USA',
          creditScore: 700,
          employmentStatus: 'EMPLOYED',
        },
  })

  const createMutation = useMutation({
    mutationFn: customerApi.create,
    onSuccess: (customer) => {
      setCurrentCustomer(customer)
      queryClient.invalidateQueries({ queryKey: ['customers'] })
      toast.success('Profile created successfully!')
    },
    onError: (error: Error) => {
      toast.error(error.message)
    },
  })

  const updateMutation = useMutation({
    mutationFn: (data: Partial<Customer>) =>
      customerApi.update(currentCustomer!.id, data),
    onSuccess: (customer) => {
      setCurrentCustomer(customer)
      queryClient.invalidateQueries({ queryKey: ['customers'] })
      toast.success('Profile updated successfully!')
    },
    onError: (error: Error) => {
      toast.error(error.message)
    },
  })

  const onSubmit = (data: ProfileFormData) => {
    if (currentCustomer) {
      updateMutation.mutate(data)
    } else {
      createMutation.mutate(data as unknown as Partial<Customer>)
    }
  }

  const isLoading = createMutation.isPending || updateMutation.isPending

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="max-w-4xl mx-auto space-y-8"
    >
      {/* Header */}
      <motion.div variants={item} className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-display font-bold text-white">
            {currentCustomer ? 'Your Profile' : 'Create Your Profile'}
          </h2>
          <p className="text-midnight-400 mt-1">
            {currentCustomer
              ? 'Manage your personal information'
              : 'Set up your profile to start using Luminous Banking'}
          </p>
        </div>
        {currentCustomer && (
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-luminous-500 to-gold-500 flex items-center justify-center text-white font-bold text-2xl font-display">
            {currentCustomer.firstName[0]}
            {currentCustomer.lastName[0]}
          </div>
        )}
      </motion.div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* Personal Information */}
        <motion.div variants={item} className="glass-card">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-luminous-500/20 flex items-center justify-center">
              <User className="w-5 h-5 text-luminous-400" />
            </div>
            <h3 className="text-lg font-display font-semibold text-white">
              Personal Information
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="label">First Name</label>
              <input
                type="text"
                {...register('firstName', { required: 'First name is required' })}
                className={`input ${errors.firstName ? 'input-error' : ''}`}
                placeholder="John"
              />
              {errors.firstName && (
                <p className="text-sm text-red-400 mt-1">{errors.firstName.message}</p>
              )}
            </div>

            <div>
              <label className="label">Last Name</label>
              <input
                type="text"
                {...register('lastName', { required: 'Last name is required' })}
                className={`input ${errors.lastName ? 'input-error' : ''}`}
                placeholder="Doe"
              />
              {errors.lastName && (
                <p className="text-sm text-red-400 mt-1">{errors.lastName.message}</p>
              )}
            </div>

            <div>
              <label className="label">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-midnight-400" />
                <input
                  type="email"
                  {...register('email', {
                    required: 'Email is required',
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: 'Please enter a valid email',
                    },
                  })}
                  className={`input pl-10 ${errors.email ? 'input-error' : ''}`}
                  placeholder="john@example.com"
                />
              </div>
              {errors.email && (
                <p className="text-sm text-red-400 mt-1">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label className="label">Phone</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-midnight-400" />
                <input
                  type="tel"
                  {...register('phone', { required: 'Phone is required' })}
                  className={`input pl-10 ${errors.phone ? 'input-error' : ''}`}
                  placeholder="+1234567890"
                />
              </div>
              {errors.phone && (
                <p className="text-sm text-red-400 mt-1">{errors.phone.message}</p>
              )}
            </div>

            <div>
              <label className="label">Date of Birth</label>
              <input
                type="date"
                {...register('dateOfBirth', { required: 'Date of birth is required' })}
                className={`input ${errors.dateOfBirth ? 'input-error' : ''}`}
              />
              {errors.dateOfBirth && (
                <p className="text-sm text-red-400 mt-1">{errors.dateOfBirth.message}</p>
              )}
            </div>
          </div>
        </motion.div>

        {/* Address */}
        <motion.div variants={item} className="glass-card">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-gold-500/20 flex items-center justify-center">
              <MapPin className="w-5 h-5 text-gold-400" />
            </div>
            <h3 className="text-lg font-display font-semibold text-white">
              Address
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="label">Street Address</label>
              <input
                type="text"
                {...register('address', { required: 'Address is required' })}
                className={`input ${errors.address ? 'input-error' : ''}`}
                placeholder="123 Main St"
              />
            </div>

            <div>
              <label className="label">City</label>
              <input
                type="text"
                {...register('city')}
                className="input"
                placeholder="New York"
              />
            </div>

            <div>
              <label className="label">State</label>
              <input
                type="text"
                {...register('state')}
                className="input"
                placeholder="NY"
              />
            </div>

            <div>
              <label className="label">ZIP Code</label>
              <input
                type="text"
                {...register('zipCode')}
                className="input"
                placeholder="10001"
              />
            </div>

            <div>
              <label className="label">Country</label>
              <input
                type="text"
                {...register('country')}
                className="input"
                placeholder="USA"
              />
            </div>
          </div>
        </motion.div>

        {/* Financial Information */}
        <motion.div variants={item} className="glass-card">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-green-500/20 flex items-center justify-center">
              <CreditCard className="w-5 h-5 text-green-400" />
            </div>
            <h3 className="text-lg font-display font-semibold text-white">
              Financial Information
            </h3>
          </div>

          <p className="text-sm text-midnight-400 mb-6">
            This information helps us determine your personalized interest rates using our AI system.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="label">Credit Score</label>
              <input
                type="number"
                min="300"
                max="850"
                {...register('creditScore', {
                  required: 'Credit score is required',
                  min: { value: 300, message: 'Minimum score is 300' },
                  max: { value: 850, message: 'Maximum score is 850' },
                })}
                className={`input ${errors.creditScore ? 'input-error' : ''}`}
                placeholder="700"
              />
              {errors.creditScore && (
                <p className="text-sm text-red-400 mt-1">{errors.creditScore.message}</p>
              )}
            </div>

            <div>
              <label className="label">Annual Income</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-midnight-400">
                  $
                </span>
                <input
                  type="number"
                  {...register('annualIncome')}
                  className="input pl-7"
                  placeholder="75000"
                />
              </div>
            </div>

            <div>
              <label className="label">Employment Status</label>
              <select {...register('employmentStatus')} className="input">
                <option value="EMPLOYED">Employed</option>
                <option value="SELF_EMPLOYED">Self-Employed</option>
                <option value="UNEMPLOYED">Unemployed</option>
                <option value="RETIRED">Retired</option>
                <option value="STUDENT">Student</option>
              </select>
            </div>
          </div>
        </motion.div>

        {/* AI Rate Info */}
        <motion.div variants={item} className="glass-card bg-gradient-to-r from-luminous-500/10 to-gold-500/10 border-luminous-500/20">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-luminous-500/20 flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-6 h-6 text-luminous-400" />
            </div>
            <div>
              <h4 className="font-semibold text-white mb-2">
                AI-Powered Interest Rates
              </h4>
              <p className="text-sm text-midnight-300">
                When you open an account, our AI analyzes your profile to determine
                personalized interest rates. Factors include your credit score,
                income, employment status, and account type to ensure you get the
                best rates available.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Submit Button */}
        <motion.div variants={item} className="flex justify-end">
          <button
            type="submit"
            disabled={isLoading || (!isDirty && !!currentCustomer)}
            className="btn-primary"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <Save className="w-5 h-5" />
                {currentCustomer ? 'Update Profile' : 'Create Profile'}
              </>
            )}
          </button>
        </motion.div>
      </form>
    </motion.div>
  )
}

