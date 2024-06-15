'use client';
import { settingsLinks } from '@/constants';
import { useUser } from '@/hooks/useUser';
import React, { useEffect, useState } from 'react';
import { Input } from '../ui/input';
import { UploadDropzone } from '@/utils/uploadthing';
import { Button } from '../ui/button';

type TView = 'profile' | 'security' | 'company' | 'danger';

const SettingsPage = () => {
  const { user } = useUser();
  const [view, setView] = useState<TView>('profile');
  const [firstName, setFirstName] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [imageUrl, setImageUrl] = useState<string>('');

  useEffect(() => {
    if (!user) return;
    setFirstName(user.first_name);
    setLastName(user.last_name);
    setEmail(user.email);
    setImageUrl(user.img_url);
  }, [user]);
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

        <div className='flex flex-col items-start justify-start gap-4 w-full max-w-[650px] rounded-xl px-4 pt-4 pb-2 bg-secondary'>
          <p className='text-2xl font-semibold first-letter:uppercase'>
            {view}
          </p>
          {view === 'profile' ? (
            <div className='flex flex-col gap-2 w-full'>
              <div className='py-3 pb-5 w-full'>
                <UploadDropzone
                  endpoint='imageUploader'
                  appearance={{
                    container:
                      'w-64 h-64 border border-dashed border-gray-400 mt-0',
                  }}
                />
              </div>
              <div className='flex items-center gap-2 w-full'>
                <p className='w-[150px]'>First Name</p>
                <Input
                  className='w-full'
                  defaultValue={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                />
              </div>
              <div className='flex items-center gap-2 w-full'>
                <p className='w-[150px]'>Last Name</p>
                <Input
                  className='w-full'
                  defaultValue={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                />
              </div>
              <div className='flex items-center gap-2 w-full'>
                <p className='w-[150px]'>Email</p>
                <Input
                  className='w-full'
                  defaultValue={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className='pt-3'>
                <Button>Save Changes</Button>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
