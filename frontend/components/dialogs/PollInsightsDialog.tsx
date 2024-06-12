import React from 'react';
import { Dialog, DialogContent } from '../ui/dialog';
import { Label } from '../ui/label';
import { useQuery } from '@tanstack/react-query';
import { getPollAnswers } from '@/actions/poll.actions';
import { getPollChartData } from '@/lib/utils';
import PollInsightsChart from '../charts/PollInsightsChart';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table';
import { TableHeaderCell } from '@tremor/react';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { format } from 'date-fns';

interface Props extends TDialogProps {
  poll: TPoll;
  answers: TAnswer[];
}

const PollInsightsDialog = ({ poll, setOpen, open, answers }: Props) => {
  const chartData = getPollChartData(answers || []);
  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        if (!v) {
          setOpen(v);
        }
      }}
    >
      <DialogContent className='flex flex-col gap-4 w-full max-w-2xl xl:max-h-[750px] overflow-y-auto'>
        <div className='flex flex-col gap-2 w-full'>
          <p className='text-2xl font-semibold'>{poll?.title}</p>
        </div>
        <div className='flex flex-col w-full gap-3'>
          {poll.questions.map((q, i) => (
            <div
              key={i}
              className={`flex items-center justify-between w-full border py-4 px-3 `}
            >
              <div className='flex items-center gap-2'>
                <Label htmlFor={q}>{q}</Label>
              </div>
              <p>{q === 'TAK' ? '66%' : '33%'}</p>
            </div>
          ))}
        </div>
        <PollInsightsChart chartdata={chartData} />
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className='w-[100px]'></TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Answered At</TableHead>
              <TableHead>Answer</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {answers?.map((a) => (
              <TableRow key={a.id}>
                <TableCell>
                  <Avatar className='h-12 w-12 rounded-md'>
                    <AvatarImage
                      src={a.answered_by.img_url}
                      className='h-12 w-12 rounded-md object-cover'
                    />
                    <AvatarFallback className='h-12 w-12 rounded-md'>
                      <div className='h-full w-full bg-primary/10 text-primary dark:bg-red-500/20 dark:text-red-200 flex items-center justify-center text-xl font-bold'>
                        {a.answered_by.first_name[0]}
                        {a.answered_by.last_name[0]}
                      </div>
                    </AvatarFallback>
                  </Avatar>
                </TableCell>
                <TableCell>
                  {a.answered_by.first_name} {a.answered_by.last_name}
                </TableCell>
                <TableCell>{a.answered_by.email}</TableCell>
                <TableCell>
                  {format(a.created_at || new Date(), 'dd.MM.yyyy, HH:mm')}
                </TableCell>
                <TableCell>{a.answer}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </DialogContent>
    </Dialog>
  );
};

export default PollInsightsDialog;
