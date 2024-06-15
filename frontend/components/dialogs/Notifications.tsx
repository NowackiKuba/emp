'use client';
import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent } from '../ui/dialog';
import { useQuery } from '@tanstack/react-query';
import { getUserNotifications } from '@/actions/user.actions';
import { Bell, ChevronRight } from 'lucide-react';
import { format } from 'date-fns';
import { Button } from '../ui/button';

interface Props extends TDialogProps {
  notification: TNotification;
}

const Notifications = ({ open, setOpen, notification }: Props) => {
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
          <p className='text-xl font-semibold'>{notification?.title}</p>
          <p className='text-sm text-gray-400'>
            {format(notification?.created_at || new Date(), 'dd.MM.yyyy')}
          </p>
        </div>
        <div className='p-2.5 w-full rounded-xl bg-secondary italic'>
          {notification?.message}
        </div>
        <div className='flex items-center gap-2'>
          <Button
            variant={'p-outline'}
            className='w-full'
            onClick={() => setOpen(false)}
          >
            Close
          </Button>
          <Button className='w-full' onClick={() => {}}>
            Delete
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default Notifications;
