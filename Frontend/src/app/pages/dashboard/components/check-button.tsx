import { FiCheck } from 'react-icons/fi';
import { cn } from '@/lib/utils';

interface CheckButtonProps {
  onClick?: () => void;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const CheckButton = ({ onClick, className, size = 'md' }: CheckButtonProps) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12', 
    lg: 'w-16 h-16'
  };

  const iconSizes = {
    sm: 16,
    md: 20,
    lg: 24
  };

  return (
    <button
      onClick={onClick}
      className={cn(
        'rounded-full bg-card border border-border/50 shadow-card hover:shadow-card-hover',
        'flex items-center justify-center transition-all duration-200',
        'hover:scale-105 active:scale-95',
        sizeClasses[size],
        className
      )}
    >
      <FiCheck 
        size={iconSizes[size]} 
        className="text-dashboard-teal stroke-2" 
      />
    </button>
  );
};