import React from 'react';
import { Dialog, DialogContent } from '../ui/dialog';
import { useQuery } from '@tanstack/react-query';
import { getSurveyAnswers, getSurveyQuestions } from '@/actions/survey.actions';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '../ui/accordion';

interface Props extends TDialogProps {
  survey: TSurvey;
}

const SurveyInsights = ({ survey, open, setOpen }: Props) => {
  const { data: questions, isLoading } = useQuery({
    queryKey: ['getSurveyQuestions', { surveyId: survey.id }],
    queryFn: async () => getSurveyQuestions({ surveyId: survey.id }),
  });
  const { data: answers, isLoading: isLoadingAnswers } = useQuery({
    queryKey: ['getSurveyAnswers', { surveyId: survey.id }],
    queryFn: async () => getSurveyAnswers({ surveyId: survey.id }),
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
      <DialogContent className='flex flex-col gap-4 w-full max-w-2xl'>
        <p className='text-xl font-semibold'>{survey.title} - Insights</p>
        {questions?.map((q, index) => (
          <Accordion type='single' collapsible key={q.id}>
            <AccordionItem value={q?.title}>
              <AccordionTrigger>
                {index + 1}. {q.title}
              </AccordionTrigger>
              <AccordionContent>
                {q.answers.map((a, i) => (
                  <p key={i} className='text-lg font-semibold'>
                    {a}
                  </p>
                ))}
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        ))}
      </DialogContent>
    </Dialog>
  );
};

export default SurveyInsights;
