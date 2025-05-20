import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import RecentAnalyses from "@/components/input/RecentAnalyses";

export default function History() {
  return (
    <div className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="max-w-7xl mx-auto">
        {/* Back Button */}
        <div className="mb-6">
          <Link href="/analyzer">
            <Button variant="ghost" className="flex items-center gap-2 hover:bg-card">
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Analyzer</span>
            </Button>
          </Link>
        </div>
        
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight logo-gradient">
            Analysis History
          </h1>
          <p className="mt-2 text-muted-foreground">
            View your past analyses and access previous results
          </p>
        </div>
        
        {/* History Content */}
        <div className="bg-card shadow-md rounded-lg border border-border p-6">
          <RecentAnalyses onSelectAnalysis={(id) => {
            // Navigate to analyzer page with the selected analysis
            window.location.href = `/analyzer?id=${id}`;
          }} />
        </div>
      </div>
    </div>
  );
}