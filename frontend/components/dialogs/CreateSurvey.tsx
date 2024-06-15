import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent } from '../ui/dialog';
import {
  CircleDot,
  MousePointerClick,
  SquareStack,
  Star,
  Text,
} from 'lucide-react';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { title } from 'process';
import { Textarea } from '../ui/textarea';
import { Checkbox } from '../ui/checkbox';
import { useMutation } from '@tanstack/react-query';
import { createSurvey } from '@/actions/survey.actions';
import { toast } from '../ui/use-toast';
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
import { start } from 'repl';

interface Question {
  title: string;
  type: 'text' | 'choose' | 'multiple' | 'select';
  inputType: 'input' | 'text-area' | 'select' | 'radio' | 'checkbox';
  answers?: string[];
}

const CreateSurvey = ({ open, setOpen }: TDialogProps) => {
  const [title, setTitle] = useState<string>('');
  const [answer, setAnswer] = useState<string>('');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [currentQuestion, setCurrentQuestion] = useState<Question>({
    title: '',
    type: 'text',
    inputType: 'input',
  });
  const [type, setType] = useState<'text' | 'choose' | 'multiple' | 'select'>();

  useEffect(() => {
    if (!type) return;

    setCurrentQuestion(() => {
      return {
        title: currentQuestion.title,
        type: type,
        inputType: currentQuestion.inputType,
        answers: type != 'text' ? [''] : undefined,
      };
    });
  }, [type]);

  const { mutate: create, isPending: isCreating } = useMutation({
    mutationKey: ['createSurvey'],
    mutationFn: createSurvey,
    onSuccess: () => {
      toast({
        title: 'Success',
      });
    },
    onError: () => {
      toast({
        title: 'ERROR',
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
      <DialogContent className='flex flex-col gap-4 w-full max-w-xl'>
        <p className='text-sm'>{questions.length} questions add</p>
        <p className='text-xl font-semibold'>Create Survey</p>
        {!type && (
          <>
            <div className='flex flex-col gap-1.5 pt-4'>
              <Label>Title</Label>
              <Input
                onChange={(e) => {
                  setTitle(e.target.value);
                }}
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
              <Label>End Date</Label>
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
                    {endDate ? (
                      format(endDate, 'PPP')
                    ) : (
                      <span>Pick a date</span>
                    )}
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
            <div className='flex items-center gap-2 w-full flex-wrap'>
              <div
                onClick={() => setType('text')}
                className='w-[calc(50%-4px)] cursor-pointer h-44 rounded-xl border border-border flex flex-col items-center justify-center group gap-2'
              >
                <div className='flex items-center text-zinc-800 dark:group-hover:text-red-200 group-hover:text-primary justify-center h-24 w-24 rounded-full bg-zinc-900 dark:group-hover:bg-red-500/20 group-hover:bg-primary/10 duration-100 ease-linear'>
                  <Text className='h-12 w-12 ' />
                </div>
                <p className='text-zinc-800 text-lg font-semibold dark:group-hover:text-red-200 group-hover:text-primary'>
                  Text
                </p>
              </div>
              <div
                onClick={() => setType('choose')}
                className='w-[calc(50%-4px)] cursor-pointer h-44 rounded-xl border border-border flex flex-col items-center justify-center group gap-2'
              >
                <div className='flex items-center text-zinc-800 dark:group-hover:text-red-200 group-hover:text-primary justify-center h-24 w-24 rounded-full bg-zinc-900 dark:group-hover:bg-red-500/20 group-hover:bg-primary/10 duration-100 ease-linear'>
                  <CircleDot className='h-12 w-12 ' />
                </div>
                <p className='text-zinc-800 text-lg font-semibold dark:group-hover:text-red-200 group-hover:text-primary'>
                  Choose
                </p>
              </div>
              <div
                onClick={() => setType('multiple')}
                className='w-[calc(50%-4px)] cursor-pointer h-44 rounded-xl border border-border flex flex-col items-center justify-center group gap-2'
              >
                <div className='flex items-center text-zinc-800 dark:group-hover:text-red-200 group-hover:text-primary justify-center h-24 w-24 rounded-full bg-zinc-900 dark:group-hover:bg-red-500/20 group-hover:bg-primary/10 duration-100 ease-linear'>
                  <SquareStack className='h-12 w-12 ' />
                </div>
                <p className='text-zinc-800 text-lg font-semibold dark:group-hover:text-red-200 group-hover:text-primary'>
                  Multiple Choice
                </p>
              </div>
              {/* <div
                onClick={() => setType('rating')}
                className='w-[calc(50%-4px)] cursor-pointer h-44 rounded-xl border border-border flex flex-col items-center justify-center group gap-2'
              >
                <div className='flex items-center text-zinc-800 dark:group-hover:text-red-200 group-hover:text-primary justify-center h-24 w-24 rounded-full bg-zinc-900 dark:group-hover:bg-red-500/20 group-hover:bg-primary/10 duration-100 ease-linear'>
                  <Star className='h-12 w-12 ' />
                </div>
                <p className='text-zinc-800 text-lg font-semibold dark:group-hover:text-red-200 group-hover:text-primary'>
                  Rating
                </p>
              </div> */}
              <div
                onClick={() => setType('select')}
                className='w-[calc(50%-4px)] cursor-pointer h-44 rounded-xl border border-border flex flex-col items-center justify-center group gap-2'
              >
                <div className='flex items-center text-zinc-800 dark:group-hover:text-red-200 group-hover:text-primary justify-center h-24 w-24 rounded-full bg-zinc-900 dark:group-hover:bg-red-500/20 group-hover:bg-primary/10 duration-100 ease-linear'>
                  <MousePointerClick className='h-12 w-12 ' />
                </div>
                <p className='text-zinc-800 text-lg font-semibold dark:group-hover:text-red-200 group-hover:text-primary'>
                  Select
                </p>
              </div>
            </div>
            <Button
              disabled={questions?.length < 2}
              onClick={() =>
                create({
                  endDate: endDate!,
                  startDate: startDate!,
                  questions,
                  title,
                })
              }
            >
              {questions?.length < 2
                ? 'Add At Least 2 Questions To Create Survey'
                : 'Create Survey'}
            </Button>
          </>
        )}
        {type === 'text' ? (
          <div className='flex flex-col gap-2 w-full mt-3'>
            <div className='flex flex-col gap-0.5 w-full pb-3'>
              <Label>Question</Label>
              <Input
                onChange={(e) => {
                  setCurrentQuestion((prev) => ({
                    ...prev,
                    title: e.target.value,
                  }));
                }}
              />
            </div>
            <div className='flex items-center gap-2 justify-start w-full py-4 px-2 rounded-xl border border-border'>
              <Button
                className={`${
                  currentQuestion.inputType === 'text-area'
                    ? 'bg-red-500'
                    : 'bg-transparent'
                } h-4 w-4 p-0.5 rounded-full border border-red-500`}
                onClick={() =>
                  setCurrentQuestion({
                    title: currentQuestion.title,
                    type: currentQuestion.type,
                    inputType: 'text-area',
                  })
                }
              >
                {currentQuestion.inputType === 'text-area' ? (
                  <Check className='text-white' />
                ) : null}
              </Button>
              <p>Textarea</p>
            </div>
            <div className='flex items-center gap-2 justify-start w-full py-4 px-2 rounded-xl border border-border'>
              <Button
                className={`${
                  currentQuestion.inputType === 'input'
                    ? 'bg-red-500'
                    : 'bg-transparent'
                } h-4 w-4 p-0.5 rounded-full border border-red-500`}
                onClick={() =>
                  setCurrentQuestion({
                    title: currentQuestion.title,
                    type: currentQuestion.type,
                    inputType: 'input',
                  })
                }
              >
                {currentQuestion.inputType === 'input' ? (
                  <Check className='text-white' />
                ) : null}
              </Button>
              <p>Input</p>
            </div>
            <p className='text-xl font-semibold text-gray-400'>Preview</p>
            <p className='text-base font-[500]'>{currentQuestion.title}</p>
            {currentQuestion?.inputType === 'input' ? (
              <Input placeholder='Preview' />
            ) : (
              <Textarea placeholder='Preview' />
            )}
            <div className='flex items-center gap-2'>
              <Button
                variant={'p-outline'}
                className='w-full'
                onClick={() => {
                  setType(undefined);
                  setCurrentQuestion({
                    title: '',
                    type: 'text',
                    inputType: 'input',
                  });
                }}
              >
                Cancel
              </Button>
              <Button
                className='w-full'
                onClick={() => {
                  setCurrentQuestion((prev) => ({
                    ...prev,
                    answers: [''],
                  }));
                  setQuestions((prev) => [...prev, currentQuestion]);
                  setType(undefined);
                  setCurrentQuestion({
                    title: '',
                    type: 'text',
                    inputType: 'input',
                    answers: [''],
                  });
                }}
              >
                Save Question
              </Button>
            </div>
          </div>
        ) : null}
        {type === 'choose' ? (
          <div className='flex flex-col gap-2 w-full mt-3'>
            <div className='flex flex-col gap-0.5 w-full pb-3'>
              <Label>Question</Label>
              <Input
                onChange={(e) => {
                  setCurrentQuestion((prev) => ({
                    ...prev,
                    title: e.target.value,
                  }));
                }}
              />
            </div>
            <div className='flex flex-col gap-2.5 w-full'>
              {currentQuestion?.answers?.map((a, i) => (
                <div
                  key={i}
                  className='flex items-center justify-between w-full'
                >
                  <div className='flex items-center gap-2.5 w-full'>
                    <Button
                      disabled
                      className={`h-6 w-6 p-0.5 px-2 bg-transparent rounded-full border border-red-500`}
                    ></Button>
                    {a === '' ? (
                      <Input
                        placeholder='Answer'
                        className='w-full'
                        onChange={(e) => setAnswer(e.target.value)}
                      />
                    ) : (
                      <p>{a}</p>
                    )}
                  </div>
                  {a !== '' ? (
                    <div className='flex items-center gap-2.5'>
                      <Button
                        size={'icon'}
                        variant={'ghost'}
                        onClick={() => {
                          if (
                            currentQuestion?.answers &&
                            currentQuestion.answers.length > 1
                          ) {
                            setCurrentQuestion((prev) => {
                              let answers = prev.answers;
                              if (answers) {
                                answers = answers.filter(
                                  (a, index) => index !== i
                                );
                              }
                              return {
                                ...prev,
                                answers: [...answers!],
                              };
                            });
                          } else {
                            setCurrentQuestion((prev) => {
                              const answers = prev.answers;
                              if (answers) {
                                answers[i] = '';
                              }
                              return {
                                ...prev,
                                answers: [''],
                              };
                            });
                          }
                        }}
                      >
                        <Trash />
                      </Button>
                    </div>
                  ) : (
                    <Button
                      variant={'ghost'}
                      size={'icon'}
                      onClick={() => {
                        setCurrentQuestion((prev) => {
                          const answers = prev.answers;
                          if (answers) {
                            answers[i] = answer;
                          }
                          return {
                            ...prev,
                            answers: [...answers!, ''],
                          };
                        });
                      }}
                    >
                      <Check />
                    </Button>
                  )}
                </div>
              ))}
            </div>
            <div className='py-2 w-full flex flex-col gap-3'>
              <p className='text-sm font-[500] text-gray-600'>PREVIEW</p>
              <p className='text-lg font-semibold'>{currentQuestion?.title}</p>
              <div className='flex flex-col gap-2.5 w-full'>
                {currentQuestion?.answers?.map((a, i) => (
                  <div key={i} className='flex items-center gap-1.5'>
                    <Button
                      disabled
                      className={`h-6 w-6 p-0.5 px-2 bg-transparent rounded-full border border-red-500`}
                    ></Button>
                    <p>{a}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className='flex items-center gap-2'>
              <Button
                variant={'p-outline'}
                className='w-full'
                onClick={() => {
                  setType(undefined);
                  setCurrentQuestion({
                    title: '',
                    type: 'text',
                    inputType: 'input',
                  });
                }}
              >
                Cancel
              </Button>
              <Button
                className='w-full'
                onClick={() => {
                  setCurrentQuestion((prev) => ({
                    ...prev,
                    answers: prev.answers?.filter((a) => a !== ''),
                  }));
                  setQuestions((prev) => [...prev, currentQuestion]);
                  setType(undefined);
                  setCurrentQuestion({
                    title: '',
                    type: 'text',
                    inputType: 'input',
                  });
                }}
              >
                Save Question
              </Button>
            </div>
          </div>
        ) : null}
        {type === 'multiple' ? (
          <div className='flex flex-col gap-2 w-full mt-3'>
            <div className='flex flex-col gap-0.5 w-full pb-3'>
              <Label>Question</Label>
              <Input
                onChange={(e) => {
                  setCurrentQuestion((prev) => ({
                    ...prev,
                    title: e.target.value,
                  }));
                }}
              />
            </div>
            <div className='flex flex-col gap-2.5 w-full'>
              {currentQuestion?.answers?.map((a, i) => (
                <div
                  key={i}
                  className='flex items-center justify-between w-full'
                >
                  <div className='flex items-center gap-2.5 w-full'>
                    <Checkbox disabled className='rounded-sm' />
                    {a === '' ? (
                      <Input
                        placeholder='Answer'
                        className='w-full'
                        onChange={(e) => setAnswer(e.target.value)}
                      />
                    ) : (
                      <p>{a}</p>
                    )}
                  </div>
                  {a !== '' ? (
                    <div className='flex items-center gap-2.5'>
                      <Button
                        size={'icon'}
                        variant={'ghost'}
                        onClick={() => {
                          if (
                            currentQuestion?.answers &&
                            currentQuestion.answers.length > 1
                          ) {
                            setCurrentQuestion((prev) => {
                              let answers = prev.answers;
                              if (answers) {
                                answers = answers.filter(
                                  (a, index) => index !== i
                                );
                              }
                              return {
                                ...prev,
                                answers: [...answers!],
                              };
                            });
                          } else {
                            setCurrentQuestion((prev) => {
                              const answers = prev.answers;
                              if (answers) {
                                answers[i] = '';
                              }
                              return {
                                ...prev,
                                answers: [''],
                              };
                            });
                          }
                        }}
                      >
                        <Trash />
                      </Button>
                    </div>
                  ) : (
                    <Button
                      variant={'ghost'}
                      size={'icon'}
                      onClick={() => {
                        setCurrentQuestion((prev) => {
                          const answers = prev.answers;
                          if (answers) {
                            answers[i] = answer;
                          }
                          return {
                            ...prev,
                            answers: [...answers!, ''],
                          };
                        });
                      }}
                    >
                      <Check />
                    </Button>
                  )}
                </div>
              ))}
            </div>
            <div className='py-2 w-full flex flex-col gap-3'>
              <p className='text-sm font-[500] text-gray-600'>PREVIEW</p>
              <p className='text-lg font-semibold'>{currentQuestion?.title}</p>
              <div className='flex flex-col gap-2.5 w-full'>
                {currentQuestion?.answers?.map((a, i) => (
                  <div key={i} className='flex items-center gap-1.5'>
                    <Checkbox disabled className='rounded-sm' />
                    <p>{a}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className='flex items-center gap-2'>
              <Button
                variant={'p-outline'}
                className='w-full'
                onClick={() => {
                  setType(undefined);
                  setCurrentQuestion({
                    title: '',
                    type: 'text',
                    inputType: 'input',
                  });
                }}
              >
                Cancel
              </Button>
              <Button
                className='w-full'
                onClick={() => {
                  setCurrentQuestion((prev) => ({
                    ...prev,
                    answers: prev.answers?.filter((a) => a !== ''),
                  }));
                  setQuestions((prev) => [...prev, currentQuestion]);
                  setType(undefined);
                  setCurrentQuestion({
                    title: '',
                    type: 'text',
                    inputType: 'input',
                  });
                }}
              >
                Save Question
              </Button>
            </div>
          </div>
        ) : null}
        {type === 'select' ? (
          <div className='flex flex-col gap-2 w-full mt-3'>
            <div className='flex flex-col gap-0.5 w-full pb-3'>
              <Label>Question</Label>
              <Input
                onChange={(e) => {
                  setCurrentQuestion((prev) => ({
                    ...prev,
                    title: e.target.value,
                  }));
                }}
              />
            </div>
            <div className='flex flex-col gap-2.5 w-full'>
              {currentQuestion?.answers?.map((a, i) => (
                <div
                  key={i}
                  className='flex items-center justify-between w-full'
                >
                  <div className='flex items-center gap-2.5 w-full'>
                    <Button
                      disabled
                      className={`h-6 w-6 p-0.5 px-2 bg-transparent rounded-full border border-red-500`}
                    ></Button>
                    {a === '' ? (
                      <Input
                        placeholder='Answer'
                        className='w-full'
                        onChange={(e) => setAnswer(e.target.value)}
                      />
                    ) : (
                      <p>{a}</p>
                    )}
                  </div>
                  {a !== '' ? (
                    <div className='flex items-center gap-2.5'>
                      <Button
                        size={'icon'}
                        variant={'ghost'}
                        onClick={() => {
                          if (
                            currentQuestion?.answers &&
                            currentQuestion.answers.length > 1
                          ) {
                            setCurrentQuestion((prev) => {
                              let answers = prev.answers;
                              if (answers) {
                                answers = answers.filter(
                                  (a, index) => index !== i
                                );
                              }
                              return {
                                ...prev,
                                answers: [...answers!],
                              };
                            });
                          } else {
                            setCurrentQuestion((prev) => {
                              const answers = prev.answers;
                              if (answers) {
                                answers[i] = '';
                              }
                              return {
                                ...prev,
                                answers: [''],
                              };
                            });
                          }
                        }}
                      >
                        <Trash />
                      </Button>
                    </div>
                  ) : (
                    <Button
                      variant={'ghost'}
                      size={'icon'}
                      onClick={() => {
                        setCurrentQuestion((prev) => {
                          const answers = prev.answers;
                          if (answers) {
                            answers[i] = answer;
                          }
                          return {
                            ...prev,
                            answers: [...answers!, ''],
                          };
                        });
                      }}
                    >
                      <Check />
                    </Button>
                  )}
                </div>
              ))}
            </div>
            <div className='py-2 w-full flex flex-col gap-3'>
              <p className='text-sm font-[500] text-gray-600'>PREVIEW</p>
              <p className='text-lg font-semibold'>{currentQuestion?.title}</p>
              <div className='flex flex-col gap-2.5 w-full'>
                {currentQuestion?.answers?.map((a, i) => (
                  <div key={i} className='flex items-center gap-1.5'>
                    <Button
                      disabled
                      className={`h-6 w-6 p-0.5 px-2 bg-transparent rounded-full border border-red-500`}
                    ></Button>
                    <p>{a}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className='flex items-center gap-2'>
              <Button
                variant={'p-outline'}
                className='w-full'
                onClick={() => {
                  setType(undefined);
                  setCurrentQuestion({
                    title: '',
                    type: 'text',
                    inputType: 'input',
                  });
                }}
              >
                Cancel
              </Button>
              <Button
                className='w-full'
                onClick={() => {
                  setCurrentQuestion((prev) => ({
                    ...prev,
                    answers: prev.answers?.filter((a) => a !== ''),
                  }));
                  setQuestions((prev) => [...prev, currentQuestion]);
                  setType(undefined);
                  setCurrentQuestion({
                    title: '',
                    type: 'text',
                    inputType: 'input',
                  });
                }}
              >
                Save Question
              </Button>
            </div>
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  );
};

export default CreateSurvey;
