import React from 'react';
import { Dialog, DialogContent } from '../ui/dialog';
import { getPriorityProps } from '@/lib/utils';
import { format } from 'date-fns';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';

interface Props extends DialogProps {
  task: Task;
}

const TaskDetails = ({ open, setOpen, task }: Props) => {
  const { bg, icon, text, textColor } = getPriorityProps(task?.priority);
  const Icon = icon;
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
        <div className='flex items-start gap-2'>
          <div
            className={`${bg} flex items-center justify-center h-24 w-24 rounded-xl`}
          >
            <Icon className='h-12 w-12' />
          </div>
          <div className='flex flex-col gap-1'>
            <p className='text-2xl font-semibold'>{task?.title}</p>
            <div className='text-gray-400 dark:text-gray-600 flex items-center gap-1'>
              To:{' '}
              <div className='flex items-center gap-0.5'>
                <Avatar className='h-8 w-8'>
                  <AvatarImage src={task?.assigned_to?.img_url} />
                  <AvatarFallback className='h-8 w-8'>
                    <div className='flex items-center justify-center h-8 w-8 rounded-full text-sm font-semibold bg-primary/10 text-primary dark:bg-red-500/20 dark:text-red-200'>
                      {task?.assigned_to.first_name[0]}
                      {task?.assigned_to.last_name[0]}
                    </div>
                  </AvatarFallback>
                </Avatar>
                <span className='font-[500]'>
                  {task?.assigned_to.first_name} {task?.assigned_to.last_name}
                </span>
                <p>, by</p>
                <Avatar className='h-8 w-8'>
                  <AvatarImage src={task?.assigned_by?.img_url} />
                  <AvatarFallback className='h-8 w-8'>
                    <div className='flex items-center justify-center h-8 w-8 rounded-full text-sm font-semibold bg-primary/10 text-primary dark:bg-red-500/20 dark:text-red-200'>
                      {task?.assigned_by.first_name[0]}
                      {task?.assigned_by.last_name[0]}
                    </div>
                  </AvatarFallback>
                </Avatar>
                <span className='font-[500]'>
                  {task?.assigned_by.first_name} {task?.assigned_by.last_name}
                </span>
              </div>
            </div>
            <p className='text-gray-400 dark:text-gray-600'>
              Deadline: {format(task?.deadline || new Date(), 'dd.MM.yyyy')}
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TaskDetails;
