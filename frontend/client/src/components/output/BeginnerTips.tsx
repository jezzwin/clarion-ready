import { Lightbulb, GraduationCap } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

interface BeginnerTipsProps {
  analogy: string;
  explanation: string;
  keyPoints: string[];
}

export default function BeginnerTips({ analogy, explanation, keyPoints }: BeginnerTipsProps) {
  const [showDetailed, setShowDetailed] = useState(false);
  
  return (
    <div className="px-4 py-5 sm:px-6 bg-yellow-50">
      <div className="flex items-start">
        <div className="flex-shrink-0 mt-1">
          <div className="h-8 w-8 rounded-full bg-yellow-100 flex items-center justify-center">
            <Lightbulb className="h-5 w-5 text-yellow-600" />
          </div>
        </div>
        <div className="ml-4 flex-1">
          <h4 className="text-lg font-medium text-gray-900">Beginner-Friendly Insights</h4>
          <div className="mt-2 text-sm text-gray-600">
            <div className="bg-white rounded-md p-4 border border-yellow-200">
              <p><span className="font-medium">{analogy}</span></p>
              <p className="mt-2">{explanation}</p>
              <p className="mt-2">The key concepts to remember:</p>
              <ul className="mt-1 list-disc list-inside space-y-1 text-gray-600">
                {keyPoints.map((point, index) => (
                  <li key={index}>{point}</li>
                ))}
              </ul>
            </div>
            
            <div className="mt-4 flex">
              <Button 
                variant="link" 
                className="text-xs p-0 h-auto text-primary-600 hover:text-primary-700 flex items-center"
                onClick={() => setShowDetailed(!showDetailed)}
              >
                <GraduationCap className="mr-1 h-4 w-4" />
                {showDetailed ? "Hide detailed explanation" : "Show more detailed explanation"}
              </Button>
            </div>
            
            {showDetailed && (
              <div className="mt-4 bg-white p-4 rounded-md border border-gray-200">
                <h5 className="font-medium text-gray-700 mb-2">Detailed Explanation:</h5>
                <p>
                  This concept follows a common pattern in software development called "caching". 
                  Caching means storing a copy of data that's expensive to fetch or compute 
                  so you can retrieve it more quickly next time.
                </p>
                <p className="mt-2">
                  When implemented correctly, caching can dramatically improve your application's 
                  performance by reducing database load and response times. However, it also 
                  introduces complexity around keeping cached data fresh and handling failures.
                </p>
                <p className="mt-2">
                  As you become more familiar with this pattern, you'll learn strategies for cache 
                  invalidation, managing cache size, and distributed caching across multiple servers.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
