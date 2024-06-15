'use client';
import React, { useEffect, useState } from 'react';
import { Sheet, SheetContent, SheetTrigger } from '../ui/sheet';
import { Menu } from 'lucide-react';
import Image from 'next/image';
import { navLinks, settingsLinks } from '@/constants';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const MobileNav = ({ user }: { user: TUser }) => {
  const pathname = usePathname();
  const [targetPath, setTargetPath] = useState<string | null>();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  useEffect(() => {
    if (targetPath !== pathname) {
      setIsOpen(false);
    }
  }, [pathname, targetPath]);
  return (
    <Sheet
      open={isOpen}
      onOpenChange={(v) => {
        if (!v) {
          setIsOpen(v);
        }
      }}
    >
      <SheetTrigger asChild>
        <Menu onClick={() => setIsOpen(true)} />
      </SheetTrigger>
      <SheetContent>
        <div className='flex items-center gap-2 py-2.5 border-b'>
          <div className='py-4 flex items-center justify-center gap-2'>
            {user?.img_url === '' ? (
              <div className='h-16 w-16 rounded-md bg-primary border border-border flex items-center justify-center text-xl text-white font-bold'>
                {user?.first_name[0]}
                {user?.last_name[0]}
              </div>
            ) : (
              <Image
                alt='profile'
                src={user?.img_url}
                height={500}
                className='h-16 w-16 object-cover rounded-md'
                width={500}
              />
            )}
            <div className='flex flex-col items-start justify-start'>
              <p className='text-lg font-semibold'>
                {user?.first_name} {user?.last_name}
              </p>
            </div>
          </div>
        </div>
        <div className='flex flex-col py-2 gap-2 w-full'>
          {navLinks.map((link) => {
            const Icon = link.icon;
            return (
              <Link
                onClick={() => {
                  setTargetPath(link.href);
                }}
                key={link.id}
                href={link.href}
                className={`${
                  pathname === link.href ? 'bg-primary' : ''
                } flex items-center gap-2 rounded-xl py-2 px-1.5`}
              >
                <Icon />
                <p>{link.name}</p>
              </Link>
            );
          })}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default MobileNav;
