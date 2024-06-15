'use client';
import React, { useState } from 'react';
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
import { format, formatDate } from 'date-fns';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from './ui/tooltip';
import Link from 'next/link';
import WorkDialog from './dialogs/WorkDialog';

const UserButton = ({ user }: { user: TUser }) => {
  const { theme, setTheme } = useTheme();
  const [isOpenWorkDialog, setOpenWorkDialog] = useState(false);
  console.log(user);
  return (
    <div className='flex items-center gap-2'>
      {!user?.is_working && (
        <div className='px-1 py-0.5 text-xs rounded-sm bg-red-500 text-white'>
          Not Working
        </div>
      )}
      <>
        {user?.is_on_break ? (
          <div
            onClick={() => setOpenWorkDialog(true)}
            className='px-4 py-2 text-xs font-[500] flex flex-col items-start cursor-pointer rounded-sm bg-sky-500 text-white'
          >
            On Break
          </div>
        ) : user?.is_on_vacation ? (
          <div className='px-1 py-0.5 text-xs rounded-sm bg-yellow-500 text-white'>
            🏝️ Happy Vacation
          </div>
        ) : user?.is_working ? (
          <div
            onClick={() => setOpenWorkDialog(true)}
            className='px-4 py-2 text-xs font-[500] flex flex-col items-start cursor-pointer rounded-sm bg-green-500 text-white'
          >
            <p>Currently Working</p>
            <p>since {format(user?.work_start, 'dd.MM.yyyy')}</p>
          </div>
        ) : null}
      </>
      <DropdownMenu>
        <DropdownMenuTrigger>
          {user?.img_url === '' ? (
            <div className='h-12 w-12 rounded-md bg-primary border border-border text-white flex items-center justify-center text-xl font-bold'>
              {user?.first_name[0]}
              {user?.last_name[0]}
            </div>
          ) : (
            <Image
              alt='profile'
              src={user?.img_url}
              height={500}
              className='h-12 w-12 object-cover rounded-md'
              width={500}
            />
          )}
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <div className='py-4 flex items-center justify-center gap-2'>
            {user?.img_url === '' ? (
              <div className='h-12 w-12 rounded-md bg-primary border border-border flex items-center justify-center text-xl text-white font-bold'>
                {user?.first_name[0]}
                {user?.last_name[0]}
              </div>
            ) : (
              <Image
                alt='profile'
                src={user?.img_url}
                height={500}
                className='h-12 w-12 object-cover rounded-md'
                width={500}
              />
            )}
            <div className='flex flex-col items-start justify-start'>
              <p className='text-lg font-semibold'>
                {user?.first_name} {user?.last_name}
              </p>
            </div>
          </div>
          <DropdownMenuItem className='cursor-pointer'>
            <Link href={'/settings'} className='flex items-center gap-2 '>
              <Settings className='h-4 w-4' />
              <p>Settings</p>
            </Link>
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
          <DropdownMenuItem className='flex items-end gap-2 cursor-pointer'>
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
      <WorkDialog
        open={isOpenWorkDialog}
        setOpen={setOpenWorkDialog}
        user={user}
      />
    </div>
  );
};

export default UserButton;
