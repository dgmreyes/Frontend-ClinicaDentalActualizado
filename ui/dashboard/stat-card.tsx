import { ReactNode } from 'react';

interface Props {
  title: string;
  value: string | number;
  icon: ReactNode;
  color: 'blue' | 'green' | 'orange' | 'purple';
  description?: string;
}

export default function StatCard({ title, value, icon, color, description }: Props) {
  
  const colors = {
    blue: 'bg-blue-50 text-blue-600 border-blue-200',
    green: 'bg-green-50 text-green-600 border-green-200',
    orange: 'bg-orange-50 text-orange-600 border-orange-200',
    purple: 'bg-purple-50 text-purple-600 border-purple-200',
  };

  return (
    <div className={`p-6 rounded-2xl border ${colors[color]} shadow-sm transition-transform hover:scale-105`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-700">{title}</h3>
        <div className={`p-2 rounded-lg bg-white/60`}>
          {icon}
        </div>
      </div>
      <div className="text-3xl font-bold text-gray-800 mb-1">{value}</div>
      {description && (
        <p className="text-xs font-medium opacity-80">{description}</p>
      )}
    </div>
  );
}