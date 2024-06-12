'use client';
import React, { useState } from 'react';
import { Dialog, DialogContent } from '../ui/dialog';
import { useMutation, useQuery } from '@tanstack/react-query';
import { answerSurvey, getSurveyQuestions } from '@/actions/survey.actions';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { Checkbox } from '../ui/checkbox';
import { Button } from '../ui/button';
import { toast } from '../ui/use-toast';
import { Loader2 } from 'lucide-react';

interface Props extends TDialogProps {
  surveyId: number;
  surveyTitle: string;
  creatorFullName: string;
}

const AnswerSurveyDialog = ({
  open,
  setOpen,
  surveyId,
  surveyTitle,
}: Props) => {
  const [answers, setAnswers] = useState<any[]>([]);
  const { data: questions, isLoading } = useQuery({
    queryKey: ['getSurveyQuestions', surveyId],
    queryFn: async () => getSurveyQuestions({ surveyId }),
  });

  const { mutate: answerSurveyMutation, isPending: isAnswering } = useMutation({
    mutationKey: ['answerSurvey'],
    mutationFn: answerSurvey,
    onSuccess: () => {
      toast({
        title: 'Successfully answered survey',
        duration: 1500,
      });
      setOpen(false);
    },
    onError: () => {
      toast({
        title: 'Failed to answer survey',
        description: 'Please try again later',
        variant: 'destructive',
        duration: 1500,
      });
    },
  });

  console.log(questions);
  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        if (!v) {
          setOpen(v);
        }
      }}
    >
      <DialogContent className='flex flex-col gap-4 w-full xl:max-h-[750px] overflow-y-auto'>
        <p className='text-2xl font-semibold'>{surveyTitle}</p>
        <div className='flex flex-col gap-6 w-full'>
          {questions?.map((q, i) => (
            <div className='flex flex-col gap-2 w-full' key={q.id}>
              <p className='text-lg font-semibold'>
                {i + 1}. {q.title}
              </p>
              {q.type === 'text' && (
                <>
                  {q.input_type === 'input' ? (
                    <Input
                      onChange={(e) =>
                        setAnswers((prev) => [...prev, e.target.value])
                      }
                    />
                  ) : (
                    <Textarea />
                  )}
                </>
              )}
              {q.type === 'choose' && (
                <div className='flex flex-col gap-2.5 w-full'>
                  {q?.answers?.map((a, i) => (
                    <div
                      key={i}
                      className={`${
                        a === '' ? 'hidden' : 'flex'
                      } flex items-center gap-2`}
                    >
                      <Button
                        className={`bg-transparent h-4 w-4 p-0.5 rounded-full border border-red-500`}
                        onClick={() => setAnswers((prev) => [...prev, a])}
                      >
                        {/* {selectedAnswer === q ? (
                    <Check className='text-white' />
                  ) : null} */}
                      </Button>
                      <p>{a}</p>
                    </div>
                  ))}
                </div>
              )}
              {q.type === 'multiple' && (
                <div className='flex flex-col gap-2.5 w-full'>
                  {q?.answers?.map((a, i) => (
                    <div
                      key={i}
                      className={`${
                        a === '' ? 'hidden' : 'flex'
                      } flex items-center gap-2`}
                    >
                      <Checkbox
                        onCheckedChange={() =>
                          setAnswers((prev) => [...prev, a])
                        }
                      />
                      <p>{a}</p>
                    </div>
                  ))}
                </div>
              )}
              {q.type === 'select' && (
                <Select
                  onValueChange={(e) => setAnswers((prev) => [...prev, e])}
                >
                  <SelectTrigger>
                    <SelectValue placeholder='Select Answer' />
                  </SelectTrigger>
                  <SelectContent>
                    {q?.answers?.map((a, i) => (
                      <SelectItem key={i} value={a === '' ? 'a' : a}>
                        {a}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>
          ))}
        </div>
        <div className='flex items-center gap-2 w-full'>
          <Button
            className='w-full'
            variant={'p-outline'}
            onClick={() => setOpen(false)}
          >
            Cancel
          </Button>
          <Button
            className='w-full'
            onClick={() => {
              answerSurveyMutation({ answers, surveyId });
            }}
            disabled={isAnswering}
          >
            {isAnswering ? (
              <div className='flex items-center gap-1'>
                <Loader2 className='h-4 w-4 animate-spin' />
                <p>Finish</p>
              </div>
            ) : (
              'Finish'
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AnswerSurveyDialog;
