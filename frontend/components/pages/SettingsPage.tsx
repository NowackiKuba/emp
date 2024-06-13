'use client';
import { settingsLinks } from '@/constants';
import { useUser } from '@/hooks/useUser';
import React, { useState } from 'react';

type TView = 'profile' | 'security' | 'company' | 'danger';

const SettingsPage = () => {
  const { user } = useUser();
  const [view, setView] = useState<TView>('profile');
  return (
    <div className='flex items-start gap-10 w-full'>
      <div className='w-[17%] bg-secondary/40 rounded-xl p-4 flex flex-col items-start justify-start gap-2'>
        {settingsLinks.map((link) => {
          const Icon = link.icon;
          return (
            <div
              key={link.id}
              onClick={() => setView(link.view as TView)}
              className={`${
                link.view === 'company' && user?.role.toLowerCase() != 'admin'
                  ? 'hidden'
                  : 'flex'
              } items-center gap-2 p-2 w-full rounded-xl cursor-pointer ${
                view === link.view
                  ? 'bg-primary text-white'
                  : 'hover:bg-primary/10 hover:text-primary dark:hover:bg-red-500/20 dark:hover:text-red-200 duration-100 ease-linear'
              } ${link?.specialClass}`}
            >
              <Icon />
              <p>{link.name}</p>
            </div>
          );
        })}
      </div>
      <div className='flex flex-col gap-4 w-full'>
        <p className='text-4xl font-semibold '>Settings</p>

        <div className='flex flex-col items-start justify-start gap-4 w-full max-w-[650px] rounded-xl p-4 bg-secondary'>
          <p className='text-2xl font-semibold first-letter:uppercase'>
            {view}
          </p>
          {view === 'profile' ? (
            <div className='flex flex-col gap-2 w-full'>
              <div className=''></div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;