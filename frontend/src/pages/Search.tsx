import { useState } from 'react'
import { motion } from 'framer-motion'
import { Search as SearchIcon, AlertTriangle, Database, Code } from 'lucide-react'
import { apiClient } from '../api/client'

/**
 * ⚠️ VULNERABLE COMPONENT - FOR EDUCATIONAL PURPOSES ONLY ⚠️
 *
 * This component contains intentional security vulnerabilities to demonstrate:
 * 1. XSS (Cross-Site Scripting) attacks via dangerouslySetInnerHTML
 * 2. Unsafe rendering of user input
 *
 * DO NOT USE IN PRODUCTION
 */

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

export function Search() {
  const [customerSearch, setCustomerSearch] = useState('')
  const [accountSearch, setAccountSearch] = useState('')
  const [echoMessage, setEchoMessage] = useState('')
  const [results, setResults] = useState<any>(null)
  const [echoResult, setEchoResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const searchCustomers = async () => {
    setLoading(true)
    setError(null)
    try {
      const { data } = await apiClient.get('/search/customers', {
        params: { name: customerSearch },
      })
      setResults(data)
    } catch (err: any) {
      setError(err.response?.data?.error || err.message)
      setResults(err.response?.data)
    } finally {
      setLoading(false)
    }
  }

  const searchAccounts = async () => {
    setLoading(true)
    setError(null)
    try {
      const { data } = await apiClient.get('/search/accounts', {
        params: { accountNumber: accountSearch },
      })
      setResults(data)
    } catch (err: any) {
      setError(err.response?.data?.error || err.message)
      setResults(err.response?.data)
    } finally {
      setLoading(false)
    }
  }

  const sendEcho = async () => {
    setLoading(true)
    setError(null)
    try {
      const { data } = await apiClient.get('/search/echo', {
        params: { message: echoMessage },
      })
      setEchoResult(data)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-8"
    >
      {/* Warning Banner */}
      <motion.div
        variants={item}
        className="glass-card bg-red-500/10 border-red-500/30"
      >
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-red-500/20 flex items-center justify-center flex-shrink-0">
            <AlertTriangle className="w-6 h-6 text-red-400" />
          </div>
          <div>
            <h2 className="text-xl font-display font-bold text-red-400 mb-2">
              ⚠️ Security Vulnerability Demo
            </h2>
            <p className="text-midnight-300">
              This page contains <strong>intentional security vulnerabilities</strong> for
              educational purposes. It demonstrates SQL Injection and XSS attacks.
              <strong className="text-red-400"> DO NOT use this code in production!</strong>
            </p>
          </div>
        </div>
      </motion.div>

      {/* SQL Injection Demo - Customer Search */}
      <motion.div variants={item} className="glass-card">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-orange-500/20 flex items-center justify-center">
            <Database className="w-5 h-5 text-orange-400" />
          </div>
          <div>
            <h3 className="text-lg font-display font-semibold text-white">
              SQL Injection Demo - Customer Search
            </h3>
            <p className="text-sm text-midnight-400">
              Try: <code className="bg-midnight-800 px-2 py-1 rounded">' OR '1'='1</code>
            </p>
          </div>
        </div>

        <div className="flex gap-4">
          <input
            type="text"
            value={customerSearch}
            onChange={(e) => setCustomerSearch(e.target.value)}
            placeholder="Enter customer name..."
            className="input flex-1"
          />
          <button onClick={searchCustomers} disabled={loading} className="btn-primary">
            <SearchIcon className="w-5 h-5" />
            Search
          </button>
        </div>
      </motion.div>

      {/* SQL Injection Demo - Account Search */}
      <motion.div variants={item} className="glass-card">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-orange-500/20 flex items-center justify-center">
            <Database className="w-5 h-5 text-orange-400" />
          </div>
          <div>
            <h3 className="text-lg font-display font-semibold text-white">
              SQL Injection Demo - Account Search
            </h3>
            <p className="text-sm text-midnight-400">
              Try: <code className="bg-midnight-800 px-2 py-1 rounded">' UNION SELECT * FROM customers --</code>
            </p>
          </div>
        </div>

        <div className="flex gap-4">
          <input
            type="text"
            value={accountSearch}
            onChange={(e) => setAccountSearch(e.target.value)}
            placeholder="Enter account number..."
            className="input flex-1"
          />
          <button onClick={searchAccounts} disabled={loading} className="btn-secondary">
            <SearchIcon className="w-5 h-5" />
            Search
          </button>
        </div>
      </motion.div>

      {/* XSS Demo */}
      <motion.div variants={item} className="glass-card">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center">
            <Code className="w-5 h-5 text-purple-400" />
          </div>
          <div>
            <h3 className="text-lg font-display font-semibold text-white">
              XSS (Cross-Site Scripting) Demo
            </h3>
            <p className="text-sm text-midnight-400">
              Try: <code className="bg-midnight-800 px-2 py-1 rounded">&lt;img src=x onerror="alert('XSS')"&gt;</code>
            </p>
          </div>
        </div>

        <div className="flex gap-4 mb-4">
          <input
            type="text"
            value={echoMessage}
            onChange={(e) => setEchoMessage(e.target.value)}
            placeholder="Enter a message to echo..."
            className="input flex-1"
          />
          <button onClick={sendEcho} disabled={loading} className="btn-gold">
            Send
          </button>
        </div>

        {echoResult && (
          <div className="space-y-4">
            <div className="p-4 bg-midnight-800 rounded-xl">
              <p className="text-sm text-midnight-400 mb-2">Raw message:</p>
              <p className="text-white">{echoResult.message}</p>
            </div>

            {/* ⚠️ XSS VULNERABILITY: Using dangerouslySetInnerHTML with unsanitized input */}
            <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl">
              <p className="text-sm text-red-400 mb-2">
                ⚠️ VULNERABLE: Rendered as HTML (dangerouslySetInnerHTML)
              </p>
              <div
                className="text-white"
                dangerouslySetInnerHTML={{ __html: echoResult.html }}
              />
            </div>
          </div>
        )}
      </motion.div>

      {/* Results Display */}
      {(results || error) && (
        <motion.div variants={item} className="glass-card">
          <h3 className="text-lg font-display font-semibold text-white mb-4">
            Query Results
          </h3>

          {error && (
            <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl mb-4">
              <p className="text-red-400">Error: {error}</p>
            </div>
          )}

          {results?.query && (
            <div className="p-4 bg-orange-500/10 border border-orange-500/30 rounded-xl mb-4">
              <p className="text-sm text-orange-400 mb-2">Executed SQL Query:</p>
              <code className="text-white font-mono text-sm break-all">
                {results.query}
              </code>
            </div>
          )}

          {results?.results && (
            <div className="p-4 bg-midnight-800 rounded-xl">
              <p className="text-sm text-midnight-400 mb-2">
                Results ({results.results.length} found):
              </p>
              <pre className="text-white font-mono text-xs overflow-auto max-h-64">
                {JSON.stringify(results.results, null, 2)}
              </pre>
            </div>
          )}
        </motion.div>
      )}

      {/* Attack Examples */}
      <motion.div variants={item} className="glass-card">
        <h3 className="text-lg font-display font-semibold text-white mb-4">
          Example Attack Payloads
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-midnight-800 rounded-xl">
            <h4 className="font-semibold text-orange-400 mb-2">SQL Injection</h4>
            <ul className="space-y-2 text-sm text-midnight-300">
              <li><code className="bg-midnight-900 px-2 py-1 rounded">' OR '1'='1</code> - Always true</li>
              <li><code className="bg-midnight-900 px-2 py-1 rounded">' UNION SELECT * FROM customers --</code></li>
              <li><code className="bg-midnight-900 px-2 py-1 rounded">'; DROP TABLE customers; --</code></li>
              <li><code className="bg-midnight-900 px-2 py-1 rounded">' OR 1=1; --</code></li>
            </ul>
          </div>

          <div className="p-4 bg-midnight-800 rounded-xl">
            <h4 className="font-semibold text-purple-400 mb-2">XSS Attacks</h4>
            <ul className="space-y-2 text-sm text-midnight-300">
              <li><code className="bg-midnight-900 px-2 py-1 rounded">&lt;script&gt;alert('XSS')&lt;/script&gt;</code></li>
              <li><code className="bg-midnight-900 px-2 py-1 rounded">&lt;img src=x onerror="alert('XSS')"&gt;</code></li>
              <li><code className="bg-midnight-900 px-2 py-1 rounded">&lt;svg onload="alert('XSS')"&gt;</code></li>
              <li><code className="bg-midnight-900 px-2 py-1 rounded">&lt;body onload="alert('XSS')"&gt;</code></li>
            </ul>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

