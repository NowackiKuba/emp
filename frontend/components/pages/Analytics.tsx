import React from 'react';
import AnalyticsCard from '../cards/AnalyticsCard';
import { BarChart, FileText, NotepadText, Users } from 'lucide-react';

const Analytics = () => {
  return (
    <div className='flex flex-col gap-4 w-full'>
      <p className='text-2xl font-semibold'>Analytics</p>
      <div className='flex md:flex-row flex-col items-center gap-2 md:gap-4 w-full'>
        <AnalyticsCard icon={BarChart} title='Active Polls' value='2' />
        <AnalyticsCard icon={NotepadText} title='Active Surveys' value='4' />
        <AnalyticsCard icon={Users} title='Total Employees' value='24' />
        <AnalyticsCard icon={FileText} title="Active PTO's" value='0' />
      </div>
    </div>
  );
};

export default Analytics;
