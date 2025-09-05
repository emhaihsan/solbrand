"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Loader2,
  Target,
  CheckCircle,
  TrendingUp,
  Users,
  DollarSign,
} from "lucide-react";

interface IdeaValidationProps {
  onNext: (data: any) => void;
  initialData?: any;
}

export function IdeaValidation({ onNext, initialData }: IdeaValidationProps) {
  const [detailedDescription, setDetailedDescription] = useState(
    initialData?.detailedDescription || ""
  );
  const [targetMarket, setTargetMarket] = useState(
    initialData?.targetMarket || ""
  );
  const [uniqueness, setUniqueness] = useState(initialData?.uniqueness || "");
  const [isValidating, setIsValidating] = useState(false);
  const [validationResults, setValidationResults] = useState(
    initialData?.validationResults || []
  );
  const [insights, setInsights] = useState(initialData?.insights || []);

  const validateIdea = async () => {
    if (
      !detailedDescription.trim() ||
      !targetMarket.trim() ||
      !uniqueness.trim()
    )
      return;

    setIsValidating(true);

    // Simulate AI validation
    setTimeout(() => {
      const mockResults = [
        {
          category: "Market Potential",
          score: 85,
          description: "Strong market demand identified",
          icon: TrendingUp,
        },
        {
          category: "Target Audience",
          score: 78,
          description: "Clear audience segmentation",
          icon: Users,
        },
        {
          category: "Revenue Potential",
          score: 82,
          description: "Multiple monetization options",
          icon: DollarSign,
        },
      ];

      const mockInsights = [
        "Your idea addresses a real market need",
        "Consider expanding to adjacent markets",
        "Strong differentiation from competitors",
        "Scalable business model potential",
      ];

      setValidationResults(mockResults);
      setInsights(mockInsights);
      setIsValidating(false);
    }, 2500);
  };

  const handleSubmit = () => {
    if (validationResults.length === 0) return;

    onNext({
      detailedDescription,
      targetMarket,
      uniqueness,
      validationResults,
      insights,
    });
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-400";
    if (score >= 60) return "text-yellow-400";
    return "text-red-400";
  };

  const getScoreBg = (score: number) => {
    if (score >= 80) return "bg-green-500/20";
    if (score >= 60) return "bg-yellow-500/20";
    return "bg-red-500/20";
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <Label className="text-white mb-2 block">
              Detailed Description *
            </Label>
            <Textarea
              placeholder="Provide a detailed description of your business idea..."
              value={detailedDescription}
              onChange={(e) => setDetailedDescription(e.target.value)}
              className="bg-white/5 border-white/20 text-white min-h-[120px]"
            />
          </div>

          <div>
            <Label className="text-white mb-2 block">Target Market *</Label>
            <Textarea
              placeholder="Who is your target market? Be specific about demographics, needs, and size..."
              value={targetMarket}
              onChange={(e) => setTargetMarket(e.target.value)}
              className="bg-white/5 border-white/20 text-white min-h-[100px]"
            />
          </div>

          <div>
            <Label className="text-white mb-2 block">
              What Makes It Unique? *
            </Label>
            <Textarea
              placeholder="What differentiates your idea from existing solutions?"
              value={uniqueness}
              onChange={(e) => setUniqueness(e.target.value)}
              className="bg-white/5 border-white/20 text-white min-h-[100px]"
            />
          </div>

          <Button
            onClick={validateIdea}
            disabled={
              !detailedDescription.trim() ||
              !targetMarket.trim() ||
              !uniqueness.trim() ||
              isValidating
            }
            className="w-full solana-gradient text-white"
          >
            {isValidating ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Validating Idea...
              </>
            ) : (
              <>
                <Target className="w-4 h-4 mr-2" />
                Validate Business Idea
              </>
            )}
          </Button>
        </div>

        <div className="space-y-4">
          {validationResults.length > 0 && (
            <>
              <div>
                <Label className="text-white text-lg mb-3 block">
                  Validation Results
                </Label>
                <div className="space-y-3">
                  {validationResults.map((result: any, index: any) => (
                    <div
                      key={index}
                      className={`p-4 rounded-lg ${getScoreBg(result.score)}`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <result.icon className="w-5 h-5 text-white" />
                          <span className="font-medium text-white">
                            {result.category}
                          </span>
                        </div>
                        <span
                          className={`font-bold ${getScoreColor(result.score)}`}
                        >
                          {result.score}/100
                        </span>
                      </div>
                      <p className="text-sm text-white/70">
                        {result.description}
                      </p>
                      <div className="mt-2 w-full bg-white/10 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${
                            result.score >= 80
                              ? "bg-green-400"
                              : result.score >= 60
                              ? "bg-yellow-400"
                              : "bg-red-400"
                          }`}
                          style={{ width: `${result.score}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {insights.length > 0 && (
                <div>
                  <Label className="text-white text-lg mb-3 block">
                    Key Insights
                  </Label>
                  <div className="space-y-2">
                    {insights.map((insight: any, index: any) => (
                      <div
                        key={index}
                        className="flex items-start gap-2 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg"
                      >
                        <CheckCircle className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-white/80">{insight}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="mt-6 p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
                <div className="flex items-center gap-2 text-green-400 mb-2">
                  <CheckCircle className="w-5 h-5" />
                  <span className="font-medium">Validation Complete</span>
                </div>
                <Button
                  onClick={handleSubmit}
                  className="w-full solana-gradient text-white"
                >
                  Continue to Next Step
                </Button>
              </div>
            </>
          )}

          {validationResults.length === 0 && (
            <div className="flex items-center justify-center h-64 text-white/50">
              <div className="text-center">
                <Target className="w-12 h-12 mx-auto mb-4" />
                <p>
                  Fill out the form and click "Validate Business Idea" to see
                  results
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
