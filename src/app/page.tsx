"use client";

import { useState, useEffect } from "react";
import { useWeb3AuthUser } from "@web3auth/modal/react";
import WalletConnection from "@/components/WalletConnection";
import {
  Sparkles,
  ArrowRight,
  Brain,
  Shield,
  Coins,
  Lock,
  Globe,
  Cpu,
  Database,
  CheckCircle,
  Zap,
  Award,
  Bot,
  Wallet,
  Gem,
} from "lucide-react";

export default function Home() {
  const [isVisible, setIsVisible] = useState(false);
  const { userInfo } = useWeb3AuthUser();

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const features = [
    {
      icon: Brain,
      title: "AI Brand Generation",
      description:
        "Advanced AI creates complete brand identities with Web3-native metadata, perfect for Solana dApps and DeFi projects.",
      gradient: "from-purple-500 to-pink-500",
    },
    {
      icon: Gem,
      title: "NFT Brand Ownership",
      description:
        "True ownership of your brand assets through NFTs on Solana. Transferable, tradeable, and verifiably yours forever.",
      gradient: "from-green-400 to-cyan-400",
    },
    {
      icon: Bot,
      title: "Autonomous Brand Agents",
      description:
        "AI agents that monitor, protect, and monetize your brand 24/7 through Solana smart contract automation.",
      gradient: "from-purple-500 to-green-400",
    },
    {
      icon: Zap,
      title: "Lightning Fast on Solana",
      description:
        "Sub-second transactions and instant brand verification powered by Solana's high-performance blockchain.",
      gradient: "from-cyan-400 to-purple-500",
    },
  ];

  const steps = [
    {
      number: "01",
      title: "Connect Solana Wallet",
      description:
        "Connect your Solana wallet seamlessly with Web3Auth and describe your Web3 startup vision.",
      icon: Wallet,
      color: "text-purple-400",
    },
    {
      number: "02",
      title: "AI Brand Creation",
      description:
        "Our AI creates your complete brand identity with Solana-native metadata and smart contracts.",
      icon: Sparkles,
      color: "text-green-400",
    },
    {
      number: "03",
      title: "Mint on Solana",
      description:
        "Receive your brand as NFTs on Solana with autonomous agents protecting your IP instantly.",
      icon: Coins,
      color: "text-cyan-400",
    },
  ];

  const advantages = [
    {
      icon: Lock,
      title: "True Solana Ownership",
      description:
        "Your brand lives on Solana blockchain, not centralized servers",
      color: "from-purple-500/20 to-purple-500/10",
      glow: "glow-solana",
    },
    {
      icon: Zap,
      title: "Solana Speed",
      description: "Sub-second transactions and instant global verification",
      color: "from-green-400/20 to-green-400/10",
      glow: "glow-solana-green",
    },
    {
      icon: Cpu,
      title: "Smart Automation",
      description:
        "Solana programs handle licensing and protection automatically",
      color: "from-cyan-400/20 to-cyan-400/10",
      glow: "glow-white-soft",
    },
    {
      icon: Database,
      title: "Immutable Proof",
      description: "Permanent record of creation and ownership on Solana",
      color: "from-pink-500/20 to-pink-500/10",
      glow: "glow-solana",
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
                SolBrand
              </span>
            </div>
            <nav className="hidden md:flex items-center space-x-8">
              <a
                href="#features"
                className="text-white/70 hover:text-white transition-colors text-font font-medium"
              >
                Features
              </a>
              <a
                href="#how-it-works"
                className="text-white/70 hover:text-white transition-colors text-font font-medium"
              >
                How it Works
              </a>
              <a
                href="#advantages"
                className="text-white/70 hover:text-white transition-colors text-font font-medium"
              >
                Advantages
              </a>
              <WalletConnection />
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 lg:py-32">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div
            className={`text-center transition-all duration-1000 ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-12"
            }`}
          >
            <div className="inline-flex items-center px-6 py-3 rounded-full glass-surface mb-8 glow-solana">
              <Zap className="w-5 h-5 mr-3 text-green-400" />
              <span className="text-sm font-semibold text-white text-font">
                AI-Powered Solana Brand Creation
              </span>
            </div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight text-font">
              Your Brand,
              <span className="text-gradient-brand block mt-2">
                On Solana Forever
              </span>
            </h1>

            <p className="text-xl text-white/70 mb-12 max-w-3xl mx-auto leading-relaxed text-font">
              Transform your Web3 startup into a complete brand identity with
              AI-powered generation. True ownership through Solana NFTs,
              autonomous protection, and lightning-fast verification.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
              <button className="flex items-center gap-3 solana-gradient text-white px-10 py-4 text-lg font-semibold rounded-xl shadow-elegant-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 text-font glow-solana">
                {userInfo ? "Create Your Brand" : "Connect Solana Wallet"}
                <ArrowRight className="w-5 h-5" />
              </button>
              <button className="flex items-center gap-3 glass-surface px-10 py-4 text-lg font-semibold rounded-xl border border-purple-500/30 text-white hover:glass-surface-light transition-all duration-300 text-font">
                <Globe className="w-5 h-5" />
                View Solana Examples
              </button>
            </div>

            {/* Brand Advantages Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
              {advantages.map((advantage, index) => (
                <div
                  key={index}
                  className={`text-center p-6 rounded-2xl glass-card card-hover ${advantage.glow}`}
                >
                  <div
                    className={`w-12 h-12 bg-gradient-to-br ${advantage.color} rounded-xl flex items-center justify-center mx-auto mb-4`}
                  >
                    <advantage.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2 text-font">
                    {advantage.title}
                  </h3>
                  <p className="text-white/60 text-sm text-font font-medium">
                    {advantage.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6 text-font">
              Solana-Native Brand Creation
            </h2>
            <p className="text-xl text-white/70 max-w-2xl mx-auto text-font">
              Beyond traditional branding - your identity becomes a living,
              breathing Solana asset with autonomous protection and global
              verification.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="group">
                <div className="h-full p-8 rounded-2xl glass-card card-hover">
                  <div className="text-center">
                    <div
                      className={`w-16 h-16 bg-gradient-to-br ${feature.gradient} rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 glow-solana`}
                    >
                      <feature.icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-4 text-font">
                      {feature.title}
                    </h3>
                    <p className="text-white/70 leading-relaxed text-font">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6 text-font">
              Three Steps to Solana Brand Ownership
            </h2>
            <p className="text-xl text-white/70 max-w-2xl mx-auto text-font">
              From concept to on-chain ownership in seconds, not months. Powered
              by Solana's speed.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="relative">
                <div className="text-center p-8 rounded-2xl glass-card card-hover h-full">
                  <div
                    className={`w-20 h-20 bg-gradient-to-br from-purple-500/15 to-green-400/15 rounded-full flex items-center justify-center mx-auto mb-6 glow-solana`}
                  >
                    <step.icon className={`w-8 h-8 ${step.color}`} />
                  </div>
                  <div className="text-sm font-bold text-white/60 mb-2 text-font">
                    {step.number}
                  </div>
                  <h3 className="text-2xl font-semibold text-white mb-4 text-font">
                    {step.title}
                  </h3>
                  <p className="text-white/70 leading-relaxed text-font">
                    {step.description}
                  </p>
                </div>
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-10 left-1/2 transform translate-x-8 w-32 h-0.5 bg-gradient-to-r from-purple-500/30 to-green-400/30"></div>
                )}
              </div>
            ))}
          </div>

          <div className="text-center mt-16">
            <button className="flex items-center gap-3 solana-gradient text-white px-10 py-4 text-lg font-semibold rounded-xl shadow-elegant-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 text-font glow-solana mx-auto">
              Start Creating on Solana
              <Sparkles className="w-5 h-5" />
            </button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="p-12 rounded-3xl glass-surface-strong glow-solana">
            <div className="mb-8">
              <div className="w-20 h-20 solana-gradient-accent rounded-full flex items-center justify-center mx-auto mb-6 glow-solana">
                <Shield className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6 text-font">
                The Future of Brand Ownership
              </h2>
              <p className="text-xl text-white/70 mb-8 max-w-2xl mx-auto text-font">
                Join the revolution where brands are truly owned, globally
                verified, and autonomously protected through Solana blockchain
                and AI technology.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="p-4 rounded-lg glass-surface glow-solana">
                <CheckCircle className="w-8 h-8 text-green-400 mx-auto mb-3" />
                <h3 className="font-semibold text-white mb-2 text-font">
                  Solana Ownership
                </h3>
                <p className="text-sm text-white/70 text-font">
                  Your brand, your keys, your Solana NFTs
                </p>
              </div>
              <div className="p-4 rounded-lg glass-surface glow-solana-green">
                <Zap className="w-8 h-8 text-purple-400 mx-auto mb-3" />
                <h3 className="font-semibold text-white mb-2 text-font">
                  Lightning Speed
                </h3>
                <p className="text-sm text-white/70 text-font">
                  Generate and mint in seconds on Solana
                </p>
              </div>
              <div className="p-4 rounded-lg glass-surface glow-white-soft">
                <Award className="w-8 h-8 text-cyan-400 mx-auto mb-3" />
                <h3 className="font-semibold text-white mb-2 text-font">
                  AI-Powered
                </h3>
                <p className="text-sm text-white/70 text-font">
                  Advanced algorithms for perfect Solana brands
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="flex items-center gap-3 solana-gradient text-white px-10 py-4 text-lg font-semibold rounded-xl shadow-elegant-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 text-font glow-solana">
                {userInfo
                  ? "Create Your Solana Brand"
                  : "Connect Solana Wallet to Start"}
                <Sparkles className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 solana-gradient rounded-lg flex items-center justify-center glow-solana">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <span className="text-2xl font-bold brand-font text-gradient">
                  SolBrand
                </span>
              </div>
              <p className="text-white/70 mb-6 max-w-md text-font leading-relaxed">
                The first AI-powered Solana brand creation platform. Transform
                your startup ideas into verifiable, ownable, and autonomous
                brand identities on the fastest blockchain.
              </p>
              <p className="text-white/50 text-sm text-font">
                Built on Solana • Powered by AI • Web3Auth Integration
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-white text-font">
                Platform
              </h4>
              <div className="space-y-3">
                <a
                  href="#"
                  className="block text-white/70 hover:text-white transition-colors text-font"
                >
                  Features
                </a>
                <a
                  href="#"
                  className="block text-white/70 hover:text-white transition-colors text-font"
                >
                  Examples
                </a>
                <a
                  href="#"
                  className="block text-white/70 hover:text-white transition-colors text-font"
                >
                  Documentation
                </a>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-white text-font">
                Community
              </h4>
              <div className="space-y-3">
                <a
                  href="#"
                  className="block text-white/70 hover:text-white transition-colors text-font"
                >
                  Discord
                </a>
                <a
                  href="#"
                  className="block text-white/70 hover:text-white transition-colors text-font"
                >
                  Twitter
                </a>
                <a
                  href="#"
                  className="block text-white/70 hover:text-white transition-colors text-font"
                >
                  GitHub
                </a>
              </div>
            </div>
          </div>
          <div className="border-t border-white/10 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-white/60 text-sm text-font">
              2025 SolBrand. Built on Solana. Powered by AI. Lightning Fast.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a
                href="#"
                className="text-white/60 hover:text-white text-sm transition-colors text-font"
              >
                Privacy
              </a>
              <a
                href="#"
                className="text-white/60 hover:text-white text-sm transition-colors text-font"
              >
                Terms
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
