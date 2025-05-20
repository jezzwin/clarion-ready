import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { 
  BookText, 
  History,
  FileText,
} from "lucide-react";

import InputPanel from "@/components/input/InputPanel";
import RecentAnalyses from "@/components/input/RecentAnalyses";
import OutputPanel from "@/components/output/OutputPanel";
import { queryClient } from "@/lib/queryClient";

export default function Analyzer() {
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  // Fetch specific analysis if ID is provided
  const fetchAnalysis = async (id: number) => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/analyses/${id}`);
      if (!response.ok) {
        throw new Error("Failed to fetch analysis");
      }
      const data = await response.json();
      setAnalysisResult(data);
    } catch (error) {
      console.error("Error fetching analysis:", error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleAnalysisComplete = (result: any) => {
    setAnalysisResult(result);
    // Invalidate the recent analyses query to refetch the list
    queryClient.invalidateQueries({ queryKey: ["/api/analyses"] });
    
    // Scroll to results
    setTimeout(() => {
      document.getElementById('results-section')?.scrollIntoView({ behavior: 'smooth' });
    }, 300);
  };
  
  const handleSelectAnalysis = (id: number) => {
    fetchAnalysis(id);
    
    // Scroll to results
    setTimeout(() => {
      document.getElementById('results-section')?.scrollIntoView({ behavior: 'smooth' });
    }, 300);
  };
  
  return (
    <div className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="max-w-7xl mx-auto">
        {/* Animated Page Header */}
        <div className="mb-8 text-center relative py-6">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-3xl blur-3xl"></div>
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight logo-gradient relative animate-pulse-slow">
            CLARION
          </h1>
          <div className="h-1 w-32 mx-auto bg-gradient-to-r from-primary/80 to-secondary/80 my-4 rounded-full"></div>
          <p className="mt-2 text-xl text-primary/90 font-light tracking-wide">
            <span className="animate-text-reveal inline-block">CLARIFY BEFORE YOU BUILD</span>
          </p>
        </div>
        
        {/* Main Content - All in Home page now */}
        <div className="space-y-8">
          {/* Features Section (Simplified) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="flex flex-col items-center text-center p-4 rounded-lg bg-card/50 border border-border">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <BookText className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Task Breakdown</h3>
              <p className="text-muted-foreground text-sm">Get step-by-step explanations of tasks</p>
            </div>
            
            <div className="flex flex-col items-center text-center p-4 rounded-lg bg-card/50 border border-border">
              <div className="h-12 w-12 rounded-full bg-secondary/10 flex items-center justify-center mb-4">
                <FileText className="h-6 w-6 text-secondary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Code Pattern Recognition</h3>
              <p className="text-muted-foreground text-sm">Identify reusable patterns in your code</p>
            </div>
            
            <div className="flex flex-col items-center text-center p-4 rounded-lg bg-card/50 border border-border">
              <div className="h-12 w-12 rounded-full bg-accent/10 flex items-center justify-center mb-4">
                <History className="h-6 w-6 text-accent" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Beginner-Friendly Insights</h3>
              <p className="text-muted-foreground text-sm">Complex concepts explained simply</p>
            </div>
          </div>
          
          {/* Input Form */}
          <div>
            <InputPanel 
              onAnalysisComplete={handleAnalysisComplete}
              isLoading={isLoading}
            />
          </div>
          
          {/* Output Panel - Only shown when there are results */}
          {(isLoading || analysisResult) && (
            <div id="results-section" className="pt-6">
              <OutputPanel 
                loading={isLoading}
                result={analysisResult}
              />
            </div>
          )}
          
          {/* History Section - Shown below the input/output */}
          <div className="pt-6 border-t border-border mt-8">
            <RecentAnalyses onSelectAnalysis={handleSelectAnalysis} />
          </div>
        </div>
      </div>
    </div>
  );
}
