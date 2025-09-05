import { Loader2 } from "lucide-react";

export default function LoadingPage() {
  return (
    <div className="min-h-screen bg-black text-white grid-bg network-dots">
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center p-8 glass-card rounded-2xl max-w-md">
          <div className="w-16 h-16 solana-gradient rounded-full flex items-center justify-center mx-auto mb-6 glow-solana">
            <Loader2 className="w-8 h-8 text-white animate-spin" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-4">
            Loading SolBrand
          </h2>
          <p className="text-white/70 mb-6">
            Connecting to Solana and preparing your dashboard...
          </p>
          <div className="flex items-center justify-center space-x-2">
            <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse delay-75"></div>
            <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse delay-150"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
