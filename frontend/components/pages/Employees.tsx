'use client';
import React, { useState } from 'react';
import { Button } from '../ui/button';
import {
  ChevronRight,
  CircleCheck,
  CirclePlus,
  Edit,
  Eye,
  FileQuestion,
  Loader2,
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import CreateTask from '../dialogs/CreateTask';
import { format } from 'date-fns';
import EditEmployee from '../dialogs/EditEmployee';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteEmployee } from '@/actions/user.actions';
import { toast } from '../ui/use-toast';
import EmployeeDetails from '../dialogs/EmployeeDetails';

const Employees = () => {
  const { employees, isLoading } = useCompanyEmployees();
  const [isOpenCreate, setIsOpenCreate] = useState<boolean>(false);
  const [isOpenAssign, setIsOpenAssign] = useState<boolean>(false);
  const [isOpenEdit, setIsOpenEdit] = useState<boolean>(false);
  const [isOpenDelete, setIsOpenDelete] = useState<boolean>(false);
  const [isOpenDetails, setIsOpenDetails] = useState<boolean>(false);
  const [employeeId, setEmployeeId] = useState<number>(0);
  const [activeSort, setActiveSort] = useState<string | undefined>();
  const [selectedEmployee, setSelectedEmployee] = useState<TUser>();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();
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
  const { mutate: deleteUser, isPending: isDeleting } = useMutation({
    mutationKey: ['deleteUser'],
    mutationFn: deleteEmployee,
    onSuccess: () => {
      toast({
        title: 'Successfully deleted employee',
        duration: 1500,
      });
      queryClient.invalidateQueries({
        queryKey: ['getCompanyEmployees'],
        refetchType: 'all',
      });
    },
    onError: () => {
      toast({
        title: 'Failed to delete employee',
        description: 'Please try again later',
        variant: 'destructive',
        duration: 1500,
      });
    },
  });
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
            otherClasses='lg:max-w-[280px] md:max-w-[220px] max-w-[240px]'
          />
          <Select onValueChange={(e) => handleSort(e)}>
            <SelectTrigger className='md:max-w-[180px] max-w-[140px]'>
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
            className='hidden md:flex items-center gap-2'
          >
            <CirclePlus className='h-4 w-4' />
            Create Employee Account
          </Button>
          <Button
            onClick={() => setIsOpenCreate(true)}
            size={'icon'}
            className='flex md:hidden items-center gap-2'
          >
            <CirclePlus className='h-4 w-4' />
          </Button>
        </div>
      </div>
      <div className='md:flex hidden w-full'>
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
                  {employee?.is_working ? (
                    <div className='px-1 py-0.5 bg-green-500 text-white rounded-sm max-w-[100px] flex items-center justify-center text-xs font-semibold'>
                      Working: {format(employee?.work_start, 'HH:mm')}
                    </div>
                  ) : employee?.is_on_vacation ? (
                    'Vacation'
                  ) : employee?.is_on_break ? (
                    'break'
                  ) : (
                    'Not working'
                  )}
                </TableCell>
                <TableCell className='flex justify-end items-end'>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant={'ghost'} size={'icon'}>
                        <Settings />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem
                        onClick={() => {
                          setSelectedEmployee(employee);
                          setIsOpenDetails(true);
                        }}
                        className='flex items-center gap-2 cursor-pointer'
                      >
                        <Eye className='h-4 w-4' />
                        <p>See Details</p>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className='flex items-center gap-2 cursor-pointer'
                        onClick={() => {
                          setIsOpenEdit(true);
                          setSelectedEmployee(employee);
                        }}
                      >
                        <Edit className='h-4 w-4' />
                        <p>Edit Employee</p>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => {
                          setIsOpenAssign(true);
                          setEmployeeId(employee.id);
                        }}
                        className='flex items-center gap-2 cursor-pointer'
                      >
                        <CircleCheck className='h-4 w-4' />
                        <p>Assign Task</p>
                      </DropdownMenuItem>
                      <DropdownMenuItem className='flex items-center gap-2 cursor-pointer'>
                        <FileQuestion className='h-4 w-4' />
                        <p>Ask Question</p>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />

                      <DropdownMenuItem
                        onClick={() => {
                          setIsOpenDelete(true);
                          setEmployeeId(employee.id);
                        }}
                        className='flex items-center gap-2 cursor-pointer text-red-500'
                      >
                        <Trash className='h-4 w-4' />
                        <p>
                          Delete {employee?.first_name} {employee?.last_name}
                        </p>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <div className='md:hidden flex items-center flex-wrap gap-2'>
        {employees?.map((e) => (
          <div
            key={e.id}
            className='w-full sm:w-[calc(50%-4px)] bg-secondary p-2 rounded-xl flex items-center justify-between gap-1.5'
          >
            <div className='flex items-center gap-2 w-full'>
              <Avatar className='h-20 w-20 rounded-md'>
                <AvatarImage
                  src={e.img_url}
                  className='h-20 w-20 object-cover rounded-md'
                />
                <AvatarFallback className='h-20 w-20'>
                  <div className='h-full w-full bg-primary/10 text-primary dark:bg-red-500/20 dark:text-red-200 flex items-center justify-center text-2xl font-bold'>
                    {e.first_name[0]}
                    {e.last_name[0]}
                  </div>
                </AvatarFallback>
              </Avatar>
              <div className='flex flex-col'>
                <p className='text-xl sm:text-[22px] font-[600]'>
                  {e.first_name} {e.last_name}
                </p>
                <p className='text-sm text-gray-600'>{e.email}</p>
              </div>
            </div>
            <ChevronRight />
          </div>
        ))}
      </div>
      <AlertDialog
        open={isOpenDelete}
        onOpenChange={(v) => {
          if (!v) {
            setIsOpenDelete(v);
          }
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your
              account and remove your data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <Button
              variant={'destructive'}
              onClick={() => deleteUser({ id: employeeId })}
              disabled={isDeleting}
            >
              {isDeleting ? (
                <div className='flex items-center gap-1'>
                  <Loader2 className='h-4 w-4 animate-spin' />
                  <p>Delete</p>
                </div>
              ) : (
                'Delete'
              )}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <CreateEmployee open={isOpenCreate} setOpen={setIsOpenCreate} />
      <EditEmployee
        open={isOpenEdit}
        setOpen={setIsOpenEdit}
        employee={selectedEmployee!}
      />
      <CreateTask
        open={isOpenAssign}
        setOpen={setIsOpenAssign}
        employeeId={employeeId}
      />
      <EmployeeDetails
        open={isOpenDetails}
        setOpen={setIsOpenDetails}
        user={selectedEmployee!}
      />
    </div>
  );
};

export default Employees;
