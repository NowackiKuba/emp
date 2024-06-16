'use client';
import { settingsLinks } from '@/constants';
import { useUser } from '@/hooks/useUser';
import React, { useEffect, useState } from 'react';
import { Input } from '../ui/input';
import { UploadDropzone } from '@/utils/uploadthing';
import { Button } from '../ui/button';
import { useMutation } from '@tanstack/react-query';
import { editEmployee } from '@/actions/user.actions';
import { toast } from '../ui/use-toast';
import { Loader2 } from 'lucide-react';
import CompanySettings from '../cards/CompanySettings';

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

  const { mutate: updateUser, isPending: isUpdating } = useMutation({
    mutationKey: ['updateUser'],
    mutationFn: editEmployee,
    onSuccess: () => {
      toast({
        title: 'Successfully updated data',
        duration: 1500,
      });
    },
    onError: () => {
      toast({
        title: 'An error occured while updating data',
        description: 'Please try again',
        duration: 1500,
        variant: 'destructive',
      });
    },
  });
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

        <div className='flex flex-col items-start justify-start gap-4 w-full max-w-[750px] xl:max-h-[650px] overflow-y-auto rounded-xl px-4 pt-4 pb-2 bg-secondary'>
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
                <Button
                  onClick={() =>
                    updateUser({
                      email,
                      firstName,
                      lastName,
                      image: imageUrl,
                      position: user?.position!,
                      id: user?.id!,
                      password: user?.password!,
                      role: user?.role!,
                    })
                  }
                  disabled={isUpdating}
                >
                  {isUpdating ? (
                    <div className='flex items-center gap-1'>
                      <Loader2 className='h-4 w-4 animate-spin' />
                      <p>Save Changes</p>
                    </div>
                  ) : (
                    'Save Changes'
                  )}
                </Button>
              </div>
            </div>
          ) : null}
          {view === 'company' ? <CompanySettings /> : null}
          {view === 'danger' ? (
            <div className='flex flex-col gap-6 w-full'>
              <div className='flex flex-col w-full gap-2'>
                <p className='text-xl font-semibold'>Delete your account</p>
                <p className='text-sm text-gray-400'>
                  Account deletion is permanent and cannot be undone, resulting
                  in the loss of all data and access.
                </p>
              </div>
              <div className='w-full flex justify-start'>
                <Button variant={'destructive'}>Delete Account</Button>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
