'use client';
import React, { useState } from 'react';
import { Button } from '../ui/button';
import { CirclePlus } from 'lucide-react';
import CreateEmployee from '../dialogs/CreateEmployee';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table';
import { useCompanyEmployees } from '@/hooks/useCompanyEmployees';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';

const Employees = () => {
  const { employees, isLoading } = useCompanyEmployees();
  const [isOpenCreate, setIsOpenCreate] = useState<boolean>(false);
  return (
    <div className='flex flex-col w-full gap-4'>
      <div className='flex items-center justify-between w-full'>
        <div />
        <div className='flex items-center gap-2'>
          <Button
            onClick={() => setIsOpenCreate(true)}
            className='flex items-center gap-2'
          >
            <CirclePlus className='h-4 w-4' />
            Create Employee Account
          </Button>
        </div>
      </div>
      <div className='w-full'>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className='w-[100px]'>ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Position</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className='text-right'>Options</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {employees?.map((employee) => (
              <TableRow key={employee._id}>
                <TableCell>
                  <Avatar className='h-16 w-16 rounded-md'>
                    <AvatarImage
                      src={employee.imgUrl}
                      className='h-16 w-16 rounded-md object-cover'
                    />
                    <AvatarFallback className='h-16 w-16 rounded-md'>
                      <div className='h-full w-full bg-primary/10 text-primary dark:bg-red-500/20 dark:text-red-200 flex items-center justify-center text-xl font-bold'>
                        {employee.firstName[0]}
                        {employee.lastName[0]}
                      </div>
                    </AvatarFallback>
                  </Avatar>
                </TableCell>
                <TableCell>
                  {employee.firstName} {employee.lastName}
                </TableCell>
                <TableCell>{employee.email}</TableCell>
                <TableCell>{employee.position}</TableCell>
                <TableCell className='first-letter:uppercase'>
                  {employee.role.toLowerCase()}
                </TableCell>
                <TableCell>
                  {employee?.isWorking
                    ? 'Working'
                    : employee?.isOnVacation
                    ? 'Vacation'
                    : employee?.isOnBreak
                    ? 'break'
                    : 'Not working'}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <CreateEmployee open={isOpenCreate} setOpen={setIsOpenCreate} />
    </div>
  );
};

export default Employees;
