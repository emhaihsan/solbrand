"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, FileText, CheckCircle, Download, Eye } from "lucide-react";

interface PitchDeckBuilderProps {
  onNext: (data: any) => void;
  initialData?: any;
}

export function PitchDeckBuilder({
  onNext,
  initialData,
}: PitchDeckBuilderProps) {
  const [problemStatement, setProblemStatement] = useState(
    initialData?.problemStatement || ""
  );
  const [solution, setSolution] = useState(initialData?.solution || "");
  const [targetMarket, setTargetMarket] = useState(
    initialData?.targetMarket || ""
  );
  const [businessModel, setBusinessModel] = useState(
    initialData?.businessModel || ""
  );
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedDeck, setGeneratedDeck] = useState(
    initialData?.generatedDeck || null
  );
  const [selectedTemplate, setSelectedTemplate] = useState(
    initialData?.selectedTemplate || ""
  );

  const templates = [
    {
      id: "startup",
      name: "Startup Classic",
      description: "Perfect for new ventures and startups",
      slides: [
        "Problem",
        "Solution",
        "Market Size",
        "Business Model",
        "Competition",
        "Team",
        "Financial Projections",
        "Funding Ask",
      ],
    },
    {
      id: "product",
      name: "Product Launch",
      description: "Ideal for launching new products",
      slides: [
        "Market Opportunity",
        "Product Overview",
        "Target Audience",
        "Go-to-Market",
        "Revenue Model",
        "Marketing Strategy",
        "Timeline",
        "Investment",
      ],
    },
    {
      id: "minimal",
      name: "Minimal Pitch",
      description: "Clean and focused presentation",
      slides: [
        "Problem & Solution",
        "Market Analysis",
        "Product Demo",
        "Business Model",
        "Financial Overview",
        "Next Steps",
      ],
    },
  ];

  const generatePitchDeck = async () => {
    if (
      !problemStatement ||
      !solution ||
      !targetMarket ||
      !businessModel ||
      !selectedTemplate
    )
      return;

    setIsGenerating(true);

    // Simulate pitch deck generation
    setTimeout(() => {
      const template = templates.find((t) => t.id === selectedTemplate);
      const mockDeck = {
        template: template?.name,
        totalSlides: template?.slides.length || 8,
        slides: template?.slides.map((slide, index) => ({
          id: index + 1,
          title: slide,
          content: generateSlideContent(slide, {
            problemStatement,
            solution,
            targetMarket,
            businessModel,
          }),
          notes: `Speaker notes for ${slide} slide`,
        })),
        createdAt: new Date().toISOString(),
        downloadUrl: "#", // Would be actual download URL in real implementation
        previewUrl: "#", // Would be actual preview URL in real implementation
      };

      setGeneratedDeck(mockDeck);
      setIsGenerating(false);
    }, 3000);
  };

  const generateSlideContent = (slideTitle: string, data: any) => {
    const contentMap: { [key: string]: string } = {
      Problem: `The Challenge: ${data.problemStatement.substring(0, 100)}...`,
      Solution: `Our Solution: ${data.solution.substring(0, 100)}...`,
      "Market Size": `Target Market: ${data.targetMarket.substring(0, 100)}...`,
      "Business Model": `Revenue Strategy: ${data.businessModel.substring(
        0,
        100
      )}...`,
      "Problem & Solution": `The Problem: ${data.problemStatement.substring(
        0,
        50
      )}...\n\nOur Solution: ${data.solution.substring(0, 50)}...`,
      "Market Opportunity": `Market Analysis: ${data.targetMarket.substring(
        0,
        100
      )}...`,
      "Product Overview": `Product Description: ${data.solution.substring(
        0,
        100
      )}...`,
      "Target Audience": `Our Customers: ${data.targetMarket.substring(
        0,
        100
      )}...`,
      "Revenue Model": `Monetization: ${data.businessModel.substring(
        0,
        100
      )}...`,
    };

    return (
      contentMap[slideTitle] ||
      `Content for ${slideTitle} slide based on your inputs`
    );
  };

  const handleSubmit = () => {
    if (!generatedDeck) return;

    onNext({
      problemStatement,
      solution,
      targetMarket,
      businessModel,
      selectedTemplate,
      generatedDeck,
    });
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          <div>
            <Label className="text-white mb-3 block text-lg">
              Problem Statement
            </Label>
            <Textarea
              value={problemStatement}
              onChange={(e) => setProblemStatement(e.target.value)}
              placeholder="What problem does your brand/business solve? Be specific about the pain points your target audience faces..."
              className="bg-white/5 border-white/10 text-white placeholder:text-white/50 min-h-[100px]"
            />
          </div>

          <div>
            <Label className="text-white mb-3 block text-lg">Solution</Label>
            <Textarea
              value={solution}
              onChange={(e) => setSolution(e.target.value)}
              placeholder="How does your brand/product solve this problem? What makes your solution unique and better than alternatives..."
              className="bg-white/5 border-white/10 text-white placeholder:text-white/50 min-h-[100px]"
            />
          </div>

          <div>
            <Label className="text-white mb-3 block text-lg">
              Target Market
            </Label>
            <Textarea
              value={targetMarket}
              onChange={(e) => setTargetMarket(e.target.value)}
              placeholder="Who are your ideal customers? Include demographics, psychographics, market size, and behavior patterns..."
              className="bg-white/5 border-white/10 text-white placeholder:text-white/50 min-h-[100px]"
            />
          </div>

          <div>
            <Label className="text-white mb-3 block text-lg">
              Business Model
            </Label>
            <Textarea
              value={businessModel}
              onChange={(e) => setBusinessModel(e.target.value)}
              placeholder="How will you make money? Describe your revenue streams, pricing strategy, and key business metrics..."
              className="bg-white/5 border-white/10 text-white placeholder:text-white/50 min-h-[100px]"
            />
          </div>

          <div>
            <Label className="text-white mb-3 block text-lg">
              Pitch Deck Template
            </Label>
            <div className="space-y-3">
              {templates.map((template) => (
                <button
                  key={template.id}
                  onClick={() => setSelectedTemplate(template.id)}
                  className={`
                    w-full p-4 rounded-lg text-left transition-all duration-200
                    ${
                      selectedTemplate === template.id
                        ? "bg-purple-500/30 border border-purple-500/50 text-white"
                        : "bg-white/5 border border-white/10 text-white/80 hover:bg-white/10"
                    }
                  `}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">{template.name}</span>
                    {selectedTemplate === template.id && (
                      <CheckCircle className="w-5 h-5 text-green-400" />
                    )}
                  </div>
                  <p className="text-sm text-white/70 mb-2">
                    {template.description}
                  </p>
                  <p className="text-xs text-white/50">
                    {template.slides.length} slides
                  </p>
                </button>
              ))}
            </div>
          </div>

          <Button
            onClick={generatePitchDeck}
            disabled={
              !problemStatement ||
              !solution ||
              !targetMarket ||
              !businessModel ||
              !selectedTemplate ||
              isGenerating
            }
            className="w-full solana-gradient text-white"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Generating Pitch Deck...
              </>
            ) : (
              <>
                <FileText className="w-4 h-4 mr-2" />
                Generate Pitch Deck
              </>
            )}
          </Button>
        </div>

        <div className="space-y-4">
          <Label className="text-white text-lg">Generated Pitch Deck</Label>

          {generatedDeck ? (
            <div className="space-y-4">
              <div className="bg-white/5 border border-white/10 rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-1">
                      {generatedDeck.template}
                    </h3>
                    <p className="text-white/70">
                      {generatedDeck.totalSlides} slides
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-white/20 text-white hover:bg-white/10"
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      Preview
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-white/20 text-white hover:bg-white/10"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </Button>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="text-lg font-medium text-white mb-3">
                    Slide Overview
                  </h4>
                  {generatedDeck.slides.map((slide: any, index: number) => (
                    <div
                      key={slide.id}
                      className="bg-white/5 border border-white/10 rounded-lg p-4"
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-8 h-8 bg-purple-500/30 rounded-full flex items-center justify-center text-white text-sm font-medium">
                          {slide.id}
                        </div>
                        <span className="font-medium text-white">
                          {slide.title}
                        </span>
                      </div>
                      <p className="text-sm text-white/70 ml-11">
                        {slide.content}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
                <div className="flex items-center gap-2 text-green-400 mb-2">
                  <CheckCircle className="w-5 h-5" />
                  <span className="font-medium">
                    Pitch Deck Generated Successfully
                  </span>
                </div>
                <p className="text-sm text-green-300/80 mb-3">
                  Your professional pitch deck is ready! You can preview,
                  download, or continue to the summary.
                </p>
                <Button
                  onClick={handleSubmit}
                  className="w-full solana-gradient text-white"
                >
                  Continue to Brand Summary
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-96 text-white/50">
              <div className="text-center">
                <FileText className="w-16 h-16 mx-auto mb-4" />
                <p className="text-lg mb-2">
                  Professional Pitch Deck Generator
                </p>
                <p className="text-sm">
                  Fill in your business details and select a template to
                  generate your pitch deck
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
