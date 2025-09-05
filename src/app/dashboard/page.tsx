"use client";

import { useState, useEffect } from "react";
import { useWeb3AuthUser } from "@web3auth/modal/react";
import {
  useSolanaWallet,
  useSignAndSendTransaction,
} from "@web3auth/modal/react/solana";
import { useRouter } from "next/navigation";
import WalletConnection from "@/components/WalletConnection";
import {
  Wallet,
  TrendingUp,
  Coins,
  Sparkles,
  ArrowUpDown,
  BarChart3,
  Users,
  Shield,
  Zap,
  Plus,
  ExternalLink,
  RefreshCw,
} from "lucide-react";
import {
  Connection,
  PublicKey,
  LAMPORTS_PER_SOL,
  SystemProgram,
  Transaction,
  TransactionMessage,
  VersionedTransaction,
} from "@solana/web3.js";
import {
  getAssociatedTokenAddress,
  createAssociatedTokenAccountInstruction,
  createMintToInstruction,
  getAccount,
} from "@solana/spl-token";

const SOLANA_RPC_URL = "https://api.devnet.solana.com";
const SOLBRAND_MINT = new PublicKey(
  process.env.NEXT_PUBLIC_SOLBRAND_MINT_ADDRESS || ""
);
const TREASURY_WALLET = new PublicKey(
  "5KW2twHzRsAaiLeEx4zYWs8XAXUZjba7vh5Ue2ZNjCat"
); // CLI keypair public key

// Authority wallet that can mint SOLB tokens
const MINT_AUTHORITY = new PublicKey(
  "CEWxm2fReUAnycavAaM7FuUoFgLJyCFbuyxY8iT8CRAz"
);

