import { apiClient } from './client'
import type { Customer } from '../types'

export const customerApi = {
  getAll: async (): Promise<Customer[]> => {
    const { data } = await apiClient.get('/customers')
    return data
  },

  getById: async (id: string): Promise<Customer> => {
    const { data } = await apiClient.get(`/customers/${id}`)
    return data
  },

  getByEmail: async (email: string): Promise<Customer> => {
    const { data } = await apiClient.get(`/customers/email/${email}`)
    return data
  },

  create: async (customer: Partial<Customer>): Promise<Customer> => {
    const { data } = await apiClient.post('/customers', customer)
    return data
  },

  update: async (id: string, customer: Partial<Customer>): Promise<Customer> => {
    const { data } = await apiClient.put(`/customers/${id}`, customer)
    return data
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/customers/${id}`)
  },
}

