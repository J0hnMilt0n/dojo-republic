"use client";

import { useState, useRef } from "react";
import {
  Upload,
  Play,
  AlertCircle,
  CheckCircle,
  TrendingUp,
  Activity,
  Shield,
  Lightbulb,
  X,
  ExternalLink,
} from "lucide-react";

interface AnalysisResult {
  score: number;
  issues: string[];
  injury_risk: {
    level: "Low" | "Medium" | "High";
    area: string;
    reason: string;
    risk_type: string;
  };
  drills: string[];
  prevention_advice: string[];
}

// Vercel limit: 4.5MB - files larger than this need direct upload
const VERCEL_LIMIT_BYTES = 4.5 * 1024 * 1024;

export default function MartialMindPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type.startsWith("video/")) {
        setSelectedFile(file);
        setError(null);
        setResult(null);

        // Create preview URL
        const url = URL.createObjectURL(file);
        setPreviewUrl(url);
      } else {
        setError("Please select a valid video file");
        setSelectedFile(null);
        setPreviewUrl(null);
      }
    }
  };

  const handleAnalyze = async () => {
    if (!selectedFile) {
      setError("Please select a video file first");
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      // Check if file is larger than Vercel's limit
      // If so, upload directly to the AI backend
      if (selectedFile.size > VERCEL_LIMIT_BYTES) {
        await uploadDirectToBackend();
        return;
      }

      // For smaller files, use the Next.js API route
      const formData = new FormData();
      formData.append("video", selectedFile);

      const response = await fetch("/api/martialmind/analyze", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        if (response.status === 413) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(
            errorData.message ||
              "Video file is too large. Please upload a video under 100MB.",
          );
        }
        if (response.status === 504) {
          throw new Error(
            "Analysis timed out. Please try with a shorter video.",
          );
        }
        if (response.status === 503) {
          throw new Error(
            "AI service is temporarily unavailable. Please try again later.",
          );
        }
        throw new Error("Analysis failed. Please try again.");
      }

      const data: AnalysisResult = await response.json();
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setIsProcessing(false);
    }
  };

  const uploadDirectToBackend = async () => {
    if (!selectedFile) {
      setError("Please select a video file first");
      return;
    }

    // Direct upload to AI backend (bypasses Vercel's 4.5MB limit)
    const AI_BACKEND_URL =
      process.env.NEXT_PUBLIC_MARTIALMIND_API_URL ||
      "https://martialmind-backend-production.up.railway.app";

    const formData = new FormData();
    formData.append("video", selectedFile);

    const response = await fetch(`${AI_BACKEND_URL}/analyze-video`, {
      method: "POST",
      body: formData,
      // Set a longer timeout for large file uploads
      signal: AbortSignal.timeout(300000), // 5 minutes timeout
    });

    if (!response.ok) {
      if (response.status === 413) {
        throw new Error("Video file is too large. Maximum size is 100MB.");
      }
      if (response.status === 504) {
        throw new Error("Analysis timed out. Please try with a shorter video.");
      }
      throw new Error(
        `AI analysis failed with status ${response.status}. Please try again.`,
      );
    }

    const data: AnalysisResult = await response.json();
    setResult(data);
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case "Low":
        return "text-green-600 bg-green-50 border-green-200";
      case "Medium":
        return "text-yellow-600 bg-yellow-50 border-yellow-200";
      case "High":
        return "text-red-600 bg-red-50 border-red-200";
      default:
        return "text-gray-600 bg-[#FEFEFE] border-gray-200";
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 8) return "text-green-600";
    if (score >= 6) return "text-yellow-600";
    return "text-red-600";
  };

  const clearAnalysis = () => {
    setSelectedFile(null);
    setResult(null);
    setError(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100">
      {/* Hero Section */}
      <div className="bg-linear-to-r from-red-600 to-red-800 text-white py-7">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center mb-6">
            <Activity className="w-10 h-10 mr-3" />
            <h1 className="text-2xl md:text-3xl font-bold">MartialMind AI</h1>
          </div>
          <p className="text-center text-base md:text-lg text-red-100 max-w-3xl mx-auto">
            AI-powered performance analysis and injury risk detection for combat
            sports athletes
          </p>
          <div className="flex justify-center space-x-8 mt-8">
            <div className="text-center">
              <TrendingUp className="w-8 h-8 mx-auto mb-2" />
              <p className="text-sm font-medium">Performance Scoring</p>
            </div>
            <div className="text-center">
              <Shield className="w-8 h-8 mx-auto mb-2" />
              <p className="text-sm font-medium">Injury Risk Detection</p>
            </div>
            <div className="text-center">
              <Lightbulb className="w-8 h-8 mx-auto mb-2" />
              <p className="text-sm font-medium">Improvement Drills</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Upload Section */}
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <Upload className="w-6 h-6 mr-2 text-red-600" />
              Upload Video
            </h2>

            <div className="space-y-6">
              {/* File Input */}
              <div
                className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-red-500 transition-colors cursor-pointer bg-[#FEFEFE]"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                <p className="text-gray-600 mb-2">
                  {selectedFile
                    ? selectedFile.name
                    : "Click to select video file"}
                </p>
                <p className="text-sm text-gray-400">
                  Supported formats: MP4, MOV, AVI
                </p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="video/*"
                  onChange={handleFileSelect}
                  className="hidden"
                />
              </div>

              {/* Video Preview */}
              {previewUrl && (
                <div className="relative">
                  <button
                    onClick={clearAnalysis}
                    className="absolute top-2 right-2 z-10 bg-red-600 text-white p-2 rounded-full hover:bg-red-700 transition"
                  >
                    <X className="w-4 h-4" />
                  </button>
                  <video
                    src={previewUrl}
                    controls
                    className="w-full rounded-lg shadow-md"
                  />
                </div>
              )}

              {/* Analyze Button */}
              <button
                onClick={handleAnalyze}
                disabled={!selectedFile || isProcessing}
                className={`w-full py-4 rounded-xl font-semibold text-white transition-all duration-300 flex items-center justify-center space-x-2 ${
                  !selectedFile || isProcessing
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-red-600 to-red-800 hover:from-red-700 hover:to-red-900 shadow-lg hover:shadow-red-500/50 hover:scale-105 transform"
                }`}
              >
                {isProcessing ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
                    <span>Analyzing...</span>
                  </>
                ) : (
                  <>
                    <Play className="w-5 h-5" />
                    <span>Analyze Performance</span>
                  </>
                )}
              </button>

              {/* Error Message */}
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start space-x-3">
                  <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <p className="text-red-800 text-sm">{error}</p>
                </div>
              )}
            </div>
          </div>

          {/* Results Section */}
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <Activity className="w-6 h-6 mr-2 text-red-600" />
              Analysis Results
            </h2>

            {!result && !isProcessing && (
              <div className="flex flex-col items-center justify-center h-64 text-center">
                <div className="bg-gray-100 rounded-full p-6 mb-4">
                  <TrendingUp className="w-12 h-12 text-gray-400" />
                </div>
                <p className="text-gray-500 text-lg">
                  Upload a video to see your performance analysis
                </p>
              </div>
            )}

            {isProcessing && (
              <div className="flex flex-col items-center justify-center h-64">
                <div className="animate-spin rounded-full h-16 w-16 border-4 border-red-600 border-t-transparent mb-4" />
                <p className="text-gray-600 text-lg font-medium">
                  Analyzing your technique...
                </p>
                <p className="text-gray-500 text-sm mt-2">
                  This may take a few moments
                </p>
              </div>
            )}

            {result && (
              <div className="space-y-6">
                {/* Performance Score */}
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-6 border border-gray-200">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">
                      Performance Score
                    </h3>
                    <div
                      className={`text-4xl font-bold ${getScoreColor(result.score)}`}
                    >
                      {result.score.toFixed(1)}
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3 mt-3">
                    <div
                      className={`h-3 rounded-full transition-all duration-500 ${
                        result.score >= 8
                          ? "bg-green-500"
                          : result.score >= 6
                            ? "bg-yellow-500"
                            : "bg-red-500"
                      }`}
                      style={{ width: `${(result.score / 10) * 100}%` }}
                    />
                  </div>
                </div>

                {/* Injury Risk */}
                <div
                  className={`rounded-xl p-6 border-2 ${getRiskColor(result.injury_risk.level)}`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-lg font-semibold flex items-center">
                      <Shield className="w-5 h-5 mr-2" />
                      Injury Risk Assessment
                    </h3>
                    <span className="px-4 py-1 rounded-full text-sm font-bold">
                      {result.injury_risk.level}
                    </span>
                  </div>
                  <div className="space-y-2 text-sm">
                    <p>
                      <strong>Area:</strong> {result.injury_risk.area}
                    </p>
                    <p>
                      <strong>Reason:</strong> {result.injury_risk.reason}
                    </p>
                    <p>
                      <strong>Type:</strong> {result.injury_risk.risk_type}
                    </p>
                  </div>
                </div>

                {/* Technique Issues */}
                {result.issues.length > 0 && (
                  <div className="bg-orange-50 rounded-xl p-6 border border-orange-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                      <AlertCircle className="w-5 h-5 mr-2 text-orange-600" />
                      Technique Issues
                    </h3>
                    <ul className="space-y-2">
                      {result.issues.map((issue, index) => (
                        <li
                          key={index}
                          className="flex items-start space-x-2 text-sm text-gray-700"
                        >
                          <span className="text-orange-600 font-bold">•</span>
                          <span>{issue}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Improvement Drills */}
                {result.drills.length > 0 && (
                  <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                      <Lightbulb className="w-5 h-5 mr-2 text-blue-600" />
                      Recommended Drills
                    </h3>
                    <ul className="space-y-2">
                      {result.drills.map((drill, index) => (
                        <li
                          key={index}
                          className="flex items-start space-x-2 text-sm text-gray-700"
                        >
                          <CheckCircle className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                          <span>{drill}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Prevention Advice */}
                {result.prevention_advice.length > 0 && (
                  <div className="bg-green-50 rounded-xl p-6 border border-green-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                      <Shield className="w-5 h-5 mr-2 text-green-600" />
                      Injury Prevention
                    </h3>
                    <ul className="space-y-2">
                      {result.prevention_advice.map((advice, index) => (
                        <li
                          key={index}
                          className="flex items-start space-x-2 text-sm text-gray-700"
                        >
                          <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                          <span>{advice}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Information Section */}
        <div className="mt-12 bg-white rounded-2xl shadow-xl p-8 border border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            How MartialMind AI Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-red-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Upload className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Upload Video
              </h3>
              <p className="text-gray-600 text-sm">
                Upload your training video of kicks, punches, or sparring
                sessions
              </p>
            </div>
            <div className="text-center">
              <div className="bg-red-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Activity className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                AI Analysis
              </h3>
              <p className="text-gray-600 text-sm">
                Our AI analyzes your technique, biomechanics, and movement
                patterns
              </p>
            </div>
            <div className="text-center">
              <div className="bg-red-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-lg font-semblold text-gray-900 mb-2">
                Get Insights
              </h3>
              <p className="text-gray-600 text-sm">
                Receive performance scores, injury risk assessment, and
                personalized drills
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
