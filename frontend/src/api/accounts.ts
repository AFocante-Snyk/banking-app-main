import { apiClient } from './client'
import type { Account, OpenAccountRequest, Transaction, TransferRequest } from '../types'

export const accountApi = {
  getAll: async (): Promise<Account[]> => {
    const { data } = await apiClient.get('/accounts')
    return data
  },

  getById: async (id: string): Promise<Account> => {
    const { data } = await apiClient.get(`/accounts/${id}`)
    return data
  },

  getByNumber: async (accountNumber: string): Promise<Account> => {
    const { data } = await apiClient.get(`/accounts/number/${accountNumber}`)
    return data
  },

  getByCustomerId: async (customerId: string): Promise<Account[]> => {
    const { data } = await apiClient.get(`/accounts/customer/${customerId}`)
    return data
  },

  open: async (request: OpenAccountRequest): Promise<Account> => {
    const { data } = await apiClient.post('/accounts/open', request)
    return data
  },

  close: async (id: string): Promise<Account> => {
    const { data } = await apiClient.post(`/accounts/${id}/close`)
    return data
  },

  deposit: async (accountNumber: string, amount: number, description?: string): Promise<Transaction> => {
    const params = new URLSearchParams({ amount: amount.toString() })
    if (description) params.append('description', description)
    const { data } = await apiClient.post(`/accounts/number/${accountNumber}/deposit?${params}`)
    return data
  },

  withdraw: async (accountNumber: string, amount: number, description?: string): Promise<Transaction> => {
    const params = new URLSearchParams({ amount: amount.toString() })
    if (description) params.append('description', description)
    const { data } = await apiClient.post(`/accounts/number/${accountNumber}/withdraw?${params}`)
    return data
  },

  transfer: async (request: TransferRequest): Promise<Transaction> => {
    const { data } = await apiClient.post('/accounts/transfer', request)
    return data
  },
}

