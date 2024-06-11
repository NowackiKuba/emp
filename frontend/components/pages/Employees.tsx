'use client';
import React, { useState } from 'react';
import { Button } from '../ui/button';
import {
  CircleCheck,
  CirclePlus,
  Edit,
  Eye,
  FileQuestion,
  Settings,
  Trash,
} from 'lucide-react';
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
import Searchbar from '../Searchbar';
import { useRouter, useSearchParams } from 'next/navigation';
import { formUrlQuery, removeKeysFromQuery } from '@/lib/utils';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';

const Employees = () => {
  const { employees, isLoading } = useCompanyEmployees();
  const [isOpenCreate, setIsOpenCreate] = useState<boolean>(false);
  const [activeSort, setActiveSort] = useState<string | undefined>();
  const searchParams = useSearchParams();
  const router = useRouter();
  const handleSort = (item: string) => {
    if (activeSort === item) {
      setActiveSort(undefined);
      const newUrl = removeKeysFromQuery({
        keysToRemove: ['sort'],
        params: searchParams.toString(),
      });

      router.push(newUrl, { scroll: false });
    } else {
      setActiveSort(item);
      const newUrl = formUrlQuery({
        key: 'sort',
        params: searchParams.toString(),
        value: item,
      });

      router.push(newUrl, { scroll: false });
    }
  };

  if (isLoading) {
    return <p>...loading</p>;
  }
  return (
    <div className='flex flex-col w-full gap-4'>
      <div className='flex items-center justify-between w-full'>
        <div className='flex items-center w-full gap-2'>
          <Searchbar
            placeholder='Search for employees'
            iconPosition='left'
            route='/employees'
            otherClasses='xl:max-w-[280px]'
          />
          <Select onValueChange={(e) => handleSort(e)}>
            <SelectTrigger className='xl:max-w-[200px]'>
              <SelectValue placeholder='Sort' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='newest'>Newest</SelectItem>
              <SelectItem value='oldest'>Oldest</SelectItem>
            </SelectContent>
          </Select>
        </div>
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
              <TableRow key={employee.id}>
                <TableCell>
                  <Avatar className='h-16 w-16 rounded-md'>
                    <AvatarImage
                      src={employee.img_url}
                      className='h-16 w-16 rounded-md object-cover'
                    />
                    <AvatarFallback className='h-16 w-16 rounded-md'>
                      <div className='h-full w-full bg-primary/10 text-primary dark:bg-red-500/20 dark:text-red-200 flex items-center justify-center text-xl font-bold'>
                        {employee.first_name[0]}
                        {employee.last_name[0]}
                      </div>
                    </AvatarFallback>
                  </Avatar>
                </TableCell>
                <TableCell>
                  {employee.first_name} {employee.last_name}
                </TableCell>
                <TableCell>{employee.email}</TableCell>
                <TableCell>{employee.position}</TableCell>
                <TableCell className='first-letter:uppercase'>
                  {employee.role.toLowerCase()}
                </TableCell>
                <TableCell>
                  {employee?.is_working
                    ? 'Working'
                    : employee?.is_on_vacation
                    ? 'Vacation'
                    : employee?.is_on_break
                    ? 'break'
                    : 'Not working'}
                </TableCell>
                <TableCell className='flex justify-end items-end'>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant={'ghost'} size={'icon'}>
                        <Settings />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem className='flex items-center gap-2 cursor-pointer'>
                        <Eye className='h-4 w-4' />
                        <p>See Details</p>
                      </DropdownMenuItem>
                      <DropdownMenuItem className='flex items-center gap-2 cursor-pointer'>
                        <Edit className='h-4 w-4' />
                        <p>Edit Employee</p>
                      </DropdownMenuItem>
                      <DropdownMenuItem className='flex items-center gap-2 cursor-pointer'>
                        <CircleCheck className='h-4 w-4' />
                        <p>Assign Task</p>
                      </DropdownMenuItem>
                      <DropdownMenuItem className='flex items-center gap-2 cursor-pointer'>
                        <FileQuestion className='h-4 w-4' />
                        <p>Ask Question</p>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className='flex items-center gap-2 cursor-pointer text-red-500'>
                        <Trash className='h-4 w-4' />
                        <p>Ask Question</p>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
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
