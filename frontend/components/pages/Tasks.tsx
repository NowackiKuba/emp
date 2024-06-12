'use client';
import React, { useState } from 'react';
import { Button } from '../ui/button';
import { CirclePlus, Edit, Eye, Settings, Trash } from 'lucide-react';
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

const Tasks = () => {
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
          <Button
            className='flex items-center gap-2'
            onClick={() => setIsOpenCreate(true)}
          >
            <CirclePlus />
            <p>Create Task</p>
          </Button>
        </div>
      </div>
      {view === 'list' ? (
        <div className='w-full'>
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
