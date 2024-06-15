'use client';
import React, { useState } from 'react';
import { Button } from '../ui/button';
import {
  ChevronRight,
  CirclePlus,
  Edit,
  Eye,
  Settings,
  Trash,
} from 'lucide-react';
import CreateTask from '../dialogs/CreateTask';
import { useCompanyTasks } from '@/hooks/useCompanyTasks';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table';
import { getPriorityProps } from '@/lib/utils';
import { format } from 'date-fns';
import { useTasks } from '@/hooks/useTasks';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import TaskDetails from '../dialogs/TaskDetails';
import EditTask from '../dialogs/EditTask';
import { useUser } from '@/hooks/useUser';

const Tasks = () => {
  const { user } = useUser();
  const [isOpenCreate, setIsOpenCreate] = useState<boolean>(false);
  const [isOpenDetails, setIsOpenDetails] = useState<boolean>(false);
  const [isOpenEdit, setIsOpenEdit] = useState<boolean>(false);

  const [selectedTask, setSelectedTask] = useState<TTask>();
  const [view, setView] = useState<'list' | 'grid'>('list');
  const { tasks, isLoading } = useTasks();

  if (isLoading) {
    return <p>....loading</p>;
  }
  return (
    <div className='w-full flex flex-col gap-4'>
      <div className='flex items-center justify-between'>
        <p className='text-2xl font-semibold'>Tasks</p>
        <div className='flex items-center gap-2'>
          {user?.role.toLowerCase() !== 'employee' && (
            <Button
              className='flex items-center gap-2'
              onClick={() => setIsOpenCreate(true)}
            >
              <CirclePlus />
              <p>Create Task</p>
            </Button>
          )}
        </div>
      </div>
      {view === 'list' ? (
        <>
          <div className='md:flex hidden w-full'>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className='w-[100px]'></TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Deadline</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Assigned By</TableHead>
                  <TableHead>Assigned To</TableHead>
                  <TableHead className='text-right'>Options</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tasks?.map((t) => {
                  const { bg, icon, text, textColor } = getPriorityProps(
                    t.priority
                  );
                  const Icon = icon;
                  return (
                    <TableRow key={t.id}>
                      <TableCell>
                        <Icon className='h-8 w-8' />
                      </TableCell>
                      <TableCell>{t.title}</TableCell>
                      <TableCell className={textColor}>{text}</TableCell>
                      <TableCell>{format(t.deadline, 'dd.MM.yyyy')}</TableCell>
                      <TableCell className='first-letter:uppercase'>
                        {t.status.toLowerCase()}
                      </TableCell>
                      <TableCell className='first-letter:uppercase'>
                        {t.assigned_by.first_name} {t.assigned_by.last_name}
                      </TableCell>
                      <TableCell className='first-letter:uppercase'>
                        {t.assigned_to.first_name} {t.assigned_to.last_name}
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
                              className='flex items-center gap-2 cursor-pointer'
                              onClick={() => {
                                setSelectedTask(t);
                                setIsOpenDetails(true);
                              }}
                            >
                              <Eye className='h-4 w-4' />
                              <p>See Details</p>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className='flex items-center gap-2 cursor-pointer'
                              onClick={() => {
                                setSelectedTask(t);
                                setIsOpenEdit(true);
                              }}
                            >
                              <Edit className='h-4 w-4' />
                              <p>Edit Task</p>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className='flex items-center gap-2 cursor-pointer text-red-500'>
                              <Trash className='h-4 w-4' />
                              <p>Delete Task</p>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
          <div className='md:hidden flex items-center flex-wrap w-full gap-2'>
            {tasks?.map((t) => {
              const { bg, icon, text, textColor } = getPriorityProps(
                t.priority
              );
              const Icon = icon;
              return (
                <div
                  key={t.id}
                  className='bg-secondary rounded-xl sm:w-[calc(50%-4px)] w-full p-2 flex items-center justify-between'
                >
                  <div className='flex items-center gap-2'>
                    <div
                      className={`${bg} rounded-xl h-24 w-24 flex items-center justify-center`}
                    >
                      <Icon className='h-12 w-12' />
                    </div>
                    <div className='flex flex-col'>
                      <p className='text-xl font-[600]'>{t?.title}</p>
                      <p className='text-sm font-[500]'>
                        Deadline: {format(t.deadline, 'dd.MM.yyyy')}
                      </p>
                      <p className='text-sm font-[500] max-w-full truncate'>
                        Assigned By: {t.assigned_by.first_name}{' '}
                        {t.assigned_by.last_name}
                      </p>
                      <p className={`${textColor} text-sm font-[500]`}>
                        {text} Priority
                      </p>
                    </div>
                  </div>
                  <ChevronRight className='sm:hidden flex' />
                </div>
              );
            })}
          </div>
        </>
      ) : null}
      <CreateTask open={isOpenCreate} setOpen={setIsOpenCreate} />
      <TaskDetails
        open={isOpenDetails}
        setOpen={setIsOpenDetails}
        task={selectedTask!}
      />
      <EditTask
        open={isOpenEdit}
        setOpen={setIsOpenEdit}
        task={selectedTask!}
      />
    </div>
  );
};

export default Tasks;
