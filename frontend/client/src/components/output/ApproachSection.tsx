import { Compass, Check } from "lucide-react";
import CodeBlock from "@/components/ui/code-block";
import { Badge } from "@/components/ui/badge";

interface ApproachSectionProps {
  sections: {
    title: string;
    description: string;
    code?: string;
    isRecommended?: boolean;
  }[];
}

export default function ApproachSection({ sections }: ApproachSectionProps) {
  return (
    <div className="px-4 py-5 sm:px-6">
      <div className="flex items-start">
        <div className="flex-shrink-0 mt-1">
          <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
            <Compass className="h-5 w-5 text-blue-600" />
          </div>
        </div>
        <div className="ml-4 flex-1">
          <h4 className="text-lg font-medium text-gray-900">Approach & Best Practices</h4>
          <div className="mt-2 text-sm text-gray-500">
            <div className="space-y-4">
              {sections.map((section, index) => (
                <div key={index}>
                  <h5 className="font-medium text-gray-700">{index + 1}. {section.title}</h5>
                  <p className="mt-1">{section.description}</p>
                  
                  {section.code && (
                    <div className="mt-2 bg-gray-50 rounded-md p-3">
                      <pre className="text-xs text-gray-700 overflow-x-auto">{section.code}</pre>
                    </div>
                  )}
                  
                  {section.isRecommended && (
                    <div className="mt-1 flex items-center">
                      <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
                        <Check className="h-3 w-3 mr-1" />
                        Recommended Pattern
                      </Badge>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
