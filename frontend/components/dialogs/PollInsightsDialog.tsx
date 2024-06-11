import React from 'react';
import { Dialog, DialogContent } from '../ui/dialog';
import { Label } from '../ui/label';
import { useQuery } from '@tanstack/react-query';
import { getPollAnswers } from '@/actions/poll.actions';

interface Props extends TDialogProps {
  poll: TPoll;
}

const PollInsightsDialog = ({ poll, setOpen, open }: Props) => {
  const { data: answers, isLoading } = useQuery({
    queryKey: ['getPollAnswers', poll.id],
    queryFn: async () => await getPollAnswers({ pollId: poll.id }),
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
        </div>
        <div className='flex flex-col w-full gap-3'>
          {poll.questions.map((q, i) => (
            <div
              key={i}
              className={`flex items-center justify-between w-full border py-4 px-3 `}
            >
              <div className='flex items-center gap-2'>
                <Label htmlFor={q}>{q}</Label>
              </div>
            </div>
          ))}
        </div>
        <div>CHART</div>
        <div>Tabela Odpowiedzi</div>
      </DialogContent>
    </Dialog>
  );
};

export default PollInsightsDialog;
