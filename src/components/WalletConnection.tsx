"use client";

import { useState } from "react";
import {
  useWeb3AuthConnect,
  useWeb3AuthDisconnect,
  useWeb3AuthUser,
} from "@web3auth/modal/react";
import { useSolanaWallet } from "@web3auth/modal/react/solana";
import { Wallet, LogOut, Copy, ExternalLink } from "lucide-react";

export default function WalletConnection() {
  const { connect, isConnected, connectorName } = useWeb3AuthConnect();
  const { disconnect } = useWeb3AuthDisconnect();
  const { userInfo } = useWeb3AuthUser();
  const { accounts } = useSolanaWallet();
  const [showUserMenu, setShowUserMenu] = useState(false);

  const pubkey = accounts?.[0];

  const handleConnect = () => {
    connect();
  };

  const handleDisconnect = () => {
    disconnect();
  };

  const copyAddress = () => {
    if (pubkey) {
      navigator.clipboard.writeText(pubkey);
    }
  };

  const loggedInView = () => (
    <div className="flex items-center gap-4">
      {/* User Menu */}
      <div className="relative">
        <button
          onClick={() => setShowUserMenu(!showUserMenu)}
          className="flex items-center gap-3 glass-surface px-4 py-2 rounded-lg hover:glass-surface-light transition-all duration-300 group"
        >
          <div className="w-8 h-8 glass-surface rounded-full flex items-center justify-center text-sm font-bold text-white group-hover:glow-white-soft transition-all duration-300">
            {userInfo?.name?.charAt(0)?.toUpperCase() || "U"}
          </div>
          <span className="text-sm font-mono text-white/90">
            {pubkey ? `${pubkey.slice(0, 4)}...${pubkey.slice(-4)}` : "---"}
          </span>
        </button>

        {showUserMenu && (
          <div className="absolute right-0 mt-3 w-80 glass-surface-strong rounded-xl z-50 overflow-hidden">
            <div className="p-6 border-b border-white/10">
              <div className="text-xs text-white/60 mb-2 uppercase tracking-wider">
                Connection
              </div>
              <div className="text-lg text-white font-semibold mb-1">
                {connectorName}
              </div>
              <div className="flex items-center gap-2 mt-3">
                <div className="font-mono text-sm text-white/70 break-all flex-1">
                  {pubkey}
                </div>
                <button
                  onClick={copyAddress}
                  className="p-2 glass-surface rounded-md hover:glass-surface-light transition-all duration-200"
                  title="Copy Address"
                >
                  <Copy className="w-4 h-4 text-white/70" />
                </button>
                <a
                  href={`https://explorer.solana.com/address/${pubkey}?cluster=devnet`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 glass-surface rounded-md hover:glass-surface-light transition-all duration-200"
                  title="View on Explorer"
                >
                  <ExternalLink className="w-4 h-4 text-white/70" />
                </a>
              </div>
            </div>

            {userInfo && (
              <div className="p-6 border-b border-white/10">
                <div className="text-xs text-white/60 mb-2 uppercase tracking-wider">
                  User Info
                </div>
                <div className="text-lg text-white font-semibold mb-1">
                  {userInfo.name}
                </div>
                <div className="text-sm text-white/70">{userInfo.email}</div>
              </div>
            )}

            <div className="p-6">
              <button
                onClick={handleDisconnect}
                className="w-full flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white py-3 px-4 rounded-lg transition-all duration-300 font-medium"
              >
                <LogOut className="w-4 h-4" />
                Disconnect
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  const unloggedInView = () => (
    <button
      onClick={handleConnect}
      className="flex items-center gap-3 glass-surface px-6 py-3 rounded-lg hover:glass-surface-light transition-all duration-300 group glow-white-soft"
    >
      <Wallet className="w-5 h-5 text-white group-hover:scale-110 transition-transform duration-300" />
      <span className="text-white font-semibold">Connect Wallet</span>
    </button>
  );

  return (
    <div className="flex items-center">
      {isConnected ? loggedInView() : unloggedInView()}
    </div>
  );
}