export default function Dashboard() {
  const router = useRouter();
  const { userInfo } = useWeb3AuthUser();

  const { accounts, connection } = useSolanaWallet();
  const {
    signAndSendTransaction,
    loading: transactionLoading,
    error: transactionError,
  } = useSignAndSendTransaction();

  const [solBalance, setSolBalance] = useState<number | null>(null);
  const [solbBalance, setSolbBalance] = useState<number | null>(null);
  const [loadingSolBalance, setLoadingSolBalance] = useState(false);
  const [loadingSolbBalance, setLoadingSolbBalance] = useState(false);
  const [swapAmount, setSwapAmount] = useState("");
  const [swapLoading, setSwapLoading] = useState(false);
  const [swapSuccess, setSwapSuccess] = useState(false);
  const [swapError, setSwapError] = useState<string | null>(null);

  // Fetch SOL balance
  const fetchSolBalance = async () => {
    if (!connection || !accounts || accounts.length === 0) return;

    try {
      setLoadingSolBalance(true);
      const publicKey = new PublicKey(accounts[0]);
      const balance = await connection.getBalance(publicKey);
      setSolBalance(balance / LAMPORTS_PER_SOL);
    } catch (error) {
      console.error("Error fetching SOL balance:", error);
    } finally {
      setLoadingSolBalance(false);
    }
  };

  // Fetch SOLB token balance
  const fetchSolbBalance = async () => {
    if (!connection || !accounts || accounts.length === 0) return;

    try {
      setLoadingSolbBalance(true);
      const userPublicKey = new PublicKey(accounts[0]);
      const associatedTokenAddress = await getAssociatedTokenAddress(
        SOLBRAND_MINT,
        userPublicKey
      );

      try {
        const tokenAccount = await getAccount(
          connection,
          associatedTokenAddress
        );
        setSolbBalance(Number(tokenAccount.amount) / Math.pow(10, 9)); // Assuming 9 decimals
      } catch (error) {
        // Token account doesn't exist yet
        setSolbBalance(0);
      }
    } catch (error) {
      console.error("Error fetching SOLB balance:", error);
      setSolbBalance(0);
    } finally {
      setLoadingSolbBalance(false);
    }
  };

  // Auto-fetch balances when wallet connects
  useEffect(() => {
    if (accounts && connection) {
      fetchSolBalance();
      fetchSolbBalance();
    }
  }, [accounts, connection]);

  // Handle swap functionality
  const handleSwap = async () => {
    if (!connection || !accounts || !swapAmount || parseFloat(swapAmount) <= 0)
      return;

    try {
      setSwapLoading(true);
      setSwapError(null);
      setSwapSuccess(false);

      const userPublicKey = new PublicKey(accounts[0]);
      const swapAmountLamports = parseFloat(swapAmount) * LAMPORTS_PER_SOL;

      // Check if user has enough SOL
      if (solBalance && parseFloat(swapAmount) > solBalance) {
        throw new Error("Insufficient SOL balance");
      }

      // Step 1: Transfer SOL to treasury
      console.log("Step 1: Transferring SOL to treasury...");
      const { blockhash, lastValidBlockHeight } =
        await connection.getLatestBlockhash("confirmed");

      const transaction = new Transaction({
        blockhash,
        lastValidBlockHeight,
        feePayer: userPublicKey,
      });

      const transferInstruction = SystemProgram.transfer({
        fromPubkey: userPublicKey,
        toPubkey: TREASURY_WALLET,
        lamports: swapAmountLamports,
      });
      transaction.add(transferInstruction);

      // Sign and send SOL transfer transaction
      const signature = await signAndSendTransaction(transaction);
      console.log("✅ SOL transfer signature:", signature);

      if (!signature) {
        throw new Error("SOL transfer failed - no signature returned");
      }

      // Step 2: Call backend API to mint SOLB tokens
      console.log("Step 2: Calling mint API to create SOLB tokens...");
      const mintResponse = await fetch("/api/mint-solb", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userWallet: accounts[0],
          solAmount: swapAmount,
        }),
      });

      const mintResult = await mintResponse.json();

      if (!mintResponse.ok) {
        throw new Error(
          `Minting failed: ${mintResult.error || "Unknown error"}`
        );
      }

      console.log("✅ SOLB minting success:", mintResult);

      // Update UI with successful swap
      setSolBalance((prev) => (prev ? prev - parseFloat(swapAmount) : null));
      setSolbBalance((prev) => (prev || 0) + mintResult.solbAmount);
      setSwapSuccess(true);
      setSwapAmount("");

      // Refresh balances after a short delay
      setTimeout(() => {
        fetchSolBalance();
        fetchSolbBalance();
      }, 3000);
    } catch (error) {
      console.error("Swap error:", error);
      setSwapError(error instanceof Error ? error.message : "Swap failed");
    } finally {
      setSwapLoading(false);
    }
  };

  const stats = [
    {
      title: "SOL Balance",
      value:
        solBalance !== null ? `${solBalance.toFixed(4)} SOL` : "Loading...",
      icon: Wallet,
      color: "from-purple-500 to-pink-500",
      change: "+2.5%",
    },
    {
      title: "SolBrand Tokens",
      value: `${solbBalance} SOLB`,
      icon: Coins,
      color: "from-green-400 to-cyan-400",
      change: "0%",
    },
    {
      title: "Brands Created",
      value: "0",
      icon: Sparkles,
      color: "from-cyan-400 to-purple-500",
      change: "New!",
    },
    {
      title: "Total Value",
      value: "$0.00",
      icon: TrendingUp,
      color: "from-pink-500 to-orange-400",
      change: "+0%",
    },
  ];

  return (
    <div className="min-h-screen bg-black text-white grid-bg network-dots">
      {/* Header */}
      <header className="sticky top-0 z-50 glass-header">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 solana-gradient rounded-lg flex items-center justify-center glow-solana">
                <span className="text-2xl brand-font text-white">S</span>
              </div>
              <span className="text-2xl font-bold brand-font text-gradient">
                SolBrand Dashboard
              </span>
            </div>
            <nav className="flex items-center space-x-8">
              <a
                href="/"
                className="text-white/70 hover:text-white transition-colors text-font font-medium"
              >
                Home
              </a>
              <WalletConnection />
            </nav>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            Welcome back, {userInfo?.name || "Creator"}!
          </h1>
          <p className="text-white/70 text-lg">
            Manage your brands and tokens on Solana
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className="glass-card p-6 rounded-2xl card-hover">
              <div className="flex items-center justify-between mb-4">
                <div
                  className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center glow-solana`}
                >
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
                <span className="text-sm text-green-400 font-medium">
                  {stat.change}
                </span>
              </div>
              <h3 className="text-2xl font-bold text-white mb-1">
                {stat.value}
              </h3>
              <p className="text-white/60 text-sm">{stat.title}</p>
              {stat.title === "SOL Balance" && (
                <button
                  onClick={fetchSolBalance}
                  disabled={loadingSolBalance}
                  className="mt-2 text-xs text-purple-400 hover:text-purple-300 flex items-center gap-1"
                >
                  <RefreshCw
                    className={`w-3 h-3 ${
                      loadingSolBalance ? "animate-spin" : ""
                    }`}
                  />
                  Refresh
                </button>
              )}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Token Swap Section */}
          <div className="glass-card p-6 rounded-2xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                <ArrowUpDown className="w-6 h-6 text-purple-400" />
                Token Swap
              </h2>
            </div>

            <div className="space-y-4">
              <div className="glass-surface p-4 rounded-xl">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-white/70 text-sm">From</span>
                  <span className="text-white/70 text-sm">
                    Balance: {solBalance?.toFixed(4) || "0"} SOL
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <input
                    type="number"
                    placeholder="0.0"
                    value={swapAmount}
                    onChange={(e) => setSwapAmount(e.target.value)}
                    className="flex-1 bg-transparent text-white text-xl font-bold outline-none"
                  />
                  <div className="flex items-center gap-2 text-white font-medium">
                    <div className="w-6 h-6 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full"></div>
                    SOL
                  </div>
                </div>
              </div>

              <div className="flex justify-center">
                <div className="w-10 h-10 glass-surface rounded-full flex items-center justify-center">
                  <ArrowUpDown className="w-5 h-5 text-white/70" />
                </div>
              </div>

              <div className="glass-surface p-4 rounded-xl">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-white/70 text-sm">To</span>
                  <span className="text-white/70 text-sm">
                    Balance: {solbBalance} SOLB
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <input
                    type="number"
                    placeholder="0.0"
                    value={
                      swapAmount
                        ? (parseFloat(swapAmount) * 1000).toString()
                        : ""
                    }
                    readOnly
                    className="flex-1 bg-transparent text-white text-xl font-bold outline-none"
                  />
                  <div className="flex items-center gap-2 text-white font-medium">
                    <div className="w-6 h-6 bg-gradient-to-br from-green-400 to-cyan-400 rounded-full"></div>
                    SOLB
                  </div>
                </div>
              </div>

              <button
                onClick={handleSwap}
                disabled={swapLoading}
                className="w-full solana-gradient text-white py-4 rounded-xl font-semibold"
              >
                {swapLoading ? "Swapping..." : "Swap"}
              </button>
              {swapSuccess && (
                <p className="text-green-400 text-sm mt-2">
                  ✅ Swap complete! SOL transferred and {solbBalance} SOLB
                  tokens minted to your wallet.
                </p>
              )}
              {swapError && (
                <p className="text-red-400 text-sm mt-2">{swapError}</p>
              )}
            </div>
          </div>

          {/* Brand Creation Section */}
          <div className="glass-card p-6 rounded-2xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                <Sparkles className="w-6 h-6 text-green-400" />
                Brand Creation
              </h2>
            </div>

            <div className="space-y-4">
              <div className="text-center py-8">
                <div className="w-16 h-16 glass-surface rounded-full flex items-center justify-center mx-auto mb-4">
                  <Plus className="w-8 h-8 text-white/70" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">
                  Create Your First Brand
                </h3>
                <p className="text-white/70 mb-6">
                  Transform your startup idea into a complete brand identity
                  with AI
                </p>
                <button className="solana-gradient text-white px-6 py-3 rounded-xl font-semibold hover:scale-105 transition-transform">
                  Start Creating
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="mt-8 glass-card p-6 rounded-2xl">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
            <BarChart3 className="w-6 h-6 text-cyan-400" />
            Recent Activity
          </h2>

          <div className="text-center py-12">
            <div className="w-16 h-16 glass-surface rounded-full flex items-center justify-center mx-auto mb-4">
              <Zap className="w-8 h-8 text-white/50" />
            </div>
            <h3 className="text-xl font-bold text-white/70 mb-2">
              No Activity Yet
            </h3>
            <p className="text-white/50">
              Your brand creation and token transactions will appear here
            </p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass-card p-6 rounded-2xl text-center card-hover">
            <Shield className="w-12 h-12 text-purple-400 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-white mb-2">
              Brand Protection
            </h3>
            <p className="text-white/70 text-sm mb-4">
              AI-powered brand monitoring and protection
            </p>
            <button className="text-purple-400 hover:text-purple-300 text-sm font-medium">
              Learn More →
            </button>
          </div>

          <div className="glass-card p-6 rounded-2xl text-center card-hover">
            <Users className="w-12 h-12 text-green-400 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-white mb-2">Community</h3>
            <p className="text-white/70 text-sm mb-4">
              Connect with other brand creators
            </p>
            <button className="text-green-400 hover:text-green-300 text-sm font-medium">
              Join Discord →
            </button>
          </div>

          <div className="glass-card p-6 rounded-2xl text-center card-hover">
            <ExternalLink className="w-12 h-12 text-cyan-400 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-white mb-2">
              Solana Explorer
            </h3>
            <p className="text-white/70 text-sm mb-4">
              View your transactions on-chain
            </p>
            <a
              href={`https://explorer.solana.com/address/${
                accounts?.[0] || ""
              }?cluster=devnet`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-cyan-400 hover:text-cyan-300 text-sm font-medium"
            >
              View Wallet →
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
