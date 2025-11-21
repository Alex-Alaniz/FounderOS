'use client'

import { useState } from 'react'

interface TokenGateProps {
  onUnlock: () => void
}

export default function TokenGate({ onUnlock }: TokenGateProps) {
  const [isConnecting, setIsConnecting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleConnect = async () => {
    setIsConnecting(true)
    setError(null)

    try {
      // Check if wallet is available
      if (typeof window !== 'undefined' && (window as any).ethereum) {
        // Request account access
        const accounts = await (window as any).ethereum.request({
          method: 'eth_requestAccounts',
        })

        if (accounts.length > 0) {
          // In a real implementation, you would check token balance here
          // For now, we'll simulate a successful unlock
          setTimeout(() => {
            setIsConnecting(false)
            onUnlock()
          }, 1000)
        }
      } else {
        throw new Error('No wallet detected. Please install MetaMask or another Web3 wallet.')
      }
    } catch (err: any) {
      setError(err.message || 'Failed to connect wallet')
      setIsConnecting(false)
    }
  }

  return (
    <section className="min-h-screen flex items-center justify-center py-20 px-6 bg-gray-900">
      <div className="max-w-2xl mx-auto text-center">
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-12 border border-gray-700">
          <div className="mb-8">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
              <svg
                className="w-10 h-10 text-white"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h2 className="text-4xl font-bold mb-4 font-display">
              Token Holder Exclusive
            </h2>
            <p className="text-lg text-gray-400 mb-8">
              Connect your wallet to view the complete roadmap and exclusive
              content for BearifiedCo token holders.
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-lg text-red-400">
              {error}
            </div>
          )}

          <button
            onClick={handleConnect}
            disabled={isConnecting}
            className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-lg font-semibold text-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isConnecting ? 'Connecting...' : 'Connect Wallet'}
          </button>

          <p className="mt-6 text-sm text-gray-500">
            Don't have a wallet?{' '}
            <a
              href="https://metamask.io"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:text-blue-300 underline"
            >
              Install MetaMask
            </a>
          </p>

          <div className="mt-8 pt-8 border-t border-gray-700">
            <p className="text-sm text-gray-500">
              Note: Token gating is optional. The roadmap preview above is
              publicly accessible.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

