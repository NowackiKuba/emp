'use server';

import axios from 'axios';

export const readNotification = async ({
  notificationId,
}: {
  notificationId: number;
}) => {
  const res = await axios(
    `http://localhost:8080/read/notifications/${notificationId}`,
    { method: 'PATCH' }
  );
};
