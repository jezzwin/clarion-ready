import { CheckCircle } from "lucide-react";

interface TaskSummaryProps {
  description: string;
  steps: string[];
}

export default function TaskSummary({ description, steps }: TaskSummaryProps) {
  return (
    <div className="px-4 py-5 sm:px-6">
      <div className="flex items-start">
        <div className="flex-shrink-0 mt-1">
          <div className="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center">
            <CheckCircle className="h-5 w-5 text-primary-600" />
          </div>
        </div>
        <div className="ml-4 flex-1">
          <h4 className="text-lg font-medium text-gray-900">Task Summary</h4>
          <div className="mt-2 text-sm text-gray-500">
            <p>{description}</p>
            <ul className="list-disc list-inside mt-2 space-y-1">
              {steps.map((step, index) => (
                <li key={index}>{step}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
