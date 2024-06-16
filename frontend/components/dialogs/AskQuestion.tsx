'use client';
import React, { useState } from 'react';
import { Dialog, DialogContent } from '../ui/dialog';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { useMutation } from '@tanstack/react-query';
import { createQuestion } from '@/actions/question.actions';
import { toast } from '../ui/use-toast';
import { Loader2 } from 'lucide-react';

interface Props extends TDialogProps {
  userId: number;
}

const AskQuestion = ({ userId, open, setOpen }: Props) => {
  const [question, setQuestion] = useState<string>('');

  const { mutate: askQuestion, isPending: isLoading } = useMutation({
    mutationKey: ['askQuestion'],
    mutationFn: createQuestion,
    onSuccess: () => {
      toast({
        title: 'Successfully asked quesiton',
        duration: 1500,
      });
      setOpen(false);
    },
    onError: () => {
      toast({
        title: 'Failed to ask question',
        duration: 1500,
        description: 'Please try again later',
        variant: 'destructive',
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
        <p className='text-xl font-semibold'>Ask Question</p>
        <div className='flex flex-col gap-0.5 w-full'>
          <Label>Question</Label>
          <Input onChange={(e) => setQuestion(e.target.value)} />
        </div>
        <div className='flex items-center gap-2'>
          <Button
            className='w-full'
            variant={'p-outline'}
            onClick={() => setOpen(false)}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            className='w-full'
            onClick={() => {
              askQuestion({
                question,
                toId: userId,
              });
            }}
            disabled={isLoading}
          >
            {isLoading ? (
              <div className='flex items-center gap-1'>
                <Loader2 className='h-4 w-4 animate-spin' />
                <p>Ask Question</p>
              </div>
            ) : (
              'Ask Question'
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AskQuestion;
