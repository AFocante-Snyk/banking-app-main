import { Routes, Route, Navigate } from 'react-router-dom'
import { Layout } from './components/Layout'
import { Dashboard } from './pages/Dashboard'
import { Accounts } from './pages/Accounts'
import { Transfers } from './pages/Transfers'
import { Transactions } from './pages/Transactions'
import { Profile } from './pages/Profile'
import { OpenAccount } from './pages/OpenAccount'
import { Search } from './pages/Search'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="accounts" element={<Accounts />} />
        <Route path="accounts/open" element={<OpenAccount />} />
        <Route path="transfers" element={<Transfers />} />
        <Route path="transactions" element={<Transactions />} />
        <Route path="profile" element={<Profile />} />
        <Route path="search" element={<Search />} />
      </Route>
    </Routes>
  )
}

export default App

