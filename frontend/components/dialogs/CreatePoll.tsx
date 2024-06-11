'use client';
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
import { createPoll } from '@/actions/poll.actions';
import { toast } from '../ui/use-toast';

const CreatePoll = ({ open, setOpen }: TDialogProps) => {
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [startsOn, setStartsOn] = useState<Date>();
  const [endsOn, setEndsOn] = useState<Date>();
  const [questions, setQuestions] = useState<string[]>([]);
  const [questionsLength, setQuestionsLength] = useState<number>(2);
  const [question, setQuestion] = useState<string>('');

  const { mutate: createPollMutation, isPending: isCreating } = useMutation({
    mutationFn: createPoll,
    mutationKey: ['createPoll'],
    onSuccess: () => {
      toast({
        title: 'Poll created',
        duration: 1500,
      });
      setOpen(false);
    },
    onError: () => {
      toast({
        title: 'Failed to create poll',
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
        <p className='text-xl font-semibold'>Create Poll</p>
        <div className='flex flex-col gap-0.5 w-full'>
          <Label>Question</Label>
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
          <Label>Options</Label>
          <div className='flex flex-col gap-2 mt-4 w-full'>
            {new Array(questionsLength).fill(0).map((_, i) => (
              <div className='flex flex-col gap-0.5 w-full' key={i}>
                <Label>Option {i + 1}</Label>
                <div className='flex items-center gap-1'>
                  <Input
                    key={i}
                    onChange={(e) => setQuestion(e.target.value)}
                  />
                  <Button
                    variant={'ghost'}
                    size={'icon'}
                    onClick={() => {
                      setQuestions((prev) => [...prev, question]);
                      setQuestion('');
                    }}
                  >
                    <Check />
                  </Button>
                </div>
              </div>
            ))}
            <p
              className='text-xs text-gray-400 dark:text-gray-600 cursor-pointer'
              onClick={() => setQuestionsLength((prev) => prev + 1)}
            >
              Add more rows
            </p>
          </div>
        </div>
        <div className='flex flex-col gap-0.5 w-full'>
          <Label>Start Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={'outline'}
                className={cn(
                  'w-full justify-start text-left font-normal',
                  !startsOn && 'text-muted-foreground'
                )}
              >
                <CalendarIcon className='mr-2 h-4 w-4' />
                {startsOn ? format(startsOn, 'PPP') : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className='w-auto p-0'>
              <Calendar
                mode='single'
                selected={startsOn}
                onSelect={setStartsOn}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
        <div className='flex flex-col gap-0.5 w-full'>
          <Label>End Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={'outline'}
                className={cn(
                  'w-full justify-start text-left font-normal',
                  !endsOn && 'text-muted-foreground'
                )}
              >
                <CalendarIcon className='mr-2 h-4 w-4' />
                {endsOn ? format(endsOn, 'PPP') : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className='w-auto p-0'>
              <Calendar
                mode='single'
                selected={endsOn}
                onSelect={setEndsOn}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
        <div className='flex items-center gap-2 w-full'>
          <Button
            variant={'p-outline'}
            className='w-full'
            onClick={() => setOpen(false)}
            disabled={isCreating}
          >
            Cancel
          </Button>
          <Button
            className='w-full'
            onClick={() => {
              createPollMutation({
                title,
                description,
                questions,
                starts_on: startsOn!,
                ends_on: endsOn!,
              });
            }}
            disabled={isCreating}
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

export default CreatePoll;
