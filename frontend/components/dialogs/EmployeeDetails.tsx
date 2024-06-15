import React from 'react';
import { Dialog, DialogContent } from '../ui/dialog';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { Briefcase, Star } from 'lucide-react';
import EmployeeTasksCard from '../cards/EmployeeTasksCard';
import EmployeeWorkHistoryCard from '../cards/EmployeeWorkHistoryCard';
import EmployeeAnsweredCard from '../cards/EmployeeAnsweredCard';

interface Props extends TDialogProps {
  user: TUser;
}

const EmployeeDetails = ({ user, open, setOpen }: Props) => {
  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        if (!v) {
          setOpen(v);
        }
      }}
    >
      <DialogContent className='flex flex-col gap-4 w-full max-w-3xl xl:max-h-[770px] overflow-y-auto'>
        <div className='w-full flex items-center gap-2 px-3 py-4 bg-secondary rounded-xl'>
          <Avatar className='rounded-md h-44 w-44'>
            <AvatarFallback className='h-44 w-44'>
              <div className='h-44 w-44 rounded-md flex items-center justify-center text-7xl font-bold bg-primary/10 text-primary dark:bg-red-500/20 dark:text-red-200'>
                {user?.first_name[0] + user?.last_name[0]}
              </div>
            </AvatarFallback>
          </Avatar>
          <div className='flex flex-col items-start gap-2'>
            <p className='text-4xl font-semibold'>
              {user?.first_name} {user?.last_name}
            </p>
            <p className='text-lg text-gray-400'>{user?.email}</p>
            <div className='flex text-sm items-center gap-2 text-gray-400'>
              <Briefcase className='h-4 w-4 text-gray-400' />
              <p>{user?.position}</p>
            </div>
            <div className='flex text-sm items-center gap-2 text-gray-400'>
              <Star className='h-4 w-4 text-gray-400' />
              <p>{user?.role.toLowerCase()}</p>
            </div>
          </div>
        </div>
        <div className='flex items-center gap-2 w-full'>
          <EmployeeTasksCard userId={user?.id} />
          <EmployeeWorkHistoryCard userId={user?.id} />
        </div>
        <div className='flex items-center gap-2 w-full'>
          <EmployeeAnsweredCard userId={user?.id} type='survey' />
          <EmployeeAnsweredCard userId={user?.id} type='poll' />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EmployeeDetails;
