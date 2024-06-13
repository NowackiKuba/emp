import React from 'react';
import { Dialog, DialogContent } from '../ui/dialog';
import { differenceInHours, formatDistanceToNow } from 'date-fns';
import { StopCircle } from 'lucide-react';
import { useMutation } from '@tanstack/react-query';
import { endWork } from '@/actions/user.actions';
import { toast } from '../ui/use-toast';

interface Props extends TDialogProps {
  user: TUser;
}

const WorkDialog = ({ user, open, setOpen }: Props) => {
  const calculatedWorkTime = user?.work_start
    ? differenceInHours(new Date(user?.work_start), new Date())
    : 'Not working';

  const { mutate: endWorkMutation } = useMutation({
    mutationKey: ['endWork'],
    mutationFn: endWork,
    onSuccess: () => {
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
            className='w-full border-border border rounded-xl h-52 flex flex-col items-center justify-center'
          >
            <StopCircle className='h-24 w-24' />
          </div>
          <div className='w-full border-border border rounded-xl h-52 flex flex-col items-center justify-center'></div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default WorkDialog;
