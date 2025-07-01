import { useAppKit, useAppKitAccount, useAppKitNetwork } from '@reown/appkit/react'
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Wallet, ChevronDown, ExternalLink, Power } from "lucide-react";
import { formatAddress } from "@/lib/utils";

export default function WalletConnect() {
  const { open, close } = useAppKit()
  const { address, isConnected, caipAddress } = useAppKitAccount()
  const { caipNetwork, chainId } = useAppKitNetwork()

  const handleConnect = () => {
    open()
  }

  const handleDisconnect = () => {
    open({ view: 'Account' })
  }

  const handleSwitchNetwork = () => {
    open({ view: 'Networks' })
  }

  return (
    <Card className="shadow-sm border border-slate-200">
      <CardContent className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <Wallet className="text-green-600 text-xl h-6 w-6" />
          <h3 className="text-lg font-semibold text-slate-800">Wallet Connection</h3>
        </div>
        
        {!isConnected ? (
          <div className="space-y-4">
            <p className="text-sm text-slate-600 mb-4">
              Connect your wallet to interact with blockchain networks and manage your assets.
            </p>
            <Button
              onClick={handleConnect}
              className="w-full bg-green-600 hover:bg-green-700 text-white"
            >
              <Wallet className="h-4 w-4 mr-2" />
              Connect Wallet
            </Button>
            <div className="text-xs text-slate-500 text-center">
              Supports 500+ wallets including MetaMask, WalletConnect, and more
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">Connected Account</label>
                <div className="flex items-center gap-2 p-3 bg-green-50 rounded-lg border border-green-200">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-slate-800 font-mono flex-1">
                    {formatAddress(address || '', 8, 6)}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleDisconnect}
                    className="text-slate-500 hover:text-green-600 h-8 w-8 p-0"
                    title="Account Settings"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">Network</label>
                <Button
                  variant="outline"
                  onClick={handleSwitchNetwork}
                  className="w-full justify-between"
                >
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="text-xs">
                      {caipNetwork?.name || 'Unknown Network'}
                    </Badge>
                    {chainId && (
                      <span className="text-xs text-slate-500">ID: {chainId}</span>
                    )}
                  </div>
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => open({ view: 'Account' })}
                className="flex-1"
              >
                Account
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => open({ view: 'Networks' })}
                className="flex-1"
              >
                Networks
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}