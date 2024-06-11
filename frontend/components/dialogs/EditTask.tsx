'use client';
import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent } from '../ui/dialog';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { useCompanyEmployees } from '@/hooks/useCompanyEmployees';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { Button } from '../ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { cn } from '@/lib/utils';
import { CalendarIcon, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import { Calendar } from '../ui/calendar';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createTask, updateTask } from '@/actions/task.actions';
import { toast } from '../ui/use-toast';

interface Props extends DialogProps {
  task: TTask;
}

const EditTask = ({ open, setOpen, task }: Props) => {
  const { employees } = useCompanyEmployees();
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [priority, setPriority] = useState<number>(0);
  const [deadline, setDeadline] = useState<Date>();
  const [status, setStatus] = useState<string>('');
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<number>();

  useEffect(() => {
    if (!task) {
      return;
    }
    setTitle(task.title);
    setDescription(task.description);
    setPriority(task.priority);
    setDeadline(task.deadline);
    setSelectedEmployeeId(task.assigned_to.id);
    setStatus(task.status);
  }, [task]);
  const queryClient = useQueryClient();
  const { mutate: editTask, isPending: isEditing } = useMutation({
    mutationKey: ['editTask'],
    mutationFn: updateTask,
    onSuccess: () => {
      toast({
        title: 'Task Edited',
        duration: 1500,
      });
      setOpen(false);
      queryClient.invalidateQueries({
        queryKey: ['getCompanyTasks'],
        refetchType: 'all',
      });
    },
    onError: () => {
      toast({
        title: 'Failed to edit task',
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
        <p className='text-xl font-semibold'>Create Task</p>
        <div className='flex flex-col gap-0.5 w-full'>
          <Label>Title</Label>
          <Input
            onChange={(e) => setTitle(e.target.value)}
            defaultValue={title}
          />
        </div>

        <div className='flex flex-col gap-0.5 w-full'>
          <Label>Description</Label>
          <Textarea
            onChange={(e) => setDescription(e.target.value)}
            className='resize-none'
            rows={5}
            defaultValue={description}
          />
        </div>
        <div className='flex flex-col gap-0.5 w-full'>
          <Label>Assign To</Label>
          <Select
            defaultValue={selectedEmployeeId?.toString()}
            onValueChange={(e) => setSelectedEmployeeId(+e)}
          >
            <SelectTrigger>
              <SelectValue placeholder='Select Employee' />
            </SelectTrigger>
            <SelectContent>
              {employees?.map((e) => (
                <SelectItem key={e.id} value={e.id.toString()}>
                  {e.first_name} {e.last_name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className='flex flex-col gap-0.5 w-full'>
          <Label>Priority</Label>
          <Select
            defaultValue={priority.toString()}
            onValueChange={(e) => setPriority(+e)}
          >
            <SelectTrigger>
              <SelectValue placeholder='Select Priorty' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='0'>Low</SelectItem>
              <SelectItem value='1'>Medium</SelectItem>
              <SelectItem value='2'>High</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className='flex flex-col gap-0.5 w-full'>
          <Label>Deadline</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={'outline'}
                className={cn(
                  'w-full justify-start text-left font-normal',
                  !deadline && 'text-muted-foreground'
                )}
              >
                <CalendarIcon className='mr-2 h-4 w-4' />
                {deadline ? format(deadline, 'PPP') : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className='w-auto p-0'>
              <Calendar
                mode='single'
                selected={deadline}
                onSelect={setDeadline}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
        <div className='flex flex-col gap-0.5 w-full'>
          <Label>Status</Label>
          <Select
            defaultValue={status}
            onValueChange={(e) => setStatus(e.toUpperCase())}
          >
            <SelectTrigger>
              <SelectValue placeholder='Select Status' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={'ASSIGNED'}>Assigned</SelectItem>
              <SelectItem value={'IN_PROGRESS'}>In Progress</SelectItem>
              <SelectItem value={'COMPLETED'}>Completed</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className='flex items-center gap-2'>
          <Button
            className='w-full'
            variant={'p-outline'}
            onClick={() => setOpen(false)}
            disabled={isEditing}
          >
            Anuluj
          </Button>
          <Button
            className='w-full'
            disabled={isEditing}
            onClick={() => {
              editTask({
                assignedTo: selectedEmployeeId!,
                deadline: deadline!,
                description,
                priority,
                title,
                assignedBy: task.assigned_by.id,
                id: task.id,
                status,
              });
            }}
          >
            {isEditing ? (
              <div className='flex items-center gap-1'>
                <Loader2 className='h-4 w-4 animate-spin' />
                <p>Edit</p>
              </div>
            ) : (
              'Edit'
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditTask;
