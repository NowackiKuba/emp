'use client';
import React, { useState } from 'react';
import { Card } from '../ui/card';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { useMutation } from '@tanstack/react-query';
import { createAccount, login } from '@/actions/auth.actions';
import { toast } from '../ui/use-toast';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

const SignInForm = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const router = useRouter();
  const { mutate: logIn, isPending: isLogging } = useMutation({
    mutationKey: ['logIn'],
    mutationFn: login,
    onSuccess: () => {
      toast({
        title: 'Account Created',
        description: 'Your account has been created successfully',
        duration: 1500,
      });

      router.push('/sign-in');
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'An error occurred while creating your account',
        duration: 1500,
        variant: 'destructive',
      });
    },
  });
  return (
    <Card className='w-[450px] h-[500px] flex flex-col items-center justify-start py-3'>
      <p className='text-2xl font-[600]'>Sign In</p>
      <div className='mt-4 flex flex-col px-10 items-start justify-start gap-6 w-full'>
        <div className='flex flex-col gap-0.5 w-full'>
          <Label>Email</Label>
          <Input onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div className='flex flex-col gap-0.5 w-full'>
          <Label>Password</Label>
          <Input onChange={(e) => setPassword(e.target.value)} />
        </div>
        <div className='flex flex-col gap-3 w-full'>
          <Button
            disabled={isLogging}
            onClick={() => {
              const res = logIn({
                email,
                password,
              });
              console.log('RES: ', res);
            }}
          >
            {isLogging ? (
              <div className='flex items-center gap-1'>
                <Loader2 className='h-4 w-4 animate-spin' />
                <p>Sign In</p>
              </div>
            ) : (
              'Sign In'
            )}
          </Button>
        </div>
        <div className='flex flex-col gap-3 w-full'>
          <Button variant={'outline'} disabled={isLogging}>
            Sign In
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default SignInForm;
