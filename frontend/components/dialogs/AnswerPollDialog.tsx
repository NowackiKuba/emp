'use client';
import React, { useState } from 'react';
import { Dialog, DialogContent } from '../ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Checkbox } from '../ui/checkbox';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { Label } from '../ui/label';
import { Button } from '../ui/button';
import { Check, Loader2 } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { answerPoll } from '@/actions/poll.actions';
import { toast } from '../ui/use-toast';

interface Props extends TDialogProps {
  poll: TPoll;
}

const AnswerPollDialog = ({ open, setOpen, poll }: Props) => {
  const [selectedAnswer, setSelectedAnswer] = useState<string>();
  const [answered, setAnswered] = useState<boolean>(false);
  const queryClient = useQueryClient();
  const { mutate: answer, isPending: isAnswering } = useMutation({
    mutationKey: ['answerPoll'],
    mutationFn: answerPoll,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['getPollAnswers', poll.id],
        refetchType: 'all',
      }),
        setOpen(false);
      toast({
        title: 'Poll Answered',
        duration: 1500,
      });
    },
    onError: () => {
      toast({
        title: 'Failed to answer poll',
        description: 'Please try again later',
        variant: 'destructive',
        duration: 1500,
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
        <div className='flex flex-col gap-2 w-full'>
          <p className='text-2xl font-semibold'>{poll?.title}</p>
          <div className='text-sm text-gray-400 dark:text-gray-600 flex items-center gap-2'>
            by
            <Avatar className='h-8 w-8'>
              <AvatarImage src={poll?.created_by?.img_url} />
              <AvatarFallback className='h-8 w-8'>
                <div className='flex items-center justify-center h-8 w-8 rounded-full text-sm font-semibold bg-primary/10 text-primary dark:bg-red-500/20 dark:text-red-200'>
                  {poll?.created_by.first_name[0]}
                  {poll?.created_by.last_name[0]}
                </div>
              </AvatarFallback>
            </Avatar>
            <p>
              {poll?.created_by?.first_name} {poll?.created_by?.last_name}
            </p>
          </div>
        </div>
        <div className='flex flex-col w-full gap-3'>
          {poll.questions.map((q, i) => (
            <div
              key={i}
              className={`flex items-center justify-between w-full border py-4 px-3 `}
            >
              <div className='flex items-center gap-2'>
                <Button
                  className={`${
                    selectedAnswer === q ? 'bg-red-500' : 'bg-transparent'
                  } h-4 w-4 p-0.5 rounded-full border border-red-500`}
                  onClick={() => setSelectedAnswer(q)}
                >
                  {selectedAnswer === q ? (
                    <Check className='text-white' />
                  ) : null}
                </Button>
                <Label htmlFor={q}>{q}</Label>
              </div>
            </div>
          ))}
        </div>
        <div>
          <Button
            disabled={isAnswering || !selectedAnswer}
            onClick={() => answer({ answer: selectedAnswer!, pollId: poll.id })}
          >
            {isAnswering ? (
              <div className='flex items-center gap-1'>
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

export default AnswerPollDialog;
