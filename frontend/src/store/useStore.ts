import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Customer, Account } from '../types'

interface AppState {
  // Current user/customer (for demo purposes)
  currentCustomer: Customer | null
  setCurrentCustomer: (customer: Customer | null) => void

  // Selected account for operations
  selectedAccount: Account | null
  setSelectedAccount: (account: Account | null) => void

  // UI State
  sidebarOpen: boolean
  toggleSidebar: () => void
  setSidebarOpen: (open: boolean) => void
}

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      currentCustomer: null,
      setCurrentCustomer: (customer) => set({ currentCustomer: customer }),

      selectedAccount: null,
      setSelectedAccount: (account) => set({ selectedAccount: account }),

      sidebarOpen: true,
      toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
      setSidebarOpen: (open) => set({ sidebarOpen: open }),
    }),
    {
      name: 'luminous-banking-store',
      partialize: (state) => ({
        currentCustomer: state.currentCustomer,
        sidebarOpen: state.sidebarOpen,
      }),
    }
  )
)

