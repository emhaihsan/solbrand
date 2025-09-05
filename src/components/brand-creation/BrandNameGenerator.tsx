"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Sparkles, CheckCircle } from "lucide-react";

interface BrandNameGeneratorProps {
  onNext: (data: any) => void;
  initialData?: any;
}

export function BrandNameGenerator({
  onNext,
  initialData,
}: BrandNameGeneratorProps) {
  const [businessDescription, setBusinessDescription] = useState(
    initialData?.businessDescription || ""
  );
  const [industry, setIndustry] = useState(initialData?.industry || "");
  const [targetAudience, setTargetAudience] = useState(
    initialData?.targetAudience || ""
  );
  const [coreValues, setCoreValues] = useState(initialData?.coreValues || "");
  const [keywords, setKeywords] = useState(initialData?.keywords || "");
  const [selectedName, setSelectedName] = useState(
    initialData?.selectedName || ""
  );
  const [suggestions, setSuggestions] = useState<string[]>(
    initialData?.allSuggestions || []
  );
  const [isGenerating, setIsGenerating] = useState(false);

  const generateNames = async () => {
    if (!businessDescription.trim()) return;

    setIsGenerating(true);

    // Simulate AI name generation with some example names
    setTimeout(() => {
      const mockSuggestions = [
        "BrandForge",
        "CreativeAxis",
        "VisionCraft",
        "BrandSphere",
        "InnovateLab",
        "BrandPulse",
        "DesignFlow",
        "BrandNova",
      ];
      setSuggestions(mockSuggestions);
      setIsGenerating(false);
    }, 2000);
  };

  const handleSubmit = () => {
    if (!selectedName) return;

    onNext({
      selectedName,
      businessDescription,
      industry,
      targetAudience,
      coreValues,
      keywords,
      allSuggestions: suggestions,
    });
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <Label className="text-white mb-2 block">
              Business Description *
            </Label>
            <Textarea
              placeholder="Describe your business idea..."
              value={businessDescription}
              onChange={(e) => setBusinessDescription(e.target.value)}
              className="bg-white/5 border-white/20 text-white min-h-[100px]"
            />
          </div>

          <div>
            <Label className="text-white mb-2 block">Industry</Label>
            <Input
              placeholder="e.g. Technology, Fashion, Food"
              value={industry}
              onChange={(e) => setIndustry(e.target.value)}
              className="bg-white/5 border-white/20 text-white"
            />
          </div>

          <div>
            <Label className="text-white mb-2 block">Target Audience</Label>
            <Input
              placeholder="Who is your target customer?"
              value={targetAudience}
              onChange={(e) => setTargetAudience(e.target.value)}
              className="bg-white/5 border-white/20 text-white"
            />
          </div>

          <div>
            <Label className="text-white mb-2 block">Core Values</Label>
            <Input
              placeholder="What values drive your brand?"
              value={coreValues}
              onChange={(e) => setCoreValues(e.target.value)}
              className="bg-white/5 border-white/20 text-white"
            />
          </div>

          <div>
            <Label className="text-white mb-2 block">Keywords</Label>
            <Input
              placeholder="Relevant keywords separated by commas"
              value={keywords}
              onChange={(e) => setKeywords(e.target.value)}
              className="bg-white/5 border-white/20 text-white"
            />
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label className="text-white">Brand Name Suggestions</Label>
            <Button
              onClick={generateNames}
              disabled={!businessDescription.trim() || isGenerating}
              className="solana-gradient text-white"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Generate Names
                </>
              )}
            </Button>
          </div>

          {suggestions.length > 0 && (
            <div className="space-y-2">
              <p className="text-sm text-white/70">Select a name:</p>
              <div className="grid grid-cols-1 gap-2 max-h-[300px] overflow-y-auto">
                {suggestions.map((name, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedName(name)}
                    className={`
                      p-3 rounded-lg text-left transition-all duration-200
                      ${
                        selectedName === name
                          ? "bg-purple-500/30 border border-purple-500/50 text-white"
                          : "bg-white/5 border border-white/10 text-white/80 hover:bg-white/10"
                      }
                    `}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{name}</span>
                      {selectedName === name && (
                        <CheckCircle className="w-5 h-5 text-green-400" />
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {selectedName && (
            <div className="mt-6 p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
              <div className="flex items-center gap-2 text-green-400 mb-2">
                <CheckCircle className="w-5 h-5" />
                <span className="font-medium">Selected: {selectedName}</span>
              </div>
              <Button
                onClick={handleSubmit}
                className="w-full solana-gradient text-white"
              >
                Continue with "{selectedName}"
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
