import { useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Download, Share2 } from "lucide-react";
import LoadingSpinner from "@/components/ui/loading-spinner";
import TaskSummary from "./TaskSummary";
import ApproachSection from "./ApproachSection";
import ReusableCode from "./ReusableCode";
import ResourcesSection from "./ResourcesSection";
import BeginnerTips from "./BeginnerTips";

type AnalysisResult = {
  id: number;
  title: string;
  taskSummary: {
    description: string;
    steps: string[];
  };
  approach: {
    sections: {
      title: string;
      description: string;
      code?: string;
      isRecommended?: boolean;
    }[];
  };
  reusableCode: {
    description: string;
    code: string;
    language: string;
    similarIn?: string;
  };
  resources: {
    description: string;
    items: {
      type: string;
      title: string;
      description: string;
      duration?: string;
      icon: string;
    }[];
  };
  beginnerTips: {
    analogy: string;
    explanation: string;
    keyPoints: string[];
  };
  technologies: string[];
  createdAt: string | Date;
};

interface OutputPanelProps {
  loading: boolean;
  result?: AnalysisResult | null;
}

export default function OutputPanel({ loading, result }: OutputPanelProps) {
  const [copied, setCopied] = useState(false);
  
  const handleShare = () => {
    if (navigator.clipboard && result) {
      const shareText = `Clarion Analysis: ${result.title}\n\n${result.taskSummary.description}`;
      navigator.clipboard.writeText(shareText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };
  
  const handleDownload = () => {
    if (!result) return;
    
    // Create a JSON blob and download it
    const dataStr = JSON.stringify(result, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `clarion-analysis-${result.id}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  return (
    <Card className="border-primary/20 bg-gradient-to-b from-card to-card/70 backdrop-blur-sm">
      <CardHeader className="border-b border-border/50 bg-gradient-to-r from-primary/5 via-transparent to-secondary/5">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-bold logo-gradient">Analysis Results</CardTitle>
          {result && (
            <div className="flex space-x-2">
              <Button size="icon" variant="ghost" onClick={handleShare} className="hover:bg-primary/10 text-primary">
                <Share2 className="h-4 w-4" />
              </Button>
              <Button size="icon" variant="ghost" onClick={handleDownload} className="hover:bg-primary/10 text-primary">
                <Download className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
        <CardDescription className="text-muted-foreground">
          {result ? (
            <>Analyzing: <span className="font-medium text-primary/90">"{result.title}"</span></>
          ) : (
            <>Input your task details to get AI-powered insights</>
          )}
        </CardDescription>
      </CardHeader>
      
      {loading ? (
        <div className="px-4 py-16 sm:px-6 flex items-center justify-center">
          <div className="text-center space-y-4">
            <div className="relative mx-auto w-16 h-16">
              <div className="absolute inset-0 rounded-full border-t-2 border-r-2 border-primary animate-spin"></div>
              <div className="absolute inset-2 rounded-full border-b-2 border-l-2 border-secondary animate-spin animate-reverse"></div>
            </div>
            <p className="text-lg font-medium text-primary/90 animate-pulse">Clarifying your task...</p>
            <p className="text-sm text-muted-foreground">Analyzing code patterns and requirements</p>
          </div>
        </div>
      ) : !result ? (
        <CardContent className="px-4 py-10 text-center">
          <h3 className="text-lg font-medium mb-2 logo-gradient">No Analysis Results Yet</h3>
          <p className="text-sm text-muted-foreground max-w-md mx-auto">
            Fill out the form above and click "CLARIFY" to get detailed insights and guidance for your development task.
          </p>
        </CardContent>
      ) : (
        <div className="divide-y divide-border/30">
          <TaskSummary 
            description={result.taskSummary.description} 
            steps={result.taskSummary.steps} 
          />
          
          <ApproachSection sections={result.approach.sections} />
          
          <ReusableCode 
            description={result.reusableCode.description}
            code={result.reusableCode.code}
            language={result.reusableCode.language}
            similarIn={result.reusableCode.similarIn}
          />
          
          <ResourcesSection 
            description={result.resources.description}
            items={result.resources.items}
          />
          
          <BeginnerTips 
            analogy={result.beginnerTips.analogy}
            explanation={result.beginnerTips.explanation}
            keyPoints={result.beginnerTips.keyPoints}
          />
        </div>
      )}
    </Card>
  );
}
