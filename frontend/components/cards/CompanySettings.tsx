'use client';
import { UploadDropzone } from '@/utils/uploadthing';
import React, { useEffect, useState } from 'react';
import { Input } from '../ui/input';
import { useCompanyEmployees } from '@/hooks/useCompanyEmployees';
import { useMutation, useQuery } from '@tanstack/react-query';
import { getCompanyById, updateCompany } from '@/actions/company.actions';
import { Button } from '../ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Loader2, Trash } from 'lucide-react';
import { toast } from '../ui/use-toast';

const CompanySettings = () => {
  const { employees } = useCompanyEmployees();
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');

  const { data: company, isLoading } = useQuery({
    queryKey: ['getCompanyById'],
    queryFn: async () => await getCompanyById(),
  });

  console.log(company);

  useEffect(() => {
    if (!company) return;
    setName(company.name);
    setEmail(company.email);
  }, [company]);

  const { mutate: update, isPending } = useMutation({
    mutationKey: ['updateCompany'],
    mutationFn: updateCompany,
    onSuccess: () => {
      toast({
        title: 'Successfully updated company',
        duration: 1500,
      });
    },
    onError: () => {
      toast({
        title: 'An error occured while updating company',
        description: 'Please try again',
        duration: 1500,
        variant: 'destructive',
      });
    },
  });
  return (
    <div className='flex flex-col gap-2 w-full'>
      <div className='flex flex-col pb-4 w-full border-b border-gray-600'>
        <div className='py-3 pb-5 w-full'>
          <UploadDropzone
            endpoint='imageUploader'
            appearance={{
              container: 'w-64 h-64 border border-dashed border-gray-400 mt-0',
            }}
          />
        </div>
        <div className='flex items-center gap-2 w-full'>
          <p className='w-[190px]'>Company Name</p>
          <Input
            className='w-full'
            defaultValue={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className='flex items-center gap-2 w-full'>
          <p className='w-[190px]'>Company Email</p>
          <Input
            className='w-full'
            defaultValue={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className='mt-4'>
          <Button
            disabled={isPending}
            onClick={() =>
              update({
                email,
                name,
                logo_url: company?.logoUrl!,
              })
            }
          >
            {isPending ? (
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
      <div className='mt-6 flex flex-col gap-4'>
        <p className='text-xl font-semibold'>Employees</p>
        <div className='flex flex-col gap-2 w-full'>
          {employees?.map((e, i) => (
            <div
              key={e.id}
              className={`${
                i + 1 === employees.length ? '' : 'border-b border-gray-400'
              } py-2 w-full flex items-center justify-between`}
            >
              <div className='flex items-center gap-2'>
                <Avatar className='h-16 w-16 rounded-md'>
                  <AvatarImage
                    src={e.img_url}
                    className='h-16 w-16 object-cover rounded-md'
                  />
                  <AvatarFallback className='h-16 w-16'>
                    <div className='h-full w-full rounded-md bg-primary/10 text-primary dark:bg-red-500/20 dark:text-red-200 flex items-center justify-center text-xl font-bold'>
                      {e.first_name[0]}
                      {e.last_name[0]}
                    </div>
                  </AvatarFallback>
                </Avatar>
                <div className='flex flex-col'>
                  <p className='text-lg font-semibold'>
                    {e.first_name} {e.last_name}
                  </p>
                  <p className='text-gray-400 text-sm'>{e.email}</p>
                </div>
              </div>
              <p className='font-semibold'>{e.role}</p>
              <Button variant={'destructive'} size={'icon'}>
                <Trash />
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CompanySettings;
