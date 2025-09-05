"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Loader2, Sparkles, CheckCircle, Download } from "lucide-react";

interface LogoGeneratorProps {
  onNext: (data: any) => void;
  initialData?: any;
}

export function LogoGenerator({ onNext, initialData }: LogoGeneratorProps) {
  const [visualStyle, setVisualStyle] = useState(
    initialData?.visualStyle || ""
  );
  const [iconPreference, setIconPreference] = useState(
    initialData?.iconPreference || ""
  );
  const [brandMood, setBrandMood] = useState(initialData?.brandMood || "");
  const [selectedLogo, setSelectedLogo] = useState(
    initialData?.selectedLogo || ""
  );
  const [isGenerating, setIsGenerating] = useState(false);
  const [logos, setLogos] = useState<string[]>(initialData?.allLogos || []);

  const visualStyles = [
    {
      value: "minimalist",
      label: "Minimalist",
      description: "Clean, simple design",
    },
    { value: "modern", label: "Modern", description: "Contemporary and sleek" },
    { value: "playful", label: "Playful", description: "Fun and energetic" },
    {
      value: "professional",
      label: "Professional",
      description: "Serious and trustworthy",
    },
    {
      value: "creative",
      label: "Creative",
      description: "Artistic and unique",
    },
  ];

  const iconPreferences = [
    { value: "abstract", label: "Abstract", description: "Geometric shapes" },
    { value: "symbolic", label: "Symbolic", description: "Meaningful icons" },
    {
      value: "typographic",
      label: "Typographic",
      description: "Text-based logo",
    },
    { value: "mascot", label: "Mascot", description: "Character or animal" },
  ];

  const moods = [
    { value: "trustworthy", label: "Trustworthy" },
    { value: "innovative", label: "Innovative" },
    { value: "friendly", label: "Friendly" },
    { value: "premium", label: "Premium" },
    { value: "energetic", label: "Energetic" },
    { value: "calm", label: "Calm" },
  ];

  const generateLogos = async () => {
    if (!visualStyle || !iconPreference || !brandMood) return;

    setIsGenerating(true);

    // Simulate logo generation
    setTimeout(() => {
      const mockLogos = [
        "🌟 Logo A",
        "⚡ Logo B",
        "🚀 Logo C",
        "💎 Logo D",
        "🎯 Logo E",
        "🔥 Logo F",
      ];
      setLogos(mockLogos);
      setIsGenerating(false);
    }, 3000);
  };

  const handleSubmit = () => {
    if (!selectedLogo) return;

    onNext({
      selectedLogo,
      visualStyle,
      iconPreference,
      brandMood,
      allLogos: logos,
      imageData: `data:image/svg+xml,<svg>Mock logo: ${selectedLogo}</svg>`, // Mock image data
    });
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-6">
          <div>
            <Label className="text-white mb-3 block text-lg">
              Visual Style
            </Label>
            <div className="grid grid-cols-1 gap-2">
              {visualStyles.map((style) => (
                <button
                  key={style.value}
                  onClick={() => setVisualStyle(style.value)}
                  className={`
                    p-3 rounded-lg text-left transition-all duration-200
                    ${
                      visualStyle === style.value
                        ? "bg-purple-500/30 border border-purple-500/50 text-white"
                        : "bg-white/5 border border-white/10 text-white/80 hover:bg-white/10"
                    }
                  `}
                >
                  <div className="font-medium">{style.label}</div>
                  <div className="text-sm text-white/60">
                    {style.description}
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div>
            <Label className="text-white mb-3 block text-lg">
              Icon Preference
            </Label>
            <div className="grid grid-cols-1 gap-2">
              {iconPreferences.map((pref) => (
                <button
                  key={pref.value}
                  onClick={() => setIconPreference(pref.value)}
                  className={`
                    p-3 rounded-lg text-left transition-all duration-200
                    ${
                      iconPreference === pref.value
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

          <div>
            <Label className="text-white mb-3 block text-lg">Brand Mood</Label>
            <div className="grid grid-cols-2 gap-2">
              {moods.map((mood) => (
                <button
                  key={mood.value}
                  onClick={() => setBrandMood(mood.value)}
                  className={`
                    p-3 rounded-lg text-center transition-all duration-200
                    ${
                      brandMood === mood.value
                        ? "bg-purple-500/30 border border-purple-500/50 text-white"
                        : "bg-white/5 border border-white/10 text-white/80 hover:bg-white/10"
                    }
                  `}
                >
                  {mood.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label className="text-white text-lg">Generated Logos</Label>
            <Button
              onClick={generateLogos}
              disabled={
                !visualStyle || !iconPreference || !brandMood || isGenerating
              }
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
                  Generate Logos
                </>
              )}
            </Button>
          </div>

          {logos.length > 0 && (
            <div className="space-y-2">
              <p className="text-sm text-white/70">Select a logo:</p>
              <div className="grid grid-cols-2 gap-3 max-h-[400px] overflow-y-auto">
                {logos.map((logo, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedLogo(logo)}
                    className={`
                      p-4 rounded-lg text-center transition-all duration-200 aspect-square flex items-center justify-center
                      ${
                        selectedLogo === logo
                          ? "bg-purple-500/30 border border-purple-500/50 text-white"
                          : "bg-white/5 border border-white/10 text-white/80 hover:bg-white/10"
                      }
                    `}
                  >
                    <div className="text-4xl mb-2">{logo}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {selectedLogo && (
            <div className="mt-6 p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
              <div className="flex items-center gap-2 text-green-400 mb-2">
                <CheckCircle className="w-5 h-5" />
                <span className="font-medium">Selected: {selectedLogo}</span>
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={handleSubmit}
                  className="flex-1 solana-gradient text-white"
                >
                  Continue with This Logo
                </Button>
                <Button
                  variant="outline"
                  className="border-white/20 text-white hover:bg-white/10"
                >
                  <Download className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
