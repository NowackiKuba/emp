import React from 'react';
import { Dialog, DialogContent } from '../ui/dialog';
import { format } from 'date-fns';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../ui/tooltip';
import { Button } from '../ui/button';

interface Props extends TDialogProps {
  pto: TPTO;
}

const PTODetails = ({ open, setOpen, pto }: Props) => {
  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        if (!v) {
          setOpen(v);
        }
      }}
    >
      <DialogContent className='flex flex-col gap-4 w-full'>
        <div className='flex flex-col gap-0.5'>
          <div className='flex items-center gap-1'>
            <p className='text-xl font-semibold'>
              {pto?.send_by?.first_name} {pto?.send_by?.last_name}&apos;s PTO
              Request
            </p>
            <TooltipProvider>
              <Tooltip delayDuration={200}>
                <TooltipTrigger>
                  <div
                    className={`h-4 w-4 rounded-full ${
                      pto?.status === 'ASSIGNED'
                        ? 'bg-orange-500 animate-pulse'
                        : pto?.status === 'ACCEPTED'
                        ? 'bg-green-500'
                        : 'bg-red-500'
                    }`}
                  />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Status: {pto.status}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <p>
            {format(pto.start_date, 'dd.MM.yyyy')} -{' '}
            {format(pto.end_date, 'dd.MM.yyyy')}
          </p>
        </div>
        <div className='bg-secondary p-4 rounded-xl w-full'>
          <p className='text-lg font-semibold'>{pto?.title}</p>
          <div className='bg-neutral-900 w-full rounded-xl p-2 flex flex-col gap-1'>
            <p className='italic text-gray-400'>{pto?.description}</p>
            <div className='flex justify-end w-full text-sm text-gray-400'>
              {format(pto?.created_at, 'dd.MM.yyyy,')} at{' '}
              {format(pto?.created_at, 'HH:mm')}
            </div>
          </div>
        </div>
        <div className='flex items-center gap-2'>
          <Button className='w-full' variant={'p-outline'}>
            Reject PTO
          </Button>
          <Button className='w-full'>Accept PTO</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PTODetails;
