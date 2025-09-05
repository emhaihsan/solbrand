"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Loader2, Palette, CheckCircle, Copy } from "lucide-react";

interface ColorPaletteGeneratorProps {
  onNext: (data: any) => void;
  initialData?: any;
}

export function ColorPaletteGenerator({
  onNext,
  initialData,
}: ColorPaletteGeneratorProps) {
  const [selectedEmotions, setSelectedEmotions] = useState<string[]>(
    initialData?.selectedEmotions || []
  );
  const [dominantColor, setDominantColor] = useState(
    initialData?.dominantColor || ""
  );
  const [selectedPalette, setSelectedPalette] = useState(
    initialData?.selectedPalette || ""
  );
  const [isGenerating, setIsGenerating] = useState(false);
  const [palettes, setPalettes] = useState(initialData?.allPalettes || []);

  const emotions = [
    { value: "trustworthy", label: "Trustworthy", color: "#2563EB" },
    { value: "energetic", label: "Energetic", color: "#EF4444" },
    { value: "calm", label: "Calm", color: "#10B981" },
    { value: "creative", label: "Creative", color: "#8B5CF6" },
    { value: "premium", label: "Premium", color: "#1F2937" },
    { value: "friendly", label: "Friendly", color: "#F59E0B" },
    { value: "innovative", label: "Innovative", color: "#06B6D4" },
    { value: "playful", label: "Playful", color: "#EC4899" },
  ];

  const dominantColors = [
    { value: "blue", label: "Blue", color: "#3B82F6" },
    { value: "green", label: "Green", color: "#10B981" },
    { value: "purple", label: "Purple", color: "#8B5CF6" },
    { value: "red", label: "Red", color: "#EF4444" },
    { value: "orange", label: "Orange", color: "#F97316" },
    { value: "pink", label: "Pink", color: "#EC4899" },
    { value: "yellow", label: "Yellow", color: "#EAB308" },
    { value: "neutral", label: "Neutral", color: "#6B7280" },
  ];

  const toggleEmotion = (emotion: string) => {
    setSelectedEmotions((prev) =>
      prev.includes(emotion)
        ? prev.filter((e) => e !== emotion)
        : [...prev, emotion]
    );
  };

  const generatePalettes = async () => {
    if (selectedEmotions.length === 0 || !dominantColor) return;

    setIsGenerating(true);

    // Simulate palette generation
    setTimeout(() => {
      const mockPalettes = [
        {
          name: "Ocean Breeze",
          primary: "#2563EB",
          secondary: "#06B6D4",
          accent: "#10B981",
          neutral: "#6B7280",
          light: "#F8FAFC",
          description: "Fresh and trustworthy palette",
        },
        {
          name: "Sunset Glow",
          primary: "#F97316",
          secondary: "#EF4444",
          accent: "#EAB308",
          neutral: "#78716C",
          light: "#FEF7ED",
          description: "Energetic and warm colors",
        },
        {
          name: "Forest Harmony",
          primary: "#10B981",
          secondary: "#059669",
          accent: "#34D399",
          neutral: "#6B7280",
          light: "#F0FDF4",
          description: "Natural and calming palette",
        },
        {
          name: "Royal Purple",
          primary: "#8B5CF6",
          secondary: "#7C3AED",
          accent: "#A78BFA",
          neutral: "#6B7280",
          light: "#FAF5FF",
          description: "Creative and premium feel",
        },
      ];
      setPalettes(mockPalettes);
      setIsGenerating(false);
    }, 2000);
  };

  const handleSubmit = () => {
    if (!selectedPalette) return;

    const selectedPaletteData = palettes.find(
      (p: any) => p.name === selectedPalette
    );

    onNext({
      selectedEmotions,
      dominantColor,
      selectedPalette,
      selectedPaletteData,
      allPalettes: palettes,
    });
  };

  const copyColor = (color: string) => {
    navigator.clipboard.writeText(color);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-6">
          <div>
            <Label className="text-white mb-3 block text-lg">
              Brand Emotions
            </Label>
            <p className="text-sm text-white/60 mb-3">
              Select emotions you want your brand to convey (choose 2-3)
            </p>
            <div className="grid grid-cols-2 gap-2">
              {emotions.map((emotion) => (
                <button
                  key={emotion.value}
                  onClick={() => toggleEmotion(emotion.value)}
                  className={`
                    p-3 rounded-lg text-center transition-all duration-200 flex items-center gap-2
                    ${
                      selectedEmotions.includes(emotion.value)
                        ? "bg-purple-500/30 border border-purple-500/50 text-white"
                        : "bg-white/5 border border-white/10 text-white/80 hover:bg-white/10"
                    }
                  `}
                >
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: emotion.color }}
                  ></div>
                  <span className="text-sm">{emotion.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <Label className="text-white mb-3 block text-lg">
              Dominant Color
            </Label>
            <div className="grid grid-cols-4 gap-2">
              {dominantColors.map((color) => (
                <button
                  key={color.value}
                  onClick={() => setDominantColor(color.value)}
                  className={`
                    p-3 rounded-lg text-center transition-all duration-200 flex flex-col items-center gap-2
                    ${
                      dominantColor === color.value
                        ? "bg-purple-500/30 border border-purple-500/50 text-white"
                        : "bg-white/5 border border-white/10 text-white/80 hover:bg-white/10"
                    }
                  `}
                >
                  <div
                    className="w-8 h-8 rounded-full"
                    style={{ backgroundColor: color.color }}
                  ></div>
                  <span className="text-xs">{color.label}</span>
                </button>
              ))}
            </div>
          </div>

          <Button
            onClick={generatePalettes}
            disabled={
              selectedEmotions.length === 0 || !dominantColor || isGenerating
            }
            className="w-full solana-gradient text-white"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Palette className="w-4 h-4 mr-2" />
                Generate Color Palettes
              </>
            )}
          </Button>
        </div>

        <div className="space-y-4">
          <Label className="text-white text-lg">Color Palettes</Label>

          {palettes.length > 0 ? (
            <div className="space-y-4">
              {palettes.map((palette: any, index: any) => (
                <button
                  key={index}
                  onClick={() => setSelectedPalette(palette.name)}
                  className={`
                    w-full p-4 rounded-lg text-left transition-all duration-200
                    ${
                      selectedPalette === palette.name
                        ? "bg-purple-500/30 border border-purple-500/50 text-white"
                        : "bg-white/5 border border-white/10 text-white/80 hover:bg-white/10"
                    }
                  `}
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-medium text-lg">{palette.name}</span>
                    {selectedPalette === palette.name && (
                      <CheckCircle className="w-5 h-5 text-green-400" />
                    )}
                  </div>
                  <div className="text-sm text-white/70 mb-3">
                    {palette.description}
                  </div>
                  <div className="flex gap-2 mb-2">
                    {[
                      palette.primary,
                      palette.secondary,
                      palette.accent,
                      palette.neutral,
                      palette.light,
                    ].map((color, colorIndex) => (
                      <div
                        key={colorIndex}
                        className="flex flex-col items-center gap-1"
                      >
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            copyColor(color);
                          }}
                          className="w-8 h-8 rounded-lg border border-white/20 hover:scale-110 transition-transform group relative"
                          style={{ backgroundColor: color }}
                          title={`Copy ${color}`}
                        >
                          <Copy className="w-3 h-3 text-white/0 group-hover:text-white/80 absolute inset-0 m-auto" />
                        </button>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-4 text-xs text-white/50">
                    <span>Primary</span>
                    <span>Secondary</span>
                    <span>Accent</span>
                    <span>Neutral</span>
                    <span>Light</span>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-center h-64 text-white/50">
              <div className="text-center">
                <Palette className="w-12 h-12 mx-auto mb-4" />
                <p>Select emotions and dominant color to generate palettes</p>
              </div>
            </div>
          )}

          {selectedPalette && (
            <div className="mt-6 p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
              <div className="flex items-center gap-2 text-green-400 mb-2">
                <CheckCircle className="w-5 h-5" />
                <span className="font-medium">Selected: {selectedPalette}</span>
              </div>
              <Button
                onClick={handleSubmit}
                className="w-full solana-gradient text-white"
              >
                Continue with Color Palette
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
