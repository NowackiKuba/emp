import React from 'react';
import { Dialog, DialogContent } from '../ui/dialog';
import { differenceInHours, formatDistanceToNow } from 'date-fns';
import { CircleOff, OctagonPause, StopCircle } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { endWork, manageBreak } from '@/actions/user.actions';
import { toast } from '../ui/use-toast';

interface Props extends TDialogProps {
  user: TUser;
}

const WorkDialog = ({ user, open, setOpen }: Props) => {
  const calculatedWorkTime = user?.work_start
    ? differenceInHours(new Date(user?.work_start), new Date())
    : 'Not working';
  const queryClient = useQueryClient();
  const { mutate: endWorkMutation } = useMutation({
    mutationKey: ['endWork'],
    mutationFn: endWork,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['getCurrentUser'],
        refetchType: 'all',
      });
      toast({
        title: 'Successfullly ended work',
        duration: 1500,
      });
    },
    onError: () => {
      toast({
        title: 'Failed to end work',
        duration: 1500,
        variant: 'destructive',
      });
    },
  });
  const { mutate: manageBreakMutation } = useMutation({
    mutationKey: ['manageBreak'],
    mutationFn: manageBreak,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['getCurrentUser'],
        refetchType: 'all',
      });
      toast({
        title: 'Successfullly updated break status',
        duration: 1500,
      });
    },
    onError: () => {
      toast({
        title: 'Failed to update break status',
        duration: 1500,
        variant: 'destructive',
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
        <p className='text-xl font-semibold'>Actions</p>
        <div className='flex items-center gap-2 w-full'>
          <div
            onClick={() => {
              endWorkMutation({
                hours:
                  +calculatedWorkTime < 0
                    ? +calculatedWorkTime * -1
                    : +calculatedWorkTime,
                userId: user?.id!,
              });
            }}
            className='w-full gap-2 border-border border rounded-xl group h-52 flex flex-col items-center justify-center'
          >
            <div className='h-24 w-24 flex items-center justify-center bg-primary/10 text-primary dark:bg-red-500/20 dark:text-red-200 rounded-full'>
              <CircleOff className='h-12 w-12' />
            </div>
            <p className='font-semibold'>End Work</p>
          </div>
          <div className='w-full border-border border rounded-xl h-52 flex flex-col items-center justify-center'>
            <div
              onClick={() => {
                manageBreakMutation({
                  id: user?.id!,
                  isOnBreak: !user?.is_on_break,
                });
              }}
              className='w-full gap-2 border-border border rounded-xl group h-52 flex flex-col items-center justify-center'
            >
              <div className='h-24 w-24 flex items-center justify-center bg-primary/10 text-primary dark:bg-red-500/20 dark:text-red-200 rounded-full'>
                <OctagonPause className='h-12 w-12' />
              </div>

              <p className='font-semibold'>
                {user?.is_on_break ? 'Stop a break' : 'Take a break'}
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default WorkDialog;
