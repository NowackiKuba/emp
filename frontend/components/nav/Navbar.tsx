'use client';
import { navLinks } from '@/constants';
import Link from 'next/link';
import React from 'react';
import UserButton from '../UserButton';
import { useUser } from '@/hooks/useUser';
import { usePathname } from 'next/navigation';
import MobileNav from './MobileNav';

const Navbar = () => {
  const { user, isLoading } = useUser();
  const pathname = usePathname();
  const employeeToShow = [
    'Home',
    'Tasks',
    'Polls',
    'Opinions',
    "PTO's",
    'Surveys',
  ];
  return (
    <div className='bg-background w-full px-3 md:px-12 py-4 flex items-center justify-between'>
      <div className='bg-gradient-to-r from-primary to-purple-500 bg-clip-text'>
        <Link href={'/'} className='text-4xl font-semibold text-transparent'>
          EMP
        </Link>
      </div>
      <div className='hidden xl:flex items-center justify-center gap-2'>
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
              } ${
                user?.role.toLowerCase() === 'employee'
                  ? employeeToShow.includes(link.name)
                    ? 'flex'
                    : 'hidden'
                  : 'flex'
              } `}
            >
              <Icon />
              <p>{link.name}</p>
            </Link>
          );
        })}
      </div>
      <div className='md:flex hidden'>
        <UserButton user={user!} />
      </div>
      <div className='md:hidden flex'>
        <MobileNav user={user!} />
      </div>
    </div>
  );
};

export default Navbar;
