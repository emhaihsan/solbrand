"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Loader2, Type, CheckCircle } from "lucide-react";

interface TypographyRecommenderProps {
  onNext: (data: any) => void;
  initialData?: any;
}

export function TypographyRecommender({
  onNext,
  initialData,
}: TypographyRecommenderProps) {
  const [brandPersonality, setBrandPersonality] = useState(
    initialData?.brandPersonality || ""
  );
  const [fontPreferences, setFontPreferences] = useState(
    initialData?.fontPreferences || ""
  );
  const [selectedFontPair, setSelectedFontPair] = useState(
    initialData?.selectedFontPair || ""
  );
  const [isGenerating, setIsGenerating] = useState(false);
  const [fontPairs, setFontPairs] = useState(initialData?.allFontPairs || []);

  const personalities = [
    {
      value: "modern",
      label: "Modern",
      description: "Clean, contemporary, minimal",
    },
    {
      value: "professional",
      label: "Professional",
      description: "Trustworthy, corporate, reliable",
    },
    {
      value: "creative",
      label: "Creative",
      description: "Artistic, unique, expressive",
    },
    {
      value: "friendly",
      label: "Friendly",
      description: "Approachable, warm, casual",
    },
    {
      value: "elegant",
      label: "Elegant",
      description: "Sophisticated, refined, luxury",
    },
    {
      value: "playful",
      label: "Playful",
      description: "Fun, energetic, youthful",
    },
  ];

  const preferences = [
    {
      value: "serif",
      label: "Serif",
      description: "Traditional, readable, classic",
    },
    {
      value: "sans-serif",
      label: "Sans-serif",
      description: "Modern, clean, simple",
    },
    {
      value: "script",
      label: "Script",
      description: "Elegant, handwritten, personal",
    },
    {
      value: "display",
      label: "Display",
      description: "Bold, decorative, attention-grabbing",
    },
  ];

  const generateFonts = async () => {
    if (!brandPersonality || !fontPreferences) return;

    setIsGenerating(true);

    // Simulate font generation
    setTimeout(() => {
      const mockFontPairs = [
        {
          name: "Modern Duo",
          primary: "Inter",
          secondary: "Poppins",
          description: "Clean and contemporary pairing",
          preview: "Aa Bb Cc",
        },
        {
          name: "Professional Suite",
          primary: "Roboto",
          secondary: "Open Sans",
          description: "Reliable and trustworthy fonts",
          preview: "Aa Bb Cc",
        },
        {
          name: "Creative Mix",
          primary: "Playfair Display",
          secondary: "Source Sans Pro",
          description: "Expressive yet readable combination",
          preview: "Aa Bb Cc",
        },
        {
          name: "Friendly Pair",
          primary: "Nunito",
          secondary: "Lato",
          description: "Warm and approachable fonts",
          preview: "Aa Bb Cc",
        },
      ];
      setFontPairs(mockFontPairs);
      setIsGenerating(false);
    }, 2000);
  };

  const handleSubmit = () => {
    if (!selectedFontPair) return;

    onNext({
      brandPersonality,
      fontPreferences,
      selectedFontPair,
      allFontPairs: fontPairs,
    });
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-6">
          <div>
            <Label className="text-white mb-3 block text-lg">
              Brand Personality
            </Label>
            <div className="grid grid-cols-1 gap-2">
              {personalities.map((personality) => (
                <button
                  key={personality.value}
                  onClick={() => setBrandPersonality(personality.value)}
                  className={`
                    p-3 rounded-lg text-left transition-all duration-200
                    ${
                      brandPersonality === personality.value
                        ? "bg-purple-500/30 border border-purple-500/50 text-white"
                        : "bg-white/5 border border-white/10 text-white/80 hover:bg-white/10"
                    }
                  `}
                >
                  <div className="font-medium">{personality.label}</div>
                  <div className="text-sm text-white/60">
                    {personality.description}
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div>
            <Label className="text-white mb-3 block text-lg">
              Font Preference
            </Label>
            <div className="grid grid-cols-1 gap-2">
              {preferences.map((pref) => (
                <button
                  key={pref.value}
                  onClick={() => setFontPreferences(pref.value)}
                  className={`
                    p-3 rounded-lg text-left transition-all duration-200
                    ${
                      fontPreferences === pref.value
                        ? "bg-purple-500/30 border border-purple-500/50 text-white"
                        : "bg-white/5 border border-white/10 text-white/80 hover:bg-white/10"
                    }
                  `}
                >
                  <div className="font-medium">{pref.label}</div>
                  <div className="text-sm text-white/60">
                    {pref.description}
                  </div>
                </button>
              ))}
            </div>
          </div>

          <Button
            onClick={generateFonts}
            disabled={!brandPersonality || !fontPreferences || isGenerating}
            className="w-full solana-gradient text-white"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Type className="w-4 h-4 mr-2" />
                Generate Font Pairs
              </>
            )}
          </Button>
        </div>

        <div className="space-y-4">
          <Label className="text-white text-lg">Font Recommendations</Label>

          {fontPairs.length > 0 ? (
            <div className="space-y-3">
              {fontPairs.map((pair: any, index: any) => (
                <button
                  key={index}
                  onClick={() => setSelectedFontPair(pair.name)}
                  className={`
                    w-full p-4 rounded-lg text-left transition-all duration-200
                    ${
                      selectedFontPair === pair.name
                        ? "bg-purple-500/30 border border-purple-500/50 text-white"
                        : "bg-white/5 border border-white/10 text-white/80 hover:bg-white/10"
                    }
                  `}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-lg">{pair.name}</span>
                    {selectedFontPair === pair.name && (
                      <CheckCircle className="w-5 h-5 text-green-400" />
                    )}
                  </div>
                  <div className="text-sm text-white/70 mb-2">
                    {pair.description}
                  </div>
                  <div className="flex gap-4">
                    <div>
                      <div className="text-xs text-white/50">Primary</div>
                      <div className="font-semibold">{pair.primary}</div>
                    </div>
                    <div>
                      <div className="text-xs text-white/50">Secondary</div>
                      <div>{pair.secondary}</div>
                    </div>
                  </div>
                  <div className="mt-3 text-2xl font-bold text-white/80">
                    {pair.preview}
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-center h-64 text-white/50">
              <div className="text-center">
                <Type className="w-12 h-12 mx-auto mb-4" />
                <p>Select your preferences and generate font pairs</p>
              </div>
            </div>
          )}

          {selectedFontPair && (
            <div className="mt-6 p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
              <div className="flex items-center gap-2 text-green-400 mb-2">
                <CheckCircle className="w-5 h-5" />
                <span className="font-medium">
                  Selected: {selectedFontPair}
                </span>
              </div>
              <Button
                onClick={handleSubmit}
                className="w-full solana-gradient text-white"
              >
                Continue with Typography
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
