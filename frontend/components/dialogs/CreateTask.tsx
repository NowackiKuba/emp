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
import {
  QueryClient,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import { createTask } from '@/actions/task.actions';
import { toast } from '../ui/use-toast';

interface Props extends TDialogProps {
  employeeId?: number;
}

const CreateTask = ({ open, setOpen, employeeId }: Props) => {
  const { employees } = useCompanyEmployees();
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [priority, setPriority] = useState<number>(0);
  const [deadline, setDeadline] = useState<Date>();
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<number>(0);
  useEffect(() => {
    if (!employeeId) return;
    setSelectedEmployeeId(employeeId);
  }, [employeeId]);
  const queryClient = useQueryClient();
  const { mutate: createTaskMutation, isPending: isCreating } = useMutation({
    mutationKey: ['createTask'],
    mutationFn: createTask,
    onSuccess: () => {
      toast({
        title: 'Task Created',
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
        title: 'Failed to create task',
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
          <Input onChange={(e) => setTitle(e.target.value)} />
        </div>

        <div className='flex flex-col gap-0.5 w-full'>
          <Label>Description</Label>
          <Textarea
            onChange={(e) => setDescription(e.target.value)}
            className='resize-none'
            rows={5}
          />
        </div>
        <div className='flex flex-col gap-0.5 w-full'>
          <Label>Assign To</Label>
          <Select
            defaultValue={selectedEmployeeId.toString()}
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
        <div className='flex items-center gap-2'>
          <Button
            className='w-full'
            variant={'p-outline'}
            onClick={() => setOpen(false)}
            disabled={isCreating}
          >
            Anuluj
          </Button>
          <Button
            className='w-full'
            disabled={isCreating}
            onClick={() => {
              createTaskMutation({
                assignedTo: selectedEmployeeId,
                deadline: deadline!,
                description,
                priority,
                title,
              });
            }}
          >
            {isCreating ? (
              <div className='flex items-center gap-1'>
                <Loader2 className='h-4 w-4 animate-spin' />
                <p>Create</p>
              </div>
            ) : (
              'Create'
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreateTask;
