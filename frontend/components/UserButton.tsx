'use client';
import React from 'react';
import { Avatar } from './ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import Image from 'next/image';
import {
  Bookmark,
  CreditCard,
  LogOut,
  Moon,
  Settings,
  Ticket,
  Trash,
} from 'lucide-react';
import { Switch } from './ui/switch';
import { useTheme } from 'next-themes';

const UserButton = ({ user }: { user: TUser }) => {
  const { theme, setTheme } = useTheme();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        {user?.imgUrl === '' ? (
          <div className='h-12 w-12 rounded-md bg-primary border border-border text-white flex items-center justify-center text-xl font-bold'>
            {user?.firstName[0]}
            {user?.lastName[0]}
          </div>
        ) : (
          <Image
            alt='profile'
            src={user?.imgUrl}
            height={500}
            className='h-12 w-12 object-cover rounded-md'
            width={500}
          />
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <div className='py-4 flex items-center justify-center gap-2'>
          {user?.imgUrl === '' ? (
            <div className='h-12 w-12 rounded-md bg-primary border border-border flex items-center justify-center text-xl text-white font-bold'>
              {user?.firstName[0]}
              {user?.lastName[0]}
            </div>
          ) : (
            <Image
              alt='profile'
              src={user?.imgUrl}
              height={500}
              className='h-12 w-12 object-cover rounded-md'
              width={500}
            />
          )}
          <div className='flex flex-col items-start justify-start'>
            <p className='text-lg font-semibold'>
              {user?.firstName} {user?.lastName}
            </p>
            <p className='text-sm text-muted-foreground'>{user?.role}</p>
          </div>
        </div>
        <DropdownMenuItem className='flex items-center gap-2 cursor-pointer'>
          <Settings className='h-4 w-4' />
          <p>Settings</p>
        </DropdownMenuItem>
        <DropdownMenuItem className='flex items-center gap-2 cursor-pointer'>
          <Bookmark className='h-4 w-4' />
          <p>Saved</p>
        </DropdownMenuItem>
        <DropdownMenuItem className='flex items-center gap-2 cursor-pointer'>
          <CreditCard className='h-4 w-4' />
          <p>Billing Information</p>
        </DropdownMenuItem>
        <DropdownMenuItem className='flex items-center justify-between cursor-pointer'>
          <div className='flex items-center gap-2'>
            <Moon className='h-4 w-4' />
            <p>Dark Mode</p>
          </div>
          <Switch
            checked={theme === 'dark'}
            onCheckedChange={() => {
              if (theme === 'dark') {
                setTheme('light');
              } else {
                setTheme('dark');
              }
            }}
          />
        </DropdownMenuItem>
        <DropdownMenuItem className='flex items-center gap-2 cursor-pointer'>
          <Ticket className='h-4 w-4' />
          <p>Subscription</p>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem className='flex items-center gap-2 cursor-pointer text-red-500'>
          <LogOut className='h-4 w-4' />
          <p>Logout</p>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserButton;
