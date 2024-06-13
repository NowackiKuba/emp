import React from 'react';
import { Dialog, DialogContent } from '../ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { format } from 'date-fns';

interface Props extends TDialogProps {
  answers: TAnswer[];
}

const AnsweredDialog = ({ answers, open, setOpen }: Props) => {
  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        if (!v) {
          setOpen(v);
        }
      }}
    >
      <DialogContent className='flex flex-col gap-4 w-full max-w-sm'>
        {answers?.map((a, i) => (
          <div
            key={a.id}
            className={`${
              i + 1 === answers?.length ? '' : 'border-b border-gray-400'
            } py-4 flex items-center justify-between w-full`}
          >
            <Avatar className='h-12 w-12'>
              <AvatarImage
                src={a?.answered_by?.img_url}
                className='h-12 w-12 object-cover'
              />
              <AvatarFallback className='h-12 w-12'>
                <div className='flex items-center justify-center h-full w-full rounded-full bg-primary/10 text-primary dark:bg-red-500/20 dark:text-red-200 text-lg font-bold'>
                  {a.answered_by.first_name[0]}
                  {a.answered_by.last_name[0]}
                </div>
              </AvatarFallback>
            </Avatar>
            <p className='text-base font-semibold'>
              {a?.answered_by?.first_name} {a?.answered_by?.last_name}
            </p>
            <p className='text-sm text-gray-400'>
              {format(a.created_at || new Date(), 'dd.MM.yyyy, HH:mm')}
            </p>
          </div>
        ))}
      </DialogContent>
    </Dialog>
  );
};

export default AnsweredDialog;
