import { useEffect, useRef } from "react";
import Prism from "prismjs";
import "prismjs/components/prism-javascript";
import "prismjs/components/prism-typescript";
import "prismjs/components/prism-jsx";
import "prismjs/components/prism-tsx";
import "prismjs/components/prism-python";
import "prismjs/components/prism-java";
import "prismjs/components/prism-csharp";
import "prismjs/components/prism-bash";
import "prismjs/themes/prism-tomorrow.css";

interface CodeBlockProps {
  code: string;
  language: string;
  editable?: boolean;
  onChange?: (value: string) => void;
}

export default function CodeBlock({ code, language, editable = false, onChange }: CodeBlockProps) {
  const codeRef = useRef<HTMLPreElement>(null);
  
  useEffect(() => {
    if (codeRef.current) {
      Prism.highlightElement(codeRef.current);
    }
  }, [code, language]);
  
  const handleEdit = (e: React.FormEvent<HTMLPreElement>) => {
    if (editable && onChange) {
      onChange(e.currentTarget.textContent || "");
    }
  };
  
  // Map the language prop to Prism's supported languages
  const getLanguageClass = () => {
    const languageMap: Record<string, string> = {
      javascript: "javascript",
      typescript: "typescript",
      jsx: "jsx",
      tsx: "tsx",
      python: "python",
      java: "java",
      csharp: "csharp",
      bash: "bash",
      shell: "bash",
    };
    
    return languageMap[language.toLowerCase()] || "javascript";
  };
  
  return (
    <pre 
      ref={codeRef}
      className={`code-editor p-4 text-xs text-gray-300 overflow-x-auto language-${getLanguageClass()}`} 
      contentEditable={editable}
      onInput={handleEdit}
      suppressContentEditableWarning={true}
    >
      {code}
    </pre>
  );
}
