import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeftRight, CheckCircle, XCircle, ExternalLink, Inbox } from "lucide-react";
import { formatAddress, formatEth, formatTimeAgo } from "@/lib/utils";

interface Transaction {
  hash: string;
  value: string;
  isError: string;
  timeStamp: string;
  gasUsed: string;
}

interface TransactionsListProps {
  transactions: Transaction[];
  isLoading: boolean;
  safeAddress?: string;
}

export default function TransactionsList({ transactions, isLoading, safeAddress }: TransactionsListProps) {
  return (
    <Card className="shadow-sm border border-slate-200">
      <CardContent className="p-0">
        <div className="p-6 border-b border-slate-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <ArrowLeftRight className="text-blue-600 text-xl h-6 w-6" />
              <h2 className="text-xl font-semibold text-slate-800">Recent Transactions</h2>
            </div>
            <span className="text-sm text-slate-500">Last 10 transactions</span>
          </div>
        </div>
        
        {isLoading ? (
          <div className="p-8 text-center text-slate-500">
            <div className="animate-pulse">Loading transactions...</div>
          </div>
        ) : transactions.length === 0 ? (
          <div className="p-8 text-center text-slate-500">
            <Inbox className="h-12 w-12 mx-auto mb-4 text-slate-300" />
            <p className="text-lg font-medium mb-2">No transactions found</p>
            <p className="text-sm">Transactions will appear here once they're detected on the network.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {transactions.map((txn) => (
              <div key={txn.hash} className="p-4 hover:bg-slate-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      txn.isError === "0" ? "bg-green-100" : "bg-red-100"
                    }`}>
                      {txn.isError === "0" ? (
                        <CheckCircle className="text-green-600 h-5 w-5" />
                      ) : (
                        <XCircle className="text-red-600 h-5 w-5" />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <a
                          href={`https://arbiscan.io/tx/${txn.hash}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-mono text-sm text-blue-600 hover:text-blue-800 hover:underline"
                        >
                          {formatAddress(txn.hash, 10, 6)}
                        </a>
                        <ExternalLink className="h-3 w-3 text-slate-400" />
                      </div>
                      <div className="text-xs text-slate-500 mt-1">
                        {formatTimeAgo(parseInt(txn.timeStamp))}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-slate-800">
                      {formatEth(txn.value)} ETH
                    </div>
                    <div className="text-xs text-slate-500">
                      {txn.isError === "0" ? (
                        <>Gas: {parseInt(txn.gasUsed).toLocaleString()}</>
                      ) : (
                        <span className="text-red-500">Failed</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        
        <div className="p-4 border-t border-slate-200 bg-slate-50">
          <div className="flex items-center justify-between text-sm text-slate-600">
            <span>Updates every 30 seconds</span>
            {safeAddress && (
              <Button variant="link" size="sm" asChild className="h-auto p-0">
                <a
                  href={`https://arbiscan.io/address/${safeAddress}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-blue-600 hover:text-blue-800"
                >
                  View all on Arbiscan
                  <ExternalLink className="h-3 w-3" />
                </a>
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
