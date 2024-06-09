import React from 'react';

interface Props {
  name: string;
}

const Category = ({ name }: Props) => {
  return (
    <div className='flex flex-col gap-4 w-full items-start justify-start'>
      <p className='text-2xl font-semibold'>{name}</p>
    </div>
  );
};

export default Category;
