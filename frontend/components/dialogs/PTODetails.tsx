'use client';
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
import { useMutation } from '@tanstack/react-query';
import { answerPTO } from '@/actions/pto.actions';
import { toast } from '../ui/use-toast';
import { Loader2 } from 'lucide-react';

interface Props extends TDialogProps {
  pto: TPTO;
}

const PTODetails = ({ open, setOpen, pto }: Props) => {
  const { mutate: answer, isPending: isAnswering } = useMutation({
    mutationKey: ['answerPTO', { ptoId: pto?.id }],
    mutationFn: answerPTO,
    onSuccess: () => {
      setOpen(false);
      toast({
        title: 'PTO request answered',
        duration: 1500,
      });
    },
    onError: () => {
      toast({
        title: 'Failed to answer PTO request',
        duration: 1500,
        variant: 'destructive',
        description: 'Please try again later',
      });
    },
  });
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
                  <p>Status: {pto?.status}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <p>
            {format(pto?.start_date || new Date(), 'dd.MM.yyyy')} -{' '}
            {format(pto?.end_date || new Date(), 'dd.MM.yyyy')}
          </p>
        </div>
        <div className='bg-secondary p-4 rounded-xl w-full'>
          <p className='text-lg font-semibold'>{pto?.title}</p>
          <div className='dark:bg-neutral-900 bg-gray-300 w-full rounded-xl p-2 flex flex-col gap-1'>
            <p className='italic dark:text-gray-400 text-zinc-700'>
              {pto?.description}
            </p>
            <div className='flex justify-end w-full text-sm dark:text-gray-400 text-zinc-700'>
              {format(pto?.created_at || new Date(), 'dd.MM.yyyy,')} at{' '}
              {format(pto?.created_at || new Date(), 'HH:mm')}
            </div>
          </div>
        </div>
        <div className='flex items-center gap-2'>
          <Button
            className='w-full'
            variant={'p-outline'}
            onClick={() => {
              answer({
                ptoId: pto?.id!,
                decision: 'REJECTED',
                userId: pto?.send_by_id!,
              });
            }}
            disabled={isAnswering || pto?.status !== 'ASSIGNED'}
          >
            {isAnswering ? (
              <div className='flex items-center gap-1'>
                <Loader2 className='h-4 w-4 animate-spin' />
                <p>Reject PTO</p>
              </div>
            ) : (
              'Reject PTO'
            )}
          </Button>
          <Button
            className='w-full'
            onClick={() => {
              answer({
                ptoId: pto?.id!,
                decision: 'ACCEPTED',
                userId: pto?.send_by_id!,
              });
            }}
            disabled={isAnswering || pto?.status !== 'ASSIGNED'}
          >
            {isAnswering ? (
              <div className='flex items-center gap-1'>
                <Loader2 className='h-4 w-4 animate-spin' />
                <p>Accept PTO</p>
              </div>
            ) : (
              'Accept PTO'
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PTODetails;
