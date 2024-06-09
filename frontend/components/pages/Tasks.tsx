'use client';
import React, { useState } from 'react';
import { Button } from '../ui/button';
import { CirclePlus, Settings } from 'lucide-react';
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

const Tasks = () => {
  const [isOpenCreate, setIsOpenCreate] = useState<boolean>(false);
  const [view, setView] = useState<'list' | 'grid'>('list');
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
              {/* {tasks?.map((t) => {
                const { bg, icon, text, textColor } = getPriorityProps(
                  t.priority
                );
                const Icon = icon;
                return (
                  <TableRow key={t._id}>
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
                      {t.assignedBy.firstName} {t.assignedBy.lastName}
                    </TableCell>
                    <TableCell className='first-letter:uppercase'>
                      {t.assignedTo.firstName} {t.assignedTo.lastName}
                    </TableCell>
                    <TableCell className='flex justify-end items-end'>
                      <Button variant={'ghost'} size={'icon'}>
                        <Settings />
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })} */}
            </TableBody>
          </Table>
        </div>
      ) : null}
      <CreateTask open={isOpenCreate} setOpen={setIsOpenCreate} />
    </div>
  );
};

export default Tasks;
