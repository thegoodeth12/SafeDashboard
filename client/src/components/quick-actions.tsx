import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Github, Bell, ExternalLink, Loader2 } from "lucide-react";

interface QuickActionsProps {
  repoStats?: {
    stars: number;
    forks: number;
    issues: number;
  };
  isRepoLoading: boolean;
  onSendAlert: () => void;
  isAlertSending: boolean;
  githubRepo?: string;
}

export default function QuickActions({ 
  repoStats, 
  isRepoLoading, 
  onSendAlert, 
  isAlertSending,
  githubRepo 
}: QuickActionsProps) {
  return (
    <div className="space-y-6">
      {/* GitHub Stats */}
      <Card className="shadow-sm border border-slate-200">
        <CardContent className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <Github className="text-slate-800 text-xl h-6 w-6" />
            <h3 className="text-lg font-semibold text-slate-800">Repository</h3>
          </div>
          
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-600">Stars</span>
              <span className="font-semibold text-slate-800">
                {isRepoLoading ? "..." : repoStats?.stars ?? "0"}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-600">Forks</span>
              <span className="font-semibold text-slate-800">
                {isRepoLoading ? "..." : repoStats?.forks ?? "0"}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-600">Open Issues</span>
              <span className="font-semibold text-slate-800">
                {isRepoLoading ? "..." : repoStats?.issues ?? "0"}
              </span>
            </div>
          </div>
          
          {githubRepo && (
            <Button
              variant="secondary"
              className="mt-4 w-full"
              asChild
            >
              <a
                href={`https://github.com/${githubRepo}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2"
              >
                <Github className="h-4 w-4" />
                View Repository
                <ExternalLink className="h-3 w-3" />
              </a>
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Discord Alert */}
      <Card className="shadow-sm border border-slate-200">
        <CardContent className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <Bell className="text-indigo-600 text-xl h-6 w-6" />
            <h3 className="text-lg font-semibold text-slate-800">Alerts</h3>
          </div>
          
          <Button
            onClick={onSendAlert}
            disabled={isAlertSending}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white"
          >
            {isAlertSending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Sending...
              </>
            ) : (
              <>
                <Bell className="h-4 w-4 mr-2" />
                Send Test Alert
              </>
            )}
          </Button>
          
          <p className="mt-3 text-xs text-slate-500 text-center">
            Test Discord webhook connectivity
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
