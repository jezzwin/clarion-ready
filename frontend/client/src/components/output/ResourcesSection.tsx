import { BookOpen, ArrowRight } from "lucide-react";
import ResourceCard from "@/components/ui/resource-card";

interface ResourcesSectionProps {
  description: string;
  items: {
    type: string;
    title: string;
    description: string;
    duration?: string;
    icon: string;
  }[];
}

export default function ResourcesSection({ description, items }: ResourcesSectionProps) {
  return (
    <div className="px-4 py-5 sm:px-6">
      <div className="flex items-start">
        <div className="flex-shrink-0 mt-1">
          <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center">
            <BookOpen className="h-5 w-5 text-purple-600" />
          </div>
        </div>
        <div className="ml-4 flex-1">
          <h4 className="text-lg font-medium text-gray-900">Curated Resources</h4>
          <div className="mt-2 text-sm text-gray-500">
            <p>{description}</p>
            
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              {items.map((item, index) => (
                <ResourceCard
                  key={index}
                  type={item.type}
                  title={item.title}
                  description={item.description}
                  duration={item.duration}
                  icon={item.icon}
                />
              ))}
            </div>
            
            <div className="mt-4">
              <a href="#" className="text-primary-600 text-xs font-medium hover:text-primary-700 flex items-center">
                View all {items.length + 5} related resources 
                <ArrowRight className="ml-1 h-3 w-3" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
