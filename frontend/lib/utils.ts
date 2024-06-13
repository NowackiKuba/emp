import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import qs from 'query-string';
import {
  FcHighPriority,
  FcLowPriority,
  FcMediumPriority,
} from 'react-icons/fc';
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface UrlQueryParams {
  params: string;
  key: string;
  value: string | null;
}

export const formUrlQuery = ({ params, key, value }: UrlQueryParams) => {
  const currentUrl = qs.parse(params);

  currentUrl[key] = value;

  return qs.stringifyUrl(
    {
      url: window?.location?.pathname,
      query: currentUrl,
    },
    { skipNull: true }
  );
};

interface RemoveUrlQueryParams {
  params: string;
  keysToRemove: string[];
}

export const removeKeysFromQuery = ({
  params,
  keysToRemove,
}: RemoveUrlQueryParams) => {
  const currentUrl = qs.parse(params);

  keysToRemove.forEach((key) => {
    delete currentUrl[key];
  });

  return qs.stringifyUrl(
    {
      url: window.location?.pathname,
      query: currentUrl,
    },
    { skipNull: true }
  );
};

export const getPriorityProps = (priority: number) => {
  switch (priority) {
    case 2:
      return {
        textColor: 'text-red-500 dark:text-red-200',
        bg: 'bg-primary/10 dark:bg-red-500/20',
        text: 'High',
        icon: FcHighPriority,
      };
      break;
    case 1:
      return {
        textColor: 'text-yellow-500 dark:text-yellow-200',
        bg: 'bg-yellow-500/10 dark:bg-yellow-500/20',
        text: 'Medium',
        icon: FcMediumPriority,
      };
      break;
    case 0:
      return {
        textColor: 'text-green-500 dark:text-green-200',
        bg: 'bg-green-500/10 dark:bg-green-500/20',
        text: 'Low',
        icon: FcLowPriority,
      };
      break;
    default:
      return {
        textColor: 'text-gray-500 dark:text-gray-200',
        bg: 'bg-primary/10 dark:bg-gray-500/20',
        text: 'None',
        icon: FcLowPriority,
      };
  }
};

interface DataProps {
  name: string;
  answers: number;
}

export const getPollChartData = (answers: TAnswer[]) => {
  const data: DataProps[] = [];

  answers.forEach((a) => {
    if (data.some((d) => d.name === a.answer)) {
      data.find((d) => d.name === a.answer)!.answers += 1;
    } else {
      data.push({ name: a.answer, answers: 1 });
    }
  });

  return data;
};
