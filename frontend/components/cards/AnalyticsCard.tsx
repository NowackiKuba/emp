import { LucideIcon } from 'lucide-react';
import React from 'react';

interface Props {
  icon: LucideIcon;
  title: string;
  value: string;
}

const AnalyticsCard = ({ icon, title, value }: Props) => {
  const Icon = icon;
  return (
    <div className='flex items-center gap-2 px-2 bg-secondary py-4 rounded-xl w-full'>
      <div className='h-16 w-16 rounded-full flex items-center justify-center bg-primary/10 text-primary dark:bg-red-500/20 dark:text-red-200'>
        <Icon className='h-8 w-8' />
      </div>
      <div className='flex flex-col'>
        <p className='text-sm text-gray-400 uppercase font-bold'>{title}</p>
        <p className='text-2xl font-bold'>{value}</p>
      </div>
    </div>
  );
};

export default AnalyticsCard;
