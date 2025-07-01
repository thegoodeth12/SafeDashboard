import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import WalletOverview from "./wallet-overview";
import QuickActions from "./quick-actions";
import TransactionsList from "./transactions-list";
import { Shield, HeartPulse } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const SAFE_ADDRESS = import.meta.env.VITE_REACT_APP_SAFE_ADDRESS;
const ARBITRUM_API_KEY = import.meta.env.VITE_REACT_APP_ARBISCAN_API_KEY;
const GITHUB_REPO = import.meta.env.VITE_REACT_APP_GITHUB_REPO;
const DISCORD_WEBHOOK_URL = import.meta.env.VITE_REACT_APP_DISCORD_WEBHOOK;

interface Transaction {
  hash: string;
  value: string;
  isError: string;
  timeStamp: string;
  gasUsed: string;
}

interface RepoStats {
  stargazers_count: number;
  forks_count: number;
  open_issues_count: number;
}

export default function SafeDashboard() {
  const { toast } = useToast();
  const [isAlertSending, setIsAlertSending] = useState(false);

  // Fetch wallet balance
  const { data: balance, isLoading: balanceLoading } = useQuery({
    queryKey: [`https://api.arbiscan.io/api?module=account&action=balance&address=${SAFE_ADDRESS}&apikey=${ARBITRUM_API_KEY}`],
    enabled: !!(SAFE_ADDRESS && ARBITRUM_API_KEY),
    refetchInterval: 30000,
    select: (data: any) => {
      if (data.status === "1") {
        return (parseInt(data.result) / 1e18).toFixed(4);
      }
      return null;
    },
  });

  // Fetch transactions
  const { data: transactions = [], isLoading: transactionsLoading } = useQuery({
    queryKey: [`https://api.arbiscan.io/api?module=account&action=txlist&address=${SAFE_ADDRESS}&sort=desc&apikey=${ARBITRUM_API_KEY}`],
    enabled: !!(SAFE_ADDRESS && ARBITRUM_API_KEY),
    refetchInterval: 30000,
    select: (data: any) => {
      if (data.status === "1") {
        return data.result.slice(0, 10);
      }
      return [];
    },
  });

  // Fetch GitHub repo stats
  const { data: repoStats, isLoading: repoLoading } = useQuery({
    queryKey: [`https://api.github.com/repos/${GITHUB_REPO}`],
    enabled: !!GITHUB_REPO,
    refetchInterval: 300000, // 5 minutes
    select: (data: RepoStats) => ({
      stars: data.stargazers_count,
      forks: data.forks_count,
      issues: data.open_issues_count,
    }),
  });

  const sendDiscordAlert = async () => {
    if (!DISCORD_WEBHOOK_URL) {
      toast({
        title: "Error",
        description: "Discord webhook URL not configured",
        variant: "destructive",
      });
      return;
    }

    setIsAlertSending(true);
    try {
      await axios.post(DISCORD_WEBHOOK_URL, {
        content: `Safe Wallet ${SAFE_ADDRESS} dashboard check at ${new Date().toLocaleTimeString()}`,
      });
      toast({
        title: "Success",
        description: "Discord alert sent successfully!",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send Discord alert",
        variant: "destructive",
      });
    } finally {
      setIsAlertSending(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-3xl font-bold text-slate-800 flex items-center gap-3">
            <Shield className="text-blue-600 h-8 w-8" />
            Safe Wallet Dashboard
          </h1>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse-green"></div>
            <span className="text-sm text-slate-600">Live</span>
          </div>
        </div>
        <p className="text-slate-600 text-sm">Real-time monitoring for your Safe wallet on Arbitrum network</p>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <WalletOverview 
          address={SAFE_ADDRESS}
          balance={balance}
          isLoading={balanceLoading}
        />
        <QuickActions 
          repoStats={repoStats}
          isRepoLoading={repoLoading}
          onSendAlert={sendDiscordAlert}
          isAlertSending={isAlertSending}
          githubRepo={GITHUB_REPO}
        />
      </div>

      {/* Recent Transactions */}
      <TransactionsList 
        transactions={transactions}
        isLoading={transactionsLoading}
        safeAddress={SAFE_ADDRESS}
      />

      {/* Footer */}
      <div className="mt-12 text-center text-sm text-slate-500">
        <p>Made for thegoodeth by ChatGPT v2 • Powered by Arbiscan API</p>
      </div>
    </div>
  );
}
