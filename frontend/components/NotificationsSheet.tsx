import React, { useEffect, useState } from 'react';
import { Sheet, SheetContent } from './ui/sheet';
import { getUserNotifications } from '@/actions/user.actions';
import { Bell, ChevronRight } from 'lucide-react';
import Notifications from './dialogs/Notifications';
import { useNotifications } from '@/hooks/useNotifications';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { readNotification } from '@/actions/notification.actions';
import { toast } from './ui/use-toast';

interface Props extends TDialogProps {
  user: TUser;
}

const NotificationsSheet = ({ open, setOpen, user }: Props) => {
  const [isOpenDetails, setIsOpenDetails] = useState(false);
  const { notifications, isLoading } = useNotifications({ userId: user?.id! });
  const [selectedNotification, setSelectedNotification] =
    useState<TNotification>();
  const queryClient = useQueryClient();
  const { mutate: readNotificationMutation, isPending: isReading } =
    useMutation({
      mutationKey: ['readNotification'],
      mutationFn: readNotification,
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ['getUserNotifications', { userId: user?.id! }],
          refetchType: 'all',
        });
      },
    });

  if (isLoading) {
    return <p>...loading</p>;
  }

  const unreadNotifications = notifications?.filter((n) => !n.is_read);
  return (
    <Sheet
      open={open}
      onOpenChange={(v) => {
        if (!v) {
          setOpen(v);
        }
      }}
    >
      <SheetContent className='flex flex-col gap-4 w-full '>
        <div className='flex items-center gap-2'>
          <p className='text-xl font-semibold'>Notifications</p>
          {unreadNotifications?.length && (
            <div className='h-5 w-5 rounded-full flex items-center justify-center text-xs font-semibold bg-red-500 text-white'>
              {unreadNotifications.length}
            </div>
          )}
        </div>
        {notifications?.map((n) => (
          <div
            onClick={() => {
              setSelectedNotification(n);
              setIsOpenDetails(true);
              readNotificationMutation({ notificationId: n.id });
            }}
            key={n.id}
            className='w-full bg-secondary cursor-pointer flex items-center justify-between rounded-xl p-2'
          >
            <div className='flex items-center gap-2'>
              <div className='flex items-center rounded-xl justify-center bg-yellow-500/10 dark:bg-yellow-500/20 text-yellow-500 dark:text-yellow-200 h-16 w-16'>
                <Bell className='h-6 w-6' />
              </div>
              <div className='flex flex-col'>
                <div className='flex items-center gap-2'>
                  <p className='text-lg font-semibold'>{n?.title}</p>
                  {!n.is_read && (
                    <div className='h-3.5 w-3.5 bg-blue-500 rounded-full' />
                  )}
                </div>
                <p className='text-sm text-gray-400 max-w-[200px] truncate'>
                  {n?.message}
                </p>
              </div>
            </div>
            <ChevronRight className='h-5 w-5' />
          </div>
        ))}
      </SheetContent>
      <Notifications
        open={isOpenDetails}
        setOpen={setIsOpenDetails}
        notification={selectedNotification!}
      />
    </Sheet>
  );
};

export default NotificationsSheet;
