'use client';
import React from 'react';
import { Dialog, DialogContent } from '../ui/dialog';
import { Button } from '../ui/button';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { startWork } from '@/actions/user.actions';
import { toast } from '../ui/use-toast';
import { Loader2 } from 'lucide-react';

interface Props extends TDialogProps {
  userId: number;
  full_name: string;
}

const StartWorkDialog = ({ open, setOpen, userId, full_name }: Props) => {
  const queryClient = useQueryClient();
  const { mutate: startWorkMutation, isPending: isStartingWork } = useMutation({
    mutationKey: ['startWork'],
    mutationFn: startWork,
    onSuccess: () => {
      toast({
        title: 'Successfully started work',
        duration: 1500,
      });
      queryClient.invalidateQueries({
        queryKey: ['getCurrentUser'],
        refetchType: 'all',
      });
      setOpen(false);
    },
    onError: () => {
      toast({
        title: 'Failed to start work',
        description: 'Please try again later',
        variant: 'destructive',
        duration: 1500,
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
        <div className='flex flex-col'>
          <p className='text-xl font-semibold'>Hello, {full_name}</p>
          <p className='text-sm dark:text-gray-400'>
            You have not started your work yet! Please to do this do correctly
            measure your experience
          </p>
        </div>
        <div>
          <Button
            disabled={isStartingWork}
            onClick={() => {
              startWorkMutation({
                userId,
              });
            }}
          >
            {isStartingWork ? (
              <div className='flex items-center gap-1'>
                <Loader2 className='h-4 w-4 animate-spin' />
                <p>Start Work</p>
              </div>
            ) : (
              'Start Work'
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default StartWorkDialog;
