import React, { useState } from 'react';
import { Dialog, DialogContent } from '../ui/dialog';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { format } from 'date-fns';
import { Calendar as CalendarIcon, Check, Loader2, Trash } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { useMutation } from '@tanstack/react-query';
import { createPTO } from '@/actions/pto.actions';
import { toast } from '../ui/use-toast';

const CreatePTO = ({ open, setOpen }: DialogProps) => {
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();

  const { mutate: createPTORequest, isPending: isCreating } = useMutation({
    mutationKey: ['createPTO'],
    mutationFn: createPTO,
    onSuccess: () => {
      toast({
        title: 'Successfully created PTO request',
        duration: 1500,
      });
      setOpen(false);
    },
    onError: () => {
      toast({
        title: 'Failed to create PTO request',
        duration: 1500,
        variant: 'destructive',
        description: 'Please try again',
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
        <p className='text-xl font-semibold'>Send PTO Request</p>
        <div className='flex flex-col gap-0.5 w-full'>
          <Label>Title</Label>
          <Input onChange={(e) => setTitle(e.target.value)} />
        </div>
        <div className='flex flex-col gap-0.5 w-full'>
          <Label>Description</Label>
          <Textarea
            rows={6}
            className='resize-none'
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <div className='flex flex-col gap-0.5 w-full'>
          <Label>Start Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={'outline'}
                className={cn(
                  'w-full justify-start text-left font-normal',
                  !startDate && 'text-muted-foreground'
                )}
              >
                <CalendarIcon className='mr-2 h-4 w-4' />
                {startDate ? (
                  format(startDate, 'PPP')
                ) : (
                  <span>Pick a date</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className='w-auto p-0'>
              <Calendar
                mode='single'
                selected={startDate}
                onSelect={setStartDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
        <div className='flex flex-col gap-0.5 w-full'>
          <Label>Start Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={'outline'}
                className={cn(
                  'w-full justify-start text-left font-normal',
                  !endDate && 'text-muted-foreground'
                )}
              >
                <CalendarIcon className='mr-2 h-4 w-4' />
                {endDate ? format(endDate, 'PPP') : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className='w-auto p-0'>
              <Calendar
                mode='single'
                selected={endDate}
                onSelect={setEndDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
        <div className='flex items-center gap-2 w-full'>
          <Button
            className='w-full'
            variant={'p-outline'}
            onClick={() => setOpen(false)}
            disabled={isCreating}
          >
            Cancel
          </Button>
          <Button
            className='w-full'
            onClick={() => {
              createPTORequest({
                description,
                title,
                endDate: endDate!,
                startDate: startDate!,
              });
            }}
            disabled={isCreating}
          >
            {isCreating ? (
              <div className='flex items-center gap-2'>
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

export default CreatePTO;
