import { BookOpenCheck } from 'lucide-react';
import { cn } from '@/lib/utils';

export function Logo({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'flex items-center justify-center h-12 w-12 bg-primary/10 rounded-lg',
        className
      )}
    >
      <BookOpenCheck className="h-6 w-6 text-primary" />
    </div>
  );
}
