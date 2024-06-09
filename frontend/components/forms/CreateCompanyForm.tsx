'use client';
import React, { useState } from 'react';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { useMutation } from '@tanstack/react-query';
import { createCompany } from '@/actions/auth.actions';
import { toast } from '../ui/use-toast';
import { useRouter, useSearchParams } from 'next/navigation';

const CreateCompanyForm = () => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const searchParams = useSearchParams();
  const router = useRouter();
  const userId = searchParams.get('userId');

  if (!userId) {
    router.push('/sign-up');
  }

  const { mutate: createCompanyMutation } = useMutation({
    mutationKey: ['createCompany'],
    mutationFn: createCompany,
    onSuccess: () => {
      toast({
        title: 'Created',
        duration: 1500,
      });
    },
    onError: () => {
      toast({
        title: 'Failed to create company',
        duration: 1500,
      });
    },
  });
  return (
    <div className='flex items-start w-full h-screen'>
      <div className='w-[70%] flex flex-col h-full items-start justify-between bg-[url(https://imgs.search.brave.com/7T0f7PsSJoQVw3vp0JBkIuDkaLwY6drSPHjce-k0fzQ/rs:fit:860:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS5pc3RvY2twaG90/by5jb20vaWQvMTY3/ODE0NDIzNy9waG90/by9jZWxlYnJhdGlv/bi1idXNpbmVzcy1t/ZWV0aW5nLWFuZC1o/aWdoLWZpdmUtb2Yt/Y29tcGFueS1zdGFm/Zi13aXRoLWNvbGxh/Ym9yYXRpb24tYW5k/LXRlYW13b3JrLndl/YnA_Yj0xJnM9MTcw/NjY3YSZ3PTAmaz0y/MCZjPXVremhhNUxj/MndvR2x2Q0llVm0w/em4wbDBSUy12QklJ/a0RoREs1cmM2RnM9)] bg-no-repeat bg-cover'>
        <div className='absolute z-10 h-full w-[70%] bg-black/80 flex items-center justify-between'>
          <div className='flex flex-col items-start justify-between h-full'></div>
        </div>
      </div>
      <div className='bg-secondary gap-3 h-full  w-[30%] px-20 flex flex-col items-center justify-center'>
        <p>Create Company Account</p>
        <div className='flex flex-col gap-0.5 mt-6 w-full'>
          <Label>Name</Label>
          <Input onChange={(e) => setName(e.target.value)} />
        </div>
        <div className='flex flex-col gap-0.5 mt-6 w-full'>
          <Label>Email</Label>
          <Input onChange={(e) => setEmail(e.target.value)} />
        </div>
        <Button
          onClick={() =>
            createCompanyMutation({
              name,
              email,
              logoUrl: '',
              users: [userId!],
            })
          }
        >
          Create Company
        </Button>
      </div>
    </div>
  );
};

export default CreateCompanyForm;
