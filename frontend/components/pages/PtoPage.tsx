'use client';
import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Bot, CirclePlus, Eye, FileText, Ghost } from 'lucide-react';
import CreatePTO from '../dialogs/CreatePTO';
import { useQuery } from '@tanstack/react-query';
import { getCompanyPtos } from '@/actions/pto.actions';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { format } from 'date-fns';
import PTODetails from '../dialogs/PTODetails';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../ui/tooltip';

const PtoPage = () => {
  const { data: ptos, isLoading } = useQuery({
    queryKey: ['getPtos'],
    queryFn: async () => await getCompanyPtos(),
  });
  console.log(ptos);
  const [isOpenCreate, setIsOpenCreate] = useState<boolean>(false);
  const [isOpenDetails, setIsOpenDetails] = useState<boolean>(false);
  const [selectedRequest, setSelectedRequest] = useState<TPTO>();
  const [statusFilter, setStatusFilter] = useState<
    'assigned' | 'rejected' | 'accepted'
  >('assigned');
  return (
    <div className='flex flex-col gap-4 w-full'>
      <div className='flex items-center justify-between'>
        <p className='text-2xl font-semibold'>PTO&apos;S</p>
        <Button
          className='flex items-center gap-2'
          onClick={() => setIsOpenCreate(true)}
        >
          <CirclePlus />
          <p>Add PTO</p>
        </Button>
      </div>
      <div className='flex items-center gap-2'>
        <Button
          variant={statusFilter === 'assigned' ? 'default' : 'p-outline'}
          onClick={() => setStatusFilter('assigned')}
        >
          Assigned
        </Button>
        <Button
          variant={statusFilter === 'rejected' ? 'default' : 'p-outline'}
          onClick={() => setStatusFilter('rejected')}
        >
          Rejected
        </Button>
        <Button
          variant={statusFilter === 'accepted' ? 'default' : 'p-outline'}
          onClick={() => setStatusFilter('accepted')}
        >
          Accepted
        </Button>
      </div>
      <div className='flex items-center gap-2 w-full'>
        {ptos?.length === 0 ? <div>asd</div> : null}
        {ptos?.map((pto) => (
          <div
            key={pto.id}
            className={`${
              statusFilter === 'assigned'
                ? pto.status === 'ASSIGNED'
                  ? 'flex'
                  : 'hidden'
                : statusFilter === 'rejected'
                ? pto.status === 'REJECTED'
                  ? 'flex'
                  : 'hidden'
                : statusFilter === 'accepted'
                ? pto.status === 'ACCEPTED'
                  ? 'flex'
                  : 'hidden'
                : 'flex'
            } h-80 w-80 rounded-xl bg-secondary px-4 py-2 flex flex-col gap-1`}
          >
            <div className='flex items-center gap-2'>
              <Avatar className='h-16 w-16 rounded-xl'>
                <AvatarImage
                  src={pto.send_by.img_url}
                  className='h-16 w-16 object-cover'
                />
                <AvatarFallback className='h-16 w-16'>
                  <div className='h-16 w-16 rounded-md flex items-center justify-center text-2xl font-bold bg-primary/10 text-primary dark:bg-red-500/20 dark:text-red-200'>
                    {pto.send_by.first_name[0]}
                    {pto.send_by.last_name[0]}
                  </div>
                </AvatarFallback>
              </Avatar>
              <div className='flex flex-col'>
                <p className='text-xl font-semibold'>
                  {pto.send_by.first_name} {pto.send_by.last_name}
                </p>
                <p className='text-gray-400 text-sm'>PTO Request</p>
              </div>
            </div>
            <p className='text-gray-400'>
              Sent:{' '}
              <span className='font-semibold'>
                {format(pto.created_at, 'dd.MM.yyyy')}
              </span>
            </p>
            <p className='text-gray-400'>
              Status:{' '}
              <span
                className={`font-semibold first-letter:uppercase ${
                  pto?.status.toLowerCase() === 'accepted'
                    ? 'text-green-500'
                    : pto?.status?.toLowerCase() === 'rejeceted'
                    ? 'text-red-500'
                    : 'text-gray-400'
                }`}
              >
                {pto.status.toLowerCase()}
              </span>
            </p>
            <div className='flex items-start gap-1'>
              <TooltipProvider>
                <Tooltip delayDuration={20}>
                  <TooltipTrigger className='w-20'>
                    <Bot />
                  </TooltipTrigger>
                  <TooltipContent>AI Manager</TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <p className='italic text-gray-400'>
                In this date range none of employees have their ptos. You can
                grant this employee his pto
              </p>
            </div>
            <div className='h-full flex items-end justify-end w-full'>
              <Button
                className='w-full flex items-center gap-2'
                onClick={() => {
                  setIsOpenDetails(true);
                  setSelectedRequest(pto);
                }}
              >
                <Eye />
                <p>See Details</p>
              </Button>
            </div>
          </div>
        ))}
      </div>
      <CreatePTO open={isOpenCreate} setOpen={setIsOpenCreate} />
      <PTODetails
        open={isOpenDetails}
        setOpen={setIsOpenDetails}
        pto={selectedRequest!}
      />
    </div>
  );
};

export default PtoPage;
