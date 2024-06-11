'use client';
import React, { Dispatch, SetStateAction, useState } from 'react';
import { Dialog, DialogContent } from '../ui/dialog';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { Button } from '../ui/button';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createEmployeeAccount } from '@/actions/user.actions';
import { toast } from '../ui/use-toast';
import { Loader2, Trash, UploadCloud } from 'lucide-react';
import { UploadDropzone } from '@/utils/uploadthing';
import Image from 'next/image';

type Role = 'ADMIN' | 'MANAGER' | 'EMPLOYEE';

const CreateEmployee = ({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}) => {
  const [firstName, setFirstName] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [position, setPosition] = useState<string>('');
  const [role, setRole] = useState<Role>('EMPLOYEE');
  const [image, setImage] = useState<string | undefined>();
  const queryClient = useQueryClient();
  const { mutate: createEmployee, isPending: isCreating } = useMutation({
    mutationKey: ['createEmployee'],
    mutationFn: createEmployeeAccount,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['getCompanyEmployees'],
        refetchType: 'all',
      });
      toast({
        title: 'Employee Account Created',
        duration: 1500,
      });
    },
    onError: () => {
      toast({
        title: 'Failed to create employee account',
        duration: 1500,
        variant: 'destructive',
        description: 'Please try again later',
      });
    },
  });
  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        if (!v) {
          setOpen(v);
        }
      }}
    >
      <DialogContent className='flex flex-col gap-4 w-full'>
        <p className='text-xl font-semibold'>Create Employee Account</p>
        <div className='flex flex-col gap-0.5 w-full'>
          <Label>Picture (optional)</Label>
          {!image ? (
            <UploadDropzone
              endpoint='imageUploader'
              config={{
                mode: 'auto',
              }}
              onClientUploadComplete={(res) => {
                setImage(res[0].url);
              }}
              content={{
                uploadIcon({ isUploading }) {
                  if (isUploading) {
                    return <Loader2 className='h-12 w-12 animate-spin' />;
                  }
                  return <UploadCloud className='h-12 w-12' />;
                },
              }}
              appearance={{
                button: 'hidden',
                container:
                  'w-full flex flex-col items-center justify-center gap-2 py-6',
              }}
            />
          ) : (
            <div className='flex flex-col gap-2 '>
              <Image
                src={image}
                alt='image'
                className='h-44 w-44 rounded-lg'
                height={500}
                width={500}
              />
              <div className='flex items-center w-44 gap-1'>
                <Button
                  className='w-full flex items-center gap-2'
                  variant={'destructive'}
                  onClick={() => setImage(undefined)}
                >
                  <Trash />
                  Delete
                </Button>
              </div>
            </div>
          )}
        </div>
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
        <div className='flex flex-col gap-0.5 w-full'>
          <Label>Position</Label>
          <Input onChange={(e) => setPosition(e.target.value)} />
        </div>
        <div className='flex flex-col gap-0.5 w-full'>
          <Label>Role</Label>
          <Select defaultValue={role} onValueChange={(e) => setRole(e as Role)}>
            <SelectTrigger>
              <SelectValue placeholder='Select Employee Role' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='ADMIN'>Admin</SelectItem>
              <SelectItem value='MANAGER'>Manager</SelectItem>
              <SelectItem value='EMPLOYEE'>Employee</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className='flex items-center gap-2 w-full'>
          <Button
            className='w-full bg-primary/10 text-primary dark:bg-red-500/20 dark:text-red-200'
            onClick={() => setOpen(false)}
            disabled={isCreating}
          >
            Cancel
          </Button>
          <Button
            className='w-full'
            disabled={isCreating}
            onClick={() =>
              createEmployee({
                email,
                firstName,
                lastName,
                password,
                position,
                role,
                image: image || '',
              })
            }
          >
            {isCreating ? (
              <div className='flex items-center gap-1'>
                <Loader2 className='h-4 w-4 animate-spin' />
                <p>Create Account</p>
              </div>
            ) : (
              'Create Account'
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreateEmployee;
