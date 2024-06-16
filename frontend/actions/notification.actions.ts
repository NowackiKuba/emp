'use server';

import axios from 'axios';

export const readNotification = async ({
  notificationId,
}: {
  notificationId: number;
}) => {
  const res = await axios(
    `http://localhost:8080/read/notifications/${notificationId}`,
    {
      method: 'PATCH',
      data: {
        id: notificationId,
      },
    }
  );
};

export const deleteNotification = async ({
  notificationId,
}: {
  notificationId: number;
}) => {
  const res = await axios(
    `http://localhost:8080/notification/${notificationId}`,
    { method: 'DELETE' }
  );
};
