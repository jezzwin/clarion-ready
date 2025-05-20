import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, CheckCircle, Code, Lightbulb, Sparkles } from "lucide-react";
import ClarionLogo from "@/assets/logo";

export default function Home() {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-7xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="flex justify-center mb-4">
            <ClarionLogo size={80} />
          </div>
          <h1 className="text-5xl font-bold sm:text-6xl md:text-7xl tracking-tight logo-gradient">
            Clarion
          </h1>
          <p className="mt-4 max-w-md mx-auto text-base sm:text-lg md:mt-5 md:text-xl md:max-w-3xl text-muted-foreground">
            Clarify Before You Build — Developer-focused AI assistant for understanding tasks, requirements, and code
          </p>
        </div>

        {/* Features Section */}
        <div className="py-12">
          <div className="mx-auto max-w-7xl">
            <div className="text-center mb-12">
              <h2 className="text-base text-primary font-semibold tracking-wide uppercase">Features</h2>
              <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight logo-gradient sm:text-4xl">
                Understand Tasks with Clarity
              </p>
              <p className="mt-4 max-w-2xl text-xl text-muted-foreground mx-auto">
                Clarion helps developers understand and implement tasks effectively through AI-powered analysis and guidance.
              </p>
            </div>

            <div className="mt-12">
              <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
                <Card className="border-border hover:border-primary/50 transition-colors">
                  <CardHeader>
                    <div className="inline-flex h-12 w-12 items-center justify-center rounded-md bg-primary/10 text-primary mb-4">
                      <CheckCircle className="h-6 w-6" />
                    </div>
                    <CardTitle>Task Breakdown</CardTitle>
                    <CardDescription>
                      Analyze user stories and requirements to understand exactly what needs to be built
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Get step-by-step explanations of tasks, converting vague requirements into actionable development plans.
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-border hover:border-primary/50 transition-colors">
                  <CardHeader>
                    <div className="inline-flex h-12 w-12 items-center justify-center rounded-md bg-secondary/10 text-secondary mb-4">
                      <Code className="h-6 w-6" />
                    </div>
                    <CardTitle>Code Pattern Recognition</CardTitle>
                    <CardDescription>
                      Identify reusable patterns and improve your implementation approach
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Get suggested implementations and recognizable patterns to maintain consistency in your codebase.
                    </p>
                  </CardContent>
                  <CardFooter className="pt-0">
                    <Link href="/analyzer">
                      <Button className="w-full interactive-button">
                        <Sparkles className="mr-2 h-4 w-4" />
                        Try Analyzer
                      </Button>
                    </Link>
                  </CardFooter>
                </Card>

                <Card className="border-border hover:border-primary/50 transition-colors">
                  <CardHeader>
                    <div className="inline-flex h-12 w-12 items-center justify-center rounded-md bg-accent/10 text-accent mb-4">
                      <Lightbulb className="h-6 w-6" />
                    </div>
                    <CardTitle>Beginner-Friendly Insights</CardTitle>
                    <CardDescription>
                      Complex concepts explained with analogies and simplified examples
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Bridge knowledge gaps with explanations tailored to your experience level, making complex tasks approachable.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>

        {/* How It Works Section */}
        <div className="py-16 bg-card rounded-2xl my-12 border border-border">
          <div className="mx-auto max-w-4xl px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tight logo-gradient">
                How Clarion Works
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                A simple process to get clarity on your development tasks
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
              <div className="flex flex-col items-center text-center">
                <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <span className="text-2xl font-bold text-primary">1</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">Input Your Task</h3>
                <p className="text-muted-foreground">
                  Paste your user story, requirements, or code snippet
                </p>
              </div>
              
              <div className="flex flex-col items-center text-center">
                <div className="h-16 w-16 rounded-full bg-secondary/10 flex items-center justify-center mb-4">
                  <span className="text-2xl font-bold text-secondary">2</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">Get AI Analysis</h3>
                <p className="text-muted-foreground">
                  Our AI breaks down the task and provides clear guidance
                </p>
              </div>
              
              <div className="flex flex-col items-center text-center">
                <div className="h-16 w-16 rounded-full bg-accent/10 flex items-center justify-center mb-4">
                  <span className="text-2xl font-bold text-accent">3</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">Build with Confidence</h3>
                <p className="text-muted-foreground">
                  Use the insights to implement your solution effectively
                </p>
              </div>
            </div>
            
            <div className="mt-12 flex justify-center">
              <Link href="/analyzer">
                <Button size="lg" className="interactive-button px-8 text-lg">
                  Start Analyzing Now
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
