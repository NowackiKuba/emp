'use client';
import React, { useState } from 'react';
import { Card } from '../ui/card';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { useMutation } from '@tanstack/react-query';
import { createAccount } from '@/actions/auth.actions';
import { toast } from '../ui/use-toast';
import { useRouter } from 'next/navigation';
import { CalendarIcon, Loader2 } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { Calendar } from '../ui/calendar';

const SignUpForm = () => {
  const [firstName, setFirstName] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const router = useRouter();
  const [isSignin, setIsSigning] = useState(false);

  const signup = async () => {
    try {
      setIsSigning(true);
      const res = await createAccount({
        email,
        firstName,
        lastName,
        password,
      });
      console.log(res);
      toast({
        title: 'Successfully created account',
        description: 'Your account has been created successfully',
        duration: 1500,
      });
      const userId = await res.userId;
      router.push(`/create-company/?userId=${userId}`);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'An error occurred while creating your account',
        duration: 1500,
        variant: 'destructive',
      });
      console.log(error);
    } finally {
      setIsSigning(false);
    }
  };
  // const { mutate: signup, isPending: isSignin } = useMutation({
  //   mutationKey: ['signup'],
  //   mutationFn: createAccount,
  //   onSuccess: () => {
  //     toast({
  //       title: 'Account Created',
  //       description: 'Your account has been created successfully',
  //       duration: 1500,
  //     });

  //     // router.push(`/create-company/${data._id}`);
  //   },
  //   onError: ({ message }) => {
  //     console.log(message);
  //     toast({
  //       title: 'Error',
  //       description: 'An error occurred while creating your account',
  //       duration: 1500,
  //       variant: 'destructive',
  //     });
  //   },
  // });
  // console.log(data);
  const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0];
  const generateUsername = () => {
    let username = '';
    for (let i = 0; i < 4; i++) {
      username += numbers[Math.floor(Math.random() * numbers.length)];
    }
    username = `${firstName}${lastName}${username}`;
    return username;
  };
  return (
    <Card className='w-[450px] h-[500px] flex flex-col items-center justify-start py-3'>
      <p className='text-2xl font-[600]'>Create Account</p>
      <div className='mt-4 flex flex-col px-10 items-start justify-start gap-6 w-full'>
        <div className='flex items-center gap-2 w-full'>
          <div className='flex flex-col gap-0.5 w-full'>
            <Label>First Name</Label>
            <Input onChange={(e) => setFirstName(e.target.value)} />
          </div>
          <div className='flex flex-col gap-0.5 w-full'>
            <Label>Last Name</Label>
            <Input onChange={(e) => setLastName(e.target.value)} />
          </div>
        </div>

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
            disabled={isSignin}
            onClick={() => {
              signup();
            }}
          >
            {isSignin ? (
              <div className='flex items-center gap-1'>
                <Loader2 className='h-4 w-4 animate-spin' />
                <p>Create Account</p>
              </div>
            ) : (
              'Create Account'
            )}
          </Button>
        </div>
        <div className='flex flex-col gap-3 w-full'>
          <Button variant={'outline'} disabled={isSignin}>
            Log In
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default SignUpForm;
