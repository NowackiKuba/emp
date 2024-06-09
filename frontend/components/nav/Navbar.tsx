'use client';
import { navLinks } from '@/constants';
import Link from 'next/link';
import React from 'react';
import UserButton from '../UserButton';
import { useUser } from '@/hooks/useUser';
import { usePathname } from 'next/navigation';

const Navbar = () => {
  const { user, isLoading } = useUser();
  const pathname = usePathname();
  return (
    <div className='bg-background w-full px-12 py-4 flex items-center justify-between'>
      <div>asd</div>
      <div className='flex items-center justify-center gap-2'>
        {navLinks.map((link) => {
          const Icon = link.icon;
          return (
            <Link
              href={link.href}
              key={link.id}
              className={`flex items-center gap-1 px-5 py-2.5 rounded-xl  ${
                pathname === link.href
                  ? 'bg-primary text-white '
                  : 'hover:bg-primary/10 hover:text-primary duration-100 ease-linear'
              }`}
            >
              <Icon />
              <p>{link.name}</p>
            </Link>
          );
        })}
      </div>
      <UserButton user={user!} />
    </div>
  );
};

export default Navbar;
