import { apiClient } from './client'
import type { Transaction } from '../types'

export interface PaginatedResponse<T> {
  content: T[]
  totalElements: number
  totalPages: number
  size: number
  number: number
}

export const transactionApi = {
  getById: async (id: string): Promise<Transaction> => {
    const { data } = await apiClient.get(`/transactions/${id}`)
    return data
  },

  getByReference: async (reference: string): Promise<Transaction> => {
    const { data } = await apiClient.get(`/transactions/reference/${reference}`)
    return data
  },

  getByAccountId: async (
    accountId: string,
    page = 0,
    size = 20
  ): Promise<PaginatedResponse<Transaction>> => {
    const { data } = await apiClient.get(`/transactions/account/${accountId}`, {
      params: { page, size },
    })
    return data
  },

  getByAccountIdAndDateRange: async (
    accountId: string,
    startDate: string,
    endDate: string
  ): Promise<Transaction[]> => {
    const { data } = await apiClient.get(`/transactions/account/${accountId}/range`, {
      params: { startDate, endDate },
    })
    return data
  },
}

