import { GitBranch, Copy } from "lucide-react";
import { useState } from "react";
import CodeBlock from "@/components/ui/code-block";

interface ReusableCodeProps {
  description: string;
  code: string;
  language: string;
  similarIn?: string;
}

export default function ReusableCode({ description, code, language, similarIn }: ReusableCodeProps) {
  const [copied, setCopied] = useState(false);
  
  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  
  return (
    <div className="px-4 py-5 sm:px-6">
      <div className="flex items-start">
        <div className="flex-shrink-0 mt-1">
          <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center">
            <GitBranch className="h-5 w-5 text-indigo-600" />
          </div>
        </div>
        <div className="ml-4 flex-1">
          <h4 className="text-lg font-medium text-gray-900">Reusable Patterns & Code</h4>
          <div className="mt-2 text-sm text-gray-500">
            <p className="mb-3">{description}</p>
            
            <div className="bg-gray-800 rounded-md overflow-hidden">
              <div className="flex items-center justify-between px-4 py-2 bg-gray-900">
                <span className="text-xs text-gray-200">{language === 'javascript' ? 'userProfileCache.js' : `code.${language}`}</span>
                <div className="flex space-x-2">
                  <button 
                    className="text-gray-400 hover:text-gray-200"
                    onClick={handleCopy}
                  >
                    <Copy size={16} />
                  </button>
                </div>
              </div>
              <CodeBlock code={code} language={language} />
            </div>
            
            {similarIn && (
              <div className="mt-4">
                <p className="font-medium text-gray-700">Similar in your codebase:</p>
                <p className="mt-1">
                  You've used similar caching logic in <code className="text-xs bg-gray-100 px-1 py-0.5 rounded">{similarIn}</code> - consider refactoring both to use a shared caching utility.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
