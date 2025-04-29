interface LoadingSpinnerProps {
  text?: string;
  className?: string;
}

export default function LoadingSpinner({ text = 'Loading...', className = '' }: LoadingSpinnerProps) {
  return (
    <div className={`flex items-center justify-center w-full h-full flex-col gap-2 ${className}`}>
      <div 
        role="status"
        className={`animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 ${className}`}
        aria-label={text}
      />
      <span className="text-gray-600">{text}</span>
    </div>
  );
}