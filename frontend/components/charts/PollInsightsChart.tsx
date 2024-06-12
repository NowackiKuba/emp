import React from 'react';
import { BarChart } from '@tremor/react';

const PollInsightsChart = ({ chartdata }: { chartdata: any[] }) => {
  return (
    <div>
      <BarChart
        data={chartdata}
        index='name'
        categories={['answers']}
        className='w-full h-72'
        colors={['red']}
        yAxisWidth={48}
        onValueChange={(v) => console.log(v)}
      />
    </div>
  );
};

export default PollInsightsChart;
