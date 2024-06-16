'use client';
import React, { useState } from 'react';
import { Dialog, DialogContent } from '../ui/dialog';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Button } from '../ui/button';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { answerQuestion } from '@/actions/question.actions';
import { toast } from '../ui/use-toast';
import { Loader2 } from 'lucide-react';

interface Props extends TDialogProps {
  question: TQuestion;
}

const AnswerQuestion = ({ open, setOpen, question }: Props) => {
  const queryClient = useQueryClient();
  const [answer, setAnswer] = useState<string>('');
  const { mutate: handleAnswerQuestion, isPending } = useMutation({
    mutationKey: ['answerQuestion'],
    mutationFn: answerQuestion,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['getCompanyQuestions'],
        refetchType: 'all',
      }),
        toast({
          title: 'Successfully answered question',
          duration: 1500,
        });
      setOpen(false);
    },
    onError: () => {
      toast({
        title: 'An error occured while answering question',
        description: 'Please try again',
        duration: 1500,
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
        <p className='text-xl font-semibold'>{question?.question}</p>
        <div className='flex flex-col gap-0.5 w-full'>
          <Label>Answer</Label>
          <Textarea
            className='w-full resize-none'
            rows={8}
            onChange={(e) => setAnswer(e.target.value)}
          />
        </div>
        <div className='flex items-center gap-2'>
          <Button
            className='w-full'
            variant={'p-outline'}
            onClick={() => setOpen(false)}
            disabled={isPending}
          >
            Cancel
          </Button>
          <Button
            className='w-full'
            onClick={() =>
              handleAnswerQuestion({
                answer,
                questionId: question?.id!,
              })
            }
            disabled={isPending}
          >
            {isPending ? (
              <div className='flex items-center gap-2'>
                <Loader2 className='h-4 w-4 animate-spin' />
                <p>Answer</p>
              </div>
            ) : (
              'Answer'
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AnswerQuestion;
