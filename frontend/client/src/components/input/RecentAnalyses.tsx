import { useQuery } from "@tanstack/react-query";
import { formatDistanceToNow } from "date-fns";

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Clock, Code, CheckCircle, ArrowUpRight } from "lucide-react";

type Analysis = {
  id: number;
  title: string;
  technologies: string;
  createdAt: string;
};

interface RecentAnalysesProps {
  onSelectAnalysis: (id: number) => void;
}

export default function RecentAnalyses({ onSelectAnalysis }: RecentAnalysesProps) {
  const { data: analyses, isLoading, error } = useQuery<Analysis[]>({
    queryKey: ["/api/analyses"],
  });

  const handleSelect = (id: number) => {
    onSelectAnalysis(id);
  };

  if (isLoading) {
    return (
      <Card className="border-primary/20 bg-gradient-to-br from-card to-card/80 backdrop-blur-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-xl font-bold tracking-tight text-primary">Recent Analyses</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="p-4">
            {Array.from({ length: 2 }).map((_, i) => (
              <div key={i} className="p-4 border border-border/50 rounded-md mb-3 bg-primary/5">
                <Skeleton className="h-5 w-full max-w-[250px] mb-2 bg-primary/10" />
                <div className="flex justify-between mt-2">
                  <Skeleton className="h-4 w-[150px] bg-primary/10" />
                  <Skeleton className="h-4 w-[80px] bg-primary/10" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="border-primary/20 bg-gradient-to-br from-card to-card/80 backdrop-blur-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-xl font-bold tracking-tight text-primary">Recent Analyses</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">Error loading recent analyses. Please try again later.</p>
        </CardContent>
      </Card>
    );
  }

  if (!analyses || analyses.length === 0) {
    return (
      <Card className="border-primary/20 bg-gradient-to-br from-card to-card/80 backdrop-blur-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-xl font-bold tracking-tight text-primary">Recent Analyses</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6 text-muted-foreground">
            <Code className="h-10 w-10 mx-auto mb-2 opacity-50" />
            <p>No analyses yet. Start by submitting a task!</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-primary/20 bg-gradient-to-br from-card to-card/80 backdrop-blur-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-xl font-bold tracking-tight text-primary">Recent Analyses</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {analyses.map((analysis) => (
            <div 
              key={analysis.id} 
              className="p-3 rounded-md border border-border hover:border-primary/70 hover:bg-primary/5 transition-all group relative cursor-pointer transform hover:translate-y-[-2px] hover:shadow-lg hover:shadow-primary/5"
              onClick={() => handleSelect(analysis.id)}
            >
              <div className="absolute -left-1 top-1/2 transform -translate-y-1/2 w-1 h-2/3 bg-gradient-to-b from-primary/80 to-secondary/80 rounded-r opacity-0 group-hover:opacity-100 transition-opacity"></div>
              
              <div className="flex items-center justify-between">
                <h3 className="font-medium group-hover:text-primary transition-colors">{analysis.title}</h3>
                <Button variant="ghost" size="sm" className="text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                  <ArrowUpRight className="h-4 w-4" />
                </Button>
              </div>

              <div className="mt-2 flex flex-wrap gap-2">
                {analysis.technologies.split(',').map((tech, i) => (
                  <Badge key={i} variant="outline" className="bg-secondary/10 text-secondary-foreground border-secondary/20">
                    {tech.trim()}
                  </Badge>
                ))}
              </div>

              <div className="mt-2 flex items-center text-xs text-muted-foreground">
                <Clock className="mr-1.5 h-3 w-3 text-muted-foreground" />
                <span>{formatDistanceToNow(new Date(analysis.createdAt), { addSuffix: true })}</span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
