"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  CheckCircle,
  Download,
  Share2,
  Sparkles,
  FileText,
  Palette,
  Type,
  Lightbulb,
  Eye,
} from "lucide-react";

interface BrandSummaryProps {
  onComplete: (data: any) => void;
  brandData: any;
}

export function BrandSummary({ onComplete, brandData }: BrandSummaryProps) {
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);
  const [brandSummary, setBrandSummary] = useState<any>(null);

  const generateBrandSummary = async () => {
    setIsGeneratingSummary(true);

    // Simulate summary generation
    setTimeout(() => {
      const summary = {
        brandName: brandData.brandName?.selectedName || "Your Brand",
        tagline: generateTagline(brandData),
        brandStory: generateBrandStory(brandData),
        keyAssets: {
          logo: brandData.logo?.selectedLogo,
          colorPalette: brandData.colorPalette?.selectedPaletteData,
          typography: brandData.typography?.selectedFontPair,
          pitchDeck: brandData.pitchDeck?.generatedDeck,
        },
        brandGuidelines: generateBrandGuidelines(brandData),
        nextSteps: [
          "Download your complete brand package",
          "Set up brand guidelines for your team",
          "Launch your brand across digital platforms",
          "Monitor brand consistency and performance",
        ],
        investmentRequired: calculateTotalInvestment(brandData),
        completedAt: new Date().toISOString(),
      };

      setBrandSummary(summary);
      setIsGeneratingSummary(false);
    }, 2000);
  };

  const generateTagline = (data: any) => {
    const name = data.brandName?.selectedName || "Brand";
    return `${name} - Empowering Innovation Through Design`;
  };

  const generateBrandStory = (data: any) => {
    const name = data.brandName?.selectedName || "Your Brand";
    const industry = data.brandName?.industry || "technology";
    return `${name} emerges as a visionary force in the ${industry} space, driven by a commitment to excellence and innovation. Born from deep market insights and creative brilliance, ${name} represents more than just a brand—it's a movement toward meaningful change and authentic connection with customers.`;
  };

  const generateBrandGuidelines = (data: any) => {
    return {
      logoUsage:
        "Maintain clear space equal to the height of the 'x' in the wordmark around all sides of the logo",
      colorApplication:
        "Use primary colors for main brand elements, secondary colors for accents, and neutral colors for text",
      typographyRules:
        "Headlines should use the primary font, body text uses the secondary font with minimum 14px size",
      toneOfVoice:
        "Professional yet approachable, innovative, and customer-focused",
      brandValues: [
        "Innovation",
        "Authenticity",
        "Excellence",
        "Customer-Centricity",
      ],
    };
  };

  const calculateTotalInvestment = (data: any) => {
    let total = 0;
    if (data.brandName) total += 1;
    if (data.logo) total += 5;
    if (data.ideaValidation) total += 1;
    if (data.typography) total += 1;
    if (data.colorPalette) total += 1;
    if (data.pitchDeck) total += 1;
    return total;
  };

  const handleComplete = () => {
    onComplete({
      ...brandData,
      summary: brandSummary,
    });
  };

  // Auto-generate summary when component mounts
  useState(() => {
    if (!brandSummary) {
      generateBrandSummary();
    }
  });

  return (
    <div className="space-y-6">
      {isGeneratingSummary ? (
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 relative">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full animate-pulse"></div>
              <Sparkles className="w-8 h-8 text-white absolute inset-0 m-auto animate-bounce" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">
              Finalizing Your Brand
            </h3>
            <p className="text-white/70">
              Creating your comprehensive brand summary...
            </p>
          </div>
        </div>
      ) : brandSummary ? (
        <div className="space-y-8">
          {/* Brand Header */}
          <div className="text-center space-y-4">
            <div className="w-20 h-20 mx-auto bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
              <Sparkles className="w-10 h-10 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">
                {brandSummary.brandName}
              </h1>
              <p className="text-xl text-white/80 italic">
                {brandSummary.tagline}
              </p>
            </div>
            <div className="flex items-center justify-center gap-2 text-green-400">
              <CheckCircle className="w-6 h-6" />
              <span className="text-lg font-medium">
                Brand Creation Complete!
              </span>
            </div>
          </div>

          {/* Brand Story */}
          <div className="bg-white/5 border border-white/10 rounded-lg p-6">
            <h3 className="text-xl font-semibold text-white mb-4">
              Brand Story
            </h3>
            <p className="text-white/80 leading-relaxed">
              {brandSummary.brandStory}
            </p>
          </div>

          {/* Key Assets Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-white">Brand Assets</h3>

              {/* Logo */}
              {brandSummary.keyAssets.logo && (
                <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <Eye className="w-5 h-5 text-purple-400" />
                    <span className="font-medium text-white">Logo Design</span>
                  </div>
                  <p className="text-sm text-white/70">
                    Selected: {brandSummary.keyAssets.logo.name}
                  </p>
                </div>
              )}

              {/* Color Palette */}
              {brandSummary.keyAssets.colorPalette && (
                <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <Palette className="w-5 h-5 text-purple-400" />
                    <span className="font-medium text-white">
                      Color Palette
                    </span>
                  </div>
                  <div className="flex gap-2 mb-2">
                    {[
                      brandSummary.keyAssets.colorPalette.primary,
                      brandSummary.keyAssets.colorPalette.secondary,
                      brandSummary.keyAssets.colorPalette.accent,
                      brandSummary.keyAssets.colorPalette.neutral,
                    ].map((color, index) => (
                      <div
                        key={index}
                        className="w-8 h-8 rounded-lg border border-white/20"
                        style={{ backgroundColor: color }}
                      ></div>
                    ))}
                  </div>
                  <p className="text-sm text-white/70">
                    {brandSummary.keyAssets.colorPalette.name}
                  </p>
                </div>
              )}

              {/* Typography */}
              {brandSummary.keyAssets.typography && (
                <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <Type className="w-5 h-5 text-purple-400" />
                    <span className="font-medium text-white">Typography</span>
                  </div>
                  <p className="text-sm text-white/70">
                    {brandSummary.keyAssets.typography.heading} +{" "}
                    {brandSummary.keyAssets.typography.body}
                  </p>
                </div>
              )}

              {/* Pitch Deck */}
              {brandSummary.keyAssets.pitchDeck && (
                <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <FileText className="w-5 h-5 text-purple-400" />
                    <span className="font-medium text-white">Pitch Deck</span>
                  </div>
                  <p className="text-sm text-white/70">
                    {brandSummary.keyAssets.pitchDeck.template} -{" "}
                    {brandSummary.keyAssets.pitchDeck.totalSlides} slides
                  </p>
                </div>
              )}
            </div>

            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-white">
                Brand Guidelines
              </h3>

              <div className="bg-white/5 border border-white/10 rounded-lg p-4 space-y-3">
                <div>
                  <h4 className="font-medium text-white mb-2">Logo Usage</h4>
                  <p className="text-sm text-white/70">
                    {brandSummary.brandGuidelines.logoUsage}
                  </p>
                </div>

                <div>
                  <h4 className="font-medium text-white mb-2">
                    Color Application
                  </h4>
                  <p className="text-sm text-white/70">
                    {brandSummary.brandGuidelines.colorApplication}
                  </p>
                </div>

                <div>
                  <h4 className="font-medium text-white mb-2">
                    Typography Rules
                  </h4>
                  <p className="text-sm text-white/70">
                    {brandSummary.brandGuidelines.typographyRules}
                  </p>
                </div>

                <div>
                  <h4 className="font-medium text-white mb-2">Brand Values</h4>
                  <div className="flex flex-wrap gap-2">
                    {brandSummary.brandGuidelines.brandValues.map(
                      (value: string, index: number) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-purple-500/20 border border-purple-500/30 rounded-full text-sm text-white"
                        >
                          {value}
                        </span>
                      )
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Investment Summary */}
          <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-white">
                Investment Summary
              </h3>
              <div className="text-right">
                <div className="text-2xl font-bold text-white">
                  {brandSummary.investmentRequired} SOLB
                </div>
                <div className="text-sm text-white/60">Total Invested</div>
              </div>
            </div>
            <p className="text-white/80">
              You've successfully invested {brandSummary.investmentRequired}{" "}
              SOLB tokens to create a comprehensive brand identity with
              professional assets and strategic guidance.
            </p>
          </div>

          {/* Next Steps */}
          <div className="bg-white/5 border border-white/10 rounded-lg p-6">
            <h3 className="text-xl font-semibold text-white mb-4">
              Next Steps
            </h3>
            <div className="space-y-3">
              {brandSummary.nextSteps.map((step: string, index: number) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-purple-500/30 rounded-full flex items-center justify-center text-white text-sm font-medium">
                    {index + 1}
                  </div>
                  <span className="text-white/80">{step}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Button size="lg" className="flex-1 solana-gradient text-white">
              <Download className="w-5 h-5 mr-2" />
              Download Brand Package
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="flex-1 border-white/20 text-white hover:bg-white/10"
            >
              <Share2 className="w-5 h-5 mr-2" />
              Share Brand
            </Button>
            <Button
              size="lg"
              onClick={handleComplete}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white"
            >
              <CheckCircle className="w-5 h-5 mr-2" />
              Complete & Save
            </Button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
