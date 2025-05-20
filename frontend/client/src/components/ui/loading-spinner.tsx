interface LoadingSpinnerProps {
  message?: string;
  submessage?: string;
}

export default function LoadingSpinner({ message = "Loading...", submessage }: LoadingSpinnerProps) {
  return (
    <div className="flex flex-col items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      <p className="mt-4 text-sm text-gray-500">{message}</p>
      {submessage && (
        <div className="mt-2 max-w-xl text-xs text-gray-400 text-center">
          {submessage}
        </div>
      )}
    </div>
  );
}
