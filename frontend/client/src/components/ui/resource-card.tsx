import { Book, Video, FileText, GraduationCap, ShieldCheck } from "lucide-react";

interface ResourceCardProps {
  type: string;
  title: string;
  description: string;
  duration?: string;
  icon: string;
}

export default function ResourceCard({ type, title, description, duration, icon }: ResourceCardProps) {
  // Determine the icon component based on the icon string
  const getIconComponent = () => {
    switch (icon.toLowerCase()) {
      case 'video':
        return <Video className="h-10 w-10 text-gray-500" />;
      case 'book':
        return <Book className="h-10 w-10 text-gray-500" />;
      case 'file-alt':
      case 'file':
        return <FileText className="h-10 w-10 text-gray-500" />;
      case 'graduation-cap':
        return <GraduationCap className="h-10 w-10 text-gray-500" />;
      case 'shield-alt':
        return <ShieldCheck className="h-10 w-10 text-gray-500" />;
      default:
        return <FileText className="h-10 w-10 text-gray-500" />;
    }
  };
  
  // Determine the badge color based on resource type
  const getTypeBadgeClasses = () => {
    switch (type.toLowerCase()) {
      case 'video':
        return 'text-primary-600';
      case 'article':
        return 'text-blue-600';
      case 'document':
      case 'internal':
        return 'text-green-600';
      case 'tutorial':
        return 'text-purple-600';
      default:
        return 'text-gray-600';
    }
  };
  
  return (
    <div className="border border-gray-200 rounded-md overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      <div className="h-32 bg-gray-200 relative flex items-center justify-center">
        <div className="absolute inset-0 flex items-center justify-center text-gray-500">
          {getIconComponent()}
        </div>
      </div>
      <div className="p-3">
        <span className={`text-xs font-medium ${getTypeBadgeClasses()}`}>
          {duration ? `${type.charAt(0).toUpperCase() + type.slice(1)} • ${duration}` : type.charAt(0).toUpperCase() + type.slice(1)}
        </span>
        <h5 className="font-medium text-gray-800 mt-1">{title}</h5>
        <p className="text-xs text-gray-500 mt-1">{description}</p>
      </div>
    </div>
  );
}
