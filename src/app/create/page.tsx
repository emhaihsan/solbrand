"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useWeb3AuthUser } from "@web3auth/modal/react";
import { BrandNameGenerator } from "@/components/brand-creation/BrandNameGenerator";
import { LogoGenerator } from "@/components/brand-creation/LogoGenerator";
import { IdeaValidation } from "@/components/brand-creation/IdeaValidation";
import { TypographyRecommender } from "@/components/brand-creation/TypographyRecommender";
import { ColorPaletteGenerator } from "@/components/brand-creation/ColorPaletteGenerator";
import { PitchDeckBuilder } from "@/components/brand-creation/PitchDeckBuilder";
import { BrandSummary } from "@/components/brand-creation/BrandSummary";
import { ArrowLeft, ArrowRight, Coins, CheckCircle, Lock } from "lucide-react";
import { Connection, PublicKey } from "@solana/web3.js";
import { getAssociatedTokenAddress, getAccount } from "@solana/spl-token";
import { Type, Sparkles, Palette, Target, Presentation } from "lucide-react";
import { useSolanaWallet } from "@web3auth/modal/react/solana";

const SOLBRAND_MINT = new PublicKey(
  process.env.NEXT_PUBLIC_SOLBRAND_MINT_ADDRESS ||
    "ENboCZvfVz8Rmp2LCixNpvcUZD2eLDci2x4Yjpj2v5HM"
);

const STEPS = [
  {
    id: "brandName",
    title: "Brand Name",
    description: "Generate creative brand names",
    icon: Type,
    component: "BrandNameGenerator",
    required: true,
    cost: 1, // 1 SOLB
  },
  {
    id: "logo",
    title: "Logo Design",
    description: "Create visual identity",
    icon: Sparkles,
    component: "LogoGenerator",
    required: false,
    cost: 5, // 5 SOLB for logo generation
  },
  {
    id: "ideaValidation",
    title: "Idea Validation",
    description: "Score and validate concept",
    icon: Target,
    component: "IdeaValidation",
    required: false,
    cost: 1,
  },
  {
    id: "typography",
    title: "Typography",
    description: "Choose perfect fonts",
    icon: Type,
    component: "TypographyRecommender",
    required: false,
    cost: 1,
  },
  {
    id: "colorPalette",
    title: "Color Palette",
    description: "Generate brand colors",
    icon: Palette,
    component: "ColorPaletteGenerator",
    required: false,
    cost: 1,
  },
  {
    id: "pitchDeck",
    title: "Pitch Deck",
    description: "Build investor presentation",
    icon: Presentation,
    component: "PitchDeckBuilder",
    required: false,
    cost: 1,
  },
  {
    id: "summary",
    title: "Brand Summary",
    description: "Review and download",
    icon: CheckCircle,
    component: "BrandSummary",
    required: false,
    cost: 0, // Free summary
  },
];

interface BrandData {
  selectedName?: string;
  allSuggestions?: any[];
  businessDescription?: string;
  industry?: string;
  targetAudience?: string;
  coreValues?: string;
  nameStyle?: string;
  keywords?: string;
  selectedLogo?: string;
  visualStyle?: string;
  iconPreference?: string;
  brandMood?: string;
  imageData?: string;
  detailedDescription?: string;
  targetMarket?: string;
  uniqueness?: string;
  validationResults?: any[];
  insights?: any[];
  brandPersonality?: string;
  fontPreferences?: string;
  selectedFontPair?: string;
  allFontPairs?: any[];
  selectedEmotions?: string[];
  dominantColor?: string;
  selectedPalette?: string;
  allPalettes?: any[];
  businessSummary?: string;
  fundingTarget?: string;
  teamInfo?: string;
  traction?: string;
  marketSize?: string;
  revenueModel?: string;
  competitiveAdvantage?: string;
  pitchDeckStructure?: any;
  [key: string]: any;
}

