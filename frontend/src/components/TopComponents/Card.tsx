import { ReactNode } from 'react';
import { LucideIcon } from 'lucide-react';

interface CardProps {
  title: string;
  icon: LucideIcon;
  children: ReactNode;
}

export function Card({ title, icon: Icon, children }: CardProps) {
  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      <div className="bg-[#636AE8] p-4 flex items-center gap-2">
        <Icon className="w-6 h-6 text-white" />
        <h2 className="text-xl font-semibold text-white">{title}</h2>
      </div>
      <div className="p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {children}
        </div>
      </div>
    </div>
  );
}