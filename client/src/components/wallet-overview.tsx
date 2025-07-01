import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Wallet, Copy, ExternalLink } from "lucide-react";
import { formatAddress, copyToClipboard } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

interface WalletOverviewProps {
  address?: string;
  balance?: string | null;
  isLoading: boolean;
}

export default function WalletOverview({ address, balance, isLoading }: WalletOverviewProps) {
  const { toast } = useToast();

  const handleCopyAddress = async () => {
    if (!address) return;
    const success = await copyToClipboard(address);
    if (success) {
      toast({
        title: "Copied!",
        description: "Address copied to clipboard",
      });
    }
  };

  const estimateUsdValue = (ethBalance: string) => {
    // Simple USD estimation - in a real app, you'd fetch current ETH price
    const usdRate = 2500; // Approximate ETH price
    return (parseFloat(ethBalance) * usdRate).toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD'
    });
  };

  return (
    <Card className="lg:col-span-2 shadow-sm border border-slate-200">
      <CardContent className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <Wallet className="text-blue-600 text-xl h-6 w-6" />
          <h2 className="text-xl font-semibold text-slate-800">Wallet Overview</h2>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-2">Safe Address</label>
            <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg border">
              <span className="text-sm text-slate-800 font-mono flex-1 break-all">
                {address || "Not configured"}
              </span>
              {address && (
                <>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleCopyAddress}
                    className="text-slate-500 hover:text-blue-600 h-8 w-8 p-0"
                    title="Copy Address"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    asChild
                    className="text-slate-500 hover:text-blue-600 h-8 w-8 p-0"
                    title="View on Arbiscan"
                  >
                    <a href={`https://arbiscan.io/address/${address}`} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </Button>
                </>
              )}
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-2">ETH Balance</label>
            <div className="flex items-center gap-3">
              <span className="text-3xl font-bold text-slate-800">
                {isLoading ? "Loading..." : balance !== null ? balance : "0.0000"}
              </span>
              <span className="text-lg text-slate-500">ETH</span>
              {balance && !isLoading && (
                <div className="ml-auto">
                  <span className="text-sm text-slate-500">
                    ≈ {estimateUsdValue(balance)}
                  </span>
                </div>
              )}
            </div>
            <div className="mt-2 text-xs text-slate-500">
              Last updated: {isLoading ? "Loading..." : "2 minutes ago"}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