export default function CreateBrand() {
  const { userInfo } = useWeb3AuthUser();
  const { accounts, connection } = useSolanaWallet();
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<string>("brandName");
  const [brandData, setBrandData] = useState<BrandData>({});
  const [solbBalance, setSolbBalance] = useState<number>(0);
  const [loadingBalance, setLoadingBalance] = useState(false);
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    if (accounts && connection) {
      fetchSolbBalance();
    }
  }, [accounts, connection]);

  // Fetch SOLB balance
  const fetchSolbBalance = async () => {
    if (!connection || !accounts || accounts.length === 0) return;

    try {
      setLoadingBalance(true);
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
        setSolbBalance(Number(tokenAccount.amount) / Math.pow(10, 9));
      } catch (error) {
        setSolbBalance(0);
      }
    } catch (error) {
      console.error("Error fetching SOLB balance:", error);
      setSolbBalance(0);
    } finally {
      setLoadingBalance(false);
    }
  };

  // Check if user can access a step (has enough SOLB)
  const canAccessStep = (stepId: string) => {
    if (stepId === "brandName") return true; // First step always accessible
    if (!brandData.selectedName) return false; // Need brand name first
    const step = STEPS.find((s) => s.id === stepId);
    if (!step) return false;
    return solbBalance >= step.cost;
  };

  // Check if step is completed
  const isStepCompleted = (stepId: string) => {
    return completedSteps.includes(stepId);
  };

  // Consume SOLB tokens for step access
  const consumeTokens = async (amount: number) => {
    try {
      const response = await fetch("/api/consume-solb", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userWallet: accounts?.[0],
          amount: amount,
        }),
      });

      const result = await response.json();
      if (result.success) {
        setSolbBalance((prev) => prev - amount);
        return true;
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error("Token consumption failed:", error);
      return false;
    }
  };

  const handleStepComplete = async (stepData: any) => {
    const currentStepData = STEPS.find((s) => s.id === currentStep);
    if (!currentStepData) return;

    // Consume tokens if cost > 0 and not already completed
    if (currentStepData.cost > 0 && !isStepCompleted(currentStep)) {
      const success = await consumeTokens(currentStepData.cost);
      if (!success) {
        alert(
          `Failed to consume ${currentStepData.cost} SOLB tokens. Please try again.`
        );
        return;
      }
    }

    // Update local state
    setBrandData((prev) => ({ ...prev, ...stepData }));
    setCompletedSteps((prev) => [...new Set([...prev, currentStep])]);

    // Save to localStorage for persistence
    const updatedBrandData = { ...brandData, ...stepData };
    localStorage.setItem(
      "solbrand_creation_data",
      JSON.stringify(updatedBrandData)
    );
    localStorage.setItem(
      "solbrand_completed_steps",
      JSON.stringify([...completedSteps, currentStep])
    );

    // Record activity
    const stepMeta = steps.find((s) => s.id === currentStep);
    recordActivity(
      `Completed ${stepMeta?.title || currentStep}`,
      stepMeta?.cost || 0
    );
  };

  // Handle final summary completion from BrandSummary component
  const handleSummaryComplete = (summaryData: any) => {
    // Persist summary
    const updated = {
      ...brandData,
      summary: summaryData?.summary || summaryData,
    };
    setBrandData(updated);

    // Mark summary step completed
    setCompletedSteps((prev) => [...new Set([...prev, "summary"])]);

    // Save to localStorage
    localStorage.setItem("solbrand_creation_data", JSON.stringify(updated));
    localStorage.setItem(
      "solbrand_completed_steps",
      JSON.stringify([...completedSteps, "summary"])
    );

    // Record brand completion activity
    recordActivity("Completed Brand Summary", 0);

    // Optionally navigate or show a toast; keeping user on page for now
    // router.push("/dashboard");
  };

  const recordActivity = (description: string, cost: number) => {
    const activities = JSON.parse(
      localStorage.getItem("solbrand_activities") || "[]"
    );
    const newActivity = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      description,
      cost,
      type: "brand_creation",
    };
    activities.unshift(newActivity);
    localStorage.setItem(
      "solbrand_activities",
      JSON.stringify(activities.slice(0, 50))
    ); // Keep last 50
  };

  // Load saved data on component mount
  useEffect(() => {
    const savedData = localStorage.getItem("solbrand_creation_data");
    const savedSteps = localStorage.getItem("solbrand_completed_steps");

    if (savedData) {
      setBrandData(JSON.parse(savedData));
    }
    if (savedSteps) {
      setCompletedSteps(JSON.parse(savedSteps));
    }
  }, []);

  const steps = [
    {
      id: "brandName",
      title: "Brand Name",
      description: "Generate unique brand names",
      component: BrandNameGenerator,
      cost: 1,
      completed: false,
      icon: Type,
    },
    {
      id: "logo",
      title: "Logo Design",
      description: "Create professional logos",
      component: LogoGenerator,
      cost: 5,
      completed: false,
      icon: Sparkles,
    },
    {
      id: "ideaValidation",
      title: "Idea Validation",
      description: "Validate your business concept",
      component: IdeaValidation,
      cost: 1,
      completed: false,
      icon: Target,
    },
    {
      id: "typography",
      title: "Typography",
      description: "Choose perfect font combinations",
      component: TypographyRecommender,
      cost: 1,
      completed: false,
      icon: Type,
    },
    {
      id: "colorPalette",
      title: "Color Palette",
      description: "Design your brand colors",
      component: ColorPaletteGenerator,
      cost: 1,
      completed: false,
      icon: Palette,
    },
    {
      id: "pitchDeck",
      title: "Pitch Deck",
      description: "Build your investor presentation",
      component: PitchDeckBuilder,
      cost: 1,
      completed: false,
      icon: Presentation,
    },
    {
      id: "summary",
      title: "Brand Summary",
      description: "Review your complete brand",
      component: BrandSummary,
      cost: 0,
      completed: false,
      icon: CheckCircle,
    },
  ];

  const currentStepData = steps.find((step) => step.id === currentStep);

  const renderStepComponent = () => {
    if (!currentStepData) return null;

    const props = {
      onNext:
        currentStepData.id === "summary"
          ? handleSummaryComplete
          : handleStepComplete,
      initialData: brandData[currentStepData.id],
      brandData: currentStepData.id === "summary" ? brandData : undefined,
    };

    switch (currentStepData.component) {
      case BrandNameGenerator:
        return <BrandNameGenerator {...props} />;
      case LogoGenerator:
        return <LogoGenerator {...props} />;
      case IdeaValidation:
        return <IdeaValidation {...props} />;
      case TypographyRecommender:
        return <TypographyRecommender {...props} />;
      case ColorPaletteGenerator:
        return <ColorPaletteGenerator {...props} />;
      case PitchDeckBuilder:
        return <PitchDeckBuilder {...props} />;
      case BrandSummary:
        return (
          <BrandSummary
            {...props}
            brandData={brandData}
            onComplete={handleSummaryComplete}
          />
        );
      default:
        return <div>Component not found</div>;
    }
  };

  if (!userInfo) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">
            Please Connect Your Wallet
          </h2>
          <p className="text-white/70">
            You need to connect your wallet to create brands.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white grid-bg network-dots">
      {/* Header */}
      <header className="sticky top-0 z-50 glass-header">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.back()}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 solana-gradient rounded-lg flex items-center justify-center glow-solana">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <span className="text-xl font-bold brand-font">
                  Brand Creation
                </span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="glass-surface px-4 py-2 rounded-lg">
                <div className="flex items-center gap-2">
                  <Coins className="w-4 h-4 text-green-400" />
                  <span className="text-sm font-medium">
                    {loadingBalance ? "Loading..." : `${solbBalance} SOLB`}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold">Create Your Brand</h1>
            <div className="text-sm text-white/70">
              Step {steps.findIndex((s) => s.id === currentStep) + 1} of{" "}
              {steps.length}
            </div>
          </div>

          <div className="flex items-center space-x-4 overflow-x-auto pb-4">
            {steps.map((step, index) => {
              const isActive = step.id === currentStep;
              const isCompleted = isStepCompleted(step.id);
              const canAccess = canAccessStep(step.id);

              return (
                <div key={step.id} className="flex items-center">
                  <button
                    onClick={() => canAccess && setCurrentStep(step.id)}
                    disabled={!canAccess}
                    className={`
                      flex flex-col items-center p-4 rounded-xl min-w-[120px] transition-all duration-300
                      ${
                        isActive
                          ? "glass-surface-strong border border-purple-500/50"
                          : canAccess
                          ? "glass-surface hover:glass-surface-light"
                          : "glass-surface opacity-50 cursor-not-allowed"
                      }
                    `}
                  >
                    <div
                      className={`
                      w-12 h-12 rounded-full flex items-center justify-center mb-2 transition-all duration-300
                      ${
                        isCompleted
                          ? "bg-green-500 text-white"
                          : isActive
                          ? "solana-gradient text-white"
                          : canAccess
                          ? "glass-surface text-white/70"
                          : "glass-surface text-white/30"
                      }
                    `}
                    >
                      {isCompleted ? (
                        <CheckCircle className="w-6 h-6" />
                      ) : !canAccess ? (
                        <Lock className="w-6 h-6" />
                      ) : (
                        <step.icon className="w-6 h-6" />
                      )}
                    </div>
                    <span
                      className={`text-xs font-medium text-center ${
                        canAccess ? "text-white" : "text-white/30"
                      }`}
                    >
                      {step.title}
                    </span>
                    {step.cost > 0 && (
                      <div className="flex items-center gap-1 mt-1">
                        <Coins className="w-3 h-3 text-green-400" />
                        <span className="text-xs text-green-400">
                          {step.cost}
                        </span>
                      </div>
                    )}
                  </button>
                  {index < steps.length - 1 && (
                    <div className="w-8 h-px bg-white/20 mx-2"></div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Current Step Content */}
        <div className="bg-gradient-to-br from-purple-900/20 via-blue-900/20 to-indigo-900/20 border border-white/10 rounded-lg p-8">
          {currentStepData && (
            <div className="mb-6">
              <div className="flex items-center gap-3 mb-2">
                <currentStepData.icon className="w-6 h-6 text-purple-400" />
                <h2 className="text-2xl font-bold">{currentStepData.title}</h2>
                {currentStepData.cost > 0 && (
                  <div className="flex items-center gap-1 glass-surface px-2 py-1 rounded-lg">
                    <Coins className="w-4 h-4 text-green-400" />
                    <span className="text-sm text-green-400">
                      {currentStepData.cost} SOLB
                    </span>
                  </div>
                )}
              </div>
              <p className="text-white/70">{currentStepData.description}</p>
            </div>
          )}

          {renderStepComponent()}
        </div>
      </div>
    </div>
  );
}
