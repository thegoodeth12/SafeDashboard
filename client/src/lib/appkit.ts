import { createAppKit } from '@reown/appkit/react'
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'
import { arbitrum, mainnet, polygon } from '@reown/appkit/networks'

// Get projectId from environment
const projectId = import.meta.env.VITE_REOWN_PROJECT_ID || '8a81e704ed22e53debea9db88f91bfcb'

// Create Wagmi Adapter
const wagmiAdapter = new WagmiAdapter({
  projectId,
  networks: [arbitrum, mainnet, polygon]
})

// Configure metadata
const metadata = {
  name: 'Safe Dashboard',
  description: 'Monitor Safe wallet transactions, balance, and GitHub repository stats',
  url: 'https://safe-dashboard.replit.app',
  icons: ['https://safe-dashboard.replit.app/favicon.ico']
}

// Create AppKit
createAppKit({
  adapters: [wagmiAdapter],
  projectId,
  networks: [arbitrum, mainnet, polygon],
  metadata,
  features: {
    analytics: true,
    email: true,
    socials: ['google', 'x', 'github', 'discord'],
    onramp: true,
    swaps: true
  },
  themeMode: 'light',
  themeVariables: {
    '--w3m-color-mix': '#2563eb',
    '--w3m-color-mix-strength': 40
  }
})

export { wagmiAdapter }