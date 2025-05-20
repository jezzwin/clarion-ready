import { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent,
  CardFooter 
} from "@/components/ui/card";
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel 
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue 
} from "@/components/ui/select";
import { Bolt, FileUp, Upload, X, Plus, File } from "lucide-react";
import { Badge } from "@/components/ui/badge";

// Updated form schema
const formSchema = z.object({
  inputType: z.enum(["text", "file", "mixed"]),
  content: z.string().min(1, "Please enter some content"),
  experienceLevel: z.enum(["beginner", "intermediate", "advanced"]),
  codeLanguage: z.string().optional()
});

type FormValues = z.infer<typeof formSchema>;

type InputPanelProps = {
  onAnalysisComplete: (result: any) => void;
  isLoading: boolean;
};

export default function InputPanel({ onAnalysisComplete, isLoading }: InputPanelProps) {
  const [files, setFiles] = useState<{name: string, content: string, type: string}[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const dropAreaRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  
  // Default form values
  const defaultValues = {
    inputType: "text" as const,
    content: "",
    experienceLevel: "beginner" as const,
    codeLanguage: "javascript"
  };
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues
  });
  
  // Process file function
  const processFile = (file: File) => {
    if (file) {
      // Check file size (10MB limit)
      if (file.size > 10 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Maximum file size is 10MB",
          variant: "destructive"
        });
        return;
      }
      
      // Check file type
      const acceptedTypes = [
        'text/plain', 'text/markdown', 'application/javascript', 
        'text/javascript', 'application/json', 'text/python',
        'application/octet-stream', 'text/html', 'text/css',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/pdf'
      ];
      
      // Proceed anyway even if file type isn't in the list (just a warning)
      if (!acceptedTypes.includes(file.type) && file.type !== '') {
        toast({
          title: "Unsupported file type",
          description: "We'll try to process it, but content may not be extracted correctly.",
          variant: "destructive"
        });
      }
      
      // Create file metadata and add it to files list without reading the content
      const newFile = {
        name: file.name,
        content: `File content from: ${file.name} (${(file.size / 1024).toFixed(1)}KB)`,
        type: file.type || file.name.split('.').pop() || 'txt'
      };
      
      const updatedFiles = [...files, newFile];
      setFiles(updatedFiles);
      
      // Update form state - but preserve any existing text input
      const currentContent = form.getValues("content") || "";
      const fileIds = updatedFiles.map(f => `[File: ${f.name}]`).join('\n');
      
      // If existing content is just file IDs, replace it, otherwise combine
      if (currentContent.includes('[File:') && !currentContent.replace(/\[File:.*?\]/g, '').trim()) {
        form.setValue("content", fileIds);
      } else if (currentContent) {
        form.setValue("content", currentContent);
      } else {
        form.setValue("content", fileIds);
      }
      
      form.setValue("inputType", updatedFiles.length > 0 ? "mixed" : "text");
    }
  };
  
  // Auto-detect language based on file extension and content
  const detectLanguage = (filename: string, content: string) => {
    const extension = filename.split('.').pop()?.toLowerCase();
    
    if (extension === 'js' || content.includes('function') || content.includes('const ') || content.includes('let ')) {
      form.setValue("codeLanguage", "javascript");
    } else if (extension === 'ts' || content.includes(':') && content.includes('interface ')) {
      form.setValue("codeLanguage", "typescript");
    } else if (extension === 'py' || content.includes('def ') || content.includes('import ') && content.includes(':')) {
      form.setValue("codeLanguage", "python");
    } else if (extension === 'java' || content.includes('public class ')) {
      form.setValue("codeLanguage", "java");
    } else if (extension === 'cs' || content.includes('namespace ') || content.includes('using System;')) {
      form.setValue("codeLanguage", "csharp");
    }
  };
  
  // File upload handler
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = event.target.files;
    if (fileList && fileList.length > 0) {
      // Process all files
      Array.from(fileList).forEach(file => {
        processFile(file);
      });
    }
  };
  
  // Drag and drop handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };
  
  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };
  
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      // Process all dropped files
      Array.from(e.dataTransfer.files).forEach(file => {
        processFile(file);
      });
    }
  };
  
  // Analyze button handler
  const analyzeMutation = useMutation({
    mutationFn: async (data: FormValues) => {
      const response = await apiRequest("POST", "/api/analyze", data);
      return response.json();
    },
    onSuccess: (data) => {
      onAnalysisComplete(data);
    },
    onError: (error) => {
      toast({
        title: "Analysis Failed",
        description: error.message || "Failed to analyze your input. Please try again.",
        variant: "destructive"
      });
    }
  });
  
  const onSubmit = (data: FormValues) => {
    analyzeMutation.mutate(data);
  };
  
  const removeFile = (index: number) => {
    const updatedFiles = [...files];
    updatedFiles.splice(index, 1);
    setFiles(updatedFiles);
    
    if (updatedFiles.length === 0) {
      // Reset form if no files left
      form.setValue("content", "");
      form.setValue("inputType", "text");
    } else {
      // Update combined content
      const combinedContent = updatedFiles.map(f => f.content).join('\n\n');
      form.setValue("content", combinedContent);
    }
  };
  
  const clearAllFiles = () => {
    setFiles([]);
    form.setValue("content", "");
    form.setValue("inputType", "text");
  };
  
  // Check if content includes code
  const hasCodeContent = () => {
    const content = form.watch("content") || "";
    return content.includes('{') || 
      content.includes('function') || 
      content.includes('class') ||
      content.includes('def ') ||
      content.includes('import ') ||
      content.includes('package ') ||
      content.includes('const ') ||
      content.includes('let ') ||
      files.some(file => file.name.match(/\.(js|ts|py|java|cs|html|css|json)$/i));
  };
  
  // Get file extension for badge color
  const getFileExtension = (filename: string) => {
    return filename.split('.').pop()?.toUpperCase() || 'FILE';
  };
  
  return (
    <Card className="border-border">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="py-5">
            <div className="space-y-4">
              {/* Main Content Input */}
              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center justify-end mb-4">
                      <div className="relative">
                        <Button 
                          type="button" 
                          variant="outline" 
                          size="lg" 
                          className="interactive-button flex items-center gap-2 transform transition hover:scale-105"
                          onClick={() => document.getElementById('file-upload')?.click()}
                        >
                          <FileUp className="h-5 w-5" />
                          <span className="font-medium">UPLOAD FILES</span>
                        </Button>
                        <input 
                          id="file-upload" 
                          type="file" 
                          multiple
                          className="sr-only" 
                          onChange={handleFileChange}
                          accept=".txt,.md,.js,.ts,.py,.java,.cs,.html,.css,.json,.docx,.pdf"
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 gap-4">
                      {/* Text input area */}
                      <div
                        ref={dropAreaRef}
                        className={`border-2 border-dashed rounded-md transition-colors ${
                          isDragging ? 'border-primary/50 bg-primary/5' : 'border-border'
                        }`}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                      >
                        <FormControl>
                          <Textarea 
                            placeholder="Paste your user story, requirements doc, or code snippet here... or drag and drop files"
                            className={`min-h-[150px] border-0 focus-visible:ring-0 ${isDragging ? 'opacity-50' : ''}`}
                            onChange={(e) => {
                              // Keep only the text content - separate from file content
                              form.setValue("inputType", files.length > 0 ? "mixed" : "text");
                              form.setValue("content", e.target.value);
                            }}
                          />
                        </FormControl>
                        {isDragging && (
                          <div className="absolute inset-0 flex items-center justify-center bg-primary/10 rounded-md pointer-events-none">
                            <div className="text-center">
                              <Upload className="h-10 w-10 text-primary mx-auto" />
                              <p className="mt-2 text-sm font-medium text-primary">Drop files to upload</p>
                            </div>
                          </div>
                        )}
                      </div>
                      
                      {/* Uploaded files area */}
                      {files.length > 0 && (
                        <div className="border rounded-md p-3 bg-card/80 backdrop-blur-sm">
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="font-medium text-foreground">Uploaded Files ({files.length})</h3>
                            <Button 
                              type="button" 
                              variant="outline" 
                              size="sm" 
                              onClick={clearAllFiles}
                              className="text-destructive border-destructive hover:bg-destructive/10"
                            >
                              Clear All
                            </Button>
                          </div>
                          
                          <div className="space-y-2 max-h-[120px] overflow-y-auto">
                            {files.map((file, index) => (
                              <div 
                                key={index} 
                                className="flex items-center justify-between p-2 rounded-md border border-border group hover:border-primary/30 hover:bg-primary/5"
                              >
                                <div className="flex items-center">
                                  <File className="h-5 w-5 text-muted-foreground mr-2" />
                                  <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 mr-2">
                                    {getFileExtension(file.name)}
                                  </Badge>
                                  <span className="text-sm text-foreground">{file.name}</span>
                                </div>
                                <Button 
                                  type="button" 
                                  variant="ghost" 
                                  size="sm" 
                                  onClick={() => removeFile(index)}
                                  className="opacity-0 group-hover:opacity-100 text-destructive hover:text-destructive hover:bg-destructive/10"
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {/* Hidden field to store combined content */}
                      <input type="hidden" {...field} />
                    </div>
                    
                    <p className="text-xs text-muted-foreground mt-2">
                      Supports multiple files: .txt, .md, .js, .ts, .py, .java, .cs, .html, .css, .json, .docx, .pdf
                    </p>
                  </FormItem>
                )}
              />
              
              {/* No code language selection - AI will detect automatically */}
              
              {/* Experience Level Selection */}
              <FormField
                control={form.control}
                name="experienceLevel"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Experience level with this technology</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex items-center space-x-4"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="beginner" id="beginner" />
                          <Label htmlFor="beginner">Beginner</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="intermediate" id="intermediate" />
                          <Label htmlFor="intermediate">Intermediate</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="advanced" id="advanced" />
                          <Label htmlFor="advanced">Advanced</Label>
                        </div>
                      </RadioGroup>
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
          
          <CardFooter>
            <Button
              type="submit"
              className="w-full text-lg py-6 interactive-button relative overflow-hidden"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="animate-pulse flex items-center justify-center">
                  <div className="h-8 w-8 rounded-full border-t-2 border-b-2 border-white animate-spin absolute"></div>
                  <span className="pl-7">CLARIFYING...</span>
                </div>
              ) : (
                <>
                  <Bolt className="mr-2 h-5 w-5" />
                  CLARIFY
                </>
              )}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
