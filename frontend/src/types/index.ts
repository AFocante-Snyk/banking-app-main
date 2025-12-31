export interface Customer {
  id: string
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
  ssn?: string
  creditScore: number
  annualIncome: number
  employmentStatus: EmploymentStatus
  accounts?: Account[]
  createdAt: string
  updatedAt: string
}

export type EmploymentStatus = 'EMPLOYED' | 'SELF_EMPLOYED' | 'UNEMPLOYED' | 'RETIRED' | 'STUDENT'

export interface Account {
  id: string
  accountNumber: string
  accountType: AccountType
  balance: number
  interestRate: number
  status: AccountStatus
  customerId: string
  customerName: string
  createdAt: string
  updatedAt: string
  closedAt?: string
}

export type AccountType = 'CHECKING' | 'SAVINGS' | 'MONEY_MARKET' | 'CERTIFICATE_OF_DEPOSIT'
export type AccountStatus = 'ACTIVE' | 'FROZEN' | 'CLOSED' | 'PENDING'

export interface Transaction {
  id: string
  transactionReference: string
  type: TransactionType
  amount: number
  balanceAfter: number
  sourceAccountNumber?: string
  destinationAccountNumber?: string
  description: string
  status: TransactionStatus
  createdAt: string
}

export type TransactionType = 'DEPOSIT' | 'WITHDRAWAL' | 'TRANSFER' | 'INTEREST_CREDIT' | 'FEE' | 'REFUND'
export type TransactionStatus = 'PENDING' | 'COMPLETED' | 'FAILED' | 'CANCELLED'

export interface TransferRequest {
  sourceAccountNumber: string
  destinationAccountNumber: string
  amount: number
  description?: string
}

export interface OpenAccountRequest {
  customerId: string
  accountType: AccountType
  initialDeposit?: number
}

export interface InterestRateResponse {
  interestRate: number
  riskCategory: string
  explanation: string
  factors: string[]
  approved: boolean
}

